import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Plus, Pencil, Trash2, Images, Eye, EyeOff, GripVertical } from 'lucide-react'
import { getCarouselSlides, saveCarouselSlide, deleteCarouselSlide } from '@/lib/storage'
import type { CarouselSlide } from '@/types'
import { Modal, Field, inputClass, btnPrimary, btnSecondary, btnIcon, EmptyState } from '@/components/admin/ui'

const empty: Partial<CarouselSlide> = {
  title_ar: '', title_en: '', subtitle_ar: '', subtitle_en: '',
  image_url: '', link_url: '', display_order: 0, is_active: true,
}

export default function AdminCarousel() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<CarouselSlide>>(empty)
  const [isNew, setIsNew] = useState(true)

  const load = () => setSlides(getCarouselSlides())
  useEffect(() => {
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  const openNew = () => {
    setEditing({ ...empty, display_order: slides.length })
    setIsNew(true)
    setModalOpen(true)
  }

  const openEdit = (s: CarouselSlide) => {
    setEditing({ ...s })
    setIsNew(false)
    setModalOpen(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...editing,
      display_order: Number(editing.display_order) || 0,
    }
    saveCarouselSlide(data)
    setModalOpen(false)
    load()
  }

  const remove = (id: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteCarouselSlide(id)
      load()
    }
  }

  const toggleActive = (s: CarouselSlide) => {
    saveCarouselSlide({ ...s, is_active: !s.is_active })
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('admin.carousel')}</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {slides.length} {lang === 'ar' ? 'سلايد' : 'slides'} · {slides.filter((s) => s.is_active).length} {lang === 'ar' ? 'مفعّل' : 'active'}
          </p>
        </div>
        <button onClick={openNew} className={btnPrimary}>
          <Plus className="w-4 h-4" />
          {t('admin.addSlide')}
        </button>
      </div>

      {slides.length === 0 ? (
        <EmptyState icon={Images} message={t('admin.noData')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {slides.map((s, i) => (
            <div key={s.id} className="bg-white rounded-2xl card-shadow overflow-hidden">
              <div className="relative aspect-[16/7] bg-neutral-100">
                <img
                  src={s.image_url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={s.title_en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <GripVertical className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/70">#{i + 1}</span>
                    {s.is_active ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success-500/30 text-success-300 border border-success-500/40">
                        {t('admin.isActive')}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-500/30 text-neutral-300 border border-neutral-500/40">
                        {lang === 'ar' ? 'معطّل' : 'Inactive'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base line-clamp-1">
                    {lang === 'ar' ? s.title_ar : s.title_en}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                    {lang === 'ar' ? s.subtitle_ar : s.subtitle_en}
                  </p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-neutral-500 line-clamp-1 max-w-[60%]">
                  {s.link_url || '—'}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(s)} className={btnIcon} title={t('admin.isActive')}>
                    {s.is_active ? (
                      <Eye className="w-4 h-4 text-success-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                  <button onClick={() => openEdit(s)} className={btnIcon} title={t('common.edit')}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(s.id)} className={btnIcon} title={t('common.delete')}>
                    <Trash2 className="w-4 h-4 text-error-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isNew ? t('admin.addSlide') : t('admin.editSlide')}
        size="lg"
      >
        <form onSubmit={save} className="space-y-4">
          {/* Preview */}
          {editing.image_url && (
            <div className="relative aspect-[16/7] rounded-xl overflow-hidden bg-neutral-100">
              <img src={editing.image_url} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold line-clamp-1">
                  {lang === 'ar' ? (editing.title_ar || 'العنوان') : (editing.title_en || 'Title')}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1">
                  {lang === 'ar' ? (editing.subtitle_ar || 'العنوان الفرعي') : (editing.subtitle_en || 'Subtitle')}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.titleAr')}>
              <input className={inputClass} value={editing.title_ar || ''} onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })} required />
            </Field>
            <Field label={t('admin.titleEn')}>
              <input className={inputClass} value={editing.title_en || ''} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} required />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.subtitleAr')}>
              <input className={inputClass} value={editing.subtitle_ar || ''} onChange={(e) => setEditing({ ...editing, subtitle_ar: e.target.value })} />
            </Field>
            <Field label={t('admin.subtitleEn')}>
              <input className={inputClass} value={editing.subtitle_en || ''} onChange={(e) => setEditing({ ...editing, subtitle_en: e.target.value })} />
            </Field>
          </div>

          <Field label={t('admin.imageUrl')}>
            <input className={inputClass} value={editing.image_url || ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://images.pexels.com/..." required />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.linkUrl')}>
              <input className={inputClass} value={editing.link_url || ''} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} placeholder="/primary" />
            </Field>
            <Field label={t('admin.displayOrder')}>
              <input type="number" className={inputClass} value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
            </Field>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editing.is_active ?? true}
              onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-neutral-700">{t('admin.isActive')}</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className={btnSecondary}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={btnPrimary}>
              {t('common.save')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
