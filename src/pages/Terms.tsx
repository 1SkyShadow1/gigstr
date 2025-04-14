
import React from 'react';
import { FileText, Bookmark, AlertTriangle, CheckCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gigstr-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-gigstr-indigo/30 to-gigstr-blue/30 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&q=80')"}}
        ></div>
        <div className="container-custom relative z-10 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 mr-3 text-white" />
              <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            </div>
            <p className="text-lg text-white/90">
              Last updated: April 14, 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Terms Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="prose max-w-none">
            <div className="bg-blue-50 border-l-4 border-gigstr-blue p-4 mb-8 rounded">
              <p className="text-gray-700">
                By accessing or using the Gigstr platform, you agree to be bound by these Terms of Service. 
                Please read them carefully before using our services.
              </p>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-purple/10 p-3 rounded-full mr-4 mt-1">
                <Bookmark className="h-5 w-5 text-gigstr-purple" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">1. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  When you create an account with us, you must provide accurate and complete information. 
                  You are responsible for safeguarding your password and for all activities that occur under your account.
                </p>
                <p className="text-gray-700">
                  We reserve the right to disable any user account if, in our opinion, you have violated any provision 
                  of these Terms of Service. You agree to immediately notify us of any unauthorized use of your account.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-blue/10 p-3 rounded-full mr-4 mt-1">
                <AlertTriangle className="h-5 w-5 text-gigstr-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">2. Service Guidelines</h2>
                <p className="text-gray-700 mb-4">As a user of our platform, you agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Use the platform for any illegal purpose or in violation of any laws</li>
                  <li>Infringe upon the intellectual property rights or privacy rights of others</li>
                  <li>Submit false, misleading, or fraudulent information</li>
                  <li>Engage in any activity that interferes with or disrupts the service</li>
                  <li>Attempt to access any unauthorized areas of the platform</li>
                  <li>Use the platform to distribute unsolicited promotional content</li>
                  <li>Attempt to manipulate ratings or reviews</li>
                  <li>Discriminate against or harass other users</li>
                  <li>Use the platform while impersonating another person</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-indigo/10 p-3 rounded-full mr-4 mt-1">
                <CheckCircle className="h-5 w-5 text-gigstr-indigo" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">3. Transactions and Payments</h2>
                <p className="text-gray-700 mb-4">
                  Gigstr facilitates transactions between users but is not a party to any agreement between workers and clients. 
                  We charge service fees for the use of our platform, which are clearly displayed before any transaction is completed.
                </p>
                <p className="text-gray-700 mb-4">
                  All payments must be processed through our platform's payment system. Direct payments between users outside 
                  the platform are prohibited and may result in account suspension.
                </p>
                <p className="text-gray-700">
                  Refunds may be issued in accordance with our Refund Policy, which considers factors such as service quality, 
                  completion status, and platform guidelines. All payment disputes will be reviewed by our team.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">4. Reviews and Feedback</h2>
            <p className="text-gray-700 mb-6">
              Users are encouraged to leave honest feedback about their experiences. However, feedback must not contain 
              offensive, abusive, or inappropriate content. We reserve the right to remove any feedback that violates our policies.
            </p>
            <p className="text-gray-700 mb-6">
              Reviews should be based on actual experiences using our platform. Manipulating the review system, including 
              offering incentives for positive reviews or posting fake reviews, is prohibited.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              The Gigstr platform, including all content, features, and functionality, is owned by Gigstr and is protected 
              by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mb-6">
              By posting content on our platform, you grant Gigstr a non-exclusive, worldwide, royalty-free license to use, 
              display, and distribute your content in connection with our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
            <p className="text-gray-700 mb-6">
              Our Privacy Policy, available at <a href="/privacy" className="text-gigstr-purple hover:underline">gigstr.com/privacy</a>, 
              details how we collect, use, and protect your personal information. By using our platform, you consent to our 
              data practices as described in the Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to suspend or terminate your account and access to our service at our sole discretion, 
              without notice, for conduct that we believe violates these Terms or is harmful to other users, us, 
              or third parties, or for any other reason.
            </p>
            <p className="text-gray-700 mb-6">
              Upon termination, your right to use the platform will immediately cease. All provisions of the Terms that 
              by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, 
              indemnity, and limitations of liability.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitations of Liability</h2>
            <p className="text-gray-700 mb-6">
              The service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee 
              the accuracy, completeness, or reliability of any content or services provided.
            </p>
            <p className="text-gray-700 mb-6">
              To the maximum extent permitted by law, Gigstr shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
              or any loss of data, use, goodwill, or other intangible losses.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p className="text-gray-700 mb-6">
              You agree to indemnify, defend, and hold harmless Gigstr and its officers, directors, employees, agents, and 
              affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal 
              and accounting fees, arising out of or in any way connected with your access to or use of the service or your 
              violation of these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We may modify these Terms at any time. Your continued use of the service after any such changes constitutes 
              your acceptance of the new Terms. If you do not agree with the revised Terms, you must stop using our platform.
            </p>
            <p className="text-gray-700 mb-6">
              We will notify you of significant changes to the Terms through email or platform notifications.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of South Africa, 
              without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-2">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> <a href="mailto:legal@gigstr.com" className="text-gigstr-blue hover:underline">legal@gigstr.com</a>
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> 123 Legal Avenue, Cape Town, South Africa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
