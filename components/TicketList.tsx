
import React from 'react';
import { Ticket, TicketStatus, LabelType } from '../types';
import { STATUS_COLORS, LABEL_COLORS } from '../constants';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onSelectTicket }) => {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-400">
        Nenhum chamado encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Ref</th>
              <th className="px-6 py-4">Chamado</th>
              <th className="px-6 py-4">Solicitante</th>
              <th className="px-6 py-4">Tópico</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Última Alteração</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <tr 
                key={ticket.id} 
                className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                onClick={() => onSelectTicket(ticket)}
              >
                <td className="px-6 py-4 font-mono text-xs text-slate-500">#{ticket.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{ticket.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{ticket.type}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {ticket.requesterName}
                  <div className="text-xs text-slate-400">Vyrtus Client</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${LABEL_COLORS[ticket.label as LabelType]}`}>
                    {ticket.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${STATUS_COLORS[ticket.status as TicketStatus]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <div className="font-medium text-slate-700">{ticket.lastUpdatedByName}</div>
                  <div>{new Date(ticket.updatedAt).toLocaleDateString()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {tickets.map(ticket => (
          <div 
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 active:bg-slate-50"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-[10px] text-slate-400 font-bold">#{ticket.id}</span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${STATUS_COLORS[ticket.status as TicketStatus]}`}>
                {ticket.status}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1 leading-tight">{ticket.title}</h4>
            <p className="text-xs text-slate-500 mb-3 line-clamp-2">{ticket.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${LABEL_COLORS[ticket.label as LabelType]}`}>
                {ticket.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-slate-100 text-slate-600">
                {ticket.type}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                  {ticket.requesterName.charAt(0)}
                </div>
                <div className="text-[10px] font-bold text-slate-700">{ticket.requesterName}</div>
              </div>
              <div className="text-[10px] text-slate-400">
                {new Date(ticket.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
