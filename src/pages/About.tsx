
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Gigstr</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Gigstr is a leading platform in South Africa connecting skilled workers with people who need their services. 
          Founded in 2023, we aim to solve the challenge of finding reliable help for everyday tasks and specialized jobs.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="mb-4">
          Our mission is to empower workers by giving them direct access to clients while providing households and businesses 
          with qualified, verified professionals for their needs. We believe in creating economic opportunities and building 
          bridges between skilled workers and those who need their expertise.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
        <p className="mb-4">
          Our diverse team brings together expertise in technology, customer service, and local market knowledge. 
          We're passionate about creating a platform that truly serves the South African community and addresses 
          the unique challenges of our local context.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">For Workers</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Find jobs that match your skills</li>
              <li>Set your own rates and availability</li>
              <li>Build a reputation with reviews</li>
              <li>Get paid securely and promptly</li>
              <li>Grow your business through our platform</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">For Clients</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Find verified professionals quickly</li>
              <li>Browse reviews and ratings</li>
              <li>Compare prices transparently</li>
              <li>Book appointments with ease</li>
              <li>Get problems solved efficiently</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
