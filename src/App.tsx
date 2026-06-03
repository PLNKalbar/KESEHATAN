import React, { useState } from 'react';
import { ViewType } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './views/Dashboard';
import { FacilitiesView } from './views/Facilities';
import { PartnersView } from './views/Partners';
import { ReportsView } from './views/Reports';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setIsDrawerOpen(false); // Close mobile drawer on navigation
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'facilities': return <FacilitiesView />;
      case 'partners': return <PartnersView />;
      case 'reports': return <ReportsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md">
      <Header toggleDrawer={toggleDrawer} />
      
      <Navigation 
        currentView={currentView} 
        onNavigate={handleNavigate}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />

      {/* Main Content Area */}
      <main className="pt-20 md:pt-24 px-container-padding pb-28 md:pb-8 md:pl-80 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
