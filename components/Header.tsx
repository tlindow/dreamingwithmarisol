'use client'

import { Menu, X, Instagram } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_LINKS } from '@/content/site'

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M14.5 3c.4 2.4 1.8 4.1 4.1 4.4v2.4c-1.4 0-2.7-.4-3.9-1.2v6.7c0 3.4-2.6 6.2-6.1 6.2S2.5 18.7 2.5 15.3c0-3.3 2.5-6 5.8-6.2v2.6c-1.8.2-3.2 1.7-3.2 3.6 0 2 1.6 3.6 3.6 3.6s3.5-1.6 3.5-3.6V3h2.3Z" />
    </svg>
  )
}

export function Header({ instagramUrl, tiktokUrl }: { instagramUrl: string; tiktokUrl: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">Dreaming with Marisól</Link>
        <nav className="nav" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a key={link.name} href={link.href} target="_blank" rel="noreferrer">{link.name}</a>
            ) : (
              <Link key={link.name} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
                {link.name}
              </Link>
            ),
          )}
        </nav>
        <div className="socials">
          <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
          <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon /></a>
        </div>
        <button className="menu-button" type="button" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={open ? 'mobile-nav open' : 'mobile-nav'}>
        {NAV_LINKS.map((link) =>
          link.external ? (
            <a key={link.name} href={link.href} target="_blank" rel="noreferrer">{link.name}</a>
          ) : (
            <Link key={link.name} href={link.href} onClick={() => setOpen(false)}>{link.name}</Link>
          ),
        )}
      </div>
    </header>
  )
}
