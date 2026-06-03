import React from 'react'
import { Header, Footer } from '@/theme'

interface WebsiteLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

const WebsiteLayout = ({ children }: WebsiteLayoutProps) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Header logo={<span className="text-lg font-bold">Website Starter</span>} />
      <div className="flex-1">{children}</div>
      <Footer copyright="© 2026 Website Starter. Built with Payload CMS." />
    </main>
  )
}

export default WebsiteLayout
