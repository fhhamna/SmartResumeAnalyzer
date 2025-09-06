# Smart Resume Analyzer

A web-based AI-driven application that automates resume parsing, job description matching, and candidate evaluation to support recruiters in hiring decisions. Built with **React**, **Flask**, **MySQL**, and **Natural Language Processing (NLP)**.

---

## Project Overview

Recruiters often spend significant time manually screening resumes, which can be inefficient and prone to errors. The Smart Resume Analyzer automates this process by extracting skills, education, and experience from resumes, then matching candidates to job descriptions using AI and NLP techniques. It provides a dashboard for recruiters to visualize data and make informed decisions.

---

## Features

- Upload resumes in PDF or TXT format.  
- Automatic extraction of **skills, education, and work experience** using NLP.  
- Match resumes against job descriptions and generate **match scores**.  
- Recruiter dashboard with **action buttons** to Accept, Reject, or Waitlist candidates.  
- Data visualization of application metrics and candidate status.  
- Chatbot-style tips for recruiter guidance.  

---

## Technology Stack

- **Frontend:** React.js, Tailwind CSS 
- **Backend:** Flask, Python  
- **Database:** MySQL  
- **NLP & ML:** spaCy, PyMuPDF, SentenceTransformer (MiniLM)  
- **Others:** Axios, Flask-CORS  

---

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SmartResumeAnalyzer.git
cd SmartResumeAnalyzer
2. Backend Setup
bash
Copy code
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
python app.py
3. Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
4. Database Setup
Create a MySQL database named resume_analyzer

Import database.sql from the backend folder
```
## Usage

1. Open the app in your browser: [http://localhost:3000](http://localhost:3000)
2. Sign up or log in as a recruiter.
3. Upload resumes in PDF format.
4. View parsing results, match scores, and take actions on candidates.
5. Monitor overall statistics through the dashboard.

## Folder Structure

```plaintext
SmartResumeAnalyzer/
│
├── backend/           # Flask backend
│   ├── app.py
│   └── db.py
│
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```
## Future Improvements

- Improve parsing accuracy with advanced NLP/ML models
- Enterprise-level deployment and cloud integration
- Enhanced recruiter analytics

---


## Contact

**Developer:** Fazlul Humaid Hamna  
**Email:** [hamnahumaid@gmail.com]
