import { LocalProject } from './types'

export function encodeShareToken(lp: LocalProject): string {
  const json = JSON.stringify(lp)
  const b64 = btoa(unescape(encodeURIComponent(json)))
  // URL-safe base64
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShareToken(token: string): LocalProject | null {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json) as LocalProject
  } catch {
    return null
  }
}
