'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Campus, TenantContextType } from '@/types/tenant';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Mock campus configurations - replace with API call in production
const CAMPUS_CONFIG: Record<string, Campus> = {
  srm: {
    id: 'srm',
    name: 'SRM Institute of Science and Technology',
    domain: 'srm.campcart.com',
    logo: 'https://via.placeholder.com/150?text=SRM',
    primaryColor: '#1a1f3a',
    secondaryColor: '#2d3561',
    accentColor: '#00d4ff',
  },
  mit: {
    id: 'mit',
    name: 'MIT Chennai',
    domain: 'mit.campcart.com',
    logo: 'https://via.placeholder.com/150?text=MIT',
    primaryColor: '#0a1428',
    secondaryColor: '#1f2937',
    accentColor: '#3b82f6',
  },
  iit: {
    id: 'iit',
    name: 'IIT Madras',
    domain: 'iit.campcart.com',
    logo: 'https://via.placeholder.com/150?text=IIT',
    primaryColor: '#111827',
    secondaryColor: '#1f2937',
    accentColor: '#ef4444',
  },
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [campus, setCampus] = useState<Campus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Detect tenant from URL or domain
    const detectTenant = () => {
      try {
        // Try to get from URL params first (for routes like /srm/...)
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        let foundTenantId = pathParts[0];

        // Try to get from subdomain (e.g., srm.campcart.com)
        if (!foundTenantId) {
          const hostname = window.location.hostname;
          const parts = hostname.split('.');
          if (parts.length > 1) {
            foundTenantId = parts[0]; // Get subdomain
          }
        }

        // Reset to localhost for development
        if (foundTenantId === 'localhost' || foundTenantId === '127.0.0.1') {
          foundTenantId = 'srm'; // Default to SRM for local development
        }

        if (!foundTenantId) {
          foundTenantId = 'srm'; // Default fallback
        }

        const campusData = CAMPUS_CONFIG[foundTenantId.toLowerCase()];

        if (!campusData) {
          throw new Error(`Campus not found for tenant: ${foundTenantId}`);
        }

        setTenantId(foundTenantId.toLowerCase());
        setCampus(campusData);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to detect tenant';
        setError(errorMessage);
        // Set a default tenant on error
        setTenantId('srm');
        setCampus(CAMPUS_CONFIG.srm);
      } finally {
        setLoading(false);
      }
    };

    detectTenant();
  }, []);

  const value: TenantContextType = {
    tenantId,
    campus,
    loading,
    error,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

// Custom hook to use the TenantContext
export function useTenant(): TenantContextType {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
