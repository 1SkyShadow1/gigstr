
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: { title: string; description: string }[];
  buttonText: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  onClick
}) => {
  return (
    <Card className="bg-glass border-gigstr-purple/20 mb-8 shadow-glass backdrop-blur-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
            </CardDescription>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-glow">
            <Icon className="h-8 w-8 text-gigstr-purple" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-glass">
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="glow" className="w-full sm:w-auto">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
