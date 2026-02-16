
import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      const user = await api.auth.login(email);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || "Erro ao tentar acessar o sistema.");
    } finally {
      setLoading(false);
    }
  };

  const quickUsers = [
    { name: 'Guilherme Pessoa', email: 'guilherme@vyrtus.com.br' },
    { name: 'Rogério Settim', email: 'rogerio@vyrtus.com.br' },
    { name: 'Ricardo Silva', email: 'ricardo@vyrtus.com.br' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center gap-1 mb-4">
             <div className="flex items-center gap-2">
                <span className="text-5xl font-black italic tracking-tighter text-vyrtus">VYRTUS</span>
                <svg className="w-12 h-12 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-14C7.03 4 3 8.03 3 13h2c0-3.87 3.13-7 7-7s7 3.13 7 7h2c0-4.97-4.03-9-9-9zm0 4c-2.76 0-5 2.24-5 5h2c0-1.66 1.34-3 3-3s3 1.34 3 3h2c0-2.76-2.24-5-5-5z"/>
                </svg>
             </div>
             <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.4em] -mt-1">TECNOLOGIA</p>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Painel de Helpdesk</h2>
          <p className="text-slate-500 mt-2">Autentique-se para gerenciar seus chamados.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">E-mail Corporativo</label>
              <input
                type="email"
                placeholder="nome@vyrtus.com.br"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-vyrtus transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-vyrtus text-white rounded-xl font-bold text-lg shadow-lg shadow-vyrtus/20 hover:bg-vyrtus-hover transition-all transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Acessando...
                </div>
              ) : 'Entrar no Sistema'}
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center font-medium animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Acesso Rápido</span></div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {quickUsers.map(u => (
                <button
                  key={u.email}
                  onClick={() => setEmail(u.email)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-vyrtus/30 hover:bg-vyrtus-light transition-all text-left group"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-700 group-hover:text-vyrtus">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{u.email}</div>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-vyrtus" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-slate-400 font-medium">
          Vyrtus Tecnologia &copy; {new Date().getFullYear()} - Helpdesk v2.5
        </p>
      </div>
    </div>
  );
};

export default Login;
