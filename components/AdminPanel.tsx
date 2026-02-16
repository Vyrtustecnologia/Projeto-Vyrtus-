
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../api';
import { DB_CONFIG } from '../database_info';

interface AdminPanelProps {
  currentUser: User;
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await api.users.getAll();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTogglePermission = async (userId: string, permission: keyof User['permissions']) => {
    setUpdatingId(userId);
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const updatedPermissions = {
        ...user.permissions,
        [permission]: !user.permissions[permission]
      };

      await api.users.update(userId, { permissions: updatedPermissions });
      await fetchUsers();
      onUpdate();
    } catch (err) {
      alert("Erro ao atualizar permissões");
    } finally {
      setUpdatingId(null);
    }
  };

  if (currentUser.role !== 'ADMIN') return null;

  const permissionHeaders = [
    { key: 'canViewDashboard', label: 'Dashboard' },
    { key: 'canViewTickets', label: 'Chamados' },
    { key: 'canViewAssets', label: 'Ativos' },
    { key: 'canViewAdmin', label: 'Admin' },
    { key: 'canEditAllFields', label: 'Editar Tudo' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Privilégios de Acesso</h2>
          <p className="text-slate-500 text-sm">Gerenciamento centralizado de permissões da equipe técnica.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
           <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
           <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">PostgreSQL: {DB_CONFIG.host} (Pendente)</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Carregando usuários...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 min-w-[200px]">Usuário / Perfil</th>
                  {permissionHeaders.map(h => (
                    <th key={h.key} className="px-4 py-4 text-center whitespace-nowrap">{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${updatingId === user.id ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-[10px] uppercase font-bold text-vyrtus">{user.role}</div>
                    </td>
                    {permissionHeaders.map(h => (
                      <td key={h.key} className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={user.permissions[h.key as keyof User['permissions']]}
                            onChange={() => handleTogglePermission(user.id, h.key as keyof User['permissions'])}
                            disabled={updatingId !== null || (user.id === currentUser.id && h.key === 'canViewAdmin')}
                            className="w-5 h-5 rounded-md border-slate-300 text-vyrtus focus:ring-vyrtus cursor-pointer disabled:cursor-not-allowed transition-all"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
           <svg className="w-4 h-4 text-vyrtus" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
           Dicionário de Integração (Vyrtus Tech)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-[10px] text-vyrtus font-bold mb-1">Mapeamento PostgreSQL</div>
              <div className="text-xs text-slate-300 font-mono space-y-1">
                 <p>Tabela: <span className="text-white">chamado</span></p>
                 <p>Colunas: <span className="text-slate-400 italic">titulo, cliente_id, solicitante_id, ativo_id, topico_id, tipo_id, descricao</span></p>
              </div>
           </div>
           <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-[10px] text-vyrtus font-bold mb-1">Endpoint Alvo</div>
              <div className="text-xs text-slate-300 font-mono">
                 <p>Host: <span className="text-white">{DB_CONFIG.host}</span></p>
                 <p>DB: <span className="text-white">{DB_CONFIG.database}</span></p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
