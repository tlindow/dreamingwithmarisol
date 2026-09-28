import { notFound, redirect } from 'next/navigation'
import { saveProductAction } from '../../actions'
import { SaveForm } from '@/components/admin/SaveForm'
import { isAdmin } from '@/lib/admin-auth'
import { loadDocument } from '@/lib/content-store'

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  if (!(await isAdmin())) redirect('/admin')
  const { slug } = await params
  const query = await searchParams
  const product = (await loadDocument()).products.find((item) => item.slug === slug)
  if (!product) notFound()
  return (
    <>
      <h1>{product.title}</h1>
      {query.saved === '1' ? <p className="saved">Saved.</p> : null}
      <SaveForm action={saveProductAction}>
        <input type="hidden" name="slug" value={slug} />
        <label>
          Title
          <input name="title" defaultValue={product.title} required />
        </label>
        <label>
          Description
          <textarea name="description" defaultValue={product.description} required />
        </label>
        <label>
          Listed price (dollars)
          <input name="price" defaultValue={(product.amountCents / 100).toFixed(2)} inputMode="decimal" required />
        </label>
        <p className="hint">This is the price shown on the site. Checkout charges the Stripe price ID below.</p>
        <label>
          Status
          <select name="status" defaultValue={product.status}>
            <option value="available">Available</option>
            <option value="coming-soon">Coming soon</option>
          </select>
        </label>
        <label>
          Stripe price ID
          <input name="stripePriceId" defaultValue={product.stripePriceId || ''} placeholder="price_..." />
        </label>
        <label>
          Photo path
          <input name="image" defaultValue={product.image} />
        </label>
        <label>
          Private file path
          <input name="blobPath" defaultValue={product.blobPath || ''} placeholder="products/file.pdf" />
        </label>
        <label>
          Upload file
          <input type="file" name="file" />
        </label>
        <p className="hint">
          {product.fileUrl ? `A local file is attached (${product.fileUrl}). ` : ''}
          Uploading replaces the file. Large files need BLOB_READ_WRITE_TOKEN.
        </p>
        <label>
          Note after purchase
          <textarea name="postPurchaseMessage" defaultValue={product.postPurchaseMessage || ''} />
        </label>
      </SaveForm>
    </>
  )
}
