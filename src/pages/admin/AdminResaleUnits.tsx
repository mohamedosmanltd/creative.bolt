import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { getResaleUnits, getResaleProjects, saveResaleUnit, deleteResaleUnit } from '@/lib/storage'
import type { ResaleUnit, PropertyStatus, ResaleProject } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import { Modal, Field, inputClass, btnPrimary, btnSecondary, btnIcon, EmptyState, parseUrls, urlsToString } from '@/components/admin/ui'

const empty: Partial<ResaleUnit> = {
  project_id: '', title_ar: '', title_en: '', description_ar: '', description_en: '',
  price_eur: 0, price_egp: 0, area_m2: 0, bedrooms: 0, bathrooms: 0, floor: '',
  status: 'available', image_urls: [], display_order: 0,
}

export default function AdminResaleUnits() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [units, setUnits] = useState<ResaleUnit[]>([])
  const [projects, setProjects] = useState<ResaleProject[]>([])
  const [projectFilter, setProjectFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<ResaleUnit>>(empty)
  const [imagesText, setImagesText] = useState('')
  const [isNew, setIsNew] = useState(true)

  const load = () => {
    setUnits(getResaleUnits())
    setProjects(getResaleProjects())
  }
  useEffect(() => {
    load()
    window.addEventListener('cre-data-changed', load)
    return () => window.removeEventListener('cre-data-changed', load)
  }, [])

  const filtered = projectFilter === 'all' ? units : units.filter((u) => u.project_id === projectFilter)
  const projectName = (id: string) => {
    const p = projects.find((x) => x.id === id)
    return p ? (lang === 'ar' ? p.name_ar : p.name_en) : '—'
  }

  const openNew = () => {
    setEditing({ ...empty, project_id: projectFilter !== 'all' ? projectFilter : (projects[0]?.id || ''), display_order: filtered.length })
    setImagesText('')
    setIsNew(true)
    setModalOpen(true)
  }

  const openEdit = (u: ResaleUnit) => {
    setEditing({ ...u })
    setImagesText(urlsToString(u.image_urls))
    setIsNew(false)
    setModalOpen(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...editing,
      image_urls: parseUrls(imagesText),
      price_eur: Number(editing.price_eur) || 0,
      price_egp: Number(editing.price_egp) || 0,
      area_m2: Number(editing.area_m2) || 0,
      bedrooms: Number(editing.bedrooms) || 0,
      bathrooms: Number(editing.bathrooms) || 0,
      display_order: Number(editing.display_order) || 0,
    }
    saveResaleUnit(data)
    setModalOpen(false)
    load()
  }

  const remove = (id: string) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      deleteResaleUnit(id)
      load()
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t('admin.resaleUnits')}</h1>
          <p className="text-sm text-neutral-500 mt-1">{units.length} {lang === 'ar' ? 'وحدة' : 'units'}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white"
          >
            <option value="all">{t('common.all')}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {lang === 'ar' ? p.name_ar : p.name_en}
              </option>
            ))}
          </select>
          <button onClick={openNew} className={btnPrimary}>
            <Plus className="w-4 h-4" />
            {t('admin.addResaleUnit')}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} message={t('admin.noData')} />
      ) : (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="px-4 py-3">{lang === 'ar' ? 'الوحدة' : 'Unit'}</th>
                  <th className="px-4 py-3 hidden md:table-cell">{t('admin.project')}</th>
                  <th className="px-4 py-3 hidden sm:table-cell">{t('common.price')}</th>
                  <th className="px-4 py-3">{t('common.status')}</th>
                  <th className="px-4 py-3 text-center">{t('common.edit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image_urls[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200'}
                          alt={u.title_en}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-neutral-900 text-sm line-clamp-1">
                            {lang === 'ar' ? u.title_ar : u.title_en}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {u.bedrooms} {t('common.bedrooms')} · {u.area_m2} {t('common.area')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-neutral-600 line-clamp-1 max-w-[160px]">
                      {projectName(u.project_id)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm text-neutral-700">
                      €{new Intl.NumberFormat('en').format(u.price_eur)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(u)} className={btnIcon} title={t('common.edit')}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(u.id)} className={btnIcon} title={t('common.delete')}>
                          <Trash2 className="w-4 h-4 text-error-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isNew ? t('admin.addResaleUnit') : t('admin.editResaleUnit')}
        size="xl"
      >
        <form onSubmit={save} className="space-y-4">
          <Field label={t('admin.project')}>
            <select className={inputClass} value={editing.project_id || ''} onChange={(e) => setEditing({ ...editing, project_id: e.target.value })} required>
              <option value="">—</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'ar' ? p.name_ar : p.name_en}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.titleAr')}>
              <input className={inputClass} value={editing.title_ar || ''} onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })} required />
            </Field>
            <Field label={t('admin.titleEn')}>
              <input className={inputClass} value={editing.title_en || ''} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} required />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('admin.descAr')}>
              <textarea className={inputClass} rows={3} value={editing.description_ar || ''} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} />
            </Field>
            <Field label={t('admin.descEn')}>
              <textarea className={inputClass} rows={3} value={editing.description_en || ''} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label={t('admin.priceEur')}>
              <input type="number" className={inputClass} value={editing.price_eur || 0} onChange={(e) => setEditing({ ...editing, price_eur: Number(e.target.value) })} />
            </Field>
            <Field label={t('admin.priceEgp')}>
              <input type="number" className={inputClass} value={editing.price_egp || 0} onChange={(e) => setEditing({ ...editing, price_egp: Number(e.target.value) })} />
            </Field>
            <Field label={t('admin.area')}>
              <input type="number" className={inputClass} value={editing.area_m2 || 0} onChange={(e) => setEditing({ ...editing, area_m2: Number(e.target.value) })} />
            </Field>
            <Field label={t('admin.bedrooms')}>
              <input type="number" className={inputClass} value={editing.bedrooms || 0} onChange={(e) => setEditing({ ...editing, bedrooms: Number(e.target.value) })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label={t('admin.bathrooms')}>
              <input type="number" className={inputClass} value={editing.bathrooms || 0} onChange={(e) => setEditing({ ...editing, bathrooms: Number(e.target.value) })} />
            </Field>
            <Field label={t('admin.floor')}>
              <input className={inputClass} value={editing.floor || ''} onChange={(e) => setEditing({ ...editing, floor: e.target.value })} />
            </Field>
            <Field label={t('admin.status')}>
              <select className={inputClass} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as PropertyStatus })}>
                <option value="available">{t('common.available')}</option>
                <option value="reserved">{t('common.reserved')}</option>
                <option value="sold">{t('common.sold')}</option>
              </select>
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
