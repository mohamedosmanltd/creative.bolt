import {
  getPrimaryUnits,
  getResaleProjects,
  getResaleUnits,
  getCarouselSlides,
  isInitialized,
  setInitialized,
  savePrimaryUnit,
  saveResaleProject,
  saveResaleUnit,
  saveCarouselSlide,
} from '@/lib/storage'
import type { PrimaryUnit, ResaleProject, ResaleUnit, CarouselSlide } from '@/types'

// Pexels image helpers — curated real-estate photos
const IMG = {
  modern1: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600',
  modern2: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1600',
  modern3: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600',
  villa: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interior1: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interior2: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interior3: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interior4: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600',
  interior5: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=1600',
  kitchen: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1600',
  bedroom: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1600',
  pool: 'https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=1600',
  city: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1600',
  building: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1600',
  penthouse: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1600',
  exterior: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1600',
  garden: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1600',
  sea: 'https://images.pexels.com/photos/210205/pexels-photo-210205.jpeg?auto=compress&cs=tinysrgb&w=1600',
  cairo: 'https://images.pexels.com/photos/466675/pexels-photo-466675.jpeg?auto=compress&cs=tinysrgb&w=1600',
  luxury: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?auto=compress&cs=tinysrgb&w=1600',
}

const allImages = Object.values(IMG)

function pickImages(start: number, count = 4): string[] {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    out.push(allImages[(start + i) % allImages.length])
  }
  return out
}

const LOCATIONS = [
  { ar: 'القاهرة الجديدة - التجمع الخامس', en: 'New Cairo - Fifth Settlement' },
  { ar: 'العاصمة الإدارية - الدقم', en: 'New Administrative Capital - R7' },
  { ar: 'الشيخ زايد - الحي السابع', en: 'Sheikh Zayed - 7th District' },
  { ar: 'الساحل الشمالي - رأس الحكمة', en: 'North Coast - Ras El Hekma' },
  { ar: 'العين السخنة - بورت سعيد', en: 'Ain Sokhna - Galala' },
  { ar: 'المنصورة - حي الجامعة', en: 'Mansoura - University District' },
]

const TITLES = [
  { ar: 'شقة فاخرة - 3 غرف نوم', en: 'Luxury Apartment - 3 Bedroom' },
  { ar: 'شقة عائلية - 2 غرف نوم', en: 'Family Apartment - 2 Bedroom' },
  { ar: 'بنتهاوس بإطلالة بانورامية', en: 'Penthouse with Panoramic View' },
  { ar: 'دوبلكس بحديقة خاصة', en: 'Duplex with Private Garden' },
  { ar: 'شقة حديثة - استوديو', en: 'Modern Studio Apartment' },
  { ar: 'فيلا مستقلة - 4 غرف نوم', en: 'Standalone Villa - 4 Bedroom' },
  { ar: 'تاون هاوس - 3 غرف نوم', en: 'Townhouse - 3 Bedroom' },
  { ar: 'شاقةFacing الاستراحة', en: 'Pool-Facing Apartment' },
]

function seedPrimaryUnits(): void {
  if (getPrimaryUnits().length > 0) return
  const statuses: PrimaryUnit['status'][] = ['available', 'available', 'available', 'available', 'available', 'available', 'reserved', 'available', 'available', 'sold', 'available', 'available', 'available', 'reserved', 'available', 'available', 'available', 'available', 'available', 'available']
  for (let i = 0; i < 20; i++) {
    const t = TITLES[i % TITLES.length]
    const loc = LOCATIONS[i % LOCATIONS.length]
    const eur = 65000 + i * 7500 + (i % 3) * 4000
    const egp = Math.round(eur * 52)
    savePrimaryUnit({
      title_ar: `${t.ar} ${i + 1}`,
      title_en: `${t.en} ${i + 1}`,
      description_ar: `وحدة سكنية فاخرة بمساحة ${90 + (i % 5) * 20} م²، تتميز بتصميم عصري وتشطيبات راقية. تقع في ${loc.ar}، واحدة من أرقى المناطق السكنية. تشمل صالة واسعة، مطبخ مجهز، وغرف نوم مريحة. ${i % 3 === 0 ? 'تتميز الوحدة بإطلالة خلابة على الحديقة.' : i % 3 === 1 ? 'تتميز الوحدة بإطلالة على المسبح.' : 'تتميز الوحدة بإطلالة بانورامية على المدينة.'} خطط سداد مرنة تصل إلى 7 سنوات.`,
      description_en: `Luxurious ${90 + (i % 5) * 20} sqm residential unit with modern design and premium finishes. Located in ${loc.en}, one of the finest residential areas. Includes a spacious living room, equipped kitchen, and comfortable bedrooms. ${i % 3 === 0 ? 'The unit features a stunning garden view.' : i % 3 === 1 ? 'The unit features a pool view.' : 'The unit features a panoramic city view.'} Flexible payment plans up to 7 years.`,
      price_eur: eur,
      price_egp: egp,
      area_m2: 90 + (i % 5) * 20,
      bedrooms: 2 + (i % 3),
      bathrooms: 2 + (i % 2),
      floor: `${(i % 8) + 1}`,
      location_ar: loc.ar,
      location_en: loc.en,
      status: statuses[i],
      image_urls: pickImages(i * 4, 4),
      is_featured: i < 6,
      display_order: i,
    })
  }
}

const PROJECTS = [
  {
    name_ar: 'ميفيدا التجمع الخامس',
    name_en: 'Mivida Fifth Settlement',
    developer_ar: 'إعمار مصر',
    developer_en: 'Emaar Misr',
    desc_ar: 'ميفيدا هو مجتمع متكامل على مساحة 4,400 فدان بالتجمع الخامس، يضم وحدات سكنية متنوعة، مساحات خضراء شاسعة، بحيرات صناعية، ومناطق تجارية وترفيهية متكاملة.',
    desc_en: 'Mivida is an integrated community spanning 4,400 acres in Fifth Settlement, featuring diverse residential units, vast green spaces, artificial lakes, and complete commercial and entertainment areas.',
    loc: LOCATIONS[0],
    status: 'under_construction' as const,
    delivery: '2025 Q4',
    total: 8,
  },
  {
    name_ar: 'كابيتال فالي R7',
    name_en: 'Capital Valley R7',
    developer_ar: 'تطوير مصر',
    developer_en: 'Tatweer Misr',
    desc_ar: 'كابيتال فالي في العاصمة الإدارية الجديدة، مشروع سكني فاخر على مساحة 50 فدان في منطقة R7. يضم شقق سكنية، فلل، ومناطق تجارية وترفيهية بتشطيبات سوبر لوكس.',
    desc_en: 'Capital Valley in the New Administrative Capital, a luxury residential project on 50 acres in the R7 area. Features apartments, villas, and commercial and entertainment areas with super-lux finishes.',
    loc: LOCATIONS[1],
    status: 'under_construction' as const,
    delivery: '2026 Q2',
    total: 6,
  },
  {
    name_ar: 'أوبر الشيخ زايد',
    name_en: 'Owest Sheikh Zayed',
    developer_ar: 'أوراسكوم',
    developer_en: 'Orascom',
    desc_ar: 'أوبر هو مشروع سكني متكامل في الشيخ زايد، يجمع بين الفخامة والاستدامة. يضم فلل، تاون هاوس، وشقق بمساحات متنوعة مع مرافق ترفيهية وخدمية متكاملة.',
    desc_en: 'Owest is an integrated residential project in Sheikh Zayed, combining luxury and sustainability. Features villas, townhouses, and apartments in various sizes with complete entertainment and service facilities.',
    loc: LOCATIONS[2],
    status: 'ready' as const,
    delivery: '2024 Q1',
    total: 6,
  },
  {
    name_ar: 'لاجون باي الساحل الشمالي',
    name_en: 'Lagoon Bay North Coast',
    developer_ar: 'السعودية مصر',
    developer_en: 'Saudi Egyptian',
    desc_ar: 'لاجون باي على الساحل الشمالي في رأس الحكمة، منتجع ساحلي فاخر بإطلالات مباشرة على البحر. يضم شاليهات، تاون هاوس، وفلل بمساحات متنوعة مع شواطئ خاصة ومرافق ترفيهية.',
    desc_en: 'Lagoon Bay on the North Coast in Ras El Hekma, a luxury coastal resort with direct sea views. Features chalets, townhouses, and villas in various sizes with private beaches and entertainment facilities.',
    loc: LOCATIONS[3],
    status: 'under_construction' as const,
    delivery: '2025 Q2',
    total: 4,
  },
]

function seedResaleProjects(): void {
  if (getResaleProjects().length > 0) return
  PROJECTS.forEach((p, i) => {
    saveResaleProject({
      name_ar: p.name_ar,
      name_en: p.name_en,
      developer_ar: p.developer_ar,
      developer_en: p.developer_en,
      description_ar: p.desc_ar,
      description_en: p.desc_en,
      location_ar: p.loc.ar,
      location_en: p.loc.en,
      status: p.status,
      delivery_date: p.delivery,
      total_units: p.total,
      image_urls: pickImages(i * 5 + 2, 4),
      video_urls: i === 0 ? ['https://www.youtube.com/embed/dQw4w9WgXcQ'] : [],
      is_featured: i < 3,
      display_order: i,
    })
  })
}

function seedResaleUnits(): void {
  if (getResaleUnits().length > 0) return
  const projects = getResaleProjects()
  const resaleStatuses: ResaleUnit['status'][] = ['available', 'available', 'reserved', 'available', 'sold', 'available', 'available', 'reserved', 'available', 'available', 'sold', 'available', 'available', 'available', 'reserved', 'available', 'available', 'available', 'available', 'reserved', 'available', 'sold', 'available', 'available']
  let count = 0
  projects.forEach((p, pi) => {
    for (let i = 0; i < p.total_units; i++) {
      const t = TITLES[i % TITLES.length]
      const eur = 70000 + count * 6000 + (count % 3) * 5000
      const egp = Math.round(eur * 52)
      saveResaleUnit({
        project_id: p.id,
        title_ar: `${t.ar} - ${i + 1}`,
        title_en: `${t.en} - ${i + 1}`,
        description_ar: `وحدة في ${p.name_ar}، ${p.location_ar}. مساحة ${100 + (i % 4) * 25} م²، تشطيب راقي مع إمكانية التقسيط.`,
        description_en: `Unit in ${p.name_en}, ${p.location_en}. ${100 + (i % 4) * 25} sqm area, premium finish with installment options.`,
        price_eur: eur,
        price_egp: egp,
        area_m2: 100 + (i % 4) * 25,
        bedrooms: 2 + (i % 3),
        bathrooms: 2 + (i % 2),
        floor: `${(i % 6) + 1}`,
        status: resaleStatuses[count % resaleStatuses.length],
        image_urls: pickImages(pi * 6 + i + 3, 4),
        display_order: i,
      })
      count++
    }
  })
}

function seedCarousel(): void {
  if (getCarouselSlides().length > 0) return
  const slides: Partial<CarouselSlide>[] = [
    {
      title_ar: 'استثمر في مستقبلك العقاري',
      title_en: 'Invest in your real estate future',
      subtitle_ar: 'أفضل الوحدات السكنية في أرقى المناطق',
      subtitle_en: 'The finest residential units in premium locations',
      image_url: IMG.modern1,
      link_url: '/primary',
      display_order: 0,
      is_active: true,
    },
    {
      title_ar: 'مشاريع إعادة البيع الأكثر ربحية',
      title_en: 'Most profitable resale projects',
      subtitle_ar: 'استثمر في أرقى مشاريع المطورين المعتمدين',
      subtitle_en: 'Invest in top certified developer projects',
      image_url: IMG.luxury,
      link_url: '/resale',
      display_order: 1,
      is_active: true,
    },
    {
      title_ar: 'وحدات فاخرة بإطلالات خلابة',
      title_en: 'Luxury units with stunning views',
      subtitle_ar: 'اكتشف مجموعتنا المختارة من العقارات الفاخرة',
      subtitle_en: 'Discover our curated selection of luxury properties',
      image_url: IMG.penthouse,
      link_url: '/primary',
      display_order: 2,
      is_active: true,
    },
  ]
  slides.forEach((s) => saveCarouselSlide(s))
}

export function ensureSeeded(): void {
  if (isInitialized()) return
  seedPrimaryUnits()
  seedResaleProjects()
  seedResaleUnits()
  seedCarousel()
  setInitialized(true)
}
