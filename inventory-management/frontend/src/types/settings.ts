// src/types/settings.ts
import type { BaseEntity } from './common';

export interface Settings extends BaseEntity {
  general: {
    companyName: string;
    timezone: string;
    dateFormat: string;
    lowStockThreshold: number;
  };
  notifications: {
    emailNotifications: boolean;
    lowStockAlerts: boolean;
    expiryAlerts: boolean;
    stockMovementAlerts: boolean;
  };
  security: {
    requireTwoFactor: boolean;
    passwordExpiryDays: number;
    sessionTimeout: number;
  };
}