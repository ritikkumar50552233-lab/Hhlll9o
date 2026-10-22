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
  const [aiQuery, setAiQuery] = useState<string>('');
  const [showQuotaBanner, setShowQuotaBanner] = useState(false);

  React.useEffect(() => {
    const handleQuota = () => setShowQuotaBanner(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsDashboard(true);
    setActiveTab('overview');
  };

  const handleOpenAIWithQuery = (q: string) => {
    setAiQuery(q);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Google Maps Quota Warning Banner */}
      {showQuotaBanner && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
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
              {activeTab === 'map' && <GlobalMapPage onOpenAIAnalysis={handleOpenAIWithQuery} />}
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
              {activeTab === 'ai' && <AIAnalysisPage initialQuery={aiQuery} />}
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
