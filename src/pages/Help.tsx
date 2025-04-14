
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MainLayout from '@/layouts/MainLayout';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Help Center</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              To create an account, click on the "Sign Up" button in the top right corner of any page. 
              Fill out the registration form with your details and follow the verification process.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I find workers?</AccordionTrigger>
            <AccordionContent>
              Navigate to the "Find Workers" page, where you can browse workers by category, 
              location, or search for specific skills. You can filter results based on ratings, 
              price range, and availability.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I get paid as a worker?</AccordionTrigger>
            <AccordionContent>
              Once you complete a job, the client will mark it as completed, and payment will be 
              released from escrow to your account. You can withdraw funds to your linked bank 
              account or mobile money service at any time.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>What if there's a dispute about work quality?</AccordionTrigger>
            <AccordionContent>
              If there's a disagreement about the completed work, both parties can use our 
              resolution center to address concerns. Our team will review evidence from both 
              sides and help mediate a fair outcome.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>How are workers verified?</AccordionTrigger>
            <AccordionContent>
              All workers go through our verification process, which includes ID verification, 
              skills assessment, and background checks where applicable. Workers can also gain 
              verified badges through completing jobs successfully.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
        <p className="mb-4">Our support team is available to assist you with any questions or issues.</p>
        <div className="space-y-2">
          <p><strong>Email:</strong> support@gigstr.com</p>
          <p><strong>Phone:</strong> +27 10 123 4567</p>
          <p><strong>Hours:</strong> Monday to Friday, 8am to 6pm</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
