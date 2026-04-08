/**
 * Shared response helpers — keeps route handlers concise and response shapes consistent.
 *
 * Every API response is one of three shapes:
 *   { ok: true,  data: T }
 *   { ok: false, error: string, fields?: Record<string, string> }  (validation)
 *   { ok: false, error: string }                                    (server error)
 */
export function ok(res, data, status = 200) {
    res.status(status).json({ ok: true, data });
}
export function fail(res, status, message) {
    res.status(status).json({ ok: false, error: message });
}
export function validationError(res, fields) {
    res.status(422).json({ ok: false, error: 'Validation failed', fields });
}
