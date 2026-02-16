
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User, TicketStatus, DemandType, LabelType, Asset } from '../types';
import { api } from '../api';
import { INITIAL_CLIENTS } from '../constants';

interface CreateTicketModalProps {
  currentUser: User;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ currentUser, onClose, onSuccess }) => {
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [assetSearch, setAssetSearch] = useState('');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: INITIAL_CLIENTS[0].id,
    requesterName: INITIAL_CLIENTS[0].requesters[0],
    assetIds: [] as string[],
    label: LabelType.REDE,
    status: TicketStatus.AGUARDANDO_ATENDIMENTO,
    type: DemandType.RELATO_PROBLEMA
  });

  useEffect(() => {
    const loadAssets = async () => {
      const data = await api.assets.getAll();
      setAllAssets(data);
    };
    loadAssets();
  }, []);

  const currentClient = INITIAL_CLIENTS.find(c => c.id === formData.clientId);
  const availableRequesters = currentClient?.requesters || [];
  
  const availableAssets = useMemo(() => {
    return allAssets.filter(a => a.clientId === formData.clientId);
  }, [allAssets, formData.clientId]);

  const filteredDropdownAssets = useMemo(() => {
    if (!assetSearch.trim()) return availableAssets;
    const search = assetSearch.toLowerCase();
    return availableAssets.filter(a => 
      a.id.toLowerCase().includes(search) || 
      a.brand.toLowerCase().includes(search) || 
      a.model.toLowerCase().includes(search)
    );
  }, [availableAssets, assetSearch]);

  useEffect(() => {
    if (currentClient && !currentClient.requesters.includes(formData.requesterName)) {
      setFormData(prev => ({ ...prev, requesterName: currentClient.requesters[0] || '' }));
    }
    setFormData(prev => ({
      ...prev,
      assetIds: prev.assetIds.filter(id => availableAssets.some(a => a.id === id))
    }));
  }, [formData.clientId, availableAssets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAssetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAsset = (assetId: string) => {
    setFormData(prev => ({
      ...prev,
      assetIds: prev.assetIds.includes(assetId)
        ? prev.assetIds.filter(id => id !== assetId)
        : [...prev.assetIds, assetId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.tickets.create(formData, currentUser);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erro ao criar chamado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Novo Chamado</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título do Chamado</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
                placeholder="Ex: Lentidão no servidor de arquivos"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cliente</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              >
                {INITIAL_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Solicitante</label>
              <select
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
              >
                {availableRequesters.map(req => (
                  <option key={req} value={req}>{req}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Buscar Ativos</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.assetIds.map(id => {
                  const asset = availableAssets.find(a => a.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-vyrtus-light text-vyrtus text-[10px] font-bold rounded-md border border-vyrtus/20">
                      {id}
                      <button type="button" onClick={() => toggleAsset(id)} className="hover:bg-vyrtus/10 rounded-full p-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Pesquisar por ID, Marca ou Modelo..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus"
                value={assetSearch}
                onChange={(e) => {
                  setAssetSearch(e.target.value);
                  setIsAssetDropdownOpen(true);
                }}
                onFocus={() => setIsAssetDropdownOpen(true)}
              />
              {isAssetDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {filteredDropdownAssets.map(asset => {
                    const isSelected = formData.assetIds.includes(asset.id);
                    return (
                      <div key={asset.id} onClick={() => toggleAsset(asset.id)} className={`flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none ${isSelected ? 'bg-vyrtus-light/30' : ''}`}>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-700">{asset.id} - {asset.type}</div>
                          <div className="text-[10px] text-slate-500">{asset.brand} {asset.model}</div>
                        </div>
                        {isSelected && <svg className="w-4 h-4 text-vyrtus" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tópico</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus" value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value as LabelType })}>
                {Object.values(LabelType).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
              <select className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as DemandType })}>
                {Object.values(DemandType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
              <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus resize-none" />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Descartar</button>
          <button onClick={handleSubmit} disabled={submitting} className={`flex-1 px-4 py-3 bg-vyrtus text-white rounded-xl font-bold ${submitting ? 'opacity-50' : 'hover:bg-vyrtus-hover'}`}>
            {submitting ? 'Criando...' : 'Criar Chamado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
