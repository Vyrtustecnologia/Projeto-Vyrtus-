
import React, { useState, useMemo, useEffect } from 'react';
import { Asset } from '../types';
// Use api instead of store to fetch assets asynchronously
import { api } from '../api';
import { INITIAL_CLIENTS } from '../constants';

const AssetManager: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');

  // Load assets from the API on component mount
  useEffect(() => {
    const loadAssets = async () => {
      const data = await api.assets.getAll();
      setAssets(data);
    };
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesSearch = 
        a.id.includes(searchTerm) || 
        a.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === '' || a.type === typeFilter;
      const matchesClient = clientFilter === '' || a.clientId === clientFilter;

      return matchesSearch && matchesType && matchesClient;
    });
  }, [assets, searchTerm, typeFilter, clientFilter]);

  const uniqueTypes = useMemo(() => Array.from(new Set(assets.map(a => a.type))), [assets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventário de Ativos</h2>
          <p className="text-slate-500">Consulta e gestão de dispositivos e equipamentos dos clientes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Buscar (ID, Marca, Modelo ou SN)</label>
          <input 
            type="text" 
            placeholder="Ex: 220001..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Equipamento</label>
          <select 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cliente</label>
          <select 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          >
            <option value="">Todos os clientes</option>
            {INITIAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Inventário</th>
              <th className="px-6 py-4">Equipamento</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Nº de Série</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Nenhum ativo encontrado nos filtros selecionados.</td>
              </tr>
            ) : (
              filteredAssets.map(asset => {
                const client = INITIAL_CLIENTS.find(c => c.id === asset.clientId);
                return (
                  <tr key={asset.id} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-vyrtus">{asset.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{asset.brand} {asset.model}</div>
                      <div className="text-xs text-slate-500">{asset.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{client?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-slate-500 uppercase">{asset.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-vyrtus hover:underline text-xs font-bold">Ver Detalhes</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetManager;
