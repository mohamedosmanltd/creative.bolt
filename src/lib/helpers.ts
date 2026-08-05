import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'

// Helper to pick the correct language field from a bilingual object
export function tr(ar: string, en: string): string {
  const { lang } = useLanguage()
  return lang === 'ar' ? ar : en
}

export function useT() {
  const { t } = useTranslation()
  return t
}

export function useDir() {
  const { dir } = useLanguage()
  return dir
}

export function formatPrice(value: number, currency: 'eur' | 'egp'): string {
  if (!value) return '—'
  const symbol = currency === 'eur' ? '€' : 'EGP'
  return `${new Intl.NumberFormat('en-US').format(value)} ${symbol}`
}

export function statusLabel(status: string): { ar: string; en: string; className: string } {
  switch (status) {
    case 'available':
      return { ar: 'متاح', en: 'Available', className: 'bg-success-500/15 text-success-700 border-success-500/30' }
    case 'sold':
      return { ar: 'مباع', en: 'Sold', className: 'bg-error-500/15 text-error-600 border-error-500/30' }
    case 'reserved':
      return { ar: 'محجوز', en: 'Reserved', className: 'bg-warning-500/15 text-warning-600 border-warning-500/30' }
    case 'under_construction':
      return { ar: 'قيد الإنشاء', en: 'Under Construction', className: 'bg-primary-500/15 text-primary-700 border-primary-500/30' }
    case 'ready':
      return { ar: 'جاهز', en: 'Ready', className: 'bg-success-500/15 text-success-700 border-success-500/30' }
    case 'sold_out':
      return { ar: 'نفذت', en: 'Sold Out', className: 'bg-neutral-200 text-neutral-700 border-neutral-300' }
    default:
      return { ar: status, en: status, className: 'bg-neutral-200 text-neutral-700 border-neutral-300' }
  }
}
