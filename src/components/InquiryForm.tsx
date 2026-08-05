import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react'
import { saveInquiry } from '@/lib/storage'
import type { UnitType } from '@/types'

interface Props {
  unitId: string
  unitType: UnitType
  compact?: boolean
}

export default function InquiryForm({ unitId, unitType, compact = false }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      saveInquiry({
        ...form,
        unit_type: unitType,
        unit_id: unitId,
      })
      setStatus('sent')
      setForm({ name: '', phone: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-success-500/15 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-success-600" />
        </div>
        <p className="text-sm text-neutral-700 font-medium">{t('unit.sent')}</p>
      </div>
    )
  }

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm'

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className={compact ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
        <input
          type="text"
          placeholder={t('unit.yourName')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          required
        />
        <input
          type="tel"
          placeholder={t('unit.yourPhone')}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      {!compact && (
        <input
          type="email"
          placeholder={t('unit.yourEmail')}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
      )}
      <textarea
        placeholder={t('unit.yourMessage')}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={compact ? 2 : 3}
        className={inputClass}
      />
      {status === 'error' && (
        <p className="text-xs text-error-600">{t('unit.yourName')} / {t('unit.yourPhone')}</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {t('unit.send')}
      </button>
    </form>
  )
}
