import { createReadStream } from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'
import { getProduct } from '@/lib/catalog'
import { privateDownloadRedirect, streamRemoteFile } from '@/lib/files'
import { authorizeDownload } from '@/lib/fulfillment'
import { getDeliveryStore, downloadSecret } from '@/lib/orders'

function localPrivateFile(fileUrl: string) {
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return null
  const root = path.resolve(process.cwd(), 'private-files')
  const target = path.resolve(process.cwd(), fileUrl)
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return null
  return target
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params
  let secret: string
  try {
    secret = downloadSecret()
  } catch {
    return NextResponse.json({ error: 'Downloads are not configured.' }, { status: 500 })
  }

  const decision = await authorizeDownload(token, secret, getDeliveryStore())
  if (!decision.ok) {
    return NextResponse.json({ error: 'This download link is not valid.' }, { status: 403 })
  }

  const product = await getProduct(decision.payload.productSlug)
  if (!product) return NextResponse.json({ error: 'Product missing.' }, { status: 404 })

  if (product.blobPath && process.env.BLOB_READ_WRITE_TOKEN) {
    const url = await privateDownloadRedirect(product.blobPath)
    return NextResponse.redirect(url)
  }

  if (product.fileUrl) {
    const local = localPrivateFile(product.fileUrl)
    if (local) {
      try {
        const stat = await fs.stat(local)
        if (stat.size > 20 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'This file is too large to stream. Attach a private Blob path in Content.' },
            { status: 409 },
          )
        }
        const body = Readable.toWeb(createReadStream(local)) as ReadableStream
        return new NextResponse(body, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${product.slug}.pdf"`,
          },
        })
      } catch {
        return NextResponse.json({ error: 'File missing.' }, { status: 404 })
      }
    }
    const file = await streamRemoteFile(product.fileUrl)
    if (file.tooLarge) {
      return NextResponse.json(
        { error: 'This file is too large to stream. Attach a private Blob path in Content.' },
        { status: 409 },
      )
    }
    if (file.missing) return NextResponse.json({ error: 'File missing.' }, { status: 404 })
    return new NextResponse(file.body, {
      headers: {
        'Content-Type': file.contentType,
        'Content-Disposition': `attachment; filename="${product.slug}.pdf"`,
      },
    })
  }

  return NextResponse.json({ error: 'No file is attached to this product yet.' }, { status: 404 })
}
