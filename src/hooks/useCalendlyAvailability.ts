import { useReducer, useEffect } from 'react';

type AvailabilityStatus =
  | 'loading'
  | 'available'
  | 'unavailable'
  | 'no_token'
  | 'error'
  | 'no_url';

interface AvailabilityState {
  status: AvailabilityStatus;
  slots: number | null;
  url: string | null;
}

type Action =
  | { type: 'reset'; url: string | null }
  | { type: 'resolved'; status: AvailabilityStatus; slots: number | null };

function reducer(_state: AvailabilityState, action: Action): AvailabilityState {
  switch (action.type) {
    case 'reset':
      return { status: action.url ? 'loading' : 'no_url', slots: null, url: action.url };
    case 'resolved':
      return { ..._state, status: action.status, slots: action.slots };
  }
}

/**
 * Checks Calendly event-type availability via the dev-server proxy.
 *
 * Resolved states:
 *  - available   → API confirmed open slots exist
 *  - unavailable → API confirmed zero open slots
 *  - no_token    → server has no CALENDLY_API_TOKEN
 *  - error       → transient API / network failure (show booking as safe default)
 *  - no_url      → no calendlyUrl provided (CMS hasn't set one)
 */
export function useCalendlyAvailability(
  calendlyUrl: string | null,
): Pick<AvailabilityState, 'status' | 'slots'> {
  const [state, dispatch] = useReducer(reducer, {
    status: calendlyUrl ? 'loading' : 'no_url',
    slots: null,
    url: calendlyUrl,
  });

  if (state.url !== calendlyUrl) {
    dispatch({ type: 'reset', url: calendlyUrl });
  }

  useEffect(() => {
    if (!calendlyUrl) return;

    let cancelled = false;

    fetch(`/api/check-availability?calendlyUrl=${encodeURIComponent(calendlyUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error === 'no_token') {
          dispatch({ type: 'resolved', status: 'no_token', slots: null });
        } else if (data.error) {
          dispatch({ type: 'resolved', status: 'error', slots: null });
        } else {
          dispatch({
            type: 'resolved',
            status: data.available ? 'available' : 'unavailable',
            slots: data.slots ?? null,
          });
        }
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'resolved', status: 'error', slots: null });
      });

    return () => { cancelled = true; };
  }, [calendlyUrl]);

  return { status: state.status, slots: state.slots };
}
