
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
}

interface FeaturedToolProps {
  title: string;
  description: string;
  features: FeatureItem[];
  onClick: () => void;
}

const FeaturedTool = ({ title, description, features, onClick }: FeaturedToolProps) => {
  return (
    <Card className="bg-gradient-to-r from-gigstr-purple/10 to-gigstr-blue/5 border-gigstr-purple/20 mb-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
            </CardDescription>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <FileText className="h-8 w-8 text-gigstr-purple" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full sm:w-auto" onClick={onClick}>
          Try {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedTool;
