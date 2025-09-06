import React, { useState } from "react";
import './style/FAQ.css';

const faqsData = [
  {
    question: "How does HireWise match resumes?",
    answer: "HireWise uses AI-powered NLP algorithms to analyze resumes and match them with job descriptions for the most relevant candidates."
  },
  {
    question: "Do I need to create an account?",
    answer: "Yes, you need an account to upload and analyze resumes securely."
  },
  {
    question: "Can HireWise handle large volumes of resumes?",
    answer: "Absolutely! Our system is scalable and works efficiently for small startups as well as large enterprises."
  },
  {
    question: "Do I need technical knowledge to use HireWise?",
    answer: "No, the interface is user-friendly and intuitive for recruiters and candidates alike."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container" id="FAQ">
      <h2>Frequently Asked Questions</h2>
      {faqsData.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggleFAQ(index)}>
            {faq.question}
            <span className="faq-icon">{openIndex === index ? "-" : "+"}</span>
          </div>
          {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
