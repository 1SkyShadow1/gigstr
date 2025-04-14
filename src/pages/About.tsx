
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Award, Users, ThumbsUp, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gigstr-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gigstr-purple/30 to-gigstr-blue/30 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&q=80')"}}
        ></div>
        <div className="container-custom relative z-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Gigstr</h1>
            <p className="text-xl text-white/90 mb-8">
              Connecting South Africa's skilled workforce with clients who need reliable services since 2023.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose max-w-none mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gigstr-purple">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-lg mb-4">
                  Gigstr was founded in 2023 with a clear vision: to bridge the gap between skilled workers and those in need of services in South Africa.
                </p>
                <p className="mb-4">
                  Our platform emerged from recognizing the challenges faced by both service providers seeking consistent work and clients struggling to find reliable help. By creating a transparent, secure, and easy-to-use platform, we're transforming how work happens in communities across the country.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&q=80" 
                  alt="Gig workers collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mt-16 mb-6 text-gigstr-purple">Our Mission</h2>
            <p className="text-lg mb-8">
              Our mission is to empower workers by giving them direct access to clients while providing households and businesses 
              with qualified, verified professionals for their needs. We believe in creating economic opportunities and building 
              bridges between skilled workers and those who need their expertise.
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
              <Card className="text-center py-6 border-gigstr-purple/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-gigstr-purple mb-2">5,000+</p>
                  <p className="text-sm text-gray-600">Skilled Workers</p>
                </CardContent>
              </Card>
              <Card className="text-center py-6 border-gigstr-blue/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-gigstr-blue mb-2">12,000+</p>
                  <p className="text-sm text-gray-600">Completed Jobs</p>
                </CardContent>
              </Card>
              <Card className="text-center py-6 border-gigstr-indigo/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-gigstr-indigo mb-2">3,500+</p>
                  <p className="text-sm text-gray-600">Active Clients</p>
                </CardContent>
              </Card>
              <Card className="text-center py-6 border-gigstr-teal/20 hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <p className="text-3xl font-bold text-gigstr-teal mb-2">9</p>
                  <p className="text-sm text-gray-600">South African Provinces</p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-3xl font-bold mt-16 mb-6 text-gigstr-purple">Our Team</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  Our diverse team brings together expertise in technology, customer service, and deep understanding of local markets. 
                  We're passionate about creating a platform that truly serves the South African community and addresses 
                  the unique challenges of our local context.
                </p>
                <p>
                  With team members from various backgrounds and experiences, we bring together diverse perspectives to create 
                  an inclusive platform that works for everyone, regardless of skill level, education, or geographic location.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold my-12 text-center text-gigstr-purple">How We Help</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-gigstr-purple/10 p-4 rounded-full mr-4">
                  <Briefcase className="h-6 w-6 text-gigstr-purple" />
                </div>
                <h3 className="text-xl font-semibold">For Workers</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-purple mr-2 mt-1 flex-shrink-0" />
                  <span>Find jobs that match your skills and schedule</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-purple mr-2 mt-1 flex-shrink-0" />
                  <span>Set your own rates and availability preferences</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-purple mr-2 mt-1 flex-shrink-0" />
                  <span>Build your reputation with verified reviews</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-purple mr-2 mt-1 flex-shrink-0" />
                  <span>Get paid securely through our trusted payment system</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-purple mr-2 mt-1 flex-shrink-0" />
                  <span>Access training resources to grow your skills</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-gigstr-blue/10 p-4 rounded-full mr-4">
                  <Users className="h-6 w-6 text-gigstr-blue" />
                </div>
                <h3 className="text-xl font-semibold">For Clients</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-blue mr-2 mt-1 flex-shrink-0" />
                  <span>Find verified professionals quickly for any job</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-blue mr-2 mt-1 flex-shrink-0" />
                  <span>Browse comprehensive reviews and skill ratings</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-blue mr-2 mt-1 flex-shrink-0" />
                  <span>Compare prices transparently with no hidden fees</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-blue mr-2 mt-1 flex-shrink-0" />
                  <span>Book appointments easily with our scheduling system</span>
                </li>
                <li className="flex items-start">
                  <ThumbsUp className="h-5 w-5 text-gigstr-blue mr-2 mt-1 flex-shrink-0" />
                  <span>Get your problems solved by skilled professionals</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Values Section */}
          <div className="mt-20 mb-16">
            <h2 className="text-3xl font-bold mb-12 text-center text-gigstr-purple">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-t-4 border-t-gigstr-purple hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gigstr-purple/10 p-3 rounded-full">
                      <Award className="h-6 w-6 text-gigstr-purple" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">Trust & Safety</h3>
                  <p className="text-gray-600 text-center">
                    We prioritize creating a safe platform with thorough verification processes and secure transactions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-gigstr-indigo hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gigstr-indigo/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-gigstr-indigo" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">Community</h3>
                  <p className="text-gray-600 text-center">
                    We're building more than a platform—we're creating a community that supports skill development and collaboration.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-t-gigstr-teal hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gigstr-teal/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-gigstr-teal" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">Local Impact</h3>
                  <p className="text-gray-600 text-center">
                    We're committed to making a positive difference in local communities by creating economic opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
