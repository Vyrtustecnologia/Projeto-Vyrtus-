
import React, { useState, useEffect } from 'react';

interface ChamadoExterno {
  id: number | string;
  titulo: string;
  cliente_id: number | string;
  solicitante_id: number | string;
  ativo_id: number | string;
  topico_id: number | string;
  tipo_id: number | string;
  descricao: string;
}

const TabelaChamados: React.FC = () => {
  const [chamados, setChamados] = useState<ChamadoExterno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://192.168.0.10:3001/chamados');
        if (!response.ok) {
          throw new Error('Erro ao carregar chamados da base de dados externa.');
        }
        const data = await response.json();
        setChamados(data);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado na conexão com a API.');
      } finally {
        setLoading(false);
      }
    };

    fetchChamados();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-vyrtus border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Sincronizando Base PostgreSQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-red-50 border border-red-100 rounded-3xl text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-red-900 font-black text-xl mb-2">Erro de Conectividade</h3>
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          Reconectar Agora
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Chamados Diretos (DB)</h3>
          <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">Integração PostgreSQL - Vyrtus Tecnologia</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-tighter">
            Status: Online
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
            <tr>
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Título / Descrição</th>
              <th className="px-6 py-5">Refs (Cl/So/At)</th>
              <th className="px-6 py-5">Classificação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {chamados.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Nenhum chamado pendente na base externa.
                </td>
              </tr>
            ) : (
              chamados.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-6 align-top">
                    <span className="font-mono text-xs font-black text-vyrtus">#{c.id}</span>
                  </td>
                  <td className="px-6 py-6 align-top max-w-md">
                    <div className="font-extrabold text-slate-800 text-sm group-hover:text-vyrtus transition-colors mb-1">
                      {c.titulo}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {c.descricao}
                    </div>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase w-12">Cliente</span>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 rounded">#{c.cliente_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase w-12">Solicit.</span>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 rounded">#{c.solicitante_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase w-12">Ativo</span>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 rounded">#{c.ativo_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="flex flex-col gap-2">
                       <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded uppercase border border-indigo-100">
                        Tópico #{c.topico_id}
                       </span>
                       <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded uppercase border border-amber-100">
                        Tipo #{c.tipo_id}
                       </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Vyrtus Postgres Engine</span>
        <span className="text-[10px] font-black text-slate-800">{chamados.length} chamados sincronizados</span>
      </div>
    </div>
  );
};

export default TabelaChamados;
