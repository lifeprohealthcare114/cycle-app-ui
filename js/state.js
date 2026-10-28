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
  c: { baiget: 1, physilog: 0, g: 1, e: 1, p: 0 },
  perm: 0,
  hr: 72,
  sp: 98,
  tp: 36.6,
  hv: 48,
  kc: 420,
  rpe: 4,
  hs: 22,
  cd: 84,
  lm: 92,
  H: { hr: [], sp: [], tp: [], hv: [], kc: [], rpe: [], hs: [], cd: [], lm: [] },
  u: { name: '', g: 'Male', age: 25, h: 173, w: 65 },
  goal: 20,
  th: 'l',
  ac: 'yellow',
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

// Device connection state helpers
window.hasBaiget = function() {
  return Boolean(window.S.c.baiget || window.S.c.g || window.S.c.e);
};

window.hasPhysilog = function() {
  return Boolean(window.S.c.physilog || window.S.c.p);
};

window.hasBoth = function() {
  return window.hasBaiget() && window.hasPhysilog();
};

window.deviceMode = function() {
  if (window.hasBoth()) return 'both';
  if (window.hasBaiget()) return 'baiget';
  if (window.hasPhysilog()) return 'physilog';
  return 'none';
};

window.setDeviceState = function(mode) {
  if (mode === 'baiget') {
    window.S.c = { baiget: 1, physilog: 0, g: 1, e: 1, p: 0 };
    window.toast('Baiget connected (PPG + ECG)');
  } else if (mode === 'physilog') {
    window.S.c = { baiget: 0, physilog: 1, g: 0, e: 0, p: 1 };
    window.toast('Physilog connected (Motion telemetry)');
  } else if (mode === 'both') {
    window.S.c = { baiget: 1, physilog: 1, g: 1, e: 1, p: 1 };
    window.toast('Both devices connected (Baiget + Physilog)');
  } else if (mode === 'none') {
    window.S.c = { baiget: 0, physilog: 0, g: 0, e: 0, p: 0 };
    window.toast('All devices disconnected');
  }
  for (const q in window.M) {
    if (window.avail(q) && (!window.S.H[q] || window.S.H[q].length === 0)) {
      window.S.H[q] = Array.from({ length: 24 }, () => window.S[q]);
    }
  }
  window.go(window.S.sc, window.S.a);
};

window.toggleDevice = function(dev) {
  if (dev === 'baiget') {
    const next = window.hasBaiget() ? 0 : 1;
    window.S.c.baiget = next;
    window.S.c.g = next;
    window.S.c.e = next;
    window.toast(next ? 'Baiget (PPG+ECG) connected' : 'Baiget disconnected');
  } else if (dev === 'physilog') {
    const next = window.hasPhysilog() ? 0 : 1;
    window.S.c.physilog = next;
    window.S.c.p = next;
    window.toast(next ? 'Physilog connected' : 'Physilog disconnected');
  }
  for (const q in window.M) {
    if (window.avail(q) && (!window.S.H[q] || window.S.H[q].length === 0)) {
      window.S.H[q] = Array.from({ length: 24 }, () => window.S[q]);
    }
  }
  window.go(window.S.sc, window.S.a);
};

// Check if sensor providing metric `k` is currently connected
window.avail = function(k) {
  if (!window.M[k]) return false;
  // If active session is in progress, restrict telemetry to selected device
  const w = window.S.w;
  if (w && w.on) {
    if (w.ty === 'baiget' && (k === 'cd' || k === 'lm')) return false;
    if (w.ty === 'physilog' && (k !== 'cd' && k !== 'lm')) return false;
  }
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

// Count of connected devices (Baiget: 1, Physilog: 1, Total: 2)
window.nc = function() {
  let count = 0;
  if (window.hasBaiget()) count++;
  if (window.hasPhysilog()) count++;
  return count;
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
