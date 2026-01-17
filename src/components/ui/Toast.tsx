import * as ToastPrimitive from '@radix-ui/react-toast'
import { createContext, useContext, useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ToastVariant = 'default' | 'success' | 'error' | 'warning'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, title, description, variant }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider>
        {children}
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            duration={5000}
            onOpenChange={(open) => !open && removeToast(t.id)}
            className={cn(
              'fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg p-4 shadow-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
              'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full',
              t.variant === 'default' && 'bg-white border border-gray-200',
              t.variant === 'success' && 'bg-green-50 border border-green-200',
              t.variant === 'error' && 'bg-red-50 border border-red-200',
              t.variant === 'warning' && 'bg-yellow-50 border border-yellow-200'
            )}
          >
            <div className="flex items-start gap-3">
              {t.variant !== 'default' && (
                <div className="flex-shrink-0">
                  {t.variant === 'success' && (
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {t.variant === 'error' && (
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {t.variant === 'warning' && (
                    <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              )}
              <div className="flex-1">
                <ToastPrimitive.Title
                  className={cn(
                    'text-sm font-semibold',
                    t.variant === 'default' && 'text-gray-900',
                    t.variant === 'success' && 'text-green-900',
                    t.variant === 'error' && 'text-red-900',
                    t.variant === 'warning' && 'text-yellow-900'
                  )}
                >
                  {t.title}
                </ToastPrimitive.Title>
                {t.description && (
                  <ToastPrimitive.Description
                    className={cn(
                      'mt-1 text-sm',
                      t.variant === 'default' && 'text-gray-500',
                      t.variant === 'success' && 'text-green-700',
                      t.variant === 'error' && 'text-red-700',
                      t.variant === 'warning' && 'text-yellow-700'
                    )}
                  >
                    {t.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
