import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Hospital, 
  FileText, 
  Settings, 
  LogOut,
  ShieldPlus
} from 'lucide-react';
import { LayoutProps, ViewType } from '../types';
import { cn } from '../lib/utils'; // We will create this

export function Navigation({ currentView, onNavigate, isDrawerOpen, toggleDrawer }: LayoutProps) {
  
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'partners' as ViewType, label: 'Partners', icon: Building2 },
    { id: 'facilities' as ViewType, label: 'Facilities', icon: Hospital },
    { id: 'reports' as ViewType, label: 'Dokumen PKB', icon: FileText },
  ];

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-surface-container-low backdrop-blur-md border-r border-outline-variant flex flex-col py-4 space-y-2 transition-transform duration-300 md:translate-x-0",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
         <div className="px-6 py-4 flex flex-col items-start gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
              <ShieldPlus size={28} />
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-primary">PLN Health</h1>
              <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Corporate Oversight</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 mx-2 px-4 py-3 rounded-full transition-all text-left",
                currentView === item.id 
                  ? "bg-primary-container text-on-primary-container scale-[0.98] shadow-sm" 
                  : "text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              <item.icon size={20} className={currentView === item.id ? "fill-on-primary-container/20" : ""} />
              <span className="font-body-md">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleDrawer}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-full max-h-20 px-2 pb-safe bg-surface backdrop-blur-md border-t border-outline-variant z-50 md:hidden pb-4 pt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1 transition-all rounded-xl",
              currentView === item.id 
                ? "bg-secondary-container text-on-secondary-container scale-95 duration-150" 
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            <item.icon size={24} className={currentView === item.id ? "fill-on-secondary-container/20" : ""} />
            <span className={cn(
              "text-label-sm mt-1",
              currentView === item.id ? "font-bold font-label-sm text-on-secondary-container" : "font-label-sm"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
