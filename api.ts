
import { Ticket, User, Activity, Asset, TicketStatus, LabelType, DemandType } from './types';
import { INITIAL_USERS, INITIAL_ASSETS, INITIAL_CLIENTS } from './constants';
import { FIELD_MAPPING, ENUM_TO_ID } from './database_info';

const KEYS = {
  TICKETS: 'vyrtus_tickets',
  USERS: 'vyrtus_users',
  ACTIVITIES: 'vyrtus_activities',
  ASSETS: 'vyrtus_assets',
  SESSION: 'vyrtus_session_user'
};

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

/**
 * Utilitário de mapeamento para PostgreSQL
 */
export const postgresMapper = {
  // Converte objeto do sistema para formato do banco
  toTicketRow: (ticket: Ticket) => {
    const map = FIELD_MAPPING.ticket;
    return {
      [map.title]: ticket.title,
      [map.clientId]: parseInt(ticket.clientId),
      [map.requesterId]: 0, // Placeholder se não houver ID explícito
      [map.assetId]: ticket.assetIds[0] ? parseInt(ticket.assetIds[0]) : null,
      [map.labelId]: ENUM_TO_ID.topicos[ticket.label] || 0,
      [map.typeId]: ENUM_TO_ID.demandas[ticket.type] || 0,
      [map.description]: ticket.description,
      [map.status]: ticket.status,
      [map.lastUpdatedById]: parseInt(ticket.lastUpdatedById)
    };
  }
};

export const api = {
  auth: {
    login: async (email: string): Promise<User> => {
      await delay(800);
      const users = storage.get<User[]>(KEYS.USERS, INITIAL_USERS);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error("Usuário não cadastrado no sistema Vyrtus.");
      storage.set(KEYS.SESSION, user);
      return user;
    },
    logout: () => {
      storage.remove(KEYS.SESSION);
    },
    getCurrentSession: (): User | null => {
      return storage.get<User | null>(KEYS.SESSION, null);
    }
  },

  users: {
    getAll: async (): Promise<User[]> => {
      await delay();
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
      const session = api.auth.getCurrentSession();
      if (session && session.id === id) {
        storage.set(KEYS.SESSION, updatedUser);
      }
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
      const newTicket: Ticket = {
        ...formData,
        id: (tickets.length + 101).toString(),
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
        content: `Chamado #${newTicket.id} criado.`,
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
          content: `Status alterado para "${updates.status}".`,
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
      return storage.get<Asset[]>(KEYS.ASSETS, INITIAL_ASSETS);
    }
  }
};
