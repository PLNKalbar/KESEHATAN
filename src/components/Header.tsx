import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { LayoutProps } from '../types';

export function Header({ toggleDrawer }: Pick<LayoutProps, 'toggleDrawer'>) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-container-padding h-16 md:w-[calc(100%-20rem)] md:right-0 md:left-auto">
      <div className="flex items-center gap-3">
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors duration-200 relative">
          <Bell className="text-primary" size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button 
          onClick={toggleDrawer}
          className="md:hidden p-2 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors duration-200"
        >
          <Menu className="text-primary" size={20} />
        </button>
      </div>
    </header>
  );
}
