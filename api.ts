
import { Ticket, User, Activity, Asset, TicketStatus } from './types';
import { INITIAL_USERS, INITIAL_ASSETS } from './constants';

// Chaves do LocalStorage (Substituir por endpoints de API no futuro)
const KEYS = {
  TICKETS: 'vyrtus_tickets',
  USERS: 'vyrtus_users',
  ACTIVITIES: 'vyrtus_activities',
  ASSETS: 'vyrtus_assets',
};

// Utilitário para simular delay de rede
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

export const api = {
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
      return updatedUser;
    }
  },
  tickets: {
    getAll: async (): Promise<Ticket[]> => {
      await delay();
      return storage.get<Ticket[]>(KEYS.TICKETS, []);
    },
    create: async (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdatedById' | 'lastUpdatedByName' | 'attachments'>, currentUser: User): Promise<Ticket> => {
      await delay();
      const tickets = storage.get<Ticket[]>(KEYS.TICKETS, []);
      const newTicket: Ticket = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
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
        content: 'Chamado aberto no sistema.',
        type: 'STATUS_CHANGE'
      });

      return newTicket;
    },
    update: async (id: string, updates: Partial<Ticket>, currentUser: User): Promise<Ticket> => {
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
          content: `Status alterado de "${oldTicket.status}" para "${updates.status}".`,
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
