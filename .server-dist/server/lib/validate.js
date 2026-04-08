/**
 * Reusable input validators — no external lib needed.
 * Returns human-readable error strings, or undefined when valid.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+?[\d\s\-]{8,15}$/;
export const PINCODE_RE = /^\d{6}$/;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** Non-empty string */
export function required(value, label) {
    if (typeof value !== 'string' || !value.trim())
        return `${label} is required`;
    return undefined;
}
export function email(value) {
    const e = required(value, 'Email');
    if (e)
        return e;
    if (!EMAIL_RE.test(String(value).trim()))
        return 'Invalid email address';
    return undefined;
}
export function phone(value, optional = false) {
    if (optional && (value === undefined || value === null || value === ''))
        return undefined;
    const e = required(value, 'Phone');
    if (e)
        return e;
    if (!PHONE_RE.test(String(value).trim()))
        return 'Invalid phone number';
    return undefined;
}
export function pincode(value) {
    const e = required(value, 'Pincode');
    if (e)
        return e;
    if (!PINCODE_RE.test(String(value).trim()))
        return 'Must be a 6-digit pincode';
    return undefined;
}
/** ISO date string YYYY-MM-DD, must be today or later */
export function futureDate(value) {
    const e = required(value, 'Date');
    if (e)
        return e;
    const v = String(value).trim();
    if (!DATE_RE.test(v))
        return 'Invalid date format (YYYY-MM-DD)';
    const d = new Date(v);
    const today = new Date(new Date().toDateString());
    if (d < today)
        return 'Date must be today or in the future';
    return undefined;
}
/** Positive integer */
export function positiveInt(value, label) {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1)
        return `${label} must be a positive integer`;
    return undefined;
}
/** Collect errors — only include truthy ones */
export function collect(pairs) {
    const errors = {};
    for (const [err, field] of pairs) {
        if (err)
            errors[field] = err;
    }
    return Object.keys(errors).length ? errors : null;
}
