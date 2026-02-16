
import React, { useState, useEffect } from 'react';

interface Solicitante {
  id: number | string;
  cliente_id: number | string;
  nome: string;
}

const TabelaSolicitantes: React.FC = () => {
  const [solicitantes, setSolicitantes] = useState<Solicitante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitantes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://192.168.0.10:3001/solicitantes');
        if (!response.ok) {
          throw new Error('Não foi possível carregar a lista de solicitantes.');
        }
        const data = await response.json();
        setSolicitantes(data);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado ao buscar dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitantes();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-10 h-10 border-4 border-vyrtus border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Carregando Solicitantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <h4 className="text-red-800 font-bold mb-1">Falha na Sincronização</h4>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all active:scale-95"
        >
          Tentar Reconexão
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Base de Solicitantes</h3>
          <p className="text-xs text-slate-500 font-medium">Listagem de usuários vinculados aos clientes da Vyrtus.</p>
        </div>
        <div className="px-3 py-1 bg-vyrtus-light rounded-full border border-vyrtus/20">
          <span className="text-[10px] font-black text-vyrtus uppercase tracking-tighter">API Endpoint: /solicitantes</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Cliente (Ref)</th>
              <th className="px-6 py-4">Nome Completo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {solicitantes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center text-slate-400 font-medium">
                  Nenhum solicitante cadastrado na base.
                </td>
              </tr>
            ) : (
              solicitantes.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-400">#{s.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-vyrtus/40"></div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">CLIENTE #{s.cliente_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-vyrtus transition-colors">
                      {s.nome}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-right italic">
        Sincronizado via {window.location.hostname} • Total: {solicitantes.length} registros
      </div>
    </div>
  );
};

export default TabelaSolicitantes;
