
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface RecentToolCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const RecentToolCard = ({ icon: Icon, title, subtitle, onClick }: RecentToolCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Icon className="h-5 w-5 text-gigstr-purple mb-2" />
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground py-2">
        {subtitle}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full justify-between text-xs" onClick={onClick}>
          {title.includes("Invoice") ? "Continue Editing" : title.includes("Project") ? "View Project" : "Resume Tracking"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentToolCard;
