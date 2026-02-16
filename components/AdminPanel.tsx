
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../api';

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
      onUpdate(); // Notifica App para atualizar currentUser se necessário
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Privilégios de Acesso</h2>
          <p className="text-slate-500">Configure quais telas e funcionalidades cada técnico da Vyrtus pode acessar.</p>
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
      
      <div className="bg-vyrtus-light p-4 rounded-xl border border-vyrtus/10 flex items-start gap-3">
        <svg className="w-5 h-5 text-vyrtus mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-xs text-vyrtus-hover font-medium">
          <strong>Aviso de Integração:</strong> Estas configurações estão sendo salvas temporariamente. 
          A arquitetura já está preparada para sincronização com o banco PostgreSQL da Vyrtus Tecnologia.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
