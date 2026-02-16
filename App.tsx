
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import CreateTicketModal from './components/CreateTicketModal';
import AdminPanel from './components/AdminPanel';
import AssetManager from './components/AssetManager';
import Login from './components/Login';
import { User, Ticket, TicketStatus } from './types';
import { api } from './api';

type FilterType = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'CLOSED' | 'ALL';
type ViewType = 'dashboard' | 'tickets' | 'admin' | 'assets';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeFilter, setActiveFilter] = useState<FilterType>('OPEN');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const session = api.auth.getCurrentSession();
        if (session) {
          setCurrentUser(session);
        }

        const [fetchedUsers, fetchedTickets] = await Promise.all([
          api.users.getAll(),
          api.tickets.getAll()
        ]);
        setUsers(fetchedUsers);
        setTickets(fetchedTickets);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.permissions.canViewDashboard) setCurrentView('dashboard');
    else if (user.permissions.canViewTickets) setCurrentView('tickets');
  };

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setSelectedTicket(null);
    setIsSidebarOpen(false);
  };

  const refreshUser = async () => {
    if (!currentUser) return;
    const allUsers = await api.users.getAll();
    setUsers(allUsers);
    const updated = allUsers.find(u => u.id === currentUser.id);
    if (updated) {
      setCurrentUser(updated);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const p = currentUser.permissions;
    const accessMap: Record<ViewType, boolean> = {
      dashboard: p.canViewDashboard,
      tickets: p.canViewTickets,
      assets: p.canViewAssets,
      admin: p.canViewAdmin
    };

    if (!accessMap[currentView]) {
      const firstAvailable = (Object.keys(accessMap) as ViewType[]).find(v => accessMap[v]);
      if (firstAvailable) setCurrentView(firstAvailable);
    }
  }, [currentUser, currentView]);

  const refreshTickets = async () => {
    const fetched = await api.tickets.getAll();
    setTickets(fetched);
  };

  const filteredTickets = useMemo(() => {
    switch (activeFilter) {
      case 'OPEN':
        return tickets.filter(t => t.status !== TicketStatus.CONCLUIDO && t.status !== TicketStatus.CANCELADO);
      case 'IN_PROGRESS':
        return tickets.filter(t => t.status === TicketStatus.EM_ATENDIMENTO || t.status === TicketStatus.ATENDIMENTO_AGENDADO);
      case 'WAITING':
        return tickets.filter(t => t.status === TicketStatus.AGUARDANDO_CLIENTE || t.status === TicketStatus.ELABORANDO_ORCAMENTO);
      case 'CLOSED':
        return tickets.filter(t => t.status === TicketStatus.CONCLUIDO || t.status === TicketStatus.CANCELADO);
      case 'ALL':
      default:
        return tickets;
    }
  }, [tickets, activeFilter]);

  const counts = useMemo(() => ({
    open: tickets.filter(t => t.status !== TicketStatus.CONCLUIDO && t.status !== TicketStatus.CANCELADO).length,
    inProgress: tickets.filter(t => t.status === TicketStatus.EM_ATENDIMENTO || t.status === TicketStatus.ATENDIMENTO_AGENDADO).length,
    waiting: tickets.filter(t => t.status === TicketStatus.AGUARDANDO_CLIENTE || t.status === TicketStatus.ELABORANDO_ORCAMENTO).length,
    closed: tickets.filter(t => t.status === TicketStatus.CONCLUIDO || t.status === TicketStatus.CANCELADO).length,
    all: tickets.length
  }), [tickets]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-vyrtus border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Iniciando Vyrtus Cloud...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar 
        currentUser={currentUser} 
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${currentUser ? 'md:ml-64' : ''} p-4 md:p-8`}>
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between mb-6 bg-white p-4 -m-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black italic tracking-tighter text-vyrtus">VYRTUS</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentView === 'dashboard' ? 'Visão Geral' : 
               currentView === 'tickets' ? 'Central de Chamados' : 
               currentView === 'assets' ? 'Gestão de Inventário' : 'Administração'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Bem-vindo, {currentUser.name}.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-vyrtus text-white rounded-xl font-bold shadow-lg shadow-vyrtus/20 hover:bg-vyrtus-hover transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Novo Chamado
          </button>
        </header>

        {currentView === 'dashboard' && currentUser.permissions.canViewDashboard && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Chamados Ativos</div>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900">{counts.open}</div>
              </div>
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Concluídos</div>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900">{counts.closed}</div>
              </div>
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total na Base</div>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900">{counts.all}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Últimos Chamados</h3>
              <TicketList tickets={tickets.slice(0, 5)} onSelectTicket={setSelectedTicket} />
            </div>
          </div>
        )}

        {currentView === 'tickets' && currentUser.permissions.canViewTickets && (
          <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 p-1 bg-slate-200/50 rounded-xl overflow-x-auto no-scrollbar max-w-full">
              {(['OPEN', 'IN_PROGRESS', 'WAITING', 'CLOSED', 'ALL'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-2 whitespace-nowrap rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-white text-vyrtus shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f === 'OPEN' ? 'Abertos' : f === 'IN_PROGRESS' ? 'Atendimento' : f === 'WAITING' ? 'Aguardando' : f === 'CLOSED' ? 'Encerrados' : 'Todos'}
                </button>
              ))}
            </div>
            <TicketList tickets={filteredTickets} onSelectTicket={setSelectedTicket} />
          </div>
        )}

        {currentView === 'assets' && currentUser.permissions.canViewAssets && <AssetManager />}
        {currentView === 'admin' && currentUser.permissions.canViewAdmin && (
          <AdminPanel currentUser={currentUser} onUpdate={refreshUser} />
        )}
      </main>

      {selectedTicket && (
        <TicketDetail 
          ticket={selectedTicket} 
          currentUser={currentUser} 
          onClose={() => setSelectedTicket(null)} 
          onUpdate={refreshTickets}
        />
      )}

      {showCreateModal && (
        <CreateTicketModal 
          currentUser={currentUser} 
          onClose={() => setShowCreateModal(false)}
          onSuccess={refreshTickets}
        />
      )}
    </div>
  );
};

export default App;
