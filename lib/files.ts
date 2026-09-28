import { issueSignedToken, presignUrl } from '@vercel/blob'

const STREAM_LIMIT = 20 * 1024 * 1024

export async function privateDownloadRedirect(blobPath: string) {
  const validUntil = Date.now() + 5 * 60 * 1000
  const signed = await issueSignedToken({
    pathname: blobPath,
    operations: ['get'],
    validUntil,
  })
  const { presignedUrl } = await presignUrl(signed, {
    access: 'private',
    operation: 'get',
    pathname: blobPath,
    validUntil,
  })
  return presignedUrl
}

export async function streamRemoteFile(fileUrl: string) {
  const head = await fetch(fileUrl, { method: 'HEAD' })
  const length = Number(head.headers.get('content-length') || 0)
  if (length > STREAM_LIMIT) {
    return { tooLarge: true as const }
  }
  const file = await fetch(fileUrl)
  if (!file.ok || !file.body) return { tooLarge: false as const, missing: true as const }
  return {
    tooLarge: false as const,
    missing: false as const,
    body: file.body,
    contentType: file.headers.get('content-type') || 'application/pdf',
  }
}
