
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 heading-gradient">{title}</h1>
        {description && <p className="text-muted-foreground text-lg md:text-xl">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
