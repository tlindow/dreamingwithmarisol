import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Birthday',
  robots: { index: false, follow: false },
}

const plan = [
  { time: 'Morning', title: 'Brunch at Madi’s' },
  { time: 'Midday', title: 'Thrift stores & boutiques', detail: 'Northpark' },
  { time: 'Afternoon', title: 'Free time' },
  { time: 'Evening', title: 'Dinner at Mokkoji', detail: '6:15 PM' },
]

export default function BirthdayPage() {
  return (
    <article className="wrap section prose">
      <h1>Marisól’s birthday</h1>
      <p>A private note. This page is not linked from the rest of the site.</p>
      <ul>
        {plan.map((item) => (
          <li key={item.title}>
            <strong>{item.time}:</strong> {item.title}
            {item.detail ? ` — ${item.detail}` : ''}
          </li>
        ))}
      </ul>
    </article>
  )
}
