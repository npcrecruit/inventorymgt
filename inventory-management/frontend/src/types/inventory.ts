// src/types/inventory.ts
import { BaseEntity } from './common';

export interface InventoryItem extends BaseEntity {
  name: string;
  sku: string;
  description?: string;
  category: string;
  location: string;
  quantity: number;
  minimum_stock: number;
  maximum_stock: number;
  unit_price: number;
  supplier_id?: string;
  barcode?: string;
  expiration_date?: string;
}

export interface StockMovement extends BaseEntity {
  item_id: string;
  quantity_changed: number;
  movement_type: 'in' | 'out';
  reason: string;
  performed_by: string;
}

export type ItemFormData = Omit<InventoryItem, keyof BaseEntity>;