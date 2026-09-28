import { CalendlyEmbed } from '@/components/CalendlyEmbed'
import { BOOKING_BANNER, CANCELLATION_POLICY } from '@/content/site'
import { checkAvailability } from '@/lib/calendly'
import { getSettings } from '@/lib/catalog'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata(
  'Book your session',
  'Book a 1 hour limpia ($100) or a 30 minute limpia ($45). Payment stays inside Calendly.',
)

export default async function BookPage() {
  const settings = await getSettings()
  const checks = await Promise.all(settings.calendlyEvents.map((event) => checkAvailability(event.url)))
  const decided = checks.filter((check) => check.available !== null)
  const knownClosed = decided.length > 0 && decided.every((check) => check.available === false)
  const showClosed = settings.showBookingBanner || knownClosed
  const banner = settings.bookingBannerText || BOOKING_BANNER

  return (
    <article className="wrap section">
      <h1>Book your session</h1>
      <p className="lede">
        There are two types of limpia sessions available: a 1 hour private limpia ceremony with a full plática ($100), and a 30 minute private limpia session ($45).
      </p>
      {showClosed ? (
        <div className="note">
          <p>{banner}</p>
          <a className="btn btn-primary" href={settings.substackUrl}>Keep me updated</a>
        </div>
      ) : (
        settings.calendlyEvents.map((event) => (
          <section key={event.url}>
            <h2 className="event-label">{event.name}</h2>
            <p className="price">{event.durationLabel} · {event.priceLabel}</p>
            <CalendlyEmbed url={event.url} title={event.name} />
          </section>
        ))
      )}
      <section className="prose">
        <h2>Cancellation and Refund Policy</h2>
        <p>{CANCELLATION_POLICY}</p>
        <p>Calendly collects the session payment through its own Stripe connection. This page does not charge a second time.</p>
      </section>
    </article>
  )
}
