import { NextResponse } from 'next/server'
import { getProduct } from '@/lib/catalog'
import { privateDownloadRedirect, streamSanityFile } from '@/lib/files'
import { authorizeDownload } from '@/lib/fulfillment'
import { getDeliveryStore, downloadSecret } from '@/lib/orders'

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
    const file = await streamSanityFile(product.fileUrl)
    if (file.tooLarge) {
      return NextResponse.json(
        { error: 'This file is too large to stream. Attach a private Vercel Blob path in the studio.' },
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
