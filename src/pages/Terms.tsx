
import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Welcome to Gigstr. By accessing or using our service, you agree to be bound by these Terms of Service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. User Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide accurate and complete information. 
          You are responsible for safeguarding your password and for all activities that occur under your account.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Guidelines</h2>
        <p className="mb-2">As a user of our platform, you agree not to:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Violate any laws or regulations</li>
          <li>Infringe upon the rights of others</li>
          <li>Submit false or misleading information</li>
          <li>Engage in any activity that interferes with or disrupts the service</li>
          <li>Attempt to access any unauthorized areas of the platform</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Transactions and Payments</h2>
        <p className="mb-4">
          Gigstr facilitates transactions between users but is not a party to any agreement between workers and clients. 
          We charge service fees for the use of our platform, which are clearly displayed before any transaction is completed.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Reviews and Feedback</h2>
        <p className="mb-4">
          Users are encouraged to leave honest feedback about their experiences. However, feedback must not contain 
          offensive, abusive, or inappropriate content. We reserve the right to remove any feedback that violates our policies.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate your account and access to our service at our sole discretion, 
          without notice, for conduct that we believe violates these Terms or is harmful to other users, us, 
          or third parties, or for any other reason.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Disclaimers and Limitations of Liability</h2>
        <p className="mb-4">
          The service is provided "as is" without warranties of any kind. We are not liable for any damages 
          arising out of or in connection with your use of our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to Terms</h2>
        <p className="mb-4">
          We may modify these Terms at any time. Your continued use of the service after any such changes constitutes 
          your acceptance of the new Terms.
        </p>
        
        <p className="text-sm text-gray-500 mt-8">
          Last updated: April 14, 2025
        </p>
      </div>
    </div>
  );
};

export default Terms;
