import { notFound, redirect } from 'next/navigation'
import { savePageAction } from '../../actions'
import { SaveForm } from '@/components/admin/SaveForm'
import { SectionFields } from '@/components/admin/SectionFields'
import { isAdmin } from '@/lib/admin-auth'
import { loadDocument, PAGE_ORDER } from '@/lib/content-store'

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  if (!(await isAdmin())) redirect('/admin')
  const { slug } = await params
  const query = await searchParams
  const label = PAGE_ORDER.find((page) => page.slug === slug)?.label
  if (!label) notFound()
  const page = (await loadDocument()).pages[slug]
  if (!page) notFound()
  return (
    <>
      <h1>{label}</h1>
      {query.saved === '1' ? <p className="saved">Saved.</p> : null}
      <SaveForm action={savePageAction}>
        <input type="hidden" name="slug" value={slug} />
        <label>
          Title
          <input name="heroTitle" defaultValue={page.heroTitle} required />
        </label>
        <label>
          Subtitle
          <input name="heroSubtitle" defaultValue={page.heroSubtitle} />
        </label>
        <label>
          Page name in search
          <input name="seoTitle" defaultValue={page.seoTitle} />
        </label>
        <label>
          Search description
          <textarea name="seoDescription" defaultValue={page.seoDescription} />
        </label>
        <label>
          Photo path
          <input name="image" defaultValue={page.image} />
        </label>
        <label>
          First button label
          <input name="primaryLabel" defaultValue={page.primaryLabel} />
        </label>
        <label>
          First button link
          <input name="primaryHref" defaultValue={page.primaryHref} />
        </label>
        <label>
          Second button label
          <input name="secondaryLabel" defaultValue={page.secondaryLabel} />
        </label>
        <label>
          Second button link
          <input name="secondaryHref" defaultValue={page.secondaryHref} />
        </label>
        <SectionFields initial={page.sections} />
      </SaveForm>
    </>
  )
}
