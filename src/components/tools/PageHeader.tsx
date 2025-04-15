
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4 p-1 h-8 w-8"
          asChild
        >
          <Link to="/tools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center">
          <div className="bg-gigstr-purple/10 p-2 rounded-lg mr-3">
            {icon}
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>
      <p className="text-muted-foreground ml-14">{description}</p>
    </div>
  );
};

export default PageHeader;
