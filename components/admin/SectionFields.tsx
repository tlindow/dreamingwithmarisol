'use client'

import { useState } from 'react'
import type { EditableSection } from '@/lib/content-store'

const empty: EditableSection = { heading: '', body: '', imageSrc: '', imageAlt: '', imageCaption: '' }

export function SectionFields({ initial }: { initial: EditableSection[] }) {
  const [sections, setSections] = useState(initial.length ? initial : [empty])

  function update(index: number, patch: Partial<EditableSection>) {
    setSections(sections.map((section, item) => (item === index ? { ...section, ...patch } : section)))
  }

  return (
    <div className="sections">
      {sections.map((section, index) => (
        <fieldset key={index}>
          <legend>Section {index + 1}</legend>
          <label>
            Heading
            <input
              name={`section.${index}.heading`}
              value={section.heading}
              onChange={(event) => update(index, { heading: event.target.value })}
            />
          </label>
          <label>
            Text
            <textarea
              name={`section.${index}.body`}
              value={section.body}
              onChange={(event) => update(index, { body: event.target.value })}
            />
          </label>
          <p className="hint">Separate paragraphs with a blank line. Leave the heading blank for an introduction.</p>
          <label>
            Image path
            <input
              name={`section.${index}.imageSrc`}
              value={section.imageSrc}
              onChange={(event) => update(index, { imageSrc: event.target.value })}
              placeholder="/gallery/example.webp"
            />
          </label>
          <label>
            Image description
            <input
              name={`section.${index}.imageAlt`}
              value={section.imageAlt}
              onChange={(event) => update(index, { imageAlt: event.target.value })}
            />
          </label>
          <label>
            Image caption
            <input
              name={`section.${index}.imageCaption`}
              value={section.imageCaption}
              onChange={(event) => update(index, { imageCaption: event.target.value })}
            />
          </label>
          {sections.length > 1 ? (
            <button type="button" className="btn" onClick={() => setSections(sections.filter((_, item) => item !== index))}>
              Remove section
            </button>
          ) : null}
        </fieldset>
      ))}
      <button type="button" className="btn" onClick={() => setSections([...sections, empty])}>
        Add section
      </button>
    </div>
  )
}
