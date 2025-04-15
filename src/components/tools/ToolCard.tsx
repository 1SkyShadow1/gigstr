
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  badge?: string | null;
}

const ToolCard = ({ title, description, icon: Icon, path, badge = null }: ToolCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full hover:border-gigstr-purple/40 transition-colors group cursor-pointer" onClick={() => navigate(path)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="bg-gigstr-purple/10 p-3 rounded-lg group-hover:bg-gigstr-purple/20 transition-colors">
            <Icon className="h-6 w-6 text-gigstr-purple" />
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-gray-100">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="ghost" className="w-full justify-between group-hover:text-gigstr-purple transition-colors">
          Open Tool
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
