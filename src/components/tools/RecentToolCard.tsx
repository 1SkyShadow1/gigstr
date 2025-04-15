
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface RecentToolCardProps {
  icon: LucideIcon;
  title: string;
  lastUsed: string;
  action: string;
  onClick: () => void;
}

const RecentToolCard: React.FC<RecentToolCardProps> = ({ icon: Icon, title, lastUsed, action, onClick }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Icon className="h-5 w-5 text-gigstr-purple mb-2" />
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground py-2">
        {lastUsed}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full justify-between text-xs" onClick={onClick}>
          {action}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentToolCard;
