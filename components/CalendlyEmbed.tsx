'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void
    }
  }
}

function branded(url: string) {
  const params = 'hide_gdpr_banner=1&hide_event_type_details=1&background_color=f2f7f5&text_color=304515&primary_color=304515'
  return url.includes('?') ? `${url}&${params}` : `${url}?${params}`
}

export function CalendlyEmbed({ url, title }: { url: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parent = ref.current
    const widgetUrl = branded(url)
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return
      const data = event.data as { event?: string } | undefined
      if (data?.event !== 'calendly.event_scheduled') return
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'calendly_event_scheduled', calendly_url: url })
    }
    window.addEventListener('message', onMessage)

    function init() {
      if (!parent || !window.Calendly) return
      parent.innerHTML = ''
      window.Calendly.initInlineWidget({ url: widgetUrl, parentElement: parent })
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-calendly]')
    if (window.Calendly) {
      init()
    } else if (existing) {
      existing.addEventListener('load', init)
    } else {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.dataset.calendly = 'true'
      script.onload = init
      document.body.appendChild(script)
    }
    return () => window.removeEventListener('message', onMessage)
  }, [url])

  return <div ref={ref} className="calendly" title={title} />
}
