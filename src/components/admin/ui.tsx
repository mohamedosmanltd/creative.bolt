import type { ReactNode } from 'react'

export const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm'
export const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5'
export const btnPrimary = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors'
export const btnSecondary = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 text-sm font-semibold transition-colors'
export const btnDanger = 'inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-error-500/10 text-error-600 hover:bg-error-500/20 text-sm font-medium transition-colors'
export const btnIcon = 'p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

export function Modal({
  open, onClose, title, children, size = 'lg',
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'md' | 'lg' | 'xl'
}) {
  if (!open) return null
  const sizeClass = size === 'xl' ? 'max-w-3xl' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg'
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto bg-black/50 animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClass} my-8`}>
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-bold text-lg text-neutral-900">{title}</h3>
          <button onClick={onClose} className={btnIcon} aria-label="Close">
            <span className="text-xl">×</span>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-neutral-400 bg-neutral-50 rounded-2xl">
      <Icon className="w-12 h-12 mb-3" />
      <p className="text-base">{message}</p>
    </div>
  )
}

export function parseUrls(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
}

export function urlsToString(urls: string[]): string {
  return urls.join('\n')
}
