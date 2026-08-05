import { Link } from 'react-router-dom'
import { MapPin, Building, CalendarDays, ArrowRight, ArrowLeft } from 'lucide-react'
import type { ResaleProject } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import StatusBadge from './StatusBadge'

interface Props {
  project: ResaleProject
}

export default function ProjectCard({ project }: Props) {
  const { lang, dir } = useLanguage()
  const name = lang === 'ar' ? project.name_ar : project.name_en
  const developer = lang === 'ar' ? project.developer_ar : project.developer_en
  const location = lang === 'ar' ? project.location_ar : project.location_en
  const desc = lang === 'ar' ? project.description_ar : project.description_en
  const img = project.image_urls?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <Link
      to={`/resale/${project.id}`}
      className="group block bg-white rounded-2xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 ltr:right-3 rtl:left-3">
          <StatusBadge status={project.status} />
        </div>
        <div className="absolute bottom-3 ltr:left-3 rtl:right-3 text-white">
          <h3 className="font-bold text-lg lg:text-xl drop-shadow">{name}</h3>
          {developer && (
            <div className="flex items-center gap-1.5 text-xs text-white/90 mt-0.5">
              <Building className="w-3.5 h-3.5" /> {developer}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 lg:p-5">
        <p className="text-sm text-neutral-600 line-clamp-2 min-h-[2.5rem]">{desc}</p>

        <div className="flex flex-wrap gap-3 mt-3 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="line-clamp-1 max-w-[160px]">{location}</span>
          </span>
          {project.delivery_date && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-primary-500" /> {project.delivery_date}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
          <span className="text-xs text-neutral-500">
            {project.total_units} {lang === 'ar' ? 'وحدة' : 'units'}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all">
            {lang === 'ar' ? 'عرض المشروع' : 'View Project'}
            <Arrow className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
