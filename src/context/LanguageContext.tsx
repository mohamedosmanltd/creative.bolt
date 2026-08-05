import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import i18n, { setDocumentDir, type Lang } from '@/i18n'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  dir: 'rtl' | 'ltr'
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>((i18n.language as Lang) || 'ar')
  const [dir, setDir] = useState<'rtl' | 'ltr'>(lang === 'ar' ? 'rtl' : 'ltr')

  useEffect(() => {
    setDocumentDir(lang)
    setDir(lang === 'ar' ? 'rtl' : 'ltr')
  }, [lang])

  const setLang = (l: Lang) => {
    i18n.changeLanguage(l)
    setLangState(l)
    localStorage.setItem('cre_lang', l)
  }

  const toggle = () => setLang(lang === 'ar' ? 'en' : 'ar')

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, dir }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
