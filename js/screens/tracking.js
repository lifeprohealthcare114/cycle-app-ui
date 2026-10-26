/* ==========================================================================
   LifePro Fit - Screen: Workout Tracking, Live Dashboard & Summary
   ========================================================================== */

window.Screens = window.Screens || {};

// Reusable workout summary detail view
window.rdv = function(r, isSavingFlow) {
  if (!r) return window.Screens.home();
  const isRun = r.ty === 'run';
  const sp = r.km / (Math.max(1, r.m) / 60);
  const n = Math.max(2, Math.min(6, Math.round(r.km)));
  const hs = Array.from({ length: 50 }, (_, j) => Math.round((r.hr || 120) + 9 * Math.sin(j / 4) + 6 * Math.sin(j * 1.7)));

  const d0 = isRun
    ? [
        ['Duration', window.hm(r.m)],
        ['Avg pace', window.mm(60 / sp) + ' /km'],
        ['Best pace', window.mm(60 / Math.max(r.mx, 1)) + ' /km'],
        ['Calories', r.kc + ' kcal']
      ]
    : [
        ['Duration', window.hm(r.m)],
        ['Avg speed', sp.toFixed(1) + ' km/h'],
        ['Max speed', r.mx + ' km/h'],
        ['Calories', r.kc + ' kcal']
      ];

  if (r.hr) d0.push(['Avg heart rate', r.hr + ' bpm']);
  if (r.cd) d0.push(['Avg cadence', r.cd + (isRun ? ' spm' : ' rpm')]);

  const cols = d0.length > 4 ? 3 : 2;
  while (d0.length % cols) d0.push(['', '']);

  const statsGrid = d0.map(([l, v]) => l ? `<div><div class="mu">${l}</div><b>${v}</b></div>` : '<div></div>').join('');

  // Splits table with running-aware pace headers
  const splitRows = Array.from({ length: n }, (_, i) => {
    const s = sp + (i % 2 ? (isRun ? -0.8 : -1.4) : (isRun ? 0.7 : 1.1));
    return `
      <div class="sp4" ${r.hr ? '' : 'style="--sc:.5fr 1fr 1fr"'}>
        <span class="mu">${i + 1}</span>
        <span>${window.mm(60 / Math.max(s, 0.1))}</span>
        <span style="color:var(--ac)">${s.toFixed(1)}</span>
        ${r.hr ? `<span style="color:var(--rd)">${r.hr + i * 2 - 2}</span>` : ''}
      </div>
    `;
  }).join('');

  const targetShareObj = isSavingFlow ? 'window.S.last' : `window.R[${window.R.indexOf(r)}]`;

  return `
    ${!isSavingFlow ? window.bk('rides', 'Activity') : ''}
    <div class="rw" style="margin: ${isSavingFlow ? '4px 0 16px' : '8px 0 16px'}">
      <div style="flex:1">
        <div class="mu">${isSavingFlow ? 'Workout completed!' : r.d}</div>
        <div class="t1" style="font-size:24px">${r.n}</div>
      </div>
      <button class="ib" aria-label="Share" onclick="shr(${targetShareObj})">
        ${window.I('share', 20)}
      </button>
    </div>

    <!-- GPS Map Route -->
    <div class="cd">
      ${window.route(r.s, 140)}
      <div class="big" style="margin-top:14px">
        <span data-cu="${r.km.toFixed(1)}" data-d="1">${r.km.toFixed(1)}</span>
        <small>km</small>
      </div>
    </div>

    <!-- Metrics Matrix -->
    <div class="sx" style="grid-template-columns:repeat(${cols}, 1fr)">
      ${statsGrid}
    </div>

    <!-- Kilometre Splits -->
    <div class="cd">
      <b>Kilometre splits</b>
      <div class="sp4 mu" style="margin-top:8px${r.hr ? '' : ';--sc:.5fr 1fr 1fr'}">
        <span>KM</span>
        <span>Pace</span>
        <span>km/h</span>
        ${r.hr ? '<span>BPM</span>' : ''}
      </div>
      ${splitRows}
    </div>

    <!-- Heart Rate Curve (if available) -->
    ${r.hr ? `
      <div class="cd">
        <div class="rw">
          <b style="flex:1">Heart rate graph</b>
          <span class="mu">${Math.min(...hs)}–${Math.max(...hs)} bpm</span>
        </div>
        ${window.crv(hs, 320, 90, 'var(--rd)')}
      </div>
    ` : ''}

    <!-- Action Buttons for Done Screen -->
    ${isSavingFlow ? `
      <button class="btn" onclick="save()">Save activity</button>
      <button class="btn d" onclick="go('home')">Discard</button>
    ` : ''}
  `;
};

// 1. Choose activity type
window.Screens.start = function() {
  return `
    ${window.bk('home', 'Home')}
    <div class="t1" style="margin:12px 0 4px">Start an activity</div>
    <p class="mu" style="margin-bottom:18px;font-size:14px">Choose what you’re doing today.</p>

    ${window.TY.map(([k, n, d]) => `
      <div class="cd" onclick="sw('${k}')">
        <div class="rw">
          <span class="ic" style="width:52px;height:52px;border-radius:50%">
            ${window.I(k, 26)}
          </span>
          <div style="flex:1">
            <b style="font-size:17px;font-weight:700">${n}</b>
            <div class="mu" style="margin-top:2px">${d}</div>
          </div>
          ${window.I('chev', 18)}
        </div>
      </div>
    `).join('')}

    <div class="mu" style="text-align:center;margin-top:14px;padding:0 12px">
      ${window.nc() > 0
        ? '✓ Live sensor data will be recorded in this session.'
        : 'Using phone GPS · connect a sensor for heart rate and cadence.'}
    </div>
  `;
};

// 2. Countdown screen with cancel option
window.Screens.cnt = function() {
  return `
    <div class="ctr">
      <div class="mu">Get ready</div>
      <div class="big" id="cn" style="font-size:120px;font-weight:800;color:var(--tx);margin:10px 0">3</div>
      <button class="btn s" style="width:auto;padding:10px 24px;border-radius:99px" onclick="cancelStart()">
        Cancel
      </button>
    </div>
  `;
};

// 3. Live Activity Screen
window.Screens.live = function() {
  const w = window.S.w;
  if (!w) return window.Screens.home();
  const isRun = w.ty === 'run';
  const metrics = [];

  if (window.avail('hr')) metrics.push(['Heart rate', 'k:hr', 'bpm', 'var(--rd)']);
  metrics.push(['Distance', 'w:km', 'km', 'var(--ac)']);
  if (window.avail('cd')) metrics.push(['Cadence', 'k:cd', isRun ? 'spm' : 'rpm', 'var(--pu)']);
  if (window.avail('sp')) metrics.push(['SpO₂', 'k:sp', '%', 'var(--bl)']);
  metrics.push(['Calories', 'w:kc', 'kcal', 'var(--or)']);
  metrics.push(isRun ? ['Avg pace', 'w:ap', '/km', 'var(--gr)'] : ['Max speed', 'w:mx', 'km/h', 'var(--gr)']);

  const initialSpeed = isRun ? window.mm(60 / w.spd) : w.spd.toFixed(1);

  return `
    <div class="rw" style="padding-top:4px">
      <span class="ic">${window.I(w.ty)}</span>
      <b style="flex:1;font-size:16px;font-weight:700">${w.n}</b>
      <span class="tag" id="stt">${w.on ? 'Recording' : 'Paused'}</span>
    </div>

    <div class="lb" style="text-align:center;margin-top:18px">
      ${isRun ? 'Current pace · min/km' : 'Current speed · km/h'}
    </div>
    <div class="spd" data-w="spd">${initialSpeed}</div>
    <div style="text-align:center;font-size:24px;font-weight:700;margin:4px 0 20px;font-variant-numeric:tabular-nums" data-w="t">
      ${window.formatLiveTimer(w.t)}
    </div>

    <div class="g2" style="gap:12px;margin:12px 0 24px">
      ${metrics.map(([l, k, u, c]) => {
        const [a, b] = k.split(':');
        const initialVal = a === 'w' ? (b === 'km' ? '0.00' : '0') : '--';
        return `
          <div class="cd" style="padding:14px 16px;margin:0">
            <span class="mu" style="font-size:12px;font-weight:600">${l}</span>
            <div class="bm" style="color:${c};margin-top:4px;font-size:22px">
              <span data-${a}="${b}">${initialVal}</span><small>${u}</small>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="ctl">
      <button class="cb" id="pz" aria-label="Pause or Resume" onclick="pz()">
        ${window.I(w.on ? 'pause' : 'play', 30)}
      </button>
      <button class="cb r" aria-label="Stop activity" onclick="fin()">
        ${window.I('stop', 30)}
      </button>
    </div>
  `;
};

// 4. Finished Workout & History Screens
window.Screens.done = function() {
  return window.rdv(window.S.last, 1);
};

window.Screens.rd = function(i) {
  return window.rdv(window.R[i], 0);
};

// Start Workout Action with countdown
let countdownTimer;
window.sw = function(ty) {
  const isRun = ty === 'run';
  const h = new Date().getHours();
  const timeGreeting = h < 12 ? 'Morning ' : h < 17 ? 'Afternoon ' : 'Evening ';

  window.S.w = {
    ty,
    n: timeGreeting + (isRun ? 'Run' : 'Ride'),
    t: 0,
    km: 0,
    kc: 0,
    spd: isRun ? 10.5 : 21.0,
    mx: isRun ? 10.5 : 21.0,
    on: 1,
    hs: [],
    cs: []
  };

  window.S.cn = 3;
  window.go('cnt');

  const countStep = () => {
    if (window.S.sc !== 'cnt') return;
    window.S.cn--;
    if (window.S.cn > 0) {
      const el = window.$('#cn');
      if (el) el.textContent = window.S.cn;
      countdownTimer = setTimeout(countStep, 900);
    } else {
      window.go('live');
      window.updW();
    }
  };

  clearTimeout(countdownTimer);
  countdownTimer = setTimeout(countStep, 900);
};

window.cancelStart = function() {
  clearTimeout(countdownTimer);
  window.S.w = null;
  window.go('start');
};

// Toggle Pause / Resume
window.pz = function() {
  if (!window.S.w) return;
  window.S.w.on = !window.S.w.on;
  const stt = window.$('#stt');
  const btn = window.$('#pz');
  if (stt) stt.textContent = window.S.w.on ? 'Recording' : 'Paused';
  if (btn) btn.innerHTML = window.I(window.S.w.on ? 'pause' : 'play', 30);
};

// Stop / Finish workout
window.fin = function() {
  const w = window.S.w;
  if (!w) return window.go('home');

  const isRun = w.ty === 'run';
  const avg = arr => arr.length ? Math.round(arr.reduce((p, c) => p + c, 0) / arr.length) : 0;

  let r = {
    n: w.n,
    d: 'Just now',
    ty: w.ty,
    km: w.km,
    m: Math.max(1, Math.round(w.t / 60)),
    kc: Math.round(w.kc),
    hr: window.avail('hr') ? (avg(w.hs) || window.S.hr) : 0,
    cd: window.S.c.p ? avg(w.cs) : 0,
    mx: +w.mx.toFixed(1),
    s: Math.random() * 5
  };

  // If user tested and stopped quickly (<5s), provide realistic demo stats
  if (w.t < 5) {
    r = {
      ...r,
      km: isRun ? 5.2 : 14.8,
      m: isRun ? 28 : 39,
      kc: isRun ? 340 : 410,
      hr: window.avail('hr') ? (isRun ? 152 : 132) : 0,
      cd: window.S.c.p ? (isRun ? 168 : 82) : 0,
      mx: isRun ? 13.4 : 33.6
    };
  }

  window.S.last = r;
  window.S.w = null;
  window.go('done');
};

// Save activity to recent list
window.save = function() {
  if (window.S.last) {
    window.R.unshift(window.S.last);
    window.TOT.d += window.S.last.km;
    window.TOT.w += window.S.last.km;
    window.TOT.m += window.S.last.km;
  }
  window.go('home');
  window.toast('Activity saved to your journal');
};

// Update live workout numbers immediately
window.updW = function() {
  const w = window.S.w;
  if (!w || window.S.sc !== 'live') return;

  const isRun = w.ty === 'run';
  const z = window.zn();
  const avSpeed = w.t > 0 ? (w.km / (w.t / 3600)) : w.spd;

  const o = {
    t: window.formatLiveTimer(w.t),
    spd: isRun ? window.mm(60 / Math.max(w.spd, 0.1)) : w.spd.toFixed(1),
    km: w.km.toFixed(2),
    kc: Math.round(w.kc),
    mx: w.mx.toFixed(1),
    ap: window.mm(60 / Math.max(avSpeed, 1)),
    z: 'Zone ' + z
  };

  document.querySelectorAll('[data-w]').forEach(e => {
    const key = e.dataset.w;
    if (key in o) e.textContent = o[key];
  });

  const zb = document.querySelector('#zb');
  if (zb) {
    zb.querySelectorAll('i').forEach((e, i) => {
      e.className = i < z ? 'on' : '';
    });
  }
};
