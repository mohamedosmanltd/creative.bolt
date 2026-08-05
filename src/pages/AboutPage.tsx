import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { ShieldCheck, Award, Lightbulb, Target, Eye, Heart } from 'lucide-react'

export default function AboutPage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()

  const values = [
    { icon: ShieldCheck, title: t('about.v1Title'), desc: t('about.v1Desc') },
    { icon: Award, title: t('about.v2Title'), desc: t('about.v2Desc') },
    { icon: Lightbulb, title: t('about.v3Title'), desc: t('about.v3Desc') },
  ]

  const pillars = [
    { icon: Target, title: lang === 'ar' ? 'رسالتنا' : 'Our Mission', desc: lang === 'ar' ? 'تسهيل رحلة الشراء العقاري بتقديم خدمة احترافية وشفافة لكل عميل.' : 'Make the real estate buying journey easier with professional and transparent service for every client.' },
    { icon: Eye, title: lang === 'ar' ? 'رؤيتنا' : 'Our Vision', desc: lang === 'ar' ? 'أن نكون الشركة العقارية الرائدة في مصر بتقديم تجربة استثنائية لعملائنا.' : 'To be the leading real estate company in Egypt by providing an exceptional experience to our clients.' },
    { icon: Heart, title: lang === 'ar' ? 'قيمنا' : 'Our Values', desc: lang === 'ar' ? 'النزاهة، التميز، والابتكار في كل ما نقدمه لعملائنا.' : 'Integrity, excellence, and innovation in everything we offer our clients.' },
  ]

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 text-white py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('about.title')}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                {lang === 'ar' ? 'قصتنا' : 'Our Story'}
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mt-2 mb-4">
                {lang === 'ar' ? 'رواد العقارات في مصر' : 'Real estate leaders in Egypt'}
              </h2>
              <p className="text-neutral-700 leading-relaxed mb-4">{t('about.p1')}</p>
              <p className="text-neutral-700 leading-relaxed">{t('about.p2')}</p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt={t('about.title')}
                className="rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-5 ltr:-left-5 rtl:-right-5 bg-white rounded-2xl p-5 shadow-xl border border-neutral-100">
                <div className="text-3xl font-bold text-primary-700">10+</div>
                <div className="text-sm text-neutral-500">{t('home.statsYears')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-14 lg:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-6 lg:p-8 card-shadow text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              {lang === 'ar' ? 'ما نؤمن به' : 'What we believe'}
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mt-2">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50/30 border border-primary-100/50">
                  <Icon className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-bold text-neutral-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
