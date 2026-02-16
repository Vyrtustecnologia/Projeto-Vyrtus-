
import React, { useState } from 'react';

interface FormClienteProps {
  onSuccess?: () => void;
}

const FormCliente: React.FC<FormClienteProps> = ({ onSuccess }) => {
  const [nome, setNome] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('http://192.168.0.10:3001/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }),
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar cliente na API externa.');
      }

      setStatus({ type: 'success', message: 'Cliente cadastrado com sucesso!' });
      setNome('');
      if (onSuccess) onSuccess();
      
      // Limpa mensagem de sucesso após 3 segundos
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Erro ao conectar com o servidor.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">Cadastrar Novo Cliente</h3>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Integração Direta API</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="nome-cliente" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Nome do Cliente / Razão Social
            </label>
            <input
              id="nome-cliente"
              type="text"
              placeholder="Ex: Vyrtus Soluções LTDA"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-vyrtus transition-all text-sm"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:w-auto px-8 py-2 bg-vyrtus text-white rounded-lg font-bold text-sm shadow-md shadow-vyrtus/10 hover:bg-vyrtus-hover transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : 'Cadastrar Cliente'}
            </button>
          </div>
        </div>

        {status && (
          <div className={`mt-4 p-3 rounded-lg text-xs font-bold animate-in fade-in zoom-in duration-200 flex items-center gap-2 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {status.type === 'success' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormCliente;
