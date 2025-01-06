// src/types/user.ts
import { BaseEntity } from './common';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User extends BaseEntity {
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login?: string;
}

export type UserFormData = Omit<User, keyof BaseEntity | 'last_login'> & {
  password?: string;
};