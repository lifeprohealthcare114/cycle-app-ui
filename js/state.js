/* ==========================================================================
   LifePro Fit - Global State & Core State Helpers
   ========================================================================== */

window.$ = s => document.querySelector(s);
window.$$ = s => document.querySelectorAll(s);

window.S = {
  sc: 'ob',
  ob: 0,
  tab: 'home',
  rg: 'd',
  met: 'dist',
  c: { g: 0, e: 0, p: 0 },
  perm: 0,
  hr: 72,
  sp: 98,
  tp: 36.6,
  hv: 48,
  hy: 82,
  cd: 0,
  lm: 90,
  H: { hr: [], sp: [], tp: [], hv: [], hy: [], cd: [], lm: [] },
  u: { name: '', g: 'Male', age: 25, h: 173, w: 65 },
  goal: 20,
  th: 'a',
  ac: 'teal',
  sheet: '',
  edit: 0,
  sf: 0,
  ps: 0,
  gi: 0,
  w: null,
  dvb: 'me',
  org: 'home',
  dr: 'd',
  activeBar: null
};

// Check if sensor providing metric `k` is currently connected
window.avail = function(k) {
  if (!window.M[k]) return false;
  return [...window.M[k][7]].some(d => window.S.c[d]);
};

// Format formatted value for metric `k`
window.fv = function(k) {
  if (!window.M[k]) return '--';
  return window.avail(k)
    ? (window.M[k][6] ? window.S[k].toFixed(1) : Math.round(window.S[k]))
    : '--';
};

// Check if metric `k` is within normal clinical range
window.inr = function(k) {
  if (!window.M[k]) return true;
  return window.S[k] >= window.M[k][4] && window.S[k] <= window.M[k][5];
};

// Count of connected sensors
window.nc = function() {
  return Object.values(window.S.c).filter(Boolean).length;
};

// Sanitized user profile name helpers
window.esc = function(s) {
  return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
};

window.nm = function() {
  return window.esc(window.S.u.name.trim()) || 'Rider';
};

window.fn = function() {
  return window.esc(window.S.u.name.trim().split(/\s+/)[0] || '');
};

window.ini = function() {
  const parts = window.S.u.name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'R';
  return window.esc((parts.map(w => w[0]).slice(0, 2).join('')).toUpperCase());
};

// Distance targets
window.GL = function() {
  return {
    d: window.S.goal,
    w: window.S.goal * 7,
    m: window.S.goal * 30
  };
};

// Current Heart Rate Zone (1-5) based on Age
window.zn = function() {
  const maxHr = Math.max(120, 220 - window.S.u.age);
  const p = window.S.hr / maxHr;
  return p < 0.6 ? 1 : p < 0.7 ? 2 : p < 0.8 ? 3 : p < 0.9 ? 4 : 5;
};
