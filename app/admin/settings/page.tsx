import { redirect } from 'next/navigation'
import { saveSettingsAction } from '../actions'
import { SaveForm } from '@/components/admin/SaveForm'
import { isAdmin } from '@/lib/admin-auth'
import { loadDocument } from '@/lib/content-store'

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  if (!(await isAdmin())) redirect('/admin')
  const query = await searchParams
  const settings = (await loadDocument()).settings
  const events = [0, 1].map((index) => settings.calendlyEvents[index] || { name: '', url: '', priceLabel: '', durationLabel: '' })
  return (
    <>
      <h1>Settings</h1>
      {query.saved === '1' ? <p className="saved">Saved.</p> : null}
      <SaveForm action={saveSettingsAction}>
        <label>
          Contact email
          <input name="contactEmail" type="email" defaultValue={settings.contactEmail} required />
        </label>
        <label>
          Instagram
          <input name="instagramUrl" defaultValue={settings.instagramUrl} />
        </label>
        <label>
          TikTok
          <input name="tiktokUrl" defaultValue={settings.tiktokUrl} />
        </label>
        <label>
          Newsletter
          <input name="substackUrl" defaultValue={settings.substackUrl} />
        </label>
        <label className="check">
          <input type="checkbox" name="showBookingBanner" value="yes" defaultChecked={settings.showBookingBanner} />
          Show the “no availability” message instead of the calendars
        </label>
        <label>
          No-availability message
          <textarea name="bookingBannerText" defaultValue={settings.bookingBannerText} />
        </label>
        {events.map((event, index) => (
          <fieldset key={index}>
            <legend>Session {index + 1}</legend>
            <label>
              Name
              <input name={`event.${index}.name`} defaultValue={event.name} />
            </label>
            <label>
              Calendly link
              <input name={`event.${index}.url`} defaultValue={event.url} />
            </label>
            <label>
              Price
              <input name={`event.${index}.priceLabel`} defaultValue={event.priceLabel} />
            </label>
            <label>
              Short description
              <input name={`event.${index}.durationLabel`} defaultValue={event.durationLabel} />
            </label>
          </fieldset>
        ))}
      </SaveForm>
    </>
  )
}
