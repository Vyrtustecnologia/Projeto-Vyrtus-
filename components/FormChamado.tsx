
import React, { useState } from 'react';
import { LabelType, DemandType } from '../types';
import { ENUM_TO_ID, FIELD_MAPPING } from '../database_info';

interface FormChamadoProps {
  onSuccess?: () => void;
}

const FormChamado: React.FC<FormChamadoProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    cliente_id: '',
    solicitante_id: '',
    ativo_id: '',
    topico: 'Rede' as LabelType,
    tipo: 'Relato de Problema' as DemandType,
    descricao: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const map = FIELD_MAPPING.ticket;

    // Constrói o payload usando a relação EXATA com as colunas do banco
    const payload = {
      [map.title]: formData.titulo,
      [map.clientId]: parseInt(formData.cliente_id),
      [map.requesterId]: parseInt(formData.solicitante_id),
      [map.assetId]: parseInt(formData.ativo_id),
      [map.labelId]: ENUM_TO_ID.topicos[formData.topico],
      [map.typeId]: ENUM_TO_ID.demandas[formData.tipo],
      [map.description]: formData.descricao,
      [map.status]: 'Aguardando Atendimento',
      [map.lastUpdatedById]: 1 // Guilherme (Admin) padrão para o teste
    };

    try {
      const response = await fetch('http://192.168.0.10:3001/chamados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar chamado no PostgreSQL.');
      }

      setStatus({ type: 'success', message: 'Chamado sincronizado com sucesso!' });
      setFormData({
        titulo: '',
        cliente_id: '',
        solicitante_id: '',
        ativo_id: '',
        topico: LabelType.REDE,
        tipo: DemandType.RELATO_PROBLEMA,
        descricao: ''
      });
      
      if (onSuccess) onSuccess();
      setTimeout(() => setStatus(null), 4000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro de conexão com o banco de dados.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">Novo Registro • PostgreSQL</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronismo direto via colunas do banco</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-vyrtus-light rounded-full border border-vyrtus/20">
          <span className="text-[9px] font-black text-vyrtus uppercase">Vyrtus Mapper Ativo</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Título (Coluna: {FIELD_MAPPING.ticket.title})</label>
            <input
              required
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título do incidente..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Cliente (ID)</label>
            <input
              required
              name="cliente_id"
              type="number"
              value={formData.cliente_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Solicitante (ID)</label>
            <input
              required
              name="solicitante_id"
              type="number"
              value={formData.solicitante_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Ativo (ID)</label>
            <input
              required
              name="ativo_id"
              type="number"
              value={formData.ativo_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tópico (Mapper -> {FIELD_MAPPING.ticket.labelId})</label>
            <select
              name="topico"
              value={formData.topico}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-bold"
            >
              {Object.keys(ENUM_TO_ID.topicos).map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tipo (Mapper -> {FIELD_MAPPING.ticket.typeId})</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-bold"
            >
              {Object.keys(ENUM_TO_ID.demandas).map(demanda => (
                <option key={demanda} value={demanda}>{demanda}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Validado por</label>
             <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Sessão Guilherme
             </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Descrição Técnica</label>
            <textarea
              required
              name="descricao"
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o cenário técnico detalhadamente..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm resize-none font-medium"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
             {status && (
              <div className={`p-4 rounded-2xl text-[11px] font-black flex items-center gap-3 animate-in fade-in duration-300 ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {status.type === 'success' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                )}
                {status.message.toUpperCase()}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto px-12 py-4 bg-vyrtus text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-vyrtus/40 hover:bg-vyrtus-hover transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${submitting ? 'opacity-70' : ''}`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                EXECUTANDO QUERY...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                GRAVAR NO POSTGRES
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormChamado;
