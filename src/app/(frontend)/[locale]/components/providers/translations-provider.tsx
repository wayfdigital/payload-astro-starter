'use client'

import { NextIntlClientProvider } from 'next-intl'
import React from 'react'

interface Props {
  children: React.ReactNode
  locale: string
  messages: Record<string, unknown>
}

export default function TranslationsProvider({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Warsaw">
      {children}
    </NextIntlClientProvider>
  )
}
