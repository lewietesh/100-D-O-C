// app/data/users.ts
import { User } from '@/app/models/user.model';

export const users: User[] = [
  {
    id: "user-1",
    name: "Lewis Admin",
    email: "admin@lewis-codes.com",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    permissions: {
      blogs: true,
      projects: true,
      services: true,
      orders: true,
      notifications: true,
      settings: true
    },
    lastLogin: "2025-05-12T08:30:00Z",
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2025-05-12T08:30:00Z",
    active: true
  },
  {
    id: "user-2",
    name: "Content Editor",
    email: "editor@lewis-codes.com",
    role: "editor",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    permissions: {
      blogs: true,
      projects: true,
      services: true,
      orders: false,
      notifications: true,
      settings: false
    },
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-02-20T14:25:00Z",
    active: true
  }
];