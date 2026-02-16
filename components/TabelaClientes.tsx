
import React, { useState, useEffect } from 'react';

interface ClienteAPI {
  id: number | string;
  nome: string;
}

const TabelaClientes: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://192.168.0.10:3001/clientes');
        if (!response.ok) {
          throw new Error('Falha ao carregar dados da API');
        }
        const data = await response.json();
        setClientes(data);
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-vyrtus border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-xl text-center">
        <p className="text-red-600 font-semibold mb-2">Erro de Conexão</p>
        <p className="text-red-500 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Base de Clientes (API Externa)</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Host: 192.168.0.10</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nome do Cliente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-vyrtus">#{cliente.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 group-hover:text-vyrtus transition-colors">
                      {cliente.nome}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabelaClientes;
