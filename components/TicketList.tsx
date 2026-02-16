
import React from 'react';
import { Ticket, TicketStatus, LabelType } from '../types';
import { STATUS_COLORS, LABEL_COLORS } from '../constants';

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onSelectTicket }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Ref</th>
            <th className="px-6 py-4">Chamado</th>
            <th className="px-6 py-4">Cliente</th>
            <th className="px-6 py-4">Tópico</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Última Alteração</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Nenhum chamado encontrado.</td>
            </tr>
          ) : (
            tickets.map(ticket => (
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
                  <div>{new Date(ticket.updatedAt).toLocaleDateString()} {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
