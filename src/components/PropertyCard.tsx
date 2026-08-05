import { Link } from 'react-router-dom'
import { Bed, Bath, Maximize, MapPin } from 'lucide-react'
import type { PrimaryUnit, ResaleUnit } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { formatPrice } from '@/lib/helpers'
import StatusBadge from './StatusBadge'

interface Props {
  unit: PrimaryUnit | ResaleUnit
  to: string
}

export default function PropertyCard({ unit, to }: Props) {
  const { lang } = useLanguage()
  const title = lang === 'ar' ? unit.title_ar : unit.title_en
  const desc = lang === 'ar' ? unit.description_ar : unit.description_en
  const location = 'location_ar' in unit ? (lang === 'ar' ? unit.location_ar : unit.location_en) : ''
  const img = unit.image_urls?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'

  return (
    <Link
      to={to}
      className="group block bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-3 ltr:right-3 rtl:left-3">
          <StatusBadge status={unit.status} />
        </div>
        {unit.image_urls && unit.image_urls.length > 1 && (
          <div className="absolute bottom-3 ltr:right-3 rtl:left-3 px-2 py-1 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-sm">
            {unit.image_urls.length} {lang === 'ar' ? 'صورة' : 'photos'}
          </div>
        )}
      </div>

      <div className="p-4 lg:p-5">
        <h3 className="font-bold text-neutral-900 text-base lg:text-lg line-clamp-2 group-hover:text-primary-700 transition-colors">
          {title}
        </h3>
        {location && (
          <div className="flex items-center gap-1.5 mt-1.5 text-neutral-500 text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}
        {desc && <p className="text-sm text-neutral-600 mt-2 line-clamp-2">{desc}</p>}

        <div className="flex items-center gap-3 mt-3 text-neutral-600 text-xs">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-primary-500" /> {unit.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-primary-500" /> {unit.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-4 h-4 text-primary-500" /> {unit.area_m2} {lang === 'ar' ? 'م²' : 'sqm'}
          </span>
        </div>

        <div className="flex items-end justify-between mt-4 pt-3 border-t border-neutral-100">
          <div>
            <div className="text-[11px] text-neutral-500">{lang === 'ar' ? 'ابتداءً من' : 'From'}</div>
            <div className="font-bold text-primary-700 text-base lg:text-lg">
              {formatPrice(unit.price_eur, 'eur')}
            </div>
            <div className="text-xs text-neutral-500">{formatPrice(unit.price_egp, 'egp')}</div>
          </div>
          <span className="text-xs font-medium text-primary-600 group-hover:underline">
            {lang === 'ar' ? 'التفاصيل ←' : 'Details →'}
          </span>
        </div>
      </div>
    </Link>
  )
}
