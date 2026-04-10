'use client';

import { useEffect } from 'react';
import { connectSocket } from '@/lib/socket';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    connectSocket();
  }, []);

  return <>{children}</>;
}