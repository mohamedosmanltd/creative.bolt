import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Plus, Pencil, Trash2, Star, StarOff, Building2 } from 'lucide-react'
import { getResaleProjects, saveResaleProject, deleteResaleProject, getResaleUnitsByProject } from '@/lib/storage'
import type { ResaleProject, ProjectStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { Modal, Field, inputClass, btnPrimary, btnSecondary, btnIcon, EmptyState, parseUrls, urlsToString } from '@/components/admin/ui'

const empty: Partial<ResaleProject> = {
  name_ar: '', name_en: '', developer_ar: '', developer_en: '',
  description_ar: '', description_en: '', location_ar: '', location_en: '',
  status: 'under_construction', delivery_date: '', total_units: 0,
  image_urls: [], video_urls: [], is_featured: false, display_order: 0,
}

export default function AdminResaleProjects() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [projects, setProjects] = useState<ResaleProject[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<ResaleProject>>(empty)
  const [imagesText, setImagesText] = useState('')
  const [videosText, setVideosText] = useState('')
  const [isNew, setIsNew] = useState(true)

  const load = () => setProjects(getResaleProjects())
  useEffect(() => {
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  const openNew = () => {
    setEditing({ ...empty, display_order: projects.length })
    setImagesText('')
    setVideosText('')
    setIsNew(true)
    setModalOpen(true)
  }

  const openEdit = (p: ResaleProject) => {
    setEditing({ ...p })
    setImagesText(urlsToString(p.image_urls))
    setVideosText(urlsToString(p.video_urls))
    setIsNew(false)
    setModalOpen(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...editing,
      image_urls: parseUrls(imagesText),
      video_urls: parseUrls(videosText),
      total_units: Number(editing.total_units) || 0,
      display_order: Number(editing.display_order) || 0,
    }
    saveResaleProject(data)
    setModalOpen(false)
    load()
  }

  const remove = (id: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteResaleProject(id)
      load()
    }
  }

  const toggleFeatured = (p: ResaleProject) => {
    saveResaleProject({ ...p, is_featured: !p.is_featured })
    load()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('admin.resaleProjects')}</h1>
          <p className="text-sm text-neutral-500 mt-1">{projects.length} {lang === 'ar' ? 'مشروع' : 'projects'}</p>
        </div>
        <button onClick={openNew} className={btnPrimary}>
          <Plus className="w-4 h-4" />
          {t('admin.addProject')}
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={Building2} message={t('admin.noData')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const units = getResaleUnitsByProject(p.id)
            return (
              <div key={p.id} className="bg-white rounded-2xl card-shadow overflow-hidden group">
                <div className="relative aspect-video bg-neutral-100">
                  <img
                    src={p.image_urls[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={p.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 ltr:right-2 rtl:left-2">
                    <StatusBadge status={p.status} />
                  </div>
                  <button
                    onClick={() => toggleFeatured(p)}
                    className="absolute bottom-2 ltr:right-2 rtl:left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
                    title={t('admin.isFeatured')}
                  >
                    {p.is_featured ? (
                      <Star className="w-4 h-4 text-warning-500" fill="currentColor" />
                    ) : (
                      <StarOff className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-900 line-clamp-1">
                    {lang === 'ar' ? p.name_ar : p.name_en}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                    {lang === 'ar' ? p.developer_ar : p.developer_en}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-50">
                    <span className="text-xs text-neutral-500">
                      {units.length} / {p.total_units} {lang === 'ar' ? 'وحدة' : 'units'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className={btnIcon} title={t('common.edit')}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(p.id)} className={btnIcon} title={t('common.delete')}>
                        <Trash2 className="w-4 h-4 text-error-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isNew ? t('admin.addProject') : t('admin.editProject')}
        size="xl"
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.nameAr')}>
              <input className={inputClass} value={editing.name_ar || ''} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} required />
            </Field>
            <Field label={t('admin.nameEn')}>
              <input className={inputClass} value={editing.name_en || ''} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} required />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.developerAr')}>
              <input className={inputClass} value={editing.developer_ar || ''} onChange={(e) => setEditing({ ...editing, developer_ar: e.target.value })} />
            </Field>
            <Field label={t('admin.developerEn')}>
              <input className={inputClass} value={editing.developer_en || ''} onChange={(e) => setEditing({ ...editing, developer_en: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.descAr')}>
              <textarea className={inputClass} rows={4} value={editing.description_ar || ''} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} />
            </Field>
            <Field label={t('admin.descEn')}>
              <textarea className={inputClass} rows={4} value={editing.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.locationAr')}>
              <input className={inputClass} value={editing.location_ar || ''} onChange={(e) => setEditing({ ...editing, location_ar: e.target.value })} />
            </Field>
            <Field label={t('admin.locationEn')}>
              <input className={inputClass} value={editing.location_en || ''} onChange={(e) => setEditing({ ...editing, location_en: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label={t('admin.status')}>
              <select className={inputClass} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ProjectStatus })}>
                <option value="under_construction">{t('common.underConstruction')}</option>
                <option value="ready">{t('common.ready')}</option>
                <option value="sold_out">{t('common.soldOut')}</option>
              </select>
            </Field>
            <Field label={t('admin.deliveryDate')}>
              <input className={inputClass} value={editing.delivery_date || ''} onChange={(e) => setEditing({ ...editing, delivery_date: e.target.value })} placeholder="2025 Q4" />
            </Field>
            <Field label={t('admin.totalUnits')}>
              <input type="number" className={inputClass} value={editing.total_units || 0} onChange={(e) => setEditing({ ...editing, total_units: Number(e.target.value) })} />
            </Field>
            <Field label={t('admin.displayOrder')}>
              <input type="number" className={inputClass} value={editing.display_order || 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
            </Field>
          </div>

          <Field label={t('admin.images')}>
            <textarea
              className={inputClass}
              rows={4}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://...&#10;https://..."
            />
          </Field>

          <Field label={t('admin.videos')}>
            <textarea
              className={inputClass}
              rows={3}
              value={videosText}
              onChange={(e) => setVideosText(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
          </Field>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={editing.is_featured || false}
              onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-neutral-700">{t('admin.isFeatured')}</span>
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
