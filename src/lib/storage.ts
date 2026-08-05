import type { CarouselSlide, PrimaryUnit, ResaleProject, ResaleUnit, Inquiry } from '@/types'

const STORAGE_KEYS = {
  primaryUnits: 'cre_primary_units',
  resaleProjects: 'cre_resale_projects',
  resaleUnits: 'cre_resale_units',
  carousel: 'cre_carousel',
  inquiries: 'cre_inquiries',
  initialized: 'cre_initialized_v1',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('cre-data-changed', { detail: key }))
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// ============ Primary Units ============
export function getPrimaryUnits(): PrimaryUnit[] {
  return read<PrimaryUnit[]>(STORAGE_KEYS.primaryUnits, []).sort((a, b) => a.display_order - b.display_order)
}

export function getPrimaryUnit(id: string): PrimaryUnit | undefined {
  return getPrimaryUnits().find((u) => u.id === id)
}

export function savePrimaryUnit(unit: Partial<PrimaryUnit>): PrimaryUnit {
  const units = read<PrimaryUnit[]>(STORAGE_KEYS.primaryUnits, [])
  if (unit.id) {
    const idx = units.findIndex((u) => u.id === unit.id)
    if (idx >= 0) {
      units[idx] = { ...units[idx], ...unit } as PrimaryUnit
      write(STORAGE_KEYS.primaryUnits, units)
      return units[idx]
    }
  }
  const newUnit: PrimaryUnit = {
    id: uid(),
    title_ar: unit.title_ar || '',
    title_en: unit.title_en || '',
    description_ar: unit.description_ar || '',
    description_en: unit.description_en || '',
    price_eur: unit.price_eur || 0,
    price_egp: unit.price_egp || 0,
    area_m2: unit.area_m2 || 0,
    bedrooms: unit.bedrooms || 0,
    bathrooms: unit.bathrooms || 0,
    floor: unit.floor || '',
    location_ar: unit.location_ar || '',
    location_en: unit.location_en || '',
    status: unit.status || 'available',
    image_urls: unit.image_urls || [],
    is_featured: unit.is_featured || false,
    display_order: unit.display_order || units.length,
  }
  units.push(newUnit)
  write(STORAGE_KEYS.primaryUnits, units)
  return newUnit
}

export function deletePrimaryUnit(id: string): void {
  const units = read<PrimaryUnit[]>(STORAGE_KEYS.primaryUnits, [])
  write(STORAGE_KEYS.primaryUnits, units.filter((u) => u.id !== id))
}

// ============ Resale Projects ============
export function getResaleProjects(): ResaleProject[] {
  return read<ResaleProject[]>(STORAGE_KEYS.resaleProjects, []).sort((a, b) => a.display_order - b.display_order)
}

export function getResaleProject(id: string): ResaleProject | undefined {
  return getResaleProjects().find((p) => p.id === id)
}

export function saveResaleProject(project: Partial<ResaleProject>): ResaleProject {
  const projects = read<ResaleProject[]>(STORAGE_KEYS.resaleProjects, [])
  if (project.id) {
    const idx = projects.findIndex((p) => p.id === project.id)
    if (idx >= 0) {
      projects[idx] = { ...projects[idx], ...project } as ResaleProject
      write(STORAGE_KEYS.resaleProjects, projects)
      return projects[idx]
    }
  }
  const newProject: ResaleProject = {
    id: uid(),
    name_ar: project.name_ar || '',
    name_en: project.name_en || '',
    developer_ar: project.developer_ar || '',
    developer_en: project.developer_en || '',
    description_ar: project.description_ar || '',
    description_en: project.description_en || '',
    location_ar: project.location_ar || '',
    location_en: project.location_en || '',
    status: project.status || 'under_construction',
    delivery_date: project.delivery_date || '',
    total_units: project.total_units || 0,
    image_urls: project.image_urls || [],
    video_urls: project.video_urls || [],
    is_featured: project.is_featured || false,
    display_order: project.display_order || projects.length,
  }
  projects.push(newProject)
  write(STORAGE_KEYS.resaleProjects, projects)
  return newProject
}

export function deleteResaleProject(id: string): void {
  const projects = read<ResaleProject[]>(STORAGE_KEYS.resaleProjects, [])
  write(STORAGE_KEYS.resaleProjects, projects.filter((p) => p.id !== id))
  // cascade delete units
  const units = read<ResaleUnit[]>(STORAGE_KEYS.resaleUnits, [])
  write(STORAGE_KEYS.resaleUnits, units.filter((u) => u.project_id !== id))
}

// ============ Resale Units ============
export function getResaleUnits(): ResaleUnit[] {
  return read<ResaleUnit[]>(STORAGE_KEYS.resaleUnits, []).sort((a, b) => a.display_order - b.display_order)
}

export function getResaleUnitsByProject(projectId: string): ResaleUnit[] {
  return getResaleUnits().filter((u) => u.project_id === projectId)
}

export function getResaleUnit(id: string): ResaleUnit | undefined {
  return getResaleUnits().find((u) => u.id === id)
}

export function saveResaleUnit(unit: Partial<ResaleUnit>): ResaleUnit {
  const units = read<ResaleUnit[]>(STORAGE_KEYS.resaleUnits, [])
  if (unit.id) {
    const idx = units.findIndex((u) => u.id === unit.id)
    if (idx >= 0) {
      units[idx] = { ...units[idx], ...unit } as ResaleUnit
      write(STORAGE_KEYS.resaleUnits, units)
      return units[idx]
    }
  }
  const newUnit: ResaleUnit = {
    id: uid(),
    project_id: unit.project_id || '',
    title_ar: unit.title_ar || '',
    title_en: unit.title_en || '',
    description_ar: unit.description_ar || '',
    description_en: unit.description_en || '',
    price_eur: unit.price_eur || 0,
    price_egp: unit.price_egp || 0,
    area_m2: unit.area_m2 || 0,
    bedrooms: unit.bedrooms || 0,
    bathrooms: unit.bathrooms || 0,
    floor: unit.floor || '',
    status: unit.status || 'available',
    image_urls: unit.image_urls || [],
    display_order: unit.display_order || units.length,
  }
  units.push(newUnit)
  write(STORAGE_KEYS.resaleUnits, units)
  return newUnit
}

export function deleteResaleUnit(id: string): void {
  const units = read<ResaleUnit[]>(STORAGE_KEYS.resaleUnits, [])
  write(STORAGE_KEYS.resaleUnits, units.filter((u) => u.id !== id))
}

// ============ Carousel ============
export function getCarouselSlides(): CarouselSlide[] {
  return read<CarouselSlide[]>(STORAGE_KEYS.carousel, []).sort((a, b) => a.display_order - b.display_order)
}

export function getActiveCarouselSlides(): CarouselSlide[] {
  return getCarouselSlides().filter((s) => s.is_active)
}

export function saveCarouselSlide(slide: Partial<CarouselSlide>): CarouselSlide {
  const slides = read<CarouselSlide[]>(STORAGE_KEYS.carousel, [])
  if (slide.id) {
    const idx = slides.findIndex((s) => s.id === slide.id)
    if (idx >= 0) {
      slides[idx] = { ...slides[idx], ...slide } as CarouselSlide
      write(STORAGE_KEYS.carousel, slides)
      return slides[idx]
    }
  }
  const newSlide: CarouselSlide = {
    id: uid(),
    title_ar: slide.title_ar || '',
    title_en: slide.title_en || '',
    subtitle_ar: slide.subtitle_ar || '',
    subtitle_en: slide.subtitle_en || '',
    image_url: slide.image_url || '',
    link_url: slide.link_url || '',
    display_order: slide.display_order || slides.length,
    is_active: slide.is_active ?? true,
  }
  slides.push(newSlide)
  write(STORAGE_KEYS.carousel, slides)
  return newSlide
}

export function deleteCarouselSlide(id: string): void {
  const slides = read<CarouselSlide[]>(STORAGE_KEYS.carousel, [])
  write(STORAGE_KEYS.carousel, slides.filter((s) => s.id !== id))
}

// ============ Inquiries ============
export function getInquiries(): Inquiry[] {
  return read<Inquiry[]>(STORAGE_KEYS.inquiries, []).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function saveInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'is_read'>): Inquiry {
  const inquiries = read<Inquiry[]>(STORAGE_KEYS.inquiries, [])
  const newInquiry: Inquiry = {
    id: uid(),
    ...inquiry,
    created_at: new Date().toISOString(),
    is_read: false,
  }
  inquiries.push(newInquiry)
  write(STORAGE_KEYS.inquiries, inquiries)
  return newInquiry
}

export function markInquiryRead(id: string, isRead: boolean): void {
  const inquiries = read<Inquiry[]>(STORAGE_KEYS.inquiries, [])
  const idx = inquiries.findIndex((i) => i.id === id)
  if (idx >= 0) {
    inquiries[idx].is_read = isRead
    write(STORAGE_KEYS.inquiries, inquiries)
  }
}

export function deleteInquiry(id: string): void {
  const inquiries = read<Inquiry[]>(STORAGE_KEYS.inquiries, [])
  write(STORAGE_KEYS.inquiries, inquiries.filter((i) => i.id !== id))
}

// ============ Initialization ============
export function isInitialized(): boolean {
  return read<boolean>(STORAGE_KEYS.initialized, false)
}

export function setInitialized(value: boolean): void {
  write(STORAGE_KEYS.initialized, value)
}

export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
  window.dispatchEvent(new CustomEvent('cre-data-changed'))
}
