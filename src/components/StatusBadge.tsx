import type { PropertyStatus } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { statusLabel } from '@/lib/helpers'

interface Props {
  status: PropertyStatus | string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const { lang } = useLanguage()
  const s = statusLabel(status)
  const sizeClass = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${s.className} ${sizeClass}`}
    >
      {lang === 'ar' ? s.ar : s.en}
    </span>
  )
}
