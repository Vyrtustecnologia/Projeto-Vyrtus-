
import React from 'react';
import { User, Client, TicketStatus, DemandType, LabelType, Asset } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Guilherme Pessoa',
    email: 'guilherme@vyrtus.com.br',
    role: 'ADMIN',
    permissions: {
      canEditAllFields: true,
      canDeleteTickets: true,
      canManageUsers: true,
      canViewDashboard: true,
      canViewTickets: true,
      canViewAssets: true,
      canViewAdmin: true
    }
  },
  {
    id: '2',
    name: 'Rogério Settim',
    email: 'rogerio@vyrtus.com.br',
    role: 'AGENT',
    permissions: {
      canEditAllFields: false,
      canDeleteTickets: false,
      canManageUsers: false,
      canViewDashboard: true,
      canViewTickets: true,
      canViewAssets: true,
      canViewAdmin: false
    }
  },
  {
    id: '3',
    name: 'Ricardo Silva',
    email: 'ricardo@vyrtus.com.br',
    role: 'AGENT',
    permissions: {
      canEditAllFields: false,
      canDeleteTickets: false,
      canManageUsers: false,
      canViewDashboard: true,
      canViewTickets: true,
      canViewAssets: false,
      canViewAdmin: false
    }
  }
];

export const INITIAL_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'Banco Central', 
    contactPerson: 'Maria Silva',
    requesters: ['Maria Silva', 'Carlos Andrade', 'Felipe Santos']
  },
  { 
    id: 'c2', 
    name: 'Logística Express', 
    contactPerson: 'João Mendes',
    requesters: ['João Mendes', 'Beatriz Souza', 'Ricardo Oliveira']
  },
  { 
    id: 'c3', 
    name: 'Supermercado Sol', 
    contactPerson: 'Ana Paula',
    requesters: ['Ana Paula', 'Marcos Lima', 'Patrícia Gomes']
  }
];

export const INITIAL_ASSETS: Asset[] = [
  { id: '220001', clientId: 'c1', type: 'Servidor', brand: 'Dell', model: 'PowerEdge R740', serialNumber: 'SN-BC-001' },
  { id: '220002', clientId: 'c1', type: 'Switch', brand: 'Cisco', model: 'Catalyst 2960', serialNumber: 'SN-BC-002' },
  { id: '220003', clientId: 'c2', type: 'Desktop', brand: 'HP', model: 'EliteDesk 800', serialNumber: 'SN-LE-101' },
  { id: '220004', clientId: 'c2', type: 'Notebook', brand: 'Lenovo', model: 'ThinkPad T14', serialNumber: 'SN-LE-102' },
  { id: '220005', clientId: 'c3', type: 'NVR', brand: 'Intelbras', model: 'NVR 5000', serialNumber: 'SN-SS-501' },
  { id: '220006', clientId: 'c3', type: 'Câmera IP', brand: 'Hikvision', model: 'DS-2CD', serialNumber: 'SN-SS-502' },
];

export const STATUS_COLORS: Record<TicketStatus, string> = {
  [TicketStatus.AGUARDANDO_ATENDIMENTO]: 'bg-yellow-100 text-yellow-800',
  [TicketStatus.EM_ATENDIMENTO]: 'bg-blue-100 text-blue-800',
  [TicketStatus.AGUARDANDO_CLIENTE]: 'bg-purple-100 text-purple-800',
  [TicketStatus.ELABORANDO_ORCAMENTO]: 'bg-orange-100 text-orange-800',
  [TicketStatus.ATENDIMENTO_AGENDADO]: 'bg-cyan-100 text-cyan-800',
  [TicketStatus.CONCLUIDO]: 'bg-green-100 text-green-800',
  [TicketStatus.CANCELADO]: 'bg-red-100 text-red-800',
};

export const LABEL_COLORS: Record<LabelType, string> = {
  [LabelType.CLOUD]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [LabelType.ALARMES]: 'bg-red-50 text-red-700 border-red-200',
  [LabelType.SISTEMAS_OPERACIONAIS]: 'bg-green-50 text-green-700 border-green-200',
  [LabelType.REDE]: 'bg-blue-50 text-blue-700 border-blue-200',
  [LabelType.HARDWARE]: 'bg-amber-50 text-amber-700 border-amber-200',
  [LabelType.SEGURANCA]: 'bg-slate-50 text-slate-700 border-slate-200',
};
