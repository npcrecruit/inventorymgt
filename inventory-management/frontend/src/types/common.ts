// src/types/common.ts
export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface PaginationParams {
    page: number;
    per_page: number;
    total?: number;
  }
  
  export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
  }