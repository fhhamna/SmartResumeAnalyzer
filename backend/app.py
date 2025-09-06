from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
import spacy
from spacy.matcher import PhraseMatcher
import re
from sentence_transformers import SentenceTransformer, util
import mysql.connector
from mysql.connector import Error
from db import create_connection 
from datetime import datetime, timedelta
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = 'aS9f!3dGh@7kLm#2pQrT6vWxZy1uVbC4'

jwt = JWTManager(app)

resumes_data = {}
job_description = None
model = SentenceTransformer("all-MiniLM-L6-v2")  

# Load SpaCy model
nlp = spacy.load("en_core_web_sm")

# Pre-defined skills
SKILLS = [
    "Python", "Java", "C++", "JavaScript", "React", "Node.js", "Flask", "Django",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes",
    "HTML", "CSS", "Tailwind", "Bootstrap"
]

# Create a PhraseMatcher for skills
matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(skill) for skill in SKILLS]
matcher.add("SKILL", patterns)

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']
    organization = data.get('organization', None)

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = create_connection()
    if conn is None:
        return jsonify({'message': 'Database connection failed!'}), 500

    cursor = conn.cursor()

    try:
        sql = "INSERT INTO recruiter (name, email, password_hash, organization) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (name, email, hashed_password, organization))
        conn.commit()
        return jsonify({'message': 'Recruiter registered successfully!'}), 201
    except mysql.connector.IntegrityError:
        return jsonify({'message': 'Email already exists!'}), 400
    except Error as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

from flask_jwt_extended import create_access_token

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    conn = create_connection()
    if conn is None:
        return jsonify({'message': 'Database connection failed!'}), 500

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM recruiter WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user and bcrypt.check_password_hash(user['password_hash'], password):
            # Use Flask-JWT-Extended to create the token
            access_token = create_access_token(identity=user['email'], expires_delta=timedelta(hours=2))
            
            return jsonify({
                'token': access_token,
                'recruiter_ID': user['recruiter_ID'],
                'name': user['name']
            })

        return jsonify({'message': 'Invalid email or password!'}), 401
    except Error as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()


# Extract text from PDF
def extract_text_from_pdf(pdf_file):
    """Extract raw text from uploaded PDF using PyMuPDF."""
    text = ""
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    for page in doc:
        blocks = page.get_text("blocks")
        for b in blocks:
            text += b[4] + "\n"  # b[4] is the block text
    return text

# Parse resume
def parse_resume(text):
    parsed = {
        "skills": [],
        "education": [],
        "experience": [],
        "emails": [],
        "phone_numbers": []
    }

    edu_keywords = ["bachelor", "b.sc", "btech", "bs", "master", "m.sc", "msc", "mtech",
                    "phd", "degree", "university", "college", "diploma", "school"]
    exp_keywords = ["experience", "internship", "work history", "employment",
                    "developer", "engineer", "manager", "analyst", "consultant"]
    
    doc = nlp(text)
    # Match skills
    matches = matcher(doc)
    skills = [doc[start:end].text for match_id, start, end in matches]
    parsed["skills"] = list(set(skills)) 

    # Split text by line
    lines = text.split("\n")
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in edu_keywords):
            parsed["education"].append(line.strip())
        elif any(keyword in line_lower for keyword in exp_keywords) or re.search(r"\d+\s+years", line_lower):
            parsed["experience"].append(line.strip())

    # Regex for emails
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    parsed["emails"] = re.findall(email_pattern, text)

    # Regex for phone numbers (basic, matches local/international formats)
    phone_pattern = r"(\+?\d{1,3}[\s\-]?)?(\(?\d{2,4}\)?[\s\-]?)?\d{3,4}[\s\-]?\d{4}"
    parsed["phone_numbers"] = re.findall(phone_pattern, text)
    # Flatten regex groups
    parsed["phone_numbers"] = ["".join(match).strip() for match in parsed["phone_numbers"]]


    parsed["education"] = list(set(parsed["education"]))
    parsed["experience"] = list(set(parsed["experience"]))
    parsed["emails"] = list(set(parsed["emails"]))
    parsed["phone_numbers"] = list(set(parsed["phone_numbers"]))
   
    return parsed

def save_parsed_data(resume_id, parsed):
    conn = create_connection() 
    if conn is None:
        print("Failed to connect to database.")
        return
    cursor = conn.cursor()
   
    # Convert lists to comma-separated strings
    skills_str = ", ".join(parsed["skills"])
    education_str = ", ".join(parsed["education"])
    experience_str = ", ".join(parsed["experience"])
    emails_str = ", ".join(parsed["emails"])
    phones_str = ", ".join(parsed["phone_numbers"])

    # SQL query to insert parsed data
    query = """
    INSERT INTO parsed_data (resume_ID, education, experience, skills, emails, phone_numbers)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (resume_id, education_str, experience_str, skills_str, emails_str, phones_str)

    try:
        cursor.execute(query, values)
        conn.commit()
        print("Parsed data saved successfully!")
    except Error as e:
        print(f"Error while inserting data: {e}")
    finally:
        cursor.close()
        conn.close()


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!"})


# Flask route to upload resumes
@app.route('/upload', methods=['POST'])
def upload_resumes():
    # Check if files are provided
    if 'resumes' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    files = request.files.getlist("resumes")
    
    # Get recruiter_id and validate
    recruiter_id = request.form.get("recruiter_ID")
    if not recruiter_id:
        return jsonify({"error": "Missing recruiter_id"}), 400
    try:
        recruiter_id = int(recruiter_id)
    except ValueError:
        return jsonify({"error": "Invalid recruiter_id"}), 400

    conn = create_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()

    results = []

    for file in files:
        filename = secure_filename(file.filename)

        # Extract text from PDF or TXT
        if filename.lower().endswith(".pdf"):
            raw_text = extract_text_from_pdf(file)
        else:
            raw_text = file.read().decode("utf-8")

        parsed_data = parse_resume(raw_text)

        # Correct INSERT statement order
        cursor.execute("""
            INSERT INTO resume (recruiter_ID, file_name, upload_date, status, match_score)
            VALUES (%s, %s, %s, %s, %s)
        """, (recruiter_id, filename, datetime.now(), "Waitlist", None))
        conn.commit()

        resume_id = cursor.lastrowid

        save_parsed_data(resume_id, parsed_data)

        results.append({
            "filename": filename,
            "raw_text": raw_text,
            "parsed_data": parsed_data
        })

    cursor.close()
    conn.close()

    # You had job_description in the return but it's undefined
    return jsonify({
        "parsed_resumes": results
    })

# Temporary storage for JD
@app.route('/upload_jd', methods=['POST'])
def upload_jd():
    global job_description
    data = request.get_json()
    jd_text = data.get("job_description", "")

    if jd_text.strip() == "":
        return jsonify({"message": "Job Description cannot be empty"}), 400

    job_description = jd_text
    return jsonify({"message": "Job Description received successfully!"})


from flask_jwt_extended import jwt_required, get_jwt_identity
import json

# ensure this global exists near the top of your file
job_description = None

# GET match scores (optionally pass ?limit=5 or ?limit=10)
@app.route("/match_score", methods=["GET"], strict_slashes=False)
@jwt_required()
def match_resumes_get():
    global job_description
    current_user_email = get_jwt_identity()

    if not job_description:
        return jsonify({"error": "No job description provided"}), 400

    limit_param = request.args.get("limit", None)
    try:
        limit = int(limit_param) if limit_param is not None else None
    except ValueError:
        return jsonify({"error": "Invalid limit"}), 400

    conn = create_connection()
    cursor = conn.cursor()

    # Get recruiter_id
    cursor.execute("SELECT recruiter_ID FROM recruiter WHERE email=%s", (current_user_email,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({"error": "Recruiter not found"}), 404
    recruiter_id = row[0]

    # Fetch resumes uploaded by this recruiter (include current status)
    cursor.execute("SELECT resume_ID, file_name, status FROM resume WHERE recruiter_ID=%s", (recruiter_id,))
    resumes = cursor.fetchall()
    if not resumes:
        cursor.close()
        conn.close()
        return jsonify([])

    # compute embeddings & similarities (ensure the embedding model and util are imported)
    jd_embedding = model.encode(job_description, convert_to_tensor=True)
    results = []

    # ----- IMPORTANT: loop body must contain embedding and append -----
    for resume_row in resumes:
        # unpack depending on cursor fetch format
        resume_id, filename, current_status = resume_row

        # get parsed text (select explicit columns)
        cursor.execute("SELECT education, experience, skills FROM parsed_data WHERE resume_ID=%s", (resume_id,))
        parsed_row = cursor.fetchone()
        if parsed_row:
            education, experience, skills = parsed_row
            resume_text = " ".join(filter(None, [education, experience, skills]))
        else:
            resume_text = ""

        # generate embedding and similarity for this resume
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        similarity = round(util.cos_sim(jd_embedding, resume_embedding).item(), 2)

        # update the match_score in DB for this resume
        cursor.execute("UPDATE resume SET match_score=%s WHERE resume_ID=%s", (similarity, resume_id))

        results.append({
            "resume_ID": resume_id,
            "filename": filename,
            "score": similarity,
            "status": current_status
        })

    conn.commit()
    cursor.close()
    conn.close()

    # sort and optionally limit
    results.sort(key=lambda x: x["score"], reverse=True)
    if limit is not None:
        results = results[:limit]

    return jsonify(results)


# Update status (robust)
@app.route("/update_status", methods=["POST"])
@jwt_required()
def update_status():
    current_user_email = get_jwt_identity()

    data = request.get_json() or {}
    filename = data.get("filename")
    status = data.get("status")

    if not filename or not status:
        return jsonify({"error": "Filename and status required"}), 400

    # Validate status against allowed ENUM values
    allowed = ("Accept", "Waitlist", "Reject")
    if status not in allowed:
        return jsonify({"error": f"Invalid status. Allowed: {allowed}"}), 400

    conn = create_connection()
    cursor = conn.cursor(buffered=True)

    # Get recruiter ID
    cursor.execute("SELECT recruiter_ID FROM recruiter WHERE email = %s", (current_user_email,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({"error": "Recruiter not found"}), 404
    recruiter_id = row[0]

    # Find the resume record for this recruiter
    cursor.execute(
    "SELECT resume_ID, status FROM resume WHERE file_name = %s AND recruiter_ID = %s",
    (filename, recruiter_id)
    )

    found = cursor.fetchone()
    cursor.fetchall()
    if not found:
        return jsonify({"error": "Resume not found"}), 404

    resume_id = found[0]

    # Perform update using resume_ID (safer than file_name matching)
    cursor.execute(
    "UPDATE resume SET status = %s WHERE resume_ID = %s",
    (status, resume_id)
    )

    conn.commit()
    rows_affected = cursor.rowcount
    cursor.close()
    conn.close()

    if rows_affected == 0:
        return jsonify({"error": "No rows updated"}), 500

    return jsonify({"message": f"Status updated to {status} for {filename}", "filename": filename, "status": status})

@app.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    # Get the email from the JWT token
    current_user_email = get_jwt_identity()
    
    conn = create_connection()  
    cursor = conn.cursor()

    # Get recruiter_ID
    cursor.execute("SELECT recruiter_ID FROM recruiter WHERE email=%s", (current_user_email,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Recruiter not found'}), 404
    recruiter_id = row[0]

    # Total resumes
    cursor.execute("SELECT COUNT(*) FROM resume WHERE recruiter_ID=%s", (recruiter_id,))
    total_resumes = cursor.fetchone()[0]

    # Count by status
    cursor.execute("""
        SELECT status, COUNT(*) 
        FROM resume 
        WHERE recruiter_ID=%s
        GROUP BY status
    """, (recruiter_id,))
    status_counts = {row[0]: row[1] for row in cursor.fetchall()}

    # Recent uploads
    cursor.execute("""
        SELECT file_name, upload_date, status, match_score
        FROM resume
        WHERE recruiter_ID=%s
        ORDER BY upload_date DESC
        LIMIT 5
    """, (recruiter_id,))
    recent_uploads = [
        {"file_name": row[0], "upload_date": row[1].strftime("%Y-%m-%d %H:%M"), "status": row[2], "match_score": row[3]}
        for row in cursor.fetchall()
    ]

    cursor.close()
    conn.close()

    return jsonify({
        'message': f'Welcome to the dashboard, {current_user_email}!',
        'total_resumes': total_resumes,
        'status_counts': status_counts,
        'recent_uploads': recent_uploads
    }), 200


load_dotenv(dotenv_path="backend/.env")
print("DEBUG: OPENAI_API_KE =", os.getenv("OPENAI_API_KE"))  # 👈 check if key is loaded

client = OpenAI(api_key=os.getenv("OPENAI_API_KE"))

# System prompt: knowledge about HireWise
system_message = """You are an AI assistant for the Smart Resume Analyzer platform. Help recruiters clearly and politely. Explain how to upload resumes and job descriptions, check match scores, update candidate statuses (Accept, Waitlist, Reject), and view dashboards. If you don’t know something, say: "I don’t have that information yet.
"""

@app.route("/chatbot", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ]
    )

    reply = response.choices[0].message.content
    return jsonify({"reply": reply})

import json

@app.route("/delete_resume/<filename>", methods=["DELETE"])
@jwt_required()
def delete_resume(filename):
    conn = create_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM resume WHERE file_name = %s", (filename,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Resume not found"}), 404

        conn.commit()
        return jsonify({"message": f"{filename} deleted successfully!"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to delete resume"}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(debug=True)