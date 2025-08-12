// src/hooks/AuthContext.tsx
'use client';

import { createContext } from 'react';
import type { AuthContextType } from '@/types/auth';

// Create AuthContext as a value (React context instance)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
