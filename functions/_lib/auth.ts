// Helpers d'auth réutilisables entre les Functions (admin, pilotage).

export function parseCookie(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(rest.join('='));
  }
  return out;
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Renvoie true si la requête fournit un cookie httpOnly valide. */
export function checkToken(
  request: Request,
  expected: string | undefined,
  cookieName: string
): { ok: boolean; queryToken: string | null } {
  if (!expected) return { ok: false, queryToken: null };
  const cookieToken = parseCookie(request.headers.get('cookie'))[cookieName];
  const provided = cookieToken;
  if (!provided) return { ok: false, queryToken: null };
  return { ok: timingSafeEqual(provided, expected), queryToken: null };
}

/** Header Set-Cookie httpOnly Secure SameSite=Strict 30j. */
export function makeAuthCookie(name: string, value: string, maxAgeSec = 60 * 60 * 24 * 30): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; HttpOnly; Secure; SameSite=Strict`;
}

/** Refuse les mutations déclenchées depuis un autre site. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
