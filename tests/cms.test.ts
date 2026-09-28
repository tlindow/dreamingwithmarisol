import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { stytchConfigured } from '../lib/admin-auth.ts'
import { authenticateOtp, baseUrlFor, toE164 } from '../lib/stytch.ts'
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

test('phone sign-in checks the number and the code before calling Stytch', async () => {
  assert.equal(toE164('(619) 555-0100'), '+16195550100')
  assert.equal(toE164('16195550100'), '+16195550100')
  assert.throws(() => toE164('555'), /10-digit US phone number/)
  assert.equal(baseUrlFor('project-test-abc'), 'https://test.stytch.com')
  assert.equal(baseUrlFor('project-live-abc'), 'https://api.stytch.com')
  await assert.rejects(() => authenticateOtp('phone-test-id', '12345'), /6-digit code/)

  const previousProject = process.env.STYTCH_PROJECT_ID
  const previousSecret = process.env.STYTCH_SECRET
  process.env.STYTCH_PROJECT_ID = 'project-test-abc'
  process.env.STYTCH_SECRET = 'secret-test'
  try {
    assert.equal(stytchConfigured(), true)
    delete process.env.STYTCH_SECRET
    assert.equal(stytchConfigured(), false)
  } finally {
    if (previousProject === undefined) delete process.env.STYTCH_PROJECT_ID
    else process.env.STYTCH_PROJECT_ID = previousProject
    if (previousSecret === undefined) delete process.env.STYTCH_SECRET
    else process.env.STYTCH_SECRET = previousSecret
  }
})

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
