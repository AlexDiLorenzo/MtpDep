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

/** Renvoie true si la requête fournit un token valide (query ?token=… ou cookie). */
export function checkToken(
  request: Request,
  expected: string | undefined,
  cookieName: string
): { ok: boolean; queryToken: string | null } {
  if (!expected) return { ok: false, queryToken: null };
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  const cookieToken = parseCookie(request.headers.get('cookie'))[cookieName];
  const provided = queryToken || cookieToken;
  if (!provided) return { ok: false, queryToken: null };
  return { ok: timingSafeEqual(provided, expected), queryToken };
}

/** Header Set-Cookie httpOnly Secure SameSite=Lax 30j. */
export function makeAuthCookie(name: string, value: string, maxAgeSec = 60 * 60 * 24 * 30): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; HttpOnly; Secure; SameSite=Lax`;
}
