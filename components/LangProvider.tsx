'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Lang, Translations, translations } from '@/lib/i18n'

interface LangContextType {
  lang: Lang
  t: Translations
  toggle: () => void
}

const LangContext = createContext<LangContextType>({
  lang: 'fr',
  t: translations.fr,
  toggle: () => {},
})

export function useLang() {
  return useContext(LangContext)
}

export default function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('tokenlab_lang') as Lang | null
    if (saved === 'en' || saved === 'fr') setLang(saved)
  }, [])

  function toggle() {
    const next = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    localStorage.setItem('tokenlab_lang', next)
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LangContext.Provider>
  )
}
