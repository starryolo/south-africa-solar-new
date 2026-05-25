"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Language, Currency } from "./i18n"

interface AppContextType {
  language: Language
  setLanguage: (lang: Language) => void
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")
  const [currency, setCurrency] = useState<Currency>("CNY")

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

