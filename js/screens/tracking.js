/* ==========================================================================
   LifePro Fit - Screen: Workout Tracking, Live Dashboard & Summary
   ========================================================================== */

window.Screens = window.Screens || {};

// Reusable workout summary detail view
window.rdv = function(r, isSavingFlow) {
  if (!r) return window.Screens.home();
  const isBaiget = r.ty === 'baiget';
  const isPhysilog = r.ty === 'physilog';
  const isBoth = r.ty === 'both';
  const isRun = r.ty === 'run';

  const hs = Array.from({ length: 50 }, (_, j) => Math.round((r.hr || 132) + 9 * Math.sin(j / 4) + 6 * Math.sin(j * 1.7)));
  const sp = r.km ? (r.km / (Math.max(1, r.m) / 60)) : 0;
  const n = Math.max(2, Math.min(6, Math.round(r.km || 3)));

  let d0 = [];
  if (isBaiget) {
    d0 = [
      ['Duration', window.hm(r.m)],
      ['Cardio energy', (r.kc || 380) + ' kcal'],
      ['Avg heart rate', (r.hr || 134) + ' bpm'],
      ['Peak heart rate', Math.round((r.hr || 134) * 1.18) + ' bpm'],
      ['Avg HRV', '52 ms'],
      ['Avg SpO₂', '98%']
    ];
  } else if (isPhysilog) {
    d0 = [
      ['Duration', window.hm(r.m)],
      ['Total distance', (r.km || 18.2).toFixed(1) + ' km'],
      ['Avg cadence', (r.cd || 82) + ' rpm'],
      ['Peak cadence', Math.round((r.cd || 82) * 1.25) + ' rpm'],
      ['Avg speed', sp > 0 ? sp.toFixed(1) + ' km/h' : '23.4 km/h'],
      ['Motion energy', (r.kc || 340) + ' kcal']
    ];
  } else {
    // Both or legacy cycling/running
    d0 = [
      ['Duration', window.hm(r.m)],
      ['Total distance', (r.km || 24.5).toFixed(1) + ' km'],
      ['Avg heart rate', (r.hr || 138) + ' bpm'],
      ['Avg cadence', (r.cd || 80) + ' rpm'],
      ['Avg speed', sp > 0 ? sp.toFixed(1) + ' km/h' : '24.2 km/h'],
      ['Total calories', (r.kc || 620) + ' kcal']
    ];
  }

  const cols = 2;
  const statsGrid = d0.map(([l, v]) => `
    <div style="padding:4px 0">
      <div class="mu" style="font-size:12px;font-weight:600">${l}</div>
      <b style="font-size:18px">${v}</b>
    </div>
  `).join('');

  // Splits table (for Physilog or Combined workouts with distance)
  const splitRows = Array.from({ length: n }, (_, i) => {
    const s = Math.max(12, (sp || 22) + (i % 2 ? -1.2 : 1.4));
    return `
      <div class="sp4" ${r.hr ? '' : 'style="--sc:.5fr 1fr 1fr"'}>
        <span class="mu">${i + 1}</span>
        <span>${window.mm(60 / Math.max(s, 0.1))}</span>
        <span style="color:var(--ac)">${s.toFixed(1)}</span>
        ${r.hr ? `<span style="color:var(--rd)">${(r.hr || 134) + i * 2 - 2}</span>` : ''}
      </div>
    `;
  }).join('');

  const targetShareObj = isSavingFlow ? 'window.S.last' : `window.R[${window.R.indexOf(r)}]`;

  return `
    ${!isSavingFlow ? window.bk('rides', 'Activity') : ''}
    <div class="rw" style="margin: ${isSavingFlow ? '4px 0 16px' : '8px 0 16px'}">
      <div style="flex:1">
        <div class="mu">${isSavingFlow ? 'Session completed!' : r.d}</div>
        <div class="t1" style="font-size:24px">${r.n}</div>
      </div>
      <button class="ib" aria-label="Share" onclick="shr(${targetShareObj})">
        ${window.I('share', 20)}
      </button>
    </div>

    ${!isBaiget && r.km ? `
      <!-- GPS Map Route for motion sessions -->
      <div class="cd">
        ${window.route(r.s || 1, 140)}
        <div class="big" style="margin-top:14px">
          <span data-cu="${r.km.toFixed(1)}" data-d="1">${r.km.toFixed(1)}</span>
          <small>km</small>
        </div>
      </div>
    ` : ''}

    ${isBaiget ? `
      <!-- Baiget Hero Biometrics Summary -->
      <div class="cd" style="background:linear-gradient(145deg, color-mix(in srgb, var(--rd) 12%, var(--cd)) 0%, var(--cd) 100%)">
        <div class="rw" style="color:var(--rd);font-weight:700;font-size:13px;gap:8px">
          ${window.I('baiget', 18)}
          <span>Baiget PPG + ECG Session Summary</span>
        </div>
        <div class="big" style="color:var(--rd);margin-top:10px">
          ${r.hr || 136}<small style="color:var(--mu)">bpm avg</small>
        </div>
        <div class="mu" style="margin-top:4px">Cardiac rhythm normal · 100% Sinus rhythm verified</div>
      </div>
    ` : ''}

    <!-- Metrics Matrix -->
    <div class="sx" style="grid-template-columns:repeat(${cols}, 1fr)">
      ${statsGrid}
    </div>

    ${!isBaiget && r.km ? `
      <!-- Kilometre Splits (Physilog / Both) -->
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
    ` : ''}

    ${r.hr || isBaiget ? `
      <!-- Heart Rate Curve (Baiget / Both) -->
      <div class="cd">
        <div class="rw">
          <b style="flex:1">Heart rate graph</b>
          <span class="mu">${Math.min(...hs)}–${Math.max(...hs)} bpm</span>
        </div>
        ${window.crv(hs, 320, 90, 'var(--rd)')}
      </div>
    ` : ''}

    ${isPhysilog ? `
      <!-- Pedal Stroke Symmetry (Physilog only) -->
      <div class="cd zn-card">
        <div class="zn-card-title">Pedal stroke symmetry</div>
        <div class="zn-row">
          <span class="zn-label">Left leg</span>
          <div class="zn-bar"><div class="zn-fill" style="width:50.2%;background:#FCC232"></div></div>
          <span class="zn-val">50.2%</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Right leg</span>
          <div class="zn-bar"><div class="zn-fill" style="width:49.8%;background:#3B82F6"></div></div>
          <span class="zn-val">49.8%</span>
        </div>
      </div>
    ` : ''}

    <!-- Action Buttons for Done Screen -->
    ${isSavingFlow ? `
      <button class="btn" onclick="save()">Save session</button>
      <button class="btn d" onclick="go('home')">Discard</button>
    ` : ''}
  `;
};

// 1. Choose activity type / Connected Device session
window.Screens.start = function() {
  const hasB = window.hasBaiget();
  const hasP = window.hasPhysilog();
  const hasBoth = hasB && hasP;

  const devices = [
    {
      k: 'baiget',
      n: 'Baiget',
      d: 'PPG + ECG Biometrics · Heart rate, SpO₂, ECG rhythm & HRV',
      icon: 'baiget',
      color: 'var(--rd)',
      connected: hasB
    },
    {
      k: 'physilog',
      n: 'Physilog',
      d: 'Motion Telemetry · Cadence, leg balance, pace & speed',
      icon: 'physilog',
      color: 'var(--pu)',
      connected: hasP
    }
  ];

  let statusMsg = '';
  if (hasBoth) {
    statusMsg = '✓ Baiget (PPG+ECG) & Physilog connected. Full telemetry ready.';
  } else if (hasB) {
    statusMsg = '✓ Baiget connected · Streaming PPG & ECG cardiac vitals.';
  } else if (hasP) {
    statusMsg = '✓ Physilog connected · Streaming cadence & gait telemetry.';
  } else {
    statusMsg = 'No device connected · Tap a product or pair in Sensors.';
  }

  return `
    ${window.bk('home', 'Home')}
    <div class="t1" style="margin:12px 0 4px">Start Session</div>
    <p class="mu" style="margin-bottom:18px;font-size:14px">Choose your device to begin tracking.</p>

    <!-- Product 1 & Product 2 Options -->
    ${devices.map(dev => `
      <div class="cd" onclick="sw('${dev.k}')" style="position:relative;overflow:hidden">
        <div class="rw" style="align-items:flex-start">
          <span class="ic" style="width:52px;height:52px;border-radius:50%;color:${dev.color};background:color-mix(in srgb, ${dev.color} 14%, transparent)">
            ${window.I(dev.icon, 26)}
          </span>
          <div style="flex:1;min-width:0;padding-right:8px">
            <div style="display:flex;align-items:center;gap:8px">
              <b style="font-size:18px;font-weight:700">${dev.n}</b>
              <span class="tag ${dev.connected ? 'tag-on' : ''}" style="font-size:11px;padding:2px 8px">
                ${dev.connected ? '● Connected' : '○ Standby'}
              </span>
            </div>
            <div class="mu" style="margin-top:4px;font-size:13px;line-height:1.35">${dev.d}</div>
          </div>
          <div style="margin-top:14px">${window.I('chev', 18)}</div>
        </div>
      </div>
    `).join('')}

    <!-- Product 3: Dual Sync Session (Highlighted when both connected) -->
    <div class="cd" onclick="sw('both')" style="border:${hasBoth ? '1.5px solid var(--ac)' : '1px solid var(--ln)'};background:${hasBoth ? 'color-mix(in srgb, var(--ac) 8%, var(--cd))' : 'var(--cd)'}">
      <div class="rw" style="align-items:flex-start">
        <span class="ic" style="width:52px;height:52px;border-radius:50%;color:var(--ac);background:color-mix(in srgb, var(--ac) 14%, transparent)">
          ${window.I('dual', 26)}
        </span>
        <div style="flex:1;min-width:0;padding-right:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <b style="font-size:18px;font-weight:700">Baiget + Physilog</b>
            <span class="tag ${hasBoth ? 'tag-on' : ''}" style="font-size:11px;padding:2px 8px;background:${hasBoth ? 'var(--ac);color:var(--ax)' : ''}">
              ${hasBoth ? '★ Dual Sync Ready' : 'Dual Session'}
            </span>
          </div>
          <div class="mu" style="margin-top:4px;font-size:13px;line-height:1.35">
            Combined telemetry · Full cardiac vitals + gait & motion analysis
          </div>
        </div>
        <div style="margin-top:14px">${window.I('chev', 18)}</div>
      </div>
    </div>

    <!-- Live Connection Status Banner -->
    <div class="mu" style="text-align:center;margin-top:14px;padding:0 12px;font-weight:600;color:${window.nc() > 0 ? 'var(--tx)' : 'var(--mu)'}">
      ${statusMsg}
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
  const isBaiget = w.ty === 'baiget';
  const isPhysilog = w.ty === 'physilog';
  const isBoth = w.ty === 'both';

  // 1) BAIGET ONLY SESSION: Show PPG + ECG. Absolutely NO Physilog metrics (no cadence, no balance, no speed/dist).
  if (isBaiget) {
    return `
      <!-- Baiget Header -->
      <div class="rw" style="padding-top:4px">
        <span class="ic" style="color:var(--rd);background:color-mix(in srgb, var(--rd) 16%, transparent)">
          ${window.I('baiget', 22)}
        </span>
        <div style="flex:1">
          <b style="font-size:16px;font-weight:700">${w.n}</b>
          <div class="mu" style="font-size:11px;color:var(--rd);font-weight:700">Baiget PPG + ECG Active</div>
        </div>
        <span class="tag" id="stt">${w.on ? 'Recording' : 'Paused'}</span>
      </div>

      <!-- Hero Heart Rate Metric -->
      <div class="lb" style="text-align:center;margin-top:16px">Live Heart Rate · BPM</div>
      <div class="spd" data-k="hr" style="color:var(--rd)">${window.S.hr}</div>
      <div class="mu" style="text-align:center;font-size:12px;margin-top:-8px;margin-bottom:12px">
        ${window.inr('hr') ? 'Within normal clinical range' : 'Elevated'} · Continuous PPG
      </div>
      <div style="text-align:center;font-size:22px;font-weight:700;margin:4px 0 16px;font-variant-numeric:tabular-nums" data-w="t">
        ${window.formatLiveTimer(w.t)}
      </div>

      <!-- Real-Time ECG Rhythm Tracing Banner -->
      <div class="cd" style="padding:12px 14px;background:linear-gradient(180deg, color-mix(in srgb, var(--gr) 8%, var(--cd)) 0%, var(--cd) 100%)">
        <div class="rw" style="color:var(--gr);font-weight:700;font-size:12px;gap:6px">
          ${window.I('pulse', 16)}
          <span style="flex:1">Real-Time ECG Rhythm</span>
          <span class="tag" style="font-size:10px;padding:2px 6px;background:color-mix(in srgb, var(--gr) 20%, transparent);color:var(--gr)">Normal Sinus</span>
        </div>
        <svg viewBox="0 0 300 46" style="width:100%;margin-top:6px">
          <path class="dr" pathLength="1" d="M0 25H60L68 23L74 7L80 39L86 25H130L138 23L144 7L150 39L156 25H200L208 23L214 7L220 39L226 25H300" fill="none" stroke="var(--gr)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Baiget Telemetry Grid (PPG + ECG only) -->
      <div class="g2" style="gap:10px;margin:12px 0 20px">
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Blood Oxygen (SpO₂)</span>
          <div class="bm" style="color:var(--bl);margin-top:4px">
            <span data-k="sp">${window.fv('sp')}</span><small>%</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Heart Variability (HRV)</span>
          <div class="bm" style="color:var(--gr);margin-top:4px">
            <span data-k="hv">${window.fv('hv')}</span><small>ms</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Skin Temp</span>
          <div class="bm" style="color:var(--or);margin-top:4px">
            <span data-k="tp">${window.fv('tp')}</span><small>°C</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Avg Heart Rate</span>
          <div class="bm" style="color:var(--rd);margin-top:4px">
            <span data-w="ah">${w.ah || Math.round(window.S.hr)}</span><small>bpm</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Cardio Energy</span>
          <div class="bm" style="color:var(--or);margin-top:4px">
            <span data-w="kc">${Math.round(w.kc)}</span><small>kcal</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Heart Zone</span>
          <div class="bm" style="color:var(--rd);margin-top:4px">
            <span data-w="z">Zone ${window.zn()}</span>
          </div>
        </div>
      </div>

      <!-- Workout Controls -->
      <div class="ctl">
        <button class="cb" id="pz" aria-label="Pause or Resume" onclick="pz()">
          ${window.I(w.on ? 'pause' : 'play', 30)}
        </button>
        <button class="cb r" aria-label="Stop activity" onclick="fin()">
          ${window.I('stop', 30)}
        </button>
      </div>
    `;
  }

  // 2) PHYSILOG ONLY SESSION: Show Cadence, Leg Movement, Speed/Distance. Absolutely NO Baiget metrics (no HR, SpO2, ECG).
  if (isPhysilog) {
    return `
      <!-- Physilog Header -->
      <div class="rw" style="padding-top:4px">
        <span class="ic" style="color:var(--pu);background:color-mix(in srgb, var(--pu) 16%, transparent)">
          ${window.I('physilog', 22)}
        </span>
        <div style="flex:1">
          <b style="font-size:16px;font-weight:700">${w.n}</b>
          <div class="mu" style="font-size:11px;color:var(--pu);font-weight:700">Physilog Motion Telemetry Active</div>
        </div>
        <span class="tag" id="stt">${w.on ? 'Recording' : 'Paused'}</span>
      </div>

      <!-- Hero Cadence Metric -->
      <div class="lb" style="text-align:center;margin-top:16px">Live Cadence · RPM</div>
      <div class="spd" data-k="cd" style="color:var(--pu)">${window.S.cd}</div>
      <div class="mu" style="text-align:center;font-size:12px;margin-top:-8px;margin-bottom:12px">
        Optimal Pedaling Rhythm · Dynamic leg cadence
      </div>
      <div style="text-align:center;font-size:22px;font-weight:700;margin:4px 0 16px;font-variant-numeric:tabular-nums" data-w="t">
        ${window.formatLiveTimer(w.t)}
      </div>

      <!-- Bilateral Pedal Stroke Symmetry Bar -->
      <div class="cd zn-card" style="margin-bottom:14px">
        <div class="zn-card-title">Bilateral pedal balance</div>
        <div class="zn-row">
          <span class="zn-label">Left leg</span>
          <div class="zn-bar"><div class="zn-fill" style="width:50.2%;background:var(--pu)"></div></div>
          <span class="zn-val">50.2%</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Right leg</span>
          <div class="zn-bar"><div class="zn-fill" style="width:49.8%;background:#3B82F6"></div></div>
          <span class="zn-val">49.8%</span>
        </div>
      </div>

      <!-- Physilog Telemetry Grid (Motion only) -->
      <div class="g2" style="gap:10px;margin:12px 0 20px">
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Current Speed</span>
          <div class="bm" style="color:var(--ac);margin-top:4px">
            <span data-w="spd">${w.spd.toFixed(1)}</span><small>km/h</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Distance</span>
          <div class="bm" style="color:var(--tx);margin-top:4px">
            <span data-w="km">${w.km.toFixed(2)}</span><small>km</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Leg Movement</span>
          <div class="bm" style="color:var(--pu);margin-top:4px">
            <span data-k="lm">${window.fv('lm')}</span><small>%</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Max Speed</span>
          <div class="bm" style="color:var(--gr);margin-top:4px">
            <span data-w="mx">${w.mx.toFixed(1)}</span><small>km/h</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Motion Calories</span>
          <div class="bm" style="color:var(--or);margin-top:4px">
            <span data-w="kc">${Math.round(w.kc)}</span><small>kcal</small>
          </div>
        </div>
        <div class="cd" style="padding:12px 14px;margin:0">
          <span class="mu" style="font-size:12px;font-weight:600">Pedal Smoothness</span>
          <div class="bm" style="color:var(--gr);margin-top:4px">
            <span>94</span><small>%</small>
          </div>
        </div>
      </div>

      <!-- Workout Controls -->
      <div class="ctl">
        <button class="cb" id="pz" aria-label="Pause or Resume" onclick="pz()">
          ${window.I(w.on ? 'pause' : 'play', 30)}
        </button>
        <button class="cb r" aria-label="Stop activity" onclick="fin()">
          ${window.I('stop', 30)}
        </button>
      </div>
    `;
  }

  // 3) COMBINED DUAL SESSION: Show BOTH Baiget vitals and Physilog motion telemetry!
  return `
    <!-- Dual Sync Header -->
    <div class="rw" style="padding-top:4px">
      <span class="ic" style="color:var(--ac);background:color-mix(in srgb, var(--ac) 16%, transparent)">
        ${window.I('dual', 22)}
      </span>
      <div style="flex:1">
        <b style="font-size:16px;font-weight:700">${w.n}</b>
        <div class="mu" style="font-size:11px;color:var(--ac);font-weight:700">Dual Sync: Baiget + Physilog</div>
      </div>
      <span class="tag" id="stt">${w.on ? 'Recording' : 'Paused'}</span>
    </div>

    <!-- Dual Hero Display: Heart Rate & Cadence -->
    <div class="g2" style="margin-top:16px;gap:10px">
      <div class="cd" style="padding:14px;margin:0;border:1px solid color-mix(in srgb, var(--rd) 30%, var(--ln))">
        <div class="mu" style="font-size:11px;font-weight:700;color:var(--rd)">BAIGET HEART RATE</div>
        <div class="big" style="color:var(--rd);font-size:38px;margin-top:4px">
          <span data-k="hr">${window.S.hr}</span><small>bpm</small>
        </div>
      </div>
      <div class="cd" style="padding:14px;margin:0;border:1px solid color-mix(in srgb, var(--pu) 30%, var(--ln))">
        <div class="mu" style="font-size:11px;font-weight:700;color:var(--pu)">PHYSILOG CADENCE</div>
        <div class="big" style="color:var(--pu);font-size:38px;margin-top:4px">
          <span data-k="cd">${window.S.cd}</span><small>rpm</small>
        </div>
      </div>
    </div>

    <div style="text-align:center;font-size:22px;font-weight:700;margin:12px 0 16px;font-variant-numeric:tabular-nums" data-w="t">
      ${window.formatLiveTimer(w.t)}
    </div>

    <!-- Real-Time ECG Rhythm Tracing -->
    <div class="cd" style="padding:10px 14px;background:linear-gradient(180deg, color-mix(in srgb, var(--gr) 8%, var(--cd)) 0%, var(--cd) 100%)">
      <div class="rw" style="color:var(--gr);font-weight:700;font-size:12px;gap:6px">
        ${window.I('pulse', 16)}
        <span style="flex:1">Real-Time ECG Rhythm</span>
        <span class="tag" style="font-size:10px;padding:2px 6px">Sinus Rhythm</span>
      </div>
      <svg viewBox="0 0 300 40" style="width:100%;margin-top:4px">
        <path class="dr" pathLength="1" d="M0 20H60L68 18L74 4L80 34L86 20H130L138 18L144 4L150 34L156 20H200L208 18L214 4L220 34L226 20H300" fill="none" stroke="var(--gr)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Complete Integrated Telemetry Grid -->
    <div class="g2" style="gap:10px;margin:12px 0 20px">
      <div class="cd" style="padding:12px 14px;margin:0">
        <span class="mu" style="font-size:12px;font-weight:600">Speed</span>
        <div class="bm" style="color:var(--ac);margin-top:4px">
          <span data-w="spd">${w.spd.toFixed(1)}</span><small>km/h</small>
        </div>
      </div>
      <div class="cd" style="padding:12px 14px;margin:0">
        <span class="mu" style="font-size:12px;font-weight:600">Distance</span>
        <div class="bm" style="color:var(--tx);margin-top:4px">
          <span data-w="km">${w.km.toFixed(2)}</span><small>km</small>
        </div>
      </div>
      <div class="cd" style="padding:12px 14px;margin:0">
        <span class="mu" style="font-size:12px;font-weight:600">SpO₂ Oxygen</span>
        <div class="bm" style="color:var(--bl);margin-top:4px">
          <span data-k="sp">${window.fv('sp')}</span><small>%</small>
        </div>
      </div>
      <div class="cd" style="padding:12px 14px;margin:0">
        <span class="mu" style="font-size:12px;font-weight:600">HRV (ms)</span>
        <div class="bm" style="color:var(--gr);margin-top:4px">
          <span data-k="hv">${window.fv('hv')}</span><small>ms</small>
        </div>
      </div>
      <div class="cd" style="padding:12px 14px;margin:0">
        <span class="mu" style="font-size:12px;font-weight:600">Skin Temp</span>
        <div class="bm" style="color:var(--or);margin-top:4px">
          <span data-k="tp">${window.fv('tp')}</span><small>°C</small>
        </div>
      </div>
      <div class="cd" style="padding:12px 14px;margin:0">
        <span class="mu" style="font-size:12px;font-weight:600">Leg Balance</span>
        <div class="bm" style="color:var(--pu);margin-top:4px">
          <span>50.2 / 49.8</span><small>%</small>
        </div>
      </div>
    </div>

    <!-- Workout Controls -->
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
  const h = new Date().getHours();
  const timeGreeting = h < 12 ? 'Morning ' : h < 17 ? 'Afternoon ' : 'Evening ';

  let sessionName = '';
  if (ty === 'baiget') {
    sessionName = timeGreeting + 'Baiget Cardio';
  } else if (ty === 'physilog') {
    sessionName = timeGreeting + 'Physilog Ride';
  } else {
    sessionName = timeGreeting + 'Dual Training';
  }

  window.S.w = {
    ty,
    n: sessionName,
    t: 0,
    km: ty === 'baiget' ? 0 : 0.05,
    kc: 0,
    spd: ty === 'baiget' ? 0 : 21.0,
    mx: ty === 'baiget' ? 0 : 21.0,
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

  const isBaiget = w.ty === 'baiget';
  const isPhysilog = w.ty === 'physilog';
  const avg = arr => arr.length ? Math.round(arr.reduce((p, c) => p + c, 0) / arr.length) : 0;

  let r = {
    n: w.n,
    d: 'Just now',
    ty: w.ty,
    km: w.km,
    m: Math.max(1, Math.round(w.t / 60)),
    kc: Math.round(w.kc),
    hr: !isPhysilog && window.avail('hr') ? (avg(w.hs) || window.S.hr) : 0,
    cd: !isBaiget && window.hasPhysilog() ? (avg(w.cs) || window.S.cd) : 0,
    mx: +w.mx.toFixed(1),
    s: Math.random() * 5
  };

  // If user tested and stopped quickly (<5s), provide realistic demo stats
  if (w.t < 5) {
    if (isBaiget) {
      r = {
        ...r,
        km: 0,
        m: 35,
        kc: 290,
        hr: 136,
        cd: 0,
        mx: 0
      };
    } else if (isPhysilog) {
      r = {
        ...r,
        km: 14.8,
        m: 38,
        kc: 340,
        hr: 0,
        cd: 82,
        mx: 32.4
      };
    } else {
      r = {
        ...r,
        km: 22.4,
        m: 54,
        kc: 580,
        hr: 142,
        cd: 80,
        mx: 36.2
      };
    }
  }

  window.S.last = r;
  window.S.w = null;
  window.go('done');
};

// Save activity to recent list
window.save = function() {
  if (window.S.last) {
    window.R.unshift(window.S.last);
    if (window.S.last.km) {
      window.TOT.d += window.S.last.km;
      window.TOT.w += window.S.last.km;
      window.TOT.m += window.S.last.km;
    }
  }
  window.go('home');
  window.toast('Activity saved to your journal');
};

// Update live workout numbers immediately
window.updW = function() {
  const w = window.S.w;
  if (!w || window.S.sc !== 'live') return;

  const z = window.zn();
  const avSpeed = w.t > 0 && w.km ? (w.km / (w.t / 3600)) : w.spd;

  const o = {
    t: window.formatLiveTimer(w.t),
    spd: w.spd.toFixed(1),
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
};
