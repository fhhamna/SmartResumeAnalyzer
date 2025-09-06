import React from 'react';
import HRImage from '../img/HRimage.png'; 
import HRImage2 from '../img/HRimage2.png';

const TermsOfUse = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#FBFAFC', color: '#363636', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
        <h2>Terms of Use – Smart Resume Analyzer</h2>
        
        </div>

      <p><strong>Effective Date:</strong> 01st September 2025</p>

      <h5>1. Acceptance of Terms</h5>
      <p>By creating an account or using the Smart Resume Analyzer, you agree to these Terms of Use and our Privacy Policy.</p>

      <h5>2. Eligibility</h5>
      <p>You must be an authorized recruiter to register. Minors or unauthorized users are not permitted.</p>

      <h5>3. Account Responsibilities</h5>
      <ul>
        <li>Keep your login credentials secure.</li>
        <li>Do not share your account with others.</li>
        <li>Notify us immediately if your account is compromised.</li>
      </ul>

      <h5>4. Permitted Use</h5>
      <ul>
        <li>Accessing recruiter dashboard features.</li>
        <li>Managing and analyzing resumes for recruitment purposes.</li>
        <li>Any misuse, hacking, or unauthorized access is strictly prohibited.</li>
      </ul>

      <h5>5. Limitation of Liability</h5>
      <p>We are not responsible for errors or inaccuracies in data submitted by users or losses resulting from unauthorized access if login credentials are compromised.</p>

      <h5>6. Termination</h5>
      <p>Accounts may be suspended or terminated if users violate these Terms of Use or PDPA regulations.</p>

      <h5>7. Governing Law</h5>
      <p>These terms are governed by the laws of <strong>Sri Lanka</strong>, including the <strong>Personal Data Protection Act (PDPA)</strong>.</p>

      <h5>8. Contact</h5>
      <p>For questions about these Terms or Privacy Policy, please contact us at <strong>hirewise@gmail.com</strong>.</p>
    </div>
  );
};

export default TermsOfUse;
