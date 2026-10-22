import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { DashboardOverview } from './pages/DashboardOverview';
import { GlobalMapPage } from './pages/GlobalMapPage';
import { GlobalEventsPage } from './pages/GlobalEventsPage';
import { GeospatialOSINTPage } from './pages/GeospatialOSINTPage';
import { EarthObservationPage } from './pages/EarthObservationPage';
import { AviationPage } from './pages/AviationPage';
import { MaritimePage } from './pages/MaritimePage';
import { DomainIntelPage } from './pages/DomainIntelPage';
import { IPIntelPage } from './pages/IPIntelPage';
import { NewsIntelPage } from './pages/NewsIntelPage';
import { InvestigationWorkspacePage } from './pages/InvestigationWorkspacePage';
import { SituationRoomPage } from './pages/SituationRoomPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { AdminConsolePage } from './pages/AdminConsolePage';
import { SettingsProfilePage } from './pages/SettingsProfilePage';

function MainAppContent() {
  const { isAuthenticated } = useAuth();
  const [isDashboard, setIsDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsDashboard(true);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDashboard={isDashboard}
        setIsDashboard={setIsDashboard}
      />

      <div className="flex-1 flex overflow-hidden">
        {isDashboard && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8 custom-scrollbar">
          {!isDashboard ? (
            <LandingPage
              onExplore={() => {
                if (isAuthenticated) {
                  setIsDashboard(true);
                  setActiveTab('overview');
                } else {
                  handleOpenAuth('signin');
                }
              }}
              onOpenAuth={handleOpenAuth}
            />
          ) : (
            <>
              {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
              {activeTab === 'map' && <GlobalMapPage />}
              {activeTab === 'events' && <GlobalEventsPage />}
              {activeTab === 'osint' && <GeospatialOSINTPage />}
              {activeTab === 'earth' && <EarthObservationPage />}
              {activeTab === 'aviation' && <AviationPage />}
              {activeTab === 'maritime' && <MaritimePage />}
              {activeTab === 'domain' && <DomainIntelPage />}
              {activeTab === 'ip' && <IPIntelPage />}
              {activeTab === 'news' && <NewsIntelPage />}
              {activeTab === 'investigations' && <InvestigationWorkspacePage />}
              {activeTab === 'situation' && <SituationRoomPage />}
              {activeTab === 'ai' && <AIAnalysisPage />}
              {activeTab === 'sources' && <DataSourcesPage />}
              {activeTab === 'admin' && <AdminConsolePage />}
              {activeTab === 'settings' && <SettingsProfilePage />}
            </>
          )}
        </main>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
