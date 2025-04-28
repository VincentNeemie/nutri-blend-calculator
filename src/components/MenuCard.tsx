
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  to: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  to, 
  title, 
  description, 
  icon,
  className
}) => {
  return (
    <Link 
      to={to}
      className={cn(
        "menu-card w-full md:w-72 h-64", 
        className
      )}
    >
      <div className="text-primary text-4xl mb-2">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-gray-800 text-center">{title}</h2>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </Link>
  );
};

export default MenuCard;
