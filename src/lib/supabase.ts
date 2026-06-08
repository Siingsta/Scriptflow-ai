/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Support both prefixes to remain flexible in all environments
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Optionally create the supabase client if keys are present
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Simulated store for mock auth
const MOCK_STORAGE_KEY = 'scriptflow_mock_session';

export interface AuthUser {
  id: string;
  email: string;
}

export const getMockSession = (): AuthUser | null => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const setMockSession = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }
};
