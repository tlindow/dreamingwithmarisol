import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { isAllowedEmail, loginDecision, userMayEdit } from '../lib/admin-auth.ts'
import {
  defaultDocument,
  dollarsToCents,
  loadDocument,
  mergeDocument,
  paragraphsFromBody,
  safeHref,
  saveDocument,
  toPageCopy,
} from '../lib/content-store.ts'

test('only listed emails can ask Stytch for a login link', () => {
  const previousEmails = process.env.ADMIN_EMAILS
  const previousProject = process.env.STYTCH_PROJECT_ID
  const previousSecret = process.env.STYTCH_SECRET
  process.env.ADMIN_EMAILS = 'Owner@Example.com, second@example.com'
  process.env.STYTCH_PROJECT_ID = 'project-test'
  process.env.STYTCH_SECRET = 'secret-test'
  try {
    assert.equal(isAllowedEmail('owner@example.com'), true)
    assert.equal(isAllowedEmail('second@example.com'), true)
    assert.equal(isAllowedEmail('other@example.com'), false)
    assert.equal(loginDecision('other@example.com'), 'denied')
    assert.equal(loginDecision('not-an-email'), 'email')
    assert.equal(loginDecision('owner@example.com'), 'send')
    assert.equal(userMayEdit([{ email: 'owner@example.com', verified: true }]), true)
    assert.equal(userMayEdit([{ email: 'owner@example.com', verified: false }]), false)
    assert.equal(userMayEdit([{ email: 'other@example.com', verified: true }]), false)
  } finally {
    restore('ADMIN_EMAILS', previousEmails)
    restore('STYTCH_PROJECT_ID', previousProject)
    restore('STYTCH_SECRET', previousSecret)
  }
})

function restore(name: 'ADMIN_EMAILS' | 'STYTCH_PROJECT_ID' | 'STYTCH_SECRET', value: string | undefined) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}

test('saved copy overrides a page and keeps the other pages', () => {
  const base = defaultDocument()
  const merged = mergeDocument(base, {
    pages: {
      about: {
        heroTitle: 'Hello from the editor',
        sections: [{ heading: 'Note', body: 'First paragraph.\n\nSecond paragraph.' }],
      },
    },
    products: [{ slug: 'a-book-of-prayers', amountCents: 500, status: 'available', title: 'A Book of Prayers' }],
  })
  assert.equal(merged.pages.about.heroTitle, 'Hello from the editor')
  assert.equal(merged.pages.values.heroTitle, base.pages.values.heroTitle)
  assert.equal(merged.products.find((product) => product.slug === 'enter-the-cosmic-ocean')?.status, 'coming-soon')
  const page = toPageCopy('about', merged.pages.about)
  assert.equal(page?.heroTitle, 'Hello from the editor')
  assert.deepEqual(page?.sections[0]?.paragraphs, ['First paragraph.', 'Second paragraph.'])
  assert.deepEqual(paragraphsFromBody('One\n\n\nTwo'), ['One', 'Two'])
})

test('price and link checks', () => {
  assert.equal(dollarsToCents('5.00'), 500)
  assert.equal(dollarsToCents('$9'), 900)
  assert.equal(dollarsToCents('5.555'), null)
  assert.equal(dollarsToCents('-1'), null)
  assert.equal(safeHref('/book-your-session'), '/book-your-session')
  assert.equal(safeHref('https://example.com/form'), 'https://example.com/form')
  assert.equal(safeHref('javascript:alert(1)'), null)
  assert.equal(safeHref('//evil.example'), null)
})

test('a file save round-trips without touching other storage', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'cms-'))
  const previous = process.env.CONTENT_FILE
  process.env.CONTENT_FILE = path.join(dir, 'content.json')
  try {
    const document = defaultDocument()
    document.home.heroTitle = 'Saved title'
    const saved = await saveDocument(document)
    assert.equal(saved.ok, true)
    const raw = JSON.parse(await readFile(process.env.CONTENT_FILE, 'utf8')) as { home: { heroTitle: string } }
    assert.equal(raw.home.heroTitle, 'Saved title')
    const loaded = await loadDocument()
    assert.equal(loaded.home.heroTitle, 'Saved title')
    assert.equal(loaded.pages.about.heroTitle, document.pages.about.heroTitle)
  } finally {
    if (previous === undefined) delete process.env.CONTENT_FILE
    else process.env.CONTENT_FILE = previous
    await rm(dir, { recursive: true, force: true })
  }
})
