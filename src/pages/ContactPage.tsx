import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/context/LanguageContext'
import { Phone, Mail, MapPin, Send, CircleCheck as CheckCircle2, Loader as Loader2, Clock } from 'lucide-react'
import { saveInquiry } from '@/lib/storage'

export default function ContactPage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      saveInquiry({ ...form, unit_type: 'primary', unit_id: '' })
      setStatus('sent')
      setForm({ name: '', phone: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
    }
  }

  const contacts = [
    { icon: Phone, label: t('contact.phone'), value: '+20111164118', href: 'tel:+20111164118' },
    { icon: Mail, label: t('contact.email'), value: 'info@creative-realestate.com', href: 'mailto:info@creative-realestate.com' },
    { icon: MapPin, label: t('contact.addresss'), value: t('contact.address'), href: '#' },
    { icon: Clock, label: lang === 'ar' ? 'ساعات العمل' : 'Working Hours', value: lang === 'ar' ? 'السبت - الخميس: 9ص - 6م' : 'Sat - Thu: 9AM - 6PM', href: '#' },
  ]

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm'

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 text-white py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-3">{t('contact.title')}</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-6">
                {lang === 'ar' ? 'معلومات التواصل' : 'Get in touch'}
              </h2>
              <div className="space-y-4">
                {contacts.map((c, i) => {
                  const Icon = c.icon
                  return (
                    <a
                      key={i}
                      href={c.href}
                      className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white group-hover:bg-primary-600 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
                        <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm text-neutral-500">{c.label}</div>
                        <div className="font-semibold text-neutral-900 mt-0.5" dir="ltr">{c.value}</div>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Map */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-neutral-100 aspect-video bg-neutral-100">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=31.45%2C30.0%2C31.55%2C30.05&layer=mapnik"
                  className="w-full h-full"
                  title="Location map"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="bg-white rounded-2xl border border-neutral-100 p-6 lg:p-8 card-shadow">
                <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-6">
                  {lang === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}
                </h2>

                {status === 'sent' ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-success-500/15 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-success-600" />
                    </div>
                    <p className="text-base text-neutral-800 font-semibold mb-1">{t('contact.sent')}</p>
                    <p className="text-sm text-neutral-500">{lang === 'ar' ? 'سنتواصل معك في أقرب وقت' : 'We will get back to you soon'}</p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {t('contact.formName')} *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          {t('contact.formPhone')} *
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                          {t('contact.formEmail')}
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {t('contact.formMessage')}
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        className={inputClass}
                      />
                    </div>
                    {status === 'error' && (
                      <p className="text-sm text-error-600">
                        {lang === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill required fields'}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {t('contact.formSend')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
