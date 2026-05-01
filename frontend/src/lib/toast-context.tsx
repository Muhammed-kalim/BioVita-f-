'use client';

import * as React from 'react';
import { createContext, useContext, useRef, ReactNode } from 'react';
import Toaster, { ToasterRef } from '@/components/ui/toast';

interface ToastContextType {
  toast: (props: Parameters<ToasterRef['show']>[0]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toasterRef = useRef<ToasterRef>(null);

  const toast = React.useCallback((props: Parameters<ToasterRef['show']>[0]) => {
    toasterRef.current?.show(props);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toaster ref={toasterRef} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
