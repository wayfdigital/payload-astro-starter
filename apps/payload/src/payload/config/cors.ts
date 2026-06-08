import { CORSConfig } from 'payload'
import { env } from 'process'

const getCorsOrigins = (): CORSConfig['origins'] => {
  const origins: string[] = []
  const originEnvVars = [
    env.NEXT_PUBLIC_API_ALLOWED_ORIGINS,
    env.NEXT_PUBLIC_DASHBOARD_ALLOWED_ORIGINS,
    env.NEXT_PUBLIC_ADMIN_ALLOWED_ORIGINS,
    env.NEXT_PUBLIC_WEB_ALLOWED_ORIGINS,
  ]

  originEnvVars.forEach(originString => {
    if (originString) {
      origins.push(...originString.split(',').map(o => o.trim()))
    }
  })

  return [...new Set(origins)]
}

export const corsOptions: CORSConfig = {
  origins: getCorsOrigins(),
}
