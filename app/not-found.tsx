import Link from 'next/link'

export default function NotFound() {
  return (
    <article className="wrap section">
      <h1>That page is not here</h1>
      <p><Link href="/">Go home</Link></p>
    </article>
  )
}
