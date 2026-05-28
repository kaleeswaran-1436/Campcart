/**
 * Tenant Configuration Types
 * Defines the structure for multi-tenant campus configurations
 */

export interface Campus {
  id: string;
  name: string;
  domain: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  idVerified: boolean;
  idPhotoUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TenantContextType {
  tenantId: string | null;
  campus: Campus | null;
  loading: boolean;
  error: string | null;
}
