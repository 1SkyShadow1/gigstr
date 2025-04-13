
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WorkerBadgeProps {
  category: string;
}

const WorkerBadge: React.FC<WorkerBadgeProps> = ({ category }) => {
  // Define icon and color based on worker category
  const getWorkerData = (category: string) => {
    switch(category.toLowerCase()) {
      case 'plumbing':
        return { icon: '🔧', color: 'bg-blue-100 text-blue-800' };
      case 'electrical':
        return { icon: '⚡', color: 'bg-yellow-100 text-yellow-800' };
      case 'domestic work':
        return { icon: '🏠', color: 'bg-green-100 text-green-800' };
      case 'gardening':
        return { icon: '🌱', color: 'bg-emerald-100 text-emerald-800' };
      case 'cleaning':
        return { icon: '🧹', color: 'bg-cyan-100 text-cyan-800' };
      case 'childcare':
        return { icon: '👶', color: 'bg-pink-100 text-pink-800' };
      case 'transportation':
        return { icon: '🚗', color: 'bg-indigo-100 text-indigo-800' };
      case 'repairs':
        return { icon: '🛠️', color: 'bg-gray-100 text-gray-800' };
      case 'painting':
        return { icon: '🎨', color: 'bg-purple-100 text-purple-800' };
      case 'construction':
        return { icon: '🏗️', color: 'bg-amber-100 text-amber-800' };
      case 'security':
        return { icon: '🛡️', color: 'bg-red-100 text-red-800' };
      default:
        return { icon: '💼', color: 'bg-slate-100 text-slate-800' };
    }
  };

  const { icon, color } = getWorkerData(category);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${color} cursor-help`}>
            <span className="mr-1">{icon}</span> {category}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{category} services</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WorkerBadge;
