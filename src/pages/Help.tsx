
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Mail, Phone, Clock, HelpCircle, FileText, BookOpen, MessageCircle } from 'lucide-react';

const Help = () => {
  return (
    <div className="bg-gray-50 dark:bg-[var(--color-card)] min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gigstr-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-gigstr-purple/20 to-gigstr-blue/20 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&q=80')"}}
        ></div>
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Help Center</h1>
            <p className="text-xl text-white/90 mb-8">
              Find answers to your questions and get the support you need
            </p>
            
            <div className="bg-white rounded-lg p-2 flex shadow-lg max-w-xl mx-auto">
              <Input 
                placeholder="Search for help..." 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base" 
              />
              <Button className="ml-2">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Help Categories */}
      <div className="container-custom py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Popular Help Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Card className="text-center hover:shadow-md transition-all hover:border-gigstr-purple cursor-pointer dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow">
              <CardContent className="pt-6">
                <div className="bg-gigstr-purple/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <HelpCircle className="h-6 w-6 text-gigstr-purple" />
                </div>
                <h3 className="font-medium">Getting Started</h3>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-all hover:border-gigstr-blue cursor-pointer dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow">
              <CardContent className="pt-6">
                <div className="bg-gigstr-blue/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <FileText className="h-6 w-6 text-gigstr-blue" />
                </div>
                <h3 className="font-medium">Account Issues</h3>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-all hover:border-gigstr-indigo cursor-pointer dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow">
              <CardContent className="pt-6">
                <div className="bg-gigstr-indigo/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <BookOpen className="h-6 w-6 text-gigstr-indigo" />
                </div>
                <h3 className="font-medium">Payments</h3>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-md transition-all hover:border-gigstr-teal cursor-pointer dark:bg-glass hover:shadow-glow focus:shadow-glow active:shadow-glow">
              <CardContent className="pt-6">
                <div className="bg-gigstr-teal/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <MessageCircle className="h-6 w-6 text-gigstr-teal" />
                </div>
                <h3 className="font-medium">Safety & Trust</h3>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full bg-white rounded-lg border shadow-sm">
              <AccordionItem value="item-1" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">How do I create an account?</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-1">
                  <p className="text-gray-700 mb-3">
                    To create an account, click on the "Sign Up" button in the top right corner of any page. 
                    Fill out the registration form with your details and follow the verification process.
                  </p>
                  <p className="text-gray-700">
                    You'll need to provide your email address, create a password, and verify your identity. We may also
                    ask for additional information depending on whether you're registering as a worker or a client.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">How do I find workers?</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-1">
                  <p className="text-gray-700 mb-3">
                    Navigate to the "Find Workers" page, where you can browse workers by category, 
                    location, or search for specific skills. You can filter results based on ratings, 
                    price range, and availability.
                  </p>
                  <p className="text-gray-700">
                    Each worker profile includes their rates, skills, experience, and reviews from previous clients. 
                    Once you find a suitable worker, you can contact them directly through our messaging system or book their services.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">How do I get paid as a worker?</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-1">
                  <p className="text-gray-700 mb-3">
                    Once you complete a job, the client will mark it as completed, and payment will be 
                    released from escrow to your account. You can withdraw funds to your linked bank 
                    account or mobile money service at any time.
                  </p>
                  <p className="text-gray-700">
                    Payment processing typically takes 1-3 business days, depending on your bank. You can track all your 
                    earnings and pending payments from your dashboard.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">What if there's a dispute about work quality?</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-1">
                  <p className="text-gray-700 mb-3">
                    If there's a disagreement about the completed work, both parties can use our 
                    resolution center to address concerns. Our team will review evidence from both 
                    sides and help mediate a fair outcome.
                  </p>
                  <p className="text-gray-700">
                    We recommend documenting the work with photos before and after completion, and keeping all communication 
                    within our platform to ensure there is a clear record in case of disputes.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">How are workers verified?</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-1">
                  <p className="text-gray-700 mb-3">
                    All workers go through our verification process, which includes ID verification, 
                    skills assessment, and background checks where applicable. Workers can also gain 
                    verified badges through completing jobs successfully.
                  </p>
                  <p className="text-gray-700">
                    Our verification process helps ensure safety and quality on the platform. Workers with higher verification 
                    levels typically receive more job opportunities and can command better rates.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">How do I post a job?</AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-1">
                  <p className="text-gray-700 mb-3">
                    To post a job, navigate to the "Post a Job" section in your dashboard. Fill out the job details, 
                    including description, location, budget, and any specific requirements.
                  </p>
                  <p className="text-gray-700">
                    Once posted, qualified workers will be able to view your job and send applications. You can review profiles 
                    and proposals before selecting the best candidate for your needs.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Contact Section */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6 text-center">Need More Help?</h2>
            <p className="text-center mb-8">Our support team is available to assist you with any questions or issues.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gigstr-purple/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <Mail className="h-6 w-6 text-gigstr-purple" />
                </div>
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-3">Get help via email</p>
                <p className="font-medium text-gigstr-purple">support@gigstr.com</p>
              </div>
              
              <div className="text-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gigstr-blue/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <Phone className="h-6 w-6 text-gigstr-blue" />
                </div>
                <h3 className="font-medium mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 mb-3">Speak to our team</p>
                <p className="font-medium text-gigstr-blue">+27 10 123 4567</p>
              </div>
              
              <div className="text-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-gigstr-teal/10 p-4 rounded-full mx-auto mb-4 w-fit">
                  <Clock className="h-6 w-6 text-gigstr-teal" />
                </div>
                <h3 className="font-medium mb-2">Operating Hours</h3>
                <p className="text-sm text-gray-600 mb-3">When you can reach us</p>
                <p className="font-medium text-gigstr-teal">Mon-Fri, 8am - 6pm SAST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
