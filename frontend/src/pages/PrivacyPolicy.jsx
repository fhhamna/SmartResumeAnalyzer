import React from 'react';
import HRImage from '../img/HRimage.png'; 
import HRImage2 from '../img/HRimage2.png'; 

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#FBFAFC', color: '#363636', minHeight: '100vh' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
    <h2>Privacy Policy – Smart Resume Analyzer</h2>
    
    </div>

      <p><strong>Effective Date:</strong> 01st September 2025</p>

      <h5>1. Introduction</h5>
      <p>Smart Resume Analyzer values your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and safeguard personal information in compliance with the Personal Data Protection Act (PDPA).</p>

      <h5>2. Information We Collect</h5>
      <p>We collect the following information when you register or use our platform:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Organization name</li>
        <li>Password (securely hashed)</li>
        <li>Account activity (login timestamps, actions on the dashboard)</li>
      </ul>

      <h5>3. Purpose of Collection</h5>
      <p>Your personal information is collected for:</p>
      <ul>
        <li>Creating and managing your recruiter account</li>
        <li>Authenticating login sessions</li>
        <li>Providing access to dashboard features and analytics</li>
        <li>Ensuring data security and system integrity</li>
      </ul>

      <h5>4. Data Storage & Security</h5>
      <p>Passwords are stored securely using hashing. Database access is restricted to authorized personnel only. Standard security measures are applied to prevent unauthorized access or data breaches.</p>

      <h5>5. Data Sharing</h5>
      <p>We do not share your personal information with third parties unless required by law or for system functionality.</p>

      <h5>6. Data Retention</h5>
      <p>Personal information is retained for as long as your account is active. If you request deletion, your data will be removed from our system in compliance with PDPA.</p>

      <h5>7. User Rights</h5>
      <p>You have the right to access, correct, or request deletion of your personal data. Contact us at <strong>hirewise@gmail.com</strong> to exercise these rights.</p>

      <h5>8. Cookies & Tracking</h5>
      <p>Currently, our system does not use cookies or analytics tracking. Updates will be communicated if implemented in the future.</p>

      <h5>9. Changes to Privacy Policy</h5>
      <p>We may update this Privacy Policy periodically. Updates will be communicated on the platform.</p>
    </div>
  );
};

export default PrivacyPolicy;
