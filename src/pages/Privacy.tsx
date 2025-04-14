
import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          At Gigstr, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
          and safeguard your information when you visit our website or use our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-2">We collect information that you provide directly to us, including:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Personal information (name, email address, phone number)</li>
          <li>Profile information (skills, experience, location)</li>
          <li>Payment information</li>
          <li>Communications with other users</li>
          <li>Feedback and reviews</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Verify your identity and prevent fraud</li>
          <li>Send you technical notices and support messages</li>
          <li>Communicate with you about products, services, and events</li>
          <li>Monitor and analyze usage patterns</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Sharing Your Information</h2>
        <p className="mb-4">
          We may share your information with other users as necessary to facilitate your transactions 
          and with service providers who perform services on our behalf. We may also share information 
          when required by law or to protect our rights and the safety of our users.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights and Choices</h2>
        <p className="mb-4">
          You can access, update, or delete your account information at any time through your account settings. 
          You may also contact us directly to request access to, or deletion of, your personal information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <a href="mailto:privacy@gigstr.com" className="text-blue-600 hover:underline">privacy@gigstr.com</a>
        </p>
        
        <p className="text-sm text-gray-500 mt-8">
          Last updated: April 14, 2025
        </p>
      </div>
    </div>
  );
};

export default Privacy;
