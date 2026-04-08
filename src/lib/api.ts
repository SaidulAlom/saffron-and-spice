/**
 * src/lib/api.ts — shared fetch helper for all backend API calls.
 *
 * Handles:
 *  - CSRF token fetching (lazy, cached per page load)
 *  - Attaching x-csrf-token header to every POST
 *  - Consistent error shape from the server
 */

export type ApiOk<T> = { ok: true; data: T };
export type ApiError = { ok: false; error: string; fields?: Record<string, string> };
export type ApiResult<T> = ApiOk<T> | ApiError;

export function isApiError<T>(result: ApiResult<T>): result is ApiError {
  return result.ok === false;
}

// ── CSRF token cache ───────────────────────────────────────────────────────

let _csrfToken: string | null = null;
let _csrfPromise: Promise<string> | null = null;

async function getCsrfToken(): Promise<string> {
  if (_csrfToken) return _csrfToken;
  if (_csrfPromise) return _csrfPromise;

  _csrfPromise = fetch('/api/csrf-token', { credentials: 'include' })
    .then((r) => r.json() as Promise<ApiOk<{ token: string }>>)
    .then((data) => {
      _csrfToken = data.data.token;
      _csrfPromise = null;
      return _csrfToken!;
    });

  return _csrfPromise;
}

// ── Core request helper ────────────────────────────────────────────────────

export async function post<T>(
  path: string,
  body: unknown,
): Promise<ApiResult<T>> {
  let csrfToken: string;
  try {
    csrfToken = await getCsrfToken();
  } catch {
    return { ok: false, error: 'Unable to reach the server. Please check your connection.' };
  }

  let res: Response;
  try {
    res = await fetch(path, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: 'Network error. Please check your connection.' };
  }

  // On 403 the CSRF token may have rotated — clear cache so next call re-fetches
  if (res.status === 403) {
    _csrfToken = null;
  }

  try {
    const data = (await res.json()) as ApiResult<T>;
    return data;
  } catch {
    return { ok: false, error: 'Unexpected response from server.' };
  }
}
