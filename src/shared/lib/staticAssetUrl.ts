/** Публичные файлы из /static/… с учётом Vite base (GitHub Pages subpath). */
export function staticAssetUrl(path: string): string {
  if (!path) return path
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '')
  if (base && base !== '/' && path.startsWith(`${base}/`)) {
    return path
  }

  if (path.startsWith('/static/')) {
    return `${base}${path}`
  }

  return path
}
