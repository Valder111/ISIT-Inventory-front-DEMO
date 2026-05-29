import { isDemoBuild } from '../shared/lib/demoEnv'
import { staticAssetUrl } from '../shared/lib/staticAssetUrl'
import { demoStaticUrlForKey } from './demoPlaceholders'
import { isObjectKey, presignUrl } from './demoStorage'

type WithImg = { img?: string; img_url?: string }
type WithQr = { qr_img?: string; qr_img_url?: string }
type WithUrl = { object_key?: string; url?: string }

export function presignIfKey(key: string | undefined | null): string | undefined {
  if (!key) return undefined
  if (key.startsWith('/static/')) return staticAssetUrl(key)
  if (isObjectKey(key)) {
    if (isDemoBuild()) return staticAssetUrl(demoStaticUrlForKey(key))
    return presignUrl(key)
  }
  return undefined
}

export function hydrateImg<T extends WithImg>(entity: T): T {
  const fromKey = entity.img ? presignIfKey(entity.img) : undefined
  const raw = fromKey ?? entity.img_url
  if (!raw) return entity
  const url = staticAssetUrl(raw)
  return url !== entity.img_url ? { ...entity, img_url: url } : entity
}

export function hydrateImgList<T extends WithImg>(list: T[]): T[] {
  return list.map(hydrateImg)
}

export function hydrateInstance<T extends WithImg & WithQr>(entity: T): T {
  let out = hydrateImg(entity)
  if (entity.qr_img) {
    const qr = presignIfKey(entity.qr_img)
    if (qr) out = { ...out, qr_img_url: qr }
  } else if (entity.qr_img_url) {
    const qr = staticAssetUrl(entity.qr_img_url)
    if (qr !== entity.qr_img_url) out = { ...out, qr_img_url: qr }
  }
  return out
}

export function hydrateDocument<T extends WithUrl>(doc: T): T {
  const fromKey = doc.object_key ? presignIfKey(doc.object_key) : undefined
  const raw = fromKey ?? doc.url
  if (!raw) return doc
  const url = staticAssetUrl(raw)
  return url !== doc.url ? { ...doc, url } : doc
}

export function hydrateDocuments<T extends WithUrl>(docs: T[]): T[] {
  return docs.map(hydrateDocument)
}
