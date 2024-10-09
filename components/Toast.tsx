"use client"

import { useToast } from '@/hooks/use-toast';

export default function Toast() {
  const { toast } = useToast();

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="font-bold text-lg">{toast.title}</h3>
      {toast.description && <p className="text-gray-600 dark:text-gray-300">{toast.description}</p>}
    </div>
  );
}