
import React, { useState, useEffect } from 'react';

interface AtivoExterno {
  id: number | string;
  cliente_id: number | string;
  tipo: string;
  marca: string;
  modelo: string;
}

const TabelaAtivos: React.FC = () => {
  const [ativos, setAtivos] = useState<AtivoExterno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAtivos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://192.168.0.10:3001/ativos');
        if (!response.ok) {
          throw new Error('Falha ao conectar com o servidor de inventário externo.');
        }
        const data = await response.json();
        setAtivos(data);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado ao buscar ativos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAtivos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-vyrtus border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Sincronizando Ativos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center max-w-xl mx-auto mt-10">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-red-800 font-bold text-lg mb-2">Erro de API</h3>
        <p className="text-red-600 text-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-all"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Inventário Externo (API)</h3>
          <p className="text-xs text-slate-500 font-medium">Dados vindos diretamente da base PostgreSQL 192.168.0.10</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Conectado ao endpoint /ativos</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">ID Ativo</th>
              <th className="px-6 py-4">Ref. Cliente</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Marca</th>
              <th className="px-6 py-4">Modelo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ativos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium italic">
                  Nenhum ativo retornado pela API.
                </td>
              </tr>
            ) : (
              ativos.map((ativo) => (
                <tr key={ativo.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-vyrtus">#{ativo.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">CLIENTE {ativo.cliente_id}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700 uppercase">{ativo.tipo}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{ativo.marca}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{ativo.modelo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vyrtus Tecnologia Sincronismo</span>
        <span className="text-[10px] font-black text-slate-700">{ativos.length} dispositivos listados</span>
      </div>
    </div>
  );
};

export default TabelaAtivos;
