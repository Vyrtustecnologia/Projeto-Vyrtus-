
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import CreateTicketModal from './components/CreateTicketModal';
import AdminPanel from './components/AdminPanel';
import AssetManager from './components/AssetManager';
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

  // Inicialização de dados
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [fetchedUsers, fetchedTickets] = await Promise.all([
          api.users.getAll(),
          api.tickets.getAll()
        ]);
        setUsers(fetchedUsers);
        setTickets(fetchedTickets);
        // Define Guilherme como padrão inicialmente se disponível
        const guilherme = fetchedUsers.find(u => u.name.includes('Guilherme')) || fetchedUsers[0];
        setCurrentUser(guilherme);
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Monitorar mudanças de permissões para o usuário logado
  const refreshUser = async () => {
    if (!currentUser) return;
    const allUsers = await api.users.getAll();
    setUsers(allUsers);
    const updated = allUsers.find(u => u.id === currentUser.id);
    if (updated) setCurrentUser(updated);
  };

  // Guard de visualização
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

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
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

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-vyrtus border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Carregando Vyrtus Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        currentUser={currentUser} 
        onSelectUser={handleSelectUser} 
        users={users} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentView === 'dashboard' ? 'Visão Geral' : 
               currentView === 'tickets' ? 'Central de Chamados' : 
               currentView === 'assets' ? 'Gestão de Inventário' : 'Administração'}
            </h1>
            <p className="text-slate-500 mt-1">Conectado como {currentUser.name}. Vyrtus Tecnologia.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-vyrtus text-white rounded-xl font-bold shadow-lg shadow-vyrtus/20 hover:bg-vyrtus-hover hover:shadow-vyrtus/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Novo Chamado
            </button>
          </div>
        </header>

        {currentView === 'dashboard' && currentUser.permissions.canViewDashboard && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Chamados Ativos</div>
                <div className="text-4xl font-extrabold text-slate-900">{counts.open}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Concluídos</div>
                <div className="text-4xl font-extrabold text-slate-900">{counts.closed}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total na Base</div>
                <div className="text-4xl font-extrabold text-slate-900">{counts.all}</div>
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
            <div className="flex items-center gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
              {(['OPEN', 'IN_PROGRESS', 'WAITING', 'CLOSED', 'ALL'] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-white text-vyrtus shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f === 'OPEN' ? 'Abertos' : f === 'IN_PROGRESS' ? 'Em Atendimento' : f === 'WAITING' ? 'Aguardando' : f === 'CLOSED' ? 'Encerrados' : 'Todos'}
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
