// app/models/user.model.ts
export interface UserPermission {
  blogs: boolean;
  projects: boolean;
  services: boolean;
  orders: boolean;
  notifications: boolean;
  settings: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  permissions: UserPermission;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  active: boolean;
}