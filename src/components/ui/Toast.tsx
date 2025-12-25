import { useEffect } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

export function toast(type: ToastType, message: string, duration = 5000) {
  useToastStore.getState().addToast({ type, message, duration })
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const typeClasses = {
  success: 'toast--success',
  error: 'toast--error',
  warning: 'toast--warning',
  info: 'toast--info',
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = icons[toast.type]

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(onClose, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  return (
    <div
      className={`toast ${typeClasses[toast.type]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="Notificações"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
