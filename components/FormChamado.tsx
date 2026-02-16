
import React, { useState } from 'react';

interface FormChamadoProps {
  onSuccess?: () => void;
}

const FormChamado: React.FC<FormChamadoProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    cliente_id: '',
    solicitante_id: '',
    ativo_id: '',
    topico_id: '',
    tipo_id: '',
    descricao: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('http://192.168.0.10:3001/chamados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Convertendo IDs para número caso a API espere tipos numéricos
          cliente_id: parseInt(formData.cliente_id),
          solicitante_id: parseInt(formData.solicitante_id),
          ativo_id: parseInt(formData.ativo_id),
          topico_id: parseInt(formData.topico_id),
          tipo_id: parseInt(formData.tipo_id),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao registrar chamado na base externa.');
      }

      setStatus({ type: 'success', message: 'Chamado registrado com sucesso no PostgreSQL!' });
      setFormData({
        titulo: '',
        cliente_id: '',
        solicitante_id: '',
        ativo_id: '',
        topico_id: '',
        tipo_id: '',
        descricao: ''
      });
      
      if (onSuccess) onSuccess();
      
      // Limpa mensagem de sucesso após 4 segundos
      setTimeout(() => setStatus(null), 4000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro de conexão com o servidor de banco de dados.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Novo Chamado (PostgreSQL)</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Inserção direta na tabela 'chamado'</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-vyrtus/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-vyrtus" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Título do Chamado</label>
            <input
              required
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Falha crítica no roteador de borda"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">ID Cliente</label>
            <input
              required
              name="cliente_id"
              type="number"
              value={formData.cliente_id}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">ID Solicitante</label>
            <input
              required
              name="solicitante_id"
              type="number"
              value={formData.solicitante_id}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">ID Ativo</label>
            <input
              required
              name="ativo_id"
              type="number"
              value={formData.ativo_id}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">ID Tópico</label>
            <input
              required
              name="topico_id"
              type="number"
              value={formData.topico_id}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">ID Tipo</label>
            <input
              required
              name="tipo_id"
              type="number"
              value={formData.tipo_id}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm font-mono"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Descrição Detalhada</label>
            <textarea
              required
              name="descricao"
              rows={4}
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o incidente ou solicitação com o máximo de detalhes técnicos..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm resize-none font-medium"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
             {status && (
              <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-left-4 duration-300 ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {status.type === 'success' ? (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
                {status.message}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto px-10 py-4 bg-vyrtus text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-vyrtus/20 hover:bg-vyrtus-hover transition-all active:scale-[0.97] flex items-center justify-center gap-3 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sincronizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                Abrir Chamado DB
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormChamado;
