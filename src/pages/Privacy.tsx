
import React from 'react';
import { Shield, Lock, Clock, FileText, AlertCircle } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-gray-50 dark:bg-[var(--color-card)] min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gigstr-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-gigstr-purple/30 to-gigstr-indigo/30 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1473091534298-04dcbce3278c?ixlib=rb-4.0.3&q=80')"}}
        ></div>
        <div className="container-custom relative z-10 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 mr-3 text-white" />
              <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-lg text-white/90">
              Last updated: April 14, 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Policy Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="prose max-w-none">
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-purple/10 p-3 rounded-full mr-4 mt-1">
                <Lock className="h-5 w-5 text-gigstr-purple" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">Our Commitment to Privacy</h2>
                <p className="text-gray-700">
                  At Gigstr, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you visit our website or use our service. We are committed to 
                  ensuring the privacy and security of your personal data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-blue/10 p-3 rounded-full mr-4 mt-1">
                <FileText className="h-5 w-5 text-gigstr-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">Information We Collect</h2>
                <p className="text-gray-700 mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, postal address</li>
                  <li><strong>Profile Information:</strong> Skills, experience, education, certifications, location</li>
                  <li><strong>Payment Information:</strong> Banking details, billing address (stored securely with our payment processors)</li>
                  <li><strong>Communications:</strong> Messages exchanged with other users and our support team</li>
                  <li><strong>Feedback and Reviews:</strong> Ratings and written reviews you provide or receive</li>
                  <li><strong>Identity Verification:</strong> Documents provided for verification purposes</li>
                </ul>
                
                <p className="text-gray-700 mt-4">
                  We also collect certain information automatically when you use our platform, including your IP address, 
                  browser type, device information, and usage data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-indigo/10 p-3 rounded-full mr-4 mt-1">
                <AlertCircle className="h-5 w-5 text-gigstr-indigo" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Verify your identity and prevent fraud</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Personalize your experience and provide tailored content</li>
                  <li>Ensure compliance with our terms and policies</li>
                  <li>Address trust and safety issues on our platform</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start mb-8">
              <div className="bg-gigstr-teal/10 p-3 rounded-full mr-4 mt-1">
                <Clock className="h-5 w-5 text-gigstr-teal" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4 mt-0">Data Retention</h2>
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                  unless a longer retention period is required or permitted by law. When determining how long to keep your data, we consider:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                  <li>The duration of our relationship with you</li>
                  <li>Legal obligations we must comply with</li>
                  <li>Applicable statutes of limitations</li>
                  <li>Ongoing or potential disputes or legal claims</li>
                  <li>Guidelines issued by relevant data protection authorities</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
            <p className="text-gray-700 mb-6">
              We may share your information with other users as necessary to facilitate your transactions 
              and with service providers who perform services on our behalf. We may also share information 
              when required by law or to protect our rights and the safety of our users.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-6">
              You have several rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> You can request copies of your personal information</li>
              <li><strong>Rectification:</strong> You can ask us to correct inaccurate information</li>
              <li><strong>Erasure:</strong> You can request deletion of your data under certain circumstances</li>
              <li><strong>Restriction:</strong> You can ask us to limit how we use your data</li>
              <li><strong>Data Portability:</strong> You can request transfer of your data in a machine-readable format</li>
              <li><strong>Objection:</strong> You can object to certain types of processing</li>
            </ul>
            <p className="text-gray-700 mb-6">
              To exercise these rights, please contact our Privacy Officer using the contact details below.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Security Measures</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information 
              against unauthorized access, disclosure, alteration, or destruction. These measures include encryption, 
              access controls, regular security assessments, and staff training on privacy and security practices.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">International Transfers</h2>
            <p className="text-gray-700 mb-6">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have different data protection laws. Whenever we transfer your information, we take 
              appropriate safeguards to ensure its protection.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
              "Last Updated" date and the updated version will be effective as soon as it is accessible. We encourage 
              you to review this Privacy Policy frequently to stay informed about how we are protecting your information.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-2">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> <a href="mailto:privacy@gigstr.com" className="text-gigstr-purple hover:underline">privacy@gigstr.com</a>
            </p>
            <p className="text-gray-700">
              <strong>Address:</strong> 123 Privacy Street, Cape Town, South Africa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
