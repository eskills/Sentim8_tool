import { useState, useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
    setTimeout(() => {
      setToast(null);
    }, options.duration || 3000);
  }, []);

  return { toast, showToast };
}