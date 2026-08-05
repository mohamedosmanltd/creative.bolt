import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { getActiveCarouselSlides } from '@/lib/storage'
import type { CarouselSlide } from '@/types'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react'

export default function HeroCarousel() {
  const { t } = useTranslation()
  const { lang, dir } = useLanguage()
  const [slides, setSlides] = useState<CarouselSlide[]>([])

  useEffect(() => {
    setSlides(getActiveCarouselSlides())
    const handler = () => setSlides(getActiveCarouselSlides())
    window.addEventListener('cre-data-changed', handler)
    return () => window.removeEventListener('cre-data-changed', handler)
  }, [])

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  if (slides.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[480px] bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">{t('home.heroTitle')}</h1>
          <p className="text-lg text-white/90 mb-8">{t('home.heroSubtitle')}</p>
          <Link
            to="/primary"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            {t('home.heroCta')} <Arrow className="w-5 h-5" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, Navigation]}
        slidesPerView={1}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={slides.length > 1}
        pagination={{ clickable: true }}
        navigation
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <img
                src={slide.image_url}
                alt={lang === 'ar' ? slide.title_ar : slide.title_en}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 hero-overlay" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl text-white animate-slide-up">
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                      {lang === 'ar' ? slide.title_ar : slide.title_en}
                    </h1>
                    <p className="mt-4 text-lg lg:text-xl text-white/90 drop-shadow">
                      {lang === 'ar' ? slide.subtitle_ar : slide.subtitle_en}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        to={slide.link_url || '/primary'}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                      >
                        {t('home.heroCta')}
                        <Arrow className="w-5 h-5" />
                      </Link>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
                      >
                        {t('common.contactUs')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 animate-bounce">
        <ChevronDown className="w-7 h-7" />
      </div>
    </section>
  )
}
