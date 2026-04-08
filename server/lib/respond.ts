/**
 * Shared response helpers — keeps route handlers concise and response shapes consistent.
 *
 * Every API response is one of three shapes:
 *   { ok: true,  data: T }
 *   { ok: false, error: string, fields?: Record<string, string> }  (validation)
 *   { ok: false, error: string }                                    (server error)
 */

import type { Response } from 'express';

export function ok<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ ok: true, data });
}

export function fail(res: Response, status: number, message: string): void {
  res.status(status).json({ ok: false, error: message });
}

export function validationError(
  res: Response,
  fields: Record<string, string>,
): void {
  res.status(422).json({ ok: false, error: 'Validation failed', fields });
}
