
import { Ticket, User, Activity, Asset, TicketStatus, LabelType, DemandType } from './types';
import { INITIAL_USERS, INITIAL_ASSETS, INITIAL_CLIENTS } from './constants';
import { DB_CONFIG } from './database_info';

// Simula a URL do seu futuro backend que fará a ponte com o Postgres
const API_BASE_URL = 'http://192.168.0.21:3000/api'; 

const KEYS = {
  TICKETS: 'vyrtus_tickets',
  USERS: 'vyrtus_users',
  ACTIVITIES: 'vyrtus_activities',
  ASSETS: 'vyrtus_assets',
};

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/**
 * Esta camada de API está preparada para ser substituída por chamadas fetch.
 * Os campos foram mapeados para bater com o schema PostgreSQL fornecido.
 */
export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      await delay();
      // Futuro: return fetch(`${API_BASE_URL}/users`).then(r => r.json());
      return storage.get<User[]>(KEYS.USERS, INITIAL_USERS);
    },
    update: async (id: string, updates: Partial<User>): Promise<User> => {
      await delay();
      const users = storage.get<User[]>(KEYS.USERS, INITIAL_USERS);
      const index = users.findIndex(u => u.id === id);
      if (index === -1) throw new Error("Usuário não encontrado");
      
      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      storage.set(KEYS.USERS, users);
      return updatedUser;
    }
  },

  tickets: {
    getAll: async (): Promise<Ticket[]> => {
      await delay();
      return storage.get<Ticket[]>(KEYS.TICKETS, []);
    },

    create: async (formData: any, currentUser: User): Promise<Ticket> => {
      await delay();
      const tickets = storage.get<Ticket[]>(KEYS.TICKETS, []);
      
      /**
       * MAPEAMENTO PARA POSTGRESQL (tabela chamado)
       * Aqui simulamos como os dados seriam preparados para o INSERT no banco
       */
      const pgData = {
        titulo: formData.title,
        cliente_id: formData.clientId,
        solicitante_id: formData.requesterName, // Idealmente seria um ID numérico no futuro
        ativo_id: formData.assetIds[0] || null, // No Postgres singular conforme solicitado
        topico_id: formData.label,
        tipo_id: formData.type,
        descricao: formData.description,
        status: formData.status,
        usuario_alteracao_id: currentUser.id
      };

      console.log("Enviando para o Postgres (Mock):", pgData);

      const newTicket: Ticket = {
        ...formData,
        id: (tickets.length + 100).toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastUpdatedById: currentUser.id,
        lastUpdatedByName: currentUser.name,
        attachments: []
      };
      
      storage.set(KEYS.TICKETS, [...tickets, newTicket]);
      
      await api.activities.create({
        ticketId: newTicket.id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        content: `Chamado #${newTicket.id} criado e registrado no banco 'teste'.`,
        type: 'STATUS_CHANGE'
      });

      return newTicket;
    },

    update: async (id: string, updates: any, currentUser: User): Promise<Ticket> => {
      await delay();
      const tickets = storage.get<Ticket[]>(KEYS.TICKETS, []);
      const index = tickets.findIndex(t => t.id === id);
      if (index === -1) throw new Error("Chamado não encontrado");

      const oldTicket = tickets[index];
      
      // Mapeamento de atualização para Postgres
      const pgUpdate = {
        id: id,
        ...(updates.title && { titulo: updates.title }),
        ...(updates.status && { status: updates.status }),
        ...(updates.assetIds && { ativo_id: updates.assetIds[0] }),
        usuario_alteracao_id: currentUser.id
      };

      console.log(`UPDATE no Postgres tabela 'chamado' ID ${id}:`, pgUpdate);

      const updatedTicket = {
        ...oldTicket,
        ...updates,
        updatedAt: Date.now(),
        lastUpdatedById: currentUser.id,
        lastUpdatedByName: currentUser.name
      };

      tickets[index] = updatedTicket;
      storage.set(KEYS.TICKETS, tickets);

      if (updates.status && updates.status !== oldTicket.status) {
        await api.activities.create({
          ticketId: id,
          authorId: currentUser.id,
          authorName: currentUser.name,
          content: `Status alterado para "${updates.status}". Registro atualizado por ${currentUser.name}.`,
          type: 'STATUS_CHANGE'
        });
      }

      return updatedTicket;
    }
  },

  activities: {
    getByTicket: async (ticketId: string): Promise<Activity[]> => {
      await delay(100);
      const activities = storage.get<Activity[]>(KEYS.ACTIVITIES, []);
      return activities.filter(a => a.ticketId === ticketId);
    },
    create: async (data: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> => {
      const activities = storage.get<Activity[]>(KEYS.ACTIVITIES, []);
      const newActivity: Activity = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      storage.set(KEYS.ACTIVITIES, [...activities, newActivity]);
      return newActivity;
    }
  },

  assets: {
    getAll: async (): Promise<Asset[]> => {
      await delay();
      // Futuro: SELECT * FROM ativo
      return storage.get<Asset[]>(KEYS.ASSETS, INITIAL_ASSETS);
    }
  },

  metadata: {
    getDbStatus: () => ({
      connected: false,
      target: DB_CONFIG.host,
      database: DB_CONFIG.database
    })
  }
};
