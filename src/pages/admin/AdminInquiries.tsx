import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { MessageSquare, Mail, Phone, Trash2, CheckCheck, RotateCcw, Clock } from 'lucide-react'
import { getInquiries, markInquiryRead, deleteInquiry } from '@/lib/storage'
import type { Inquiry } from '@/types'
import { btnIcon, EmptyState } from '@/components/admin/ui'

export default function AdminInquiries() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const load = () => setInquiries(getInquiries())
  useEffect(() => {
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  const filtered = filter === 'unread' ? inquiries.filter((i) => !i.is_read) : inquiries

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  const handleRead = (id: string, isRead: boolean) => {
    markInquiryRead(id, isRead)
    load()
  }

  const remove = (id: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteInquiry(id)
      load()
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('admin.inquiries')}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {inquiries.length} {lang === 'ar' ? 'طلب' : 'inquiries'} · {inquiries.filter((i) => !i.is_read).length} {t('admin.newInquiries')}
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-100">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
            }`}
          >
            {t('common.all')}
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === 'unread' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
            }`}
          >
            {t('admin.unread')} ({inquiries.filter((i) => !i.is_read).length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} message={t('admin.noData')} />
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`bg-white rounded-2xl p-5 card-shadow transition-all ${
                !inq.is_read ? 'border-l-4 border-l-primary-500' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-bold text-neutral-900">{inq.name}</h3>
                    {!inq.is_read && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                        {t('admin.newInquiries')}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {inq.unit_type === 'primary' ? t('nav.primary') : t('nav.resale')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                    <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 hover:text-primary-600" dir="ltr">
                      <Phone className="w-4 h-4 text-primary-500" /> {inq.phone}
                    </a>
                    {inq.email && (
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 hover:text-primary-600" dir="ltr">
                        <Mail className="w-4 h-4 text-primary-500" /> {inq.email}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5 text-neutral-400">
                      <Clock className="w-4 h-4" /> {formatDate(inq.created_at)}
                    </span>
                  </div>

                  {inq.message && (
                    <p className="text-sm text-neutral-700 bg-neutral-50 rounded-lg p-3 leading-relaxed">
                      {inq.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!inq.is_read ? (
                    <button
                      onClick={() => handleRead(inq.id, true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success-500/10 text-success-700 text-xs font-medium hover:bg-success-500/20 transition-colors"
                      title={t('admin.markRead')}
                    >
                      <CheckCheck className="w-4 h-4" /> {t('admin.markRead')}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRead(inq.id, false)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-medium hover:bg-neutral-200 transition-colors"
                      title={t('admin.markUnread')}
                    >
                      <RotateCcw className="w-4 h-4" /> {t('admin.markUnread')}
                    </button>
                  )}
                  <button onClick={() => remove(inq.id)} className={btnIcon} title={t('common.delete')}>
                    <Trash2 className="w-4 h-4 text-error-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
