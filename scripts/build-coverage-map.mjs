// One-shot: download Hérault + Gard GeoJSON contours, project to SVG,
// simplify, and emit ready-to-paste paths + projected city coords.
// Run: node scripts/build-coverage-map.mjs

const HERAULT_URL = 'https://france-geojson.gregoiredavid.fr/repo/departements/34-herault/departement-34-herault.geojson';
const GARD_URL    = 'https://france-geojson.gregoiredavid.fr/repo/departements/30-gard/departement-30-gard.geojson';

const W = 1000, H = 600, PAD = 36;
const EPS = 0.35; // tolerance for Ramer–Douglas–Peucker simplification (px)

const cities = {
  'Montpellier':              [3.8772, 43.6109],
  "Clermont l'Hérault":       [3.4280, 43.6280],
  "St-Georges d'Orques":      [3.7813, 43.6155],
  "St-Jean de Védas":         [3.8253, 43.5762],
  "Pérols":                   [3.9492, 43.5535],
  "La Grande Motte":          [4.0808, 43.5634],
  "Laroque":                  [3.7244, 43.9311],
  "Villetelle":               [4.1383, 43.7008],
  "Lunel":                    [4.1366, 43.6779],
  "Gallargues-le-Montueux":   [4.1764, 43.7253],
  "Fournès":                  [4.6164, 43.9233],
};

const [hRes, gRes] = await Promise.all([fetch(HERAULT_URL), fetch(GARD_URL)]);
if (!hRes.ok || !gRes.ok) throw new Error('GeoJSON fetch failed');
const [hJson, gJson] = await Promise.all([hRes.json(), gRes.json()]);

function extractRings(geom) {
  if (geom.type === 'Polygon') return geom.coordinates;          // [ring,...]
  if (geom.type === 'MultiPolygon') return geom.coordinates.flat();
  return [];
}
function geomOf(j) { return j.type === 'Feature' ? j.geometry : j.features[0].geometry; }
const hRings = extractRings(geomOf(hJson));
const gRings = extractRings(geomOf(gJson));

// Bounds across both departments
const all = [...hRings.flat(), ...gRings.flat()];
let minLon = +Infinity, maxLon = -Infinity, minLat = +Infinity, maxLat = -Infinity;
for (const [lon, lat] of all) {
  if (lon < minLon) minLon = lon;
  if (lon > maxLon) maxLon = lon;
  if (lat < minLat) minLat = lat;
  if (lat > maxLat) maxLat = lat;
}

const midLat = ((minLat + maxLat) / 2) * Math.PI / 180;
const lonScale = Math.cos(midLat); // equirectangular correction
const lonRange = (maxLon - minLon) * lonScale;
const latRange = maxLat - minLat;
const scale = Math.min((W - 2 * PAD) / lonRange, (H - 2 * PAD) / latRange);

const cw = lonRange * scale, ch = latRange * scale;
const offX = (W - cw) / 2 - minLon * lonScale * scale;
const offY = (H - ch) / 2 + maxLat * scale; // y axis flipped

function project([lon, lat]) {
  return [lon * lonScale * scale + offX, offY - lat * scale];
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts.slice();
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy);
  let maxDist = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    const d = len === 0
      ? Math.hypot(px - ax, py - ay)
      : Math.abs(dx * (ay - py) - (ax - px) * dy) / len;
    if (d > maxDist) { maxDist = d; idx = i; }
  }
  if (maxDist > eps) {
    const a = rdp(pts.slice(0, idx + 1), eps);
    const b = rdp(pts.slice(idx), eps);
    return [...a.slice(0, -1), ...b];
  }
  return [pts[0], pts[pts.length - 1]];
}

function ringsToPath(rings) {
  return rings.map((ring) => {
    const pts = ring.map(project);
    const s = rdp(pts, EPS);
    return 'M' + s.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z';
  }).join(' ');
}

const heraultPath = ringsToPath(hRings);
const gardPath = ringsToPath(gRings);

const projected = {};
for (const [name, lonlat] of Object.entries(cities)) {
  const [x, y] = project(lonlat);
  projected[name] = [+x.toFixed(1), +y.toFixed(1)];
}

console.log('// --- HERAULT ---');
console.log(heraultPath);
console.log('// --- GARD ---');
console.log(gardPath);
console.log('// --- SITES ---');
console.log(JSON.stringify(projected, null, 2));
console.error(`viewBox 0 0 ${W} ${H}`);
console.error(`Hérault path len: ${heraultPath.length} chars`);
console.error(`Gard path len:    ${gardPath.length} chars`);
