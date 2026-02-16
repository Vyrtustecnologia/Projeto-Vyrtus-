
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  users: User[];
  currentView: string;
  setCurrentView: (view: 'dashboard' | 'tickets' | 'admin' | 'assets') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onSelectUser, users, currentView, setCurrentView }) => {
  const p = currentUser.permissions;

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white shadow-xl z-50">
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
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
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
            Chamados
          </button>
        )}
        {p.canViewAssets && (
          <button
            onClick={() => setCurrentView('assets')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              currentView === 'assets' ? 'bg-vyrtus text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            Inventário de Ativos
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
            Configurações Admin
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-2">Alternar Usuário (Teste)</label>
        <div className="space-y-1">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => onSelectUser(u)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                currentUser.id === u.id ? 'bg-slate-700 text-white font-medium border-l-2 border-vyrtus' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
