import { redirect } from 'next/navigation'
import { saveHomeAction } from '../actions'
import { SaveForm } from '@/components/admin/SaveForm'
import { isAdmin } from '@/lib/admin-auth'
import { loadDocument } from '@/lib/content-store'

export default async function EditHomePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  if (!(await isAdmin())) redirect('/admin')
  const query = await searchParams
  const home = (await loadDocument()).home
  return (
    <>
      <h1>Home</h1>
      {query.saved === '1' ? <p className="saved">Saved.</p> : null}
      <SaveForm action={saveHomeAction}>
        <label>
          Search description
          <textarea name="seoDescription" defaultValue={home.seoDescription} />
        </label>
        <label>
          Title
          <input name="heroTitle" defaultValue={home.heroTitle} required />
        </label>
        <label>
          Intro
          <textarea name="heroSubtitle" defaultValue={home.heroSubtitle} />
        </label>
        <label>
          Photo path
          <input name="heroImage" defaultValue={home.heroImage} />
        </label>
        <label>
          Quote
          <textarea name="quote" defaultValue={home.quote} required />
        </label>
        <label>
          Limpias title
          <input name="limpiasTitle" defaultValue={home.limpiasTitle} />
        </label>
        <label>
          Limpias text
          <textarea name="limpiasSubtitle" defaultValue={home.limpiasSubtitle} />
        </label>
        <label>
          Limpias photo path
          <input name="limpiasImage" defaultValue={home.limpiasImage} />
        </label>
      </SaveForm>
    </>
  )
}
