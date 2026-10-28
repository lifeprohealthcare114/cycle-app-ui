/* ==========================================================================
   LifePro Fit - Utilities & SVG Visual Generators
   ========================================================================== */

// Number formatting
window.f = n => Math.round(n).toLocaleString('en-US');

// Human duration formatting (e.g. "52 min" or "1h 28m")
window.hm = function(m) {
  const mins = Math.max(0, Math.round(m));
  if (mins < 60) {
    return `${mins} min`;
  }
  const h = Math.floor(mins / 60);
  const remM = mins % 60;
  return remM > 0 ? `${h}h ${remM}m` : `${h}h`;
};

// Pace formatting mm:ss
window.mm = function(m) {
  if (!isFinite(m) || m <= 0) return '--:--';
  const min = Math.floor(m);
  const sec = Math.min(59, Math.round((m % 1) * 60));
  return `${min}:${String(sec).padStart(2, '0')}`;
};

// Live timer string formatting (hh:mm:ss or mm:ss)
window.formatLiveTimer = function(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const p = n => String(n).padStart(2, '0');
  return hrs > 0 ? `${hrs}:${p(mins)}:${p(secs)}` : `${p(mins)}:${p(secs)}`;
};

// Automatic BMI calculation from user height (cm) and weight (kg)
window.calcBMI = function() {
  const hM = (Number(window.S.u.h) || 170) / 100;
  const wKg = Number(window.S.u.w) || 65;
  if (!hM || hM <= 0) return { val: 0, text: '--', cat: 'Normal', color: 'var(--ac)' };
  const bmi = +(wKg / (hM * hM)).toFixed(1);
  let cat = 'Normal';
  let color = 'var(--gr)';
  if (bmi < 18.5) {
    cat = 'Underweight';
    color = 'var(--bl)';
  } else if (bmi < 25.0) {
    cat = 'Normal';
    color = 'var(--gr)';
  } else if (bmi < 30.0) {
    cat = 'Overweight';
    color = 'var(--or)';
  } else {
    cat = 'Obese';
    color = 'var(--rd)';
  }
  return { val: bmi, text: bmi.toFixed(1), cat, color };
};

// Date & Weekday helpers
window.l7 = function() {
  const today = new Date().getDay();
  return Array.from({ length: 7 }, (_, i) => window.DN[(today - 6 + i + 7) % 7]);
};

window.date = function() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

// Circular progress ring generator
window.ring = function(p, z, sw, c, tr) {
  const r = (z - sw) / 2;
  const C = 2 * Math.PI * r;
  const offset = C * Math.max(0, 1 - Math.min(1, p));
  return `
    <svg width="${z}" height="${z}" viewBox="0 0 ${z} ${z}" style="transform:rotate(-90deg)">
      <circle cx="${z/2}" cy="${z/2}" r="${r}" fill="none" stroke="${tr}" stroke-width="${sw}"/>
      <circle class="rr" data-o="${offset}" cx="${z/2}" cy="${z/2}" r="${r}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
    </svg>
  `;
};

// Smooth cubic bezier chart curve generator
window.crv = function(d, w, h, c, an = 1) {
  if (!d || !d.length) return '';
  const n = d.length;
  if (n === 1) d = [d[0], d[0]];
  const maxVal = Math.max(...d);
  const minVal = Math.min(...d);
  const mx = maxVal === minVal ? maxVal * 1.2 || 10 : maxVal * 1.08;
  const mn = n > 12 ? (maxVal === minVal ? minVal * 0.8 : minVal * 0.95) : 0;
  const denom = mx - mn || 1;

  const x = i => 8 + i * (w - 16) / (n - 1);
  const y = v => h - 8 - ((v - mn) / denom) * (h - 16);

  let p = `M${x(0).toFixed(1)} ${y(d[0]).toFixed(1)}`;
  for (let i = 1; i < n; i++) {
    const cpX = ((x(i - 1) + x(i)) / 2).toFixed(1);
    const prevY = y(d[i - 1]).toFixed(1);
    const currY = y(d[i]).toFixed(1);
    p += ` C${cpX} ${prevY} ${cpX} ${currY} ${x(i).toFixed(1)} ${currY}`;
  }

  const lastX = x(n - 1).toFixed(1);
  const firstX = x(0).toFixed(1);
  return `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;display:block">
      <path class="${an ? 'fa' : ''}" d="${p}L${lastX} ${h}L${firstX} ${h}Z" fill="${c}" opacity="0.14"/>
      <path class="${an ? 'dr' : ''}" pathLength="1" d="${p}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      ${n > 12 ? '' : d.map((v, i) => `
        <circle class="${an ? 'fa' : ''}" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="${i === n - 1 ? 6 : 4}" fill="${i === n - 1 ? 'var(--cd)' : c}" stroke="${c}" stroke-width="${i === n - 1 ? 3 : 0}"/>
      `).join('')}
    </svg>
  `;
};

// Route GPS map SVG generator
window.route = function(s, h = 110, c = 'var(--ac)', bg = 'var(--s2)') {
  const seed = Number(s) || 1;
  const pts = Array.from({ length: 41 }, (_, i) => {
    const a = i / 40;
    return [
      20 + a * 280,
      h / 2 + Math.sin(a * 6 + seed) * h * 0.28 + Math.sin(a * 13 + seed * 2) * h * 0.1
    ];
  });
  const p = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join('');
  const a = pts[0];
  const b = pts[40];

  return `
    <svg viewBox="0 0 320 ${h}" style="width:100%;display:block;border-radius:18px;background:${bg}">
      <path d="M0 ${h * 0.3}H320M0 ${h * 0.7}H320M100 0V${h}M220 0V${h}" stroke="${c}" stroke-opacity="0.12"/>
      <path class="dr" pathLength="1" d="${p}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="fa" cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="6" fill="#22C55E"/>
      <circle class="fa" cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="6" fill="#EF4444"/>
    </svg>
  `;
};

// Random walk generator
window.bars = function(n, t, sd) {
  const a = Array.from({ length: n }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 1.9 + sd)));
  const s = a.reduce((x, y) => x + y, 0);
  return a.map(v => (v / s) * t);
};

// Activity dataset aggregator with properly aligned labels
window.rdata = function(r, m) {
  const t = window.TOT[r];
  let km;
  if (r === 'd') {
    km = Array(24).fill(0);
    km[7] = 2.4;
    km[12] = 4.2;
    km[18] = 11.5;
    km[19] = 6.7;
  } else if (r === 'w') {
    km = window.WK;
  } else {
    km = window.bars(30, 486, 3);
  }

  const v = m === 'spd'
    ? km.map((x, i) => (x ? 19 + 3 * Math.abs(Math.sin(i + 1)) : 0))
    : km.map(x => x * { dist: 1, time: 60 / 21, kc: 25 }[m]);

  // Aligned chart labels with corresponding index
  let lab;
  if (r === 'd') {
    lab = [
      { i: 0, l: '12a' },
      { i: 6, l: '6a' },
      { i: 12, l: '12p' },
      { i: 18, l: '6p' },
      { i: 23, l: '11p' }
    ];
  } else if (r === 'w') {
    const days = window.l7();
    lab = days.map((x, i) => ({ i, l: x[0] }));
  } else {
    lab = [
      { i: 0, l: '1' },
      { i: 9, l: '10' },
      { i: 19, l: '20' },
      { i: 29, l: '30' }
    ];
  }

  return {
    v,
    big: {
      dist: t.toFixed(1) + ' km',
      time: window.hm(t * 60 / 21),
      spd: '21.0 km/h',
      kc: window.f(t * 25) + ' kcal'
    }[m],
    u: { dist: 'km', time: 'min', spd: 'km/h', kc: 'kcal'}[m],
    lab
  };
};

// Reusable back button
window.bk = function(s, l) {
  return `<button class="rw" style="color:var(--ac);font-weight:700;font-size:15px;margin-bottom:8px" onclick="go('${s}')">${window.I('back', 20)}${l}</button>`;
};

// Segmented tab control
window.seg = function(a, c, fn) {
  const activeIdx = Math.max(0, a.findIndex(x => x[0] === c));
  return `
    <div class="seg" style="--seg-n:${a.length};--seg-i:${activeIdx};--n:${a.length};--i:${activeIdx}">
      ${a.map(([k, l], i) => `
        <button class="${k === c ? 'on' : ''}" onclick="sg(this, ${i}, '${fn}', '${k}')">${l}</button>
      `).join('')}
    </div>
  `;
};

// Sensor status pill
window.pill = function() {
  const count = window.nc();
  return count > 0
    ? `<button class="pill" onclick="go('dev')"><i class="dot lv"></i>${count} sensor${count > 1 ? 's' : ''} connected</button>`
    : `<button class="pill" onclick="add()" style="color:var(--ac)">${window.I('bt', 16)}Connect sensors</button>`;
};

// Empty state placeholder
window.emp = function(i, t, d) {
  return `
    <div class="cd emp">
      <span class="ic" style="width:64px;height:64px;border-radius:50%">${window.I(i, 28)}</span>
      <b style="font-size:17px;font-weight:700;margin-top:6px">${t}</b>
      <div class="mu" style="max-width:260px">${d}</div>
      <button class="btn" style="width:auto;padding:12px 24px" onclick="add()">Connect sensor</button>
    </div>
  `;
};

// Today's reading or historical average
window.tv = function(k) {
  if (window.avail(k)) return window.fv(k);
  const a = window.hist(k, 'd').reduce((s, x) => s + x[2], 0) / 24;
  return window.M[k][6] ? a.toFixed(1) : Math.round(a);
};

// Health history ranges generator
window.hist = function(k, r) {
  const n = { d: 24, w: 7, m: 30 }[r];
  const [b, a] = window.HB[k];
  const dc = window.M[k][6] ? 1 : 0;
  const cap = ['sp', 'lm'].includes(k) ? 100 : 1e9;
  const sd = k.charCodeAt(0) + k.charCodeAt(1) + (r === 'w' ? 3 : r === 'm' ? 7 : 0);

  return Array.from({ length: n }, (_, i) => {
    const v = b + a * 0.55 * Math.sin(i * (r === 'd' ? 0.45 : 0.9) + sd);
    const lo = v - a * (0.3 + 0.25 * Math.abs(Math.sin(i * 1.7 + sd)));
    const hi = Math.min(cap, v + a * (0.3 + 0.25 * Math.abs(Math.sin(i * 2.3 + sd))));
    return [lo, hi, v].map(x => +x.toFixed(dc));
  });
};

// History period label
window.bl = function(r, i) {
  return r === 'd' ? `${i}:00–${i + 1}:00` : r === 'w' ? window.l7()[i] : `Day ${i + 1}`;
};

// High-low health range bars SVG generator
window.hbars = function(d, c, lab) {
  const n = d.length;
  const lo = Math.min(...d.map(x => x[0]));
  const hi = Math.max(...d.map(x => x[1]));
  const W = 320;
  const H = 170;
  const t = 14;
  const bt = H - t - 26;
  const denom = hi - lo || 1;
  const y = v => t + ((hi - v) / denom) * bt;
  const w = W / n;
  const bw = Math.min(14, Math.max(4, w * 0.5));

  return `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;display:block">
      ${[t, t + bt / 2, t + bt].map(q => `
        <line x1="4" x2="316" y1="${q.toFixed(1)}" y2="${q.toFixed(1)}" stroke="var(--ln)"/>
      `).join('')}
      ${d.map((x, i) => {
        const barY = y(x[1]);
        const barH = Math.max(bw, y(x[0]) - barY);
        return `
          <rect class="bar" style="--d:${i}" x="${((i + 0.5) * w - bw / 2).toFixed(1)}" y="${barY.toFixed(1)}" width="${bw.toFixed(1)}" height="${barH.toFixed(1)}" rx="${(bw / 2).toFixed(1)}" fill="${c}" onclick="pk(${i})" cursor="pointer"/>
        `;
      }).join('')}
      ${lab.map(([i, l]) => `
        <text x="${((i + 0.5) * w).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--mu)">${l}</text>
      `).join('')}
    </svg>
  `;
};

// SVG QR Code generator for share cards
window.qr = function() {
  let s = '';
  for (let i = 0; i < 81; i++) {
    const x = i % 9;
    const y = Math.floor(i / 9);
    if ((x * 7 + y * 13 + x * y) % 3 === 0 || (x < 3 && y < 3)) {
      s += `<rect x="${x * 6}" y="${y * 6}" width="5" height="5"/>`;
    }
  }
  return `<svg viewBox="0 0 54 54" width="56" height="56" fill="#fff">${s}</svg>`;
};

// Toast notification
let toastTimer;
window.toast = function(m) {
  const t = window.$('#toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 1800);
};
