
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
  currentView: string;
  setCurrentView: (view: 'dashboard' | 'tickets' | 'admin' | 'assets' | 'clients' | 'requesters' | 'external_assets' | 'external_tickets') => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, currentView, setCurrentView, isOpen, onClose }) => {
  const p = currentUser.permissions;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 border-b border-slate-800 flex flex-col items-center">
          <div className="flex flex-col items-center gap-1">
             <div className="flex items-center gap-2">
                <span className="text-3xl font-black italic tracking-tighter text-vyrtus">VYRTUS</span>
                <svg className="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-14C7.03 4 3 8.03 3 13h2c0-3.87 3.13-7 7-7s7 3.13 7 7h2c0-4.97-4.03-9-9-9zm0 4c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5z"/>
                </svg>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] -mt-1">TECNOLOGIA</p>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:hidden p-2 text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {p.canViewDashboard && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'dashboard' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </button>
          )}
          {p.canViewTickets && (
            <button
              onClick={() => setCurrentView('tickets')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'tickets' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Chamados Locais
            </button>
          )}
          {p.canViewExternalTickets && (
            <button
              onClick={() => setCurrentView('external_tickets')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'external_tickets' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              Chamados (DB)
            </button>
          )}
          {p.canViewClients && (
            <button
              onClick={() => setCurrentView('clients')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'clients' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Clientes
            </button>
          )}
          {p.canViewRequesters && (
            <button
              onClick={() => setCurrentView('requesters')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'requesters' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Solicitantes
            </button>
          )}
          {p.canViewExternalAssets && (
            <button
              onClick={() => setCurrentView('external_assets')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'external_assets' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              Ativos (API)
            </button>
          )}
          {p.canViewAssets && (
            <button
              onClick={() => setCurrentView('assets')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'assets' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Inventário Local
            </button>
          )}
          {p.canViewAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                currentView === 'admin' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Admin
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-800/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-vyrtus flex flex-shrink-0 items-center justify-center font-bold text-lg shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold truncate text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-vyrtus font-bold uppercase tracking-tight">{currentUser.role}</div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
