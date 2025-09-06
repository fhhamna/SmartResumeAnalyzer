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

**Frontend:** React.js, Bootstrap  
**Backend:** Flask, Python  
**Database:** MySQL  
**NLP & ML:** spaCy, PyMuPDF, SentenceTransformer (MiniLM)  
**Others:** Axios, Flask-CORS  

---

## Installation

1. **Clone the repository**  
```bash
git clone https://github.com/your-username/SmartResumeAnalyzer.git
cd SmartResumeAnalyzer
