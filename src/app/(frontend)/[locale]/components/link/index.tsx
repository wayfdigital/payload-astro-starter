import { Link } from '@/i18n/navigation'
import React from 'react'

type CMSLinkType = {
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: { slug?: string } | string | number
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const { type, children, className, label, newTab, reference, url } = props

  const href =
    type === 'reference' &&
    typeof reference?.value === 'object' &&
    'slug' in reference.value &&
    typeof reference.value.slug === 'string'
      ? `/${reference.value.slug}`
      : url

  if (!href) return null

  const newTabProps = newTab
    ? { rel: 'noopener noreferrer', target: '_blank' as const }
    : {}

  return (
    <Link className={className} href={href || url || ''} {...newTabProps}>
      {label && label}
      {children && children}
    </Link>
  )
}
