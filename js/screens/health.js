/* ==========================================================================
   LifePro Fit - Screen: Health, Vitals & Cardiac Rhythm (ECG)
   ========================================================================== */

window.Screens = window.Screens || {};

// Vital detailed view generator (Live stream or historical period)
window.dtv = function(k) {
  const m = window.M[k];
  const isAvail = window.avail(k);
  let r = window.S.dr;
  if (r === 'live' && !isAvail) r = 'd';
  const metricName = m[0].toUpperCase();
  let bodyHtml;

  if (r === 'live') {
    const h = window.S.H[k] || [];
    bodyHtml = `
      <div>
        <div class="hh" style="color:${m[3]}">
          <i></i>Live ${metricName}
        </div>
        <div class="big">
          <span data-k="${k}">${window.fv(k)}</span><small>${m[1]}</small>
        </div>
        <div class="mu" id="rn">
          ${window.inr(k) ? 'Within normal clinical range' : 'Out of range'} · streaming
        </div>
      </div>
      <div class="cd" style="margin-top:16px;padding:16px 10px" id="dc">
        ${window.crv(h.length > 1 ? h : [window.S[k], window.S[k]], 320, 150, m[3])}
      </div>
    `;
  } else {
    const d = window.hist(k, r);
    const avg = d.reduce((a, x) => a + x[2], 0) / d.length;
    const lab = r === 'd'
      ? [[0, '12a'], [6, '6a'], [12, '12p'], [18, '6p']]
      : r === 'w'
        ? window.l7().map((x, i) => [i, x[0]])
        : [[0, '1'], [9, '10'], [19, '20'], [29, '30']];

    window.S.hd = d;
    bodyHtml = `
      <div>
        <div class="hh" style="color:${m[3]}">
          <i></i>Avg. ${metricName}
        </div>
        <div class="big">
          <span id="hv" data-cu="${avg.toFixed(m[6])}" data-d="${m[6]}">${avg.toFixed(m[6])}</span><small>${m[1]}</small>
        </div>
        <div class="mu" id="hs">
          ${{ d: 'Today', w: 'This week', m: 'This month' }[r]} · history · tap a bar
        </div>
      </div>
      <div class="cd" style="margin-top:16px;padding:16px 10px 8px">
        ${window.hbars(d, m[3], lab)}
      </div>
    `;
  }

  const segmentTabs = [
    ...(isAvail ? [['live', 'Live']] : []),
    ['d', 'D'],
    ['w', 'W'],
    ['m', 'M']
  ];

  const periodSubtitle = { d: 'Today', w: 'This week', m: 'This month' }[r];

  return `
    ${window.bk('hl', 'Health')}
    <div class="t1" style="margin:12px 0 16px">${m[0]}</div>
    ${window.seg(segmentTabs, r, 'sdr')}
    ${bodyHtml}
    <div class="cd rw" style="margin-top:12px">
      <span class="mu" style="flex:1">Normal range</span>
      <b>${m[4]}–${m[5]} ${m[1]}</b>
    </div>
    ${window.getVitalDeepDive(k, r)}
  `;
};

// Vital Deep-Dive Intelligence Breakdown
window.getVitalDeepDive = function(k, r) {
  if (k === 'hr') {
    return `
      <!-- Heart Rate Zones Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Heart rate zones</div>
        <div class="zn-row">
          <span class="zn-label">Recovery</span>
          <div class="zn-bar"><div class="zn-fill" style="width:48%;background:#FCC232"></div></div>
          <span class="zn-val">3h 20m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Fat burn</span>
          <div class="zn-bar"><div class="zn-fill" style="width:34%;background:#3B82F6"></div></div>
          <span class="zn-val">2h 10m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Cardio</span>
          <div class="zn-bar"><div class="zn-fill" style="width:20%;background:#F59E0B"></div></div>
          <span class="zn-val">48m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Peak</span>
          <div class="zn-bar"><div class="zn-fill" style="width:8%;background:#EF4444"></div></div>
          <span class="zn-val">8m</span>
        </div>
      </div>

      <!-- 2-Column Metric Breakdown Cards -->
      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Resting heart rate</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            62 <small>bpm</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            ↓ 4 bpm vs last month
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Daily range</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            54–118 <small>bpm</small>
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Peak at 6:42 PM
          </div>
        </div>
      </div>
    `;
  }

  if (k === 'sp') {
    return `
      <!-- Oxygen Saturation Stages Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Oxygen saturation stages</div>
        <div class="zn-row">
          <span class="zn-label">Optimal (97–100%)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:88%;background:#FCC232"></div></div>
          <span class="zn-val">21h 35m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Normal (95–96%)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:18%;background:#3B82F6"></div></div>
          <span class="zn-val">2h 15m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Low (&lt;95%)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:4%;background:#EF4444"></div></div>
          <span class="zn-val">10m</span>
        </div>
      </div>

      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Sleep SpO₂ avg</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            98.2 <small>%</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            ✓ Optimal respiration
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Daily range</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            94–99 <small>%</small>
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Stable blood oxygen
          </div>
        </div>
      </div>
    `;
  }

  if (k === 'tp') {
    return `
      <!-- Temperature Variation Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Circadian temperature variation</div>
        <div class="zn-row">
          <span class="zn-label">Baseline (36.6°)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:72%;background:#FCC232"></div></div>
          <span class="zn-val">17h 40m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Night drop (-0.4°)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:24%;background:#3B82F6"></div></div>
          <span class="zn-val">5h 30m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Workout peak (+0.6°)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:10%;background:#F59E0B"></div></div>
          <span class="zn-val">50m</span>
        </div>
      </div>

      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Circadian baseline</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            36.6 <small>°C</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            Normal thermal balance
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Daily range</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            36.1–37.2 <small>°C</small>
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Lowest at 4:15 AM
          </div>
        </div>
      </div>
    `;
  }

  if (k === 'hv') {
    return `
      <!-- HRV Recovery Breakdown Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Autonomic recovery & readiness</div>
        <div class="zn-row">
          <span class="zn-label">Recovery score</span>
          <div class="zn-bar"><div class="zn-fill" style="width:84%;background:#FCC232"></div></div>
          <span class="zn-val">84 / 100</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Parasympathetic</span>
          <div class="zn-bar"><div class="zn-fill" style="width:72%;background:#3B82F6"></div></div>
          <span class="zn-val">72%</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Nervous stress</span>
          <div class="zn-bar"><div class="zn-fill" style="width:22%;background:#10B981"></div></div>
          <span class="zn-val">Low</span>
        </div>
      </div>

      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Baseline HRV</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            52 <small>ms</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            ↑ 6 ms vs baseline
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Daily range</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            26–88 <small>ms</small>
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Peak during sleep
          </div>
        </div>
      </div>
    `;
  }



  if (k === 'kc') {
    return `
      <!-- Caloric Burn Stages Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Metabolic Burn Breakdown</div>
        <div class="zn-row">
          <span class="zn-label">Fat oxidation</span>
          <div class="zn-bar"><div class="zn-fill" style="width:64%;background:#FCC232"></div></div>
          <span class="zn-val">270 kcal</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Glycogen cardio</span>
          <div class="zn-bar"><div class="zn-fill" style="width:36%;background:#F59E0B"></div></div>
          <span class="zn-val">150 kcal</span>
        </div>
      </div>
      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Active burn rate</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            520 <small>kcal/h</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            High metabolic efficiency
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Today's total</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            ${window.S.kc} <small>kcal</small>
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Target 600 kcal
          </div>
        </div>
      </div>
    `;
  }

  if (k === 'rpe') {
    return `
      <!-- Borg RPE Exertion Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Perceived Exertion Zones (Borg Scale)</div>
        <div class="zn-row">
          <span class="zn-label">Light (1–3)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:30%;background:#10B981"></div></div>
          <span class="zn-val">Warmup</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Moderate (4–6)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:55%;background:#3B82F6"></div></div>
          <span class="zn-val">Target aerobic</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Hard (7–9)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:15%;background:#EF4444"></div></div>
          <span class="zn-val">Anaerobic peak</span>
        </div>
      </div>
      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Current effort</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            ${window.S.rpe} <small>/ 10</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            Sustainable pace
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Clinical classification</div>
          <div class="bm" style="font-size:20px;margin-top:6px;font-weight:800">
            ${window.S.rpe <= 3 ? 'Light' : (window.S.rpe <= 6 ? 'Moderate' : 'Strenuous')}
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Cardiopulmonary load
          </div>
        </div>
      </div>
    `;
  }

  if (k === 'hs') {
    return `
      <!-- Autonomic Stress Balance Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Autonomic Cardiac Stress Balance</div>
        <div class="zn-row">
          <span class="zn-label">Parasympathetic (Recovery)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:${Math.max(10, 100 - window.S.hs)}%;background:#10B981"></div></div>
          <span class="zn-val">${Math.max(10, 100 - window.S.hs)}%</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Sympathetic (Cardiac Stress)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:${window.S.hs}%;background:#8B5CF6"></div></div>
          <span class="zn-val">${window.S.hs}%</span>
        </div>
      </div>
      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Cardiac stress index</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            ${window.S.hs} <small>%</small>
          </div>
          <div style="color:${window.S.hs < 40 ? 'var(--gr)' : 'var(--or)'};font-size:11px;font-weight:700;margin-top:4px">
            ${window.S.hs < 35 ? '✓ Well rested & recovered' : 'Moderate stress load'}
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Derived from</div>
          <div class="bm" style="font-size:17px;margin-top:6px;font-weight:800">
            HRV + ECG PPG
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Continuous Baiget sync
          </div>
        </div>
      </div>
    `;
  }

  if (k === 'cd') {
    return `
      <!-- Cadence Zones Card -->
      <div class="cd zn-card">
        <div class="zn-card-title">Cadence efficiency zones</div>
        <div class="zn-row">
          <span class="zn-label">Optimal (80–95)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:65%;background:#FCC232"></div></div>
          <span class="zn-val">34m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Power torque (&lt;75)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:22%;background:#F59E0B"></div></div>
          <span class="zn-val">12m</span>
        </div>
        <div class="zn-row">
          <span class="zn-label">Spin speed (>95)</span>
          <div class="zn-bar"><div class="zn-fill" style="width:13%;background:#3B82F6"></div></div>
          <span class="zn-val">6m</span>
        </div>
      </div>

      <div class="g2" style="margin-top:12px">
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Average cadence</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            78 <small>rpm</small>
          </div>
          <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
            Smooth pedaling rhythm
          </div>
        </div>
        <div class="cd" style="padding:16px 14px;margin:0">
          <div class="mu" style="font-size:12px;font-weight:600">Peak cadence</div>
          <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
            108 <small>rpm</small>
          </div>
          <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
            Sprint at 6:35 PM
          </div>
        </div>
      </div>
    `;
  }

  // Leg movement (lm)
  return `
    <!-- Pedal Stroke Symmetry Card -->
    <div class="cd zn-card">
      <div class="zn-card-title">Pedal stroke symmetry</div>
      <div class="zn-row">
        <span class="zn-label">Left leg</span>
        <div class="zn-bar"><div class="zn-fill" style="width:49.4%;background:#FCC232"></div></div>
        <span class="zn-val">49.4%</span>
      </div>
      <div class="zn-row">
        <span class="zn-label">Right leg</span>
        <div class="zn-bar"><div class="zn-fill" style="width:50.6%;background:#3B82F6"></div></div>
        <span class="zn-val">50.6%</span>
      </div>
      <div class="zn-row">
        <span class="zn-label">Smoothness</span>
        <div class="zn-bar"><div class="zn-fill" style="width:94%;background:#10B981"></div></div>
        <span class="zn-val">94%</span>
      </div>
    </div>

    <div class="g2" style="margin-top:12px">
      <div class="cd" style="padding:16px 14px;margin:0">
        <div class="mu" style="font-size:12px;font-weight:600">Bilateral balance</div>
        <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
          50 / 50 <small>%</small>
        </div>
        <div style="color:var(--gr);font-size:11px;font-weight:700;margin-top:4px">
          Optimal symmetry (±0.6%)
        </div>
      </div>
      <div class="cd" style="padding:16px 14px;margin:0">
        <div class="mu" style="font-size:12px;font-weight:600">Active pedal time</div>
        <div class="bm" style="font-size:24px;margin-top:6px;font-weight:800">
          48 <small>min</small>
        </div>
        <div class="mu" style="font-size:11px;font-weight:500;margin-top:4px">
          92% continuous drive
        </div>
      </div>
    </div>
  `;
};

// Health Overview Screen
window.Screens.hl = function() {
  const hasB = window.hasBaiget();
  const hasP = window.hasPhysilog();
  const hasBoth = hasB && hasP;

  let ks = [];
  let screenTitle = 'Health';
  let badgeLabel = '';

  if (hasBoth) {
    screenTitle = 'Telemetry & Health';
    badgeLabel = '● Baiget + Physilog Connected';
    ks = ['hr', 'sp', 'tp', 'hv', 'cd', 'lm'];
  } else if (hasB) {
    screenTitle = 'Baiget Health & Vitals';
    badgeLabel = '● Baiget PPG + ECG Active';
    ks = ['hr', 'sp', 'tp', 'hv'];
  } else if (hasP) {
    screenTitle = 'Physilog Biomechanics';
    badgeLabel = '● Physilog Motion Active';
    ks = ['cd', 'lm'];
  } else {
    screenTitle = 'Health & Telemetry';
    badgeLabel = '○ Connect Sensor';
    ks = ['hr', 'sp', 'tp', 'hv'];
  }

  return `
    <div class="rw" style="margin-bottom:8px">
      <div class="t1" style="flex:1">${screenTitle}</div>
      <button class="ble-btn ${window.nc() > 0 ? 'connected' : ''}" aria-label="Bluetooth Sensors" onclick="go('dev')" title="Bluetooth Sensors">
        ${window.I('bt', 20)}
        ${window.nc() > 0 ? '<span class="ble-badge"></span>' : ''}
      </button>
    </div>



    <!-- Real-Time ECG Link Banner (Only if Baiget PPG+ECG is active) -->
    ${hasB ? `
      <div class="cd" onclick="go('ecg')" style="cursor:pointer;padding:14px 16px;background:linear-gradient(180deg, color-mix(in srgb, var(--gr) 8%, var(--cd)) 0%, var(--cd) 100%)">
        <div class="rw" style="color:var(--gr);font-weight:700;font-size:13px;gap:8px">
          ${window.I('pulse', 16)}
          <span style="flex:1">Real-Time ECG Cardiac Rhythm</span>
          ${window.I('chev', 16)}
        </div>
        <svg viewBox="0 0 300 46" style="width:100%;margin-top:10px">
          <path class="dr" pathLength="1" d="M0 26H60L68 24L74 8L80 40L86 26H130L138 24L144 8L150 40L156 26H200L208 24L214 8L220 40L226 26H300" fill="none" stroke="var(--gr)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    ` : ''}

    ${hasP && !hasB ? `
      <!-- Physilog Pedal Stroke Symmetry Banner -->
      <div class="cd zn-card" style="margin-bottom:14px">
        <div class="zn-card-title">Physilog Leg Balance & Gait</div>
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
    ` : ''}

    <!-- Dynamic Metric Tiles Grid -->
    <div class="g2">
      ${ks.map(window.tl).join('')}
    </div>

    ${hasB ? `
      <!-- Baiget Cardio Exertion, RPE & Heart Stress Section -->
      <div class="t2" style="font-size:13px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:0.04em;margin:18px 4px 8px">Cardio Exertion & Heart Stress</div>
      <div class="sx" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:14px">
        <div onclick="det('kc')" style="cursor:pointer;padding:12px 10px">
          <div class="rw" style="color:var(--or);font-size:11px;font-weight:700;gap:4px">
            ${window.I('bolt', 13)}Calories
          </div>
          <b style="font-size:16px;margin-top:4px"><span data-k="kc">${window.fv('kc')}</span> <small style="font-size:11px;font-weight:600;color:var(--mu)">kcal</small></b>
          <div class="mu" style="font-size:10px;margin-top:2px">Active burn</div>
        </div>
        <div onclick="det('rpe')" style="cursor:pointer;padding:12px 10px">
          <div class="rw" style="color:#3B82F6;font-size:11px;font-weight:700;gap:4px">
            ${window.I('award', 13)}RPE
          </div>
          <b style="font-size:16px;margin-top:4px"><span data-k="rpe">${window.fv('rpe')}</span> <small style="font-size:11px;font-weight:600;color:var(--mu)">/ 10</small></b>
          <div class="mu" style="font-size:10px;margin-top:2px">Borg scale</div>
        </div>
        <div onclick="det('hs')" style="cursor:pointer;padding:12px 10px">
          <div class="rw" style="color:#8B5CF6;font-size:11px;font-weight:700;gap:4px">
            ${window.I('pulse', 13)}Heart stress
          </div>
          <b style="font-size:16px;margin-top:4px"><span data-k="hs">${window.fv('hs')}</span><small style="font-size:11px;font-weight:600;color:var(--mu)">%</small></b>
          <div class="mu" style="font-size:10px;margin-top:2px">${window.S.hs < 35 ? 'Low stress' : (window.S.hs < 65 ? 'Moderate' : 'Elevated')}</div>
        </div>
      </div>
    ` : ''}

    ${ks.includes('hr') ? `
      <div class="mu" style="margin-top:10px;text-align:center;font-size:12px">
        Max estimated heart rate: ${220 - window.S.u.age} bpm · Baiget Clinical PPG
      </div>
    ` : ''}
  `;
};

// Vital detail route
window.Screens.det = function(k) {
  return window.dtv(k);
};

// ECG Cardiac Rhythm Screen
window.Screens.ecg = function() {
  const hr = Math.round(window.S.hr);
  const B = [
    [0, 30], [20, 30], [24, 27], [28, 30], [40, 30],
    [44, 33], [48, 4], [52, 50], [56, 30], [72, 30],
    [80, 24], [88, 30], [110, 30]
  ];
  const pth = Array.from({ length: 6 }, (_, i) =>
    B.map(([x, y], j) => (i || j ? 'L' : 'M') + (x + i * 110 - 110) + ' ' + y).join('')
  ).join('');

  return `
    ${window.bk('hl', 'Health')}
    <div class="t1" style="margin:12px 0 16px">Heart rhythm</div>

    ${window.S.c.e ? `
      <div class="cd ecg-monitor" style="overflow:hidden;padding:0">
        <svg viewBox="0 0 330 60" style="width:100%;display:block">
          <g class="ek" style="animation-duration:${(60 / Math.max(hr, 40)).toFixed(2)}s">
            <path d="${pth}" fill="none" stroke="var(--gr)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
          </g>
        </svg>
      </div>

      <div class="sx" style="grid-template-columns:1fr 1fr;margin-top:14px">
        <div class="mu">Heart rate<b><span data-k="hr">${window.fv('hr')}</span> bpm</b></div>
        <div class="mu">HRV<b><span data-k="hv">${window.fv('hv')}</span> ms</b></div>
      </div>
    ` : window.emp('pulse', 'ECG sensor not connected', 'Pair your SmartGrip ECG sensor to stream continuous cardiac waveforms.')}
  `;
};

// Open Vital detail
window.det = function(k) {
  window.S.dr = window.avail(k) ? 'live' : 'd';
  window.go('det', k);
};

// Change detail period
window.sdr = function(k) {
  window.S.dr = k;
  window.go('det', window.S.a);
};

// Pick a historical bar in Health detail
window.pk = function(i) {
  const x = window.S.hd[i];
  const k = window.S.a;
  if (!x || !window.M[k]) return;
  const hv = window.$('#hv');
  const hs = window.$('#hs');
  if (hv) hv.textContent = x[2];
  if (hs) hs.textContent = `${x[0]}–${x[1]} ${window.M[k][1]} · ${window.bl(window.S.dr, i)}`;
};
