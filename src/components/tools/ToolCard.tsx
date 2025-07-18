
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  badge?: string | null;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, path, badge = null }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full hover:border-gigstr-purple/60 shadow-glass backdrop-blur-md transition-colors group cursor-pointer bg-glass border-gigstr-purple/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="bg-gigstr-purple/10 p-3 rounded-lg group-hover:bg-gigstr-purple/20 transition-colors shadow-glow">
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
        <Button variant="glow" className="w-full justify-between transition-colors" onClick={() => navigate(path)}>
          Open Tool
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
