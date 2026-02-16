
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
  const currentClient = INITIAL_CLIENTS.find(c => c.id === ticket.clientId);
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">#{ticket.id}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Última alteração por: {ticket.lastUpdatedByName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && !isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-vyrtus text-white rounded-lg text-xs font-bold">Editar</button>}
            {isEditing && (
              <>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Cancelar</button>
                <button onClick={handleSaveUpdate} disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold">{submitting ? 'Salvando...' : 'Salvar'}</button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {isEditing ? (
             <div className="space-y-4">
                <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                   <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value as TicketStatus)} className="w-full px-4 py-2 border rounded-lg">
                      {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                   <select value={editedType} onChange={(e) => setEditedType(e.target.value as DemandType)} className="w-full px-4 py-2 border rounded-lg">
                      {Object.values(DemandType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Editar Ativos</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedAssetIds.map(id => (
                      <span key={id} className="px-2 py-1 bg-vyrtus-light text-vyrtus text-[10px] font-bold rounded flex items-center gap-1">
                        {id} <button onClick={() => toggleAsset(id)}>×</button>
                      </span>
                    ))}
                  </div>
                  <input type="text" placeholder="Buscar..." value={assetSearch} onChange={(e) => { setAssetSearch(e.target.value); setIsAssetDropdownOpen(true); }} onFocus={() => setIsAssetDropdownOpen(true)} className="w-full px-4 py-2 border rounded-lg" />
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
                <h3 className="text-2xl font-bold text-slate-900">{ticket.title}</h3>
                <p className="text-slate-600">{ticket.description}</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className={`p-3 rounded-lg text-xs font-bold ${STATUS_COLORS[ticket.status as TicketStatus]}`}>{ticket.status}</div>
                   <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold border">{ticket.label}</div>
                </div>
                {linkedAssets.length > 0 && (
                   <div className="bg-vyrtus-light p-4 rounded-xl">
                      <h4 className="text-[10px] font-bold text-vyrtus uppercase mb-2">Ativos Vinculados</h4>
                      <div className="space-y-1">
                        {linkedAssets.map(a => <div key={a.id} className="text-xs text-slate-700 font-bold">{a.id} - {a.type} ({a.brand})</div>)}
                      </div>
                   </div>
                )}
             </div>
          )}

          <div className="pt-6 border-t">
             <h4 className="text-xs font-bold text-slate-800 uppercase mb-4 tracking-widest">Histórico de Atividades</h4>
             <div className="space-y-6">
                {activities.map(act => (
                   <div key={act.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">{act.authorName.charAt(0)}</div>
                      <div>
                         <div className="flex items-center gap-2"><span className="text-sm font-bold">{act.authorName}</span><span className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleString()}</span></div>
                         <div className="text-sm text-slate-600">{act.content}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50 flex gap-3">
          <input type="text" placeholder="Escreva uma atualização..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-vyrtus" />
          <button onClick={handleAddComment} disabled={submitting} className="px-6 py-2 bg-vyrtus text-white rounded-lg font-bold">Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
