export type PropertyStatus = 'available' | 'sold' | 'reserved'
export type ProjectStatus = 'under_construction' | 'ready' | 'sold_out'
export type UnitType = 'primary' | 'resale'

export interface PrimaryUnit {
  id: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  price_eur: number
  price_egp: number
  area_m2: number
  bedrooms: number
  bathrooms: number
  floor: string
  location_ar: string
  location_en: string
  status: PropertyStatus
  image_urls: string[]
  is_featured: boolean
  display_order: number
}

export interface ResaleProject {
  id: string
  name_ar: string
  name_en: string
  developer_ar: string
  developer_en: string
  description_ar: string
  description_en: string
  location_ar: string
  location_en: string
  status: ProjectStatus
  delivery_date: string
  total_units: number
  image_urls: string[]
  video_urls: string[]
  is_featured: boolean
  display_order: number
}

export interface ResaleUnit {
  id: string
  project_id: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  price_eur: number
  price_egp: number
  area_m2: number
  bedrooms: number
  bathrooms: number
  floor: string
  status: PropertyStatus
  image_urls: string[]
  display_order: number
}

export interface CarouselSlide {
  id: string
  title_ar: string
  title_en: string
  subtitle_ar: string
  subtitle_en: string
  image_url: string
  link_url: string
  display_order: number
  is_active: boolean
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  email: string
  message: string
  unit_type: UnitType
  unit_id: string
  created_at: string
  is_read: boolean
}
