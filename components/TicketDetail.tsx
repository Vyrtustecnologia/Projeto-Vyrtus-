
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Ticket, User, Activity, TicketStatus, DemandType, LabelType, Asset } from '../types';
import { api } from '../api';
import { STATUS_COLORS, LABEL_COLORS, INITIAL_CLIENTS } from '../constants';

interface TicketDetailProps {
  ticket: Ticket;
  currentUser: User;
  onClose: () => void;
  onUpdate: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticket: initialTicket, currentUser, onClose, onUpdate }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [assetSearch, setAssetSearch] = useState('');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [editedTitle, setEditedTitle] = useState(ticket.title);
  const [editedStatus, setEditedStatus] = useState<TicketStatus>(ticket.status);
  const [editedType, setEditedType] = useState<DemandType>(ticket.type);
  const [editedLabel, setEditedLabel] = useState<LabelType>(ticket.label);
  const [editedRequester, setEditedRequester] = useState(ticket.requesterName);
  const [editedAssetIds, setEditedAssetIds] = useState<string[]>(ticket.assetIds || []);

  useEffect(() => {
    const loadData = async () => {
      const [acts, asts] = await Promise.all([
        api.activities.getByTicket(ticket.id),
        api.assets.getAll()
      ]);
      setActivities(acts);
      setAllAssets(asts);
    };
    loadData();
  }, [ticket.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAssetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveUpdate = async () => {
    if (!editedTitle.trim() || submitting) return;
    setSubmitting(true);
    try {
      const updated = await api.tickets.update(ticket.id, {
        title: editedTitle,
        status: editedStatus,
        type: editedType,
        label: editedLabel,
        requesterName: editedRequester,
        assetIds: editedAssetIds
      }, currentUser);
      
      setTicket(updated);
      const acts = await api.activities.getByTicket(updated.id);
      setActivities(acts);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      alert("Erro ao atualizar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const act = await api.activities.create({
        ticketId: ticket.id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: newComment,
        type: 'COMMENT',
      });
      setActivities(prev => [...prev, act]);
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAsset = (assetId: string) => {
    setEditedAssetIds(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const canEdit = currentUser.role === 'ADMIN' || currentUser.permissions.canEditAllFields;
  const availableAssets = allAssets.filter(a => a.clientId === ticket.clientId);
  const linkedAssets = allAssets.filter(a => ticket.assetIds?.includes(a.id));

  const filteredDropdownAssets = useMemo(() => {
    if (!assetSearch.trim()) return availableAssets;
    const search = assetSearch.toLowerCase();
    return availableAssets.filter(a => 
      a.id.toLowerCase().includes(search) || a.brand.toLowerCase().includes(search) || a.model.toLowerCase().includes(search)
    );
  }, [availableAssets, assetSearch]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-[60]">
      <div className="bg-white w-full md:max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800">#{ticket.id}</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate max-w-[150px]">Modificado por: {ticket.lastUpdatedByName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-3 py-1.5 bg-vyrtus text-white rounded-lg text-xs font-bold"
              >
                Editar
              </button>
            )}
            {isEditing && (
              <>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                >
                  <span className="hidden sm:inline">Cancelar</span>
                  <span className="sm:hidden">✕</span>
                </button>
                <button 
                  onClick={handleSaveUpdate} 
                  disabled={submitting} 
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold"
                >
                  {submitting ? '...' : 'Salvar'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {isEditing ? (
             <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Título</label>
                  <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                     <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value as TicketStatus)} className="w-full px-4 py-2 border rounded-lg">
                        {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tipo</label>
                     <select value={editedType} onChange={(e) => setEditedType(e.target.value as DemandType)} className="w-full px-4 py-2 border rounded-lg">
                        {Object.values(DemandType).map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                   </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Ativos</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedAssetIds.map(id => (
                      <span key={id} className="px-2 py-1 bg-vyrtus-light text-vyrtus text-[10px] font-bold rounded flex items-center gap-1">
                        {id} <button onClick={() => toggleAsset(id)}>×</button>
                      </span>
                    ))}
                  </div>
                  <input type="text" placeholder="Pesquisar ativos..." value={assetSearch} onChange={(e) => { setAssetSearch(e.target.value); setIsAssetDropdownOpen(true); }} onFocus={() => setIsAssetDropdownOpen(true)} className="w-full px-4 py-2 border rounded-lg" />
                  {isAssetDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-auto">
                      {filteredDropdownAssets.map(a => (
                        <div key={a.id} onClick={() => toggleAsset(a.id)} className={`p-2 cursor-pointer hover:bg-slate-50 text-sm ${editedAssetIds.includes(a.id) ? 'bg-vyrtus-light' : ''}`}>{a.id} - {a.brand}</div>
                      ))}
                    </div>
                  )}
                </div>
             </div>
          ) : (
             <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{ticket.title}</h3>
                <p className="text-sm md:text-base text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <div className={`p-3 rounded-lg text-xs font-bold text-center ${STATUS_COLORS[ticket.status as TicketStatus]}`}>{ticket.status}</div>
                   <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold text-center border">{ticket.label}</div>
                </div>
                {linkedAssets.length > 0 && (
                   <div className="bg-vyrtus-light p-4 rounded-xl">
                      <h4 className="text-[10px] font-bold text-vyrtus uppercase mb-2">Equipamentos Vinculados</h4>
                      <div className="space-y-2">
                        {linkedAssets.map(a => (
                          <div key={a.id} className="flex justify-between items-center bg-white/50 p-2 rounded border border-vyrtus/10">
                            <span className="text-xs text-slate-700 font-bold">{a.id}</span>
                            <span className="text-[10px] text-slate-500">{a.brand} {a.model}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                )}
             </div>
          )}

          <div className="pt-6 border-t border-slate-100">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Linha do Tempo</h4>
             <div className="space-y-6">
                {activities.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-4">Início do histórico do chamado.</p>
                ) : (
                  activities.map(act => (
                    <div key={act.id} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                          {act.authorName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800">{act.authorName}</span>
                            <span className="text-[9px] text-slate-400">{new Date(act.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {act.content}
                          </div>
                        </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50 flex gap-2">
          <input 
            type="text" 
            placeholder="Nova atividade..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-vyrtus text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button 
            onClick={handleAddComment} 
            disabled={submitting} 
            className="px-4 md:px-6 py-2 bg-vyrtus text-white rounded-lg font-bold text-sm"
          >
            {submitting ? '...' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
