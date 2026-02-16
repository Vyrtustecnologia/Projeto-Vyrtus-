
export enum TicketStatus {
  AGUARDANDO_ATENDIMENTO = 'Aguardando Atendimento',
  EM_ATENDIMENTO = 'Em Atendimento',
  AGUARDANDO_CLIENTE = 'Aguardando Cliente',
  ELABORANDO_ORCAMENTO = 'Elaborando Orçamento',
  ATENDIMENTO_AGENDADO = 'Atendimento Agendado',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado'
}

export enum DemandType {
  RELATO_PROBLEMA = 'Relato de Problema',
  CONFIGURACAO_ALTERACAO = 'Configuração/Alteração',
  IMPLANTACAO = 'Implantação',
  DESCARTE_EQUIPAMENTOS = 'Descarte de Equipamentos',
  DOCUMENTACAO = 'Documentação',
  INSTRUCAO_INFORMACOES = 'Instrução/Informação ao Usuário'
}

export enum LabelType {
  CLOUD = 'Cloud',
  ALARMES = 'Alarmes',
  SISTEMAS_OPERACIONAIS = 'Sistemas Operacionais',
  REDE = 'Rede',
  HARDWARE = 'Hardware',
  SEGURANCA = 'Segurança'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
  permissions: {
    canEditAllFields: boolean;
    canDeleteTickets: boolean;
    canManageUsers: boolean;
    // View Permissions
    canViewDashboard: boolean;
    canViewTickets: boolean;
    canViewAssets: boolean;
    canViewAdmin: boolean;
  };
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  requesters: string[];
}

export interface Asset {
  id: string; // Código de inventário (6 dígitos começando com 22)
  clientId: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  lastMaintenance?: number;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string; // Base64
}

export interface Activity {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'COMMENT' | 'STATUS_CHANGE' | 'ATTACHMENT';
  createdAt: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  clientId: string;
  requesterName: string;
  assetIds: string[];
  label: LabelType;
  status: TicketStatus;
  type: DemandType;
  assigneeId?: string;
  lastUpdatedById: string;
  lastUpdatedByName: string;
  createdAt: number;
  updatedAt: number;
  attachments: Attachment[];
}
