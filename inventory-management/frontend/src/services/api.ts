// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import type { InventoryItem, ItemFormData, StockMovement } from '../types/inventory';
import type { User, UserFormData } from '../types/user';
import type { ApiResponse } from '../types/api';
import type { Settings } from '../types/settings';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await this.api.post<ApiResponse<Category>>('/categories', category);
    return response.data.data;
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await this.api.put<ApiResponse<Category>>(`/categories/${id}`, category);
    return response.data.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    const response = await this.api.get<ApiResponse<Location[]>>('/locations');
    return response.data.data;
  }

  async createLocation(location: Omit<Location, 'id'>): Promise<Location> {
    const response = await this.api.post<ApiResponse<Location>>('/locations', location);
    return response.data.data;
  }

  async updateLocation(id: string, location: Partial<Location>): Promise<Location> {
    const response = await this.api.put<ApiResponse<Location>>(`/locations/${id}`, location);
    return response.data.data;
  }

  async deleteLocation(id: string): Promise<void> {
    await this.api.delete(`/locations/${id}`);
  }

  // Inventory Items
  async getItems(): Promise<InventoryItem[]> {
    const response = await this.api.get<ApiResponse<InventoryItem[]>>('/items');
    return response.data.data;
  }

  async getItem(id: string): Promise<ItemFormData> {
    const response = await this.api.get<ApiResponse<ItemFormData>>(`/items/${id}`);
    return response.data.data;
  }

  async createItem(item: ItemFormData): Promise<InventoryItem> {
    const response = await this.api.post<ApiResponse<InventoryItem>>('/items', item);
    return response.data.data;
  }

  async updateItem(id: string, item: Partial<ItemFormData>): Promise<InventoryItem> {
    const response = await this.api.put<ApiResponse<InventoryItem>>(`/items/${id}`, item);
    return response.data.data;
  }

  async deleteItem(id: string): Promise<void> {
    await this.api.delete(`/items/${id}`);
  }

  // Stock Movement
  async recordStockMovement(data: {
    item_id: string;
    quantity_changed: number;
    movement_type: 'in' | 'out';
    reason: string;
  }): Promise<StockMovement> {
    const response = await this.api.post<ApiResponse<StockMovement>>('/stock/movements', data);
    return response.data.data;
  }

  // Settings
  async getSettings(): Promise<Settings> {
    const response = await this.api.get<ApiResponse<Settings>>('/settings');
    return response.data.data;
  }

  async updateSettings(section: keyof Settings, data: Settings[keyof Settings]): Promise<Settings> {
    const response = await this.api.put<ApiResponse<Settings>>(`/settings/${section}`, data);
    return response.data.data;
  }
}

export const apiService = new ApiService();