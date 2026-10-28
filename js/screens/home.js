/* ==========================================================================
   LifePro Fit - Screen: Home Dashboard
   ========================================================================== */

window.Screens = window.Screens || {};

// Vital summary tile component
window.tl = function(k) {
  const m = window.M[k];
  const isAvail = window.avail(k);
  return `
    <div class="cd" onclick="det('${k}')" style="padding:14px">
      <div class="rw" style="color:${m[3]};font-weight:600;font-size:13px;gap:8px">
        ${window.I(m[2], 16)}${m[0]}
      </div>
      <div class="bm" style="margin-top:10px">
        <span data-k="${k}">${window.tv(k)}</span><small>${m[1]}</small>
      </div>
      <div class="mu" style="margin-top:2px;${isAvail ? 'color:var(--ac);font-weight:600' : ''}">
        ${isAvail ? 'Live streaming' : 'Today’s avg'}
      </div>
    </div>
  `;
};

window.Screens.home = function() {
  const hasB = window.hasBaiget();
  const hasP = window.hasPhysilog();
  const hasBoth = hasB && hasP;
  const isNone = !hasB && !hasP;

  const r = window.S.rg;
  const t = window.TOT[r];
  const g = window.GL()[r];
  const p = Math.min(1, t / g);
  const lb = { d: 'Today', w: 'This week', m: 'This month' }[r];

  // Filter metrics strictly according to connected device
  let availableKeys = [];
  if (hasBoth) {
    availableKeys = ['hr', 'cd', 'sp', 'hv', 'lm'];
  } else if (hasB) {
    availableKeys = ['hr', 'sp', 'tp', 'hv'];
  } else if (hasP) {
    availableKeys = ['cd', 'lm'];
  }

  const lv = availableKeys.filter(window.avail).slice(0, 4);

  // Recent workout matching connected device
  const recent = window.R.find(item => {
    if (hasBoth) return true;
    if (hasB) return item.ty === 'baiget' || item.hr > 0;
    if (hasP) return item.ty === 'physilog' || item.cd > 0;
    return true;
  }) || window.R[0];

  return `
    <!-- Top Bar Header -->
    <div class="rw" style="margin-bottom:14px">
      <div style="flex:1">
        <div class="mu">${window.date()}</div>
        <div class="t1">${window.S.u.name.trim() ? 'Hi, ' + window.fn() : 'Home'}</div>
      </div>
      <button class="ble-btn ${window.nc() > 0 ? 'connected' : ''}" aria-label="Bluetooth Sensors" onclick="go('dev')" title="Bluetooth Sensors">
        ${window.I('bt', 20)}
        ${window.nc() > 0 ? '<span class="ble-badge"></span>' : ''}
      </button>
      <button class="av" aria-label="Settings" onclick="go('me')">
        ${window.ini()}
      </button>
    </div>



    ${isNone ? `
      <!-- Welcome Device Connection Prompt -->
      <div class="cd" style="padding:18px;text-align:center;background:linear-gradient(165deg, color-mix(in srgb, var(--ac) 10%, var(--cd)) 0%, var(--cd) 100%)">
        <div class="t2" style="justify-content:center;margin:0 0 6px">Connect your sensor</div>
        <p class="mu" style="font-size:13px;line-height:1.4;margin-bottom:14px">
          LifePro Fit streams live biometric and motion telemetry from Baiget and Physilog.
        </p>
        <div style="display:flex;gap:8px;justify-content:center">
          <button class="tag" style="background:var(--rd);color:#fff;padding:6px 14px" onclick="window.setDeviceState('baiget')">
            Connect Baiget
          </button>
          <button class="tag" style="background:var(--pu);color:#fff;padding:6px 14px" onclick="window.setDeviceState('physilog')">
            Connect Physilog
          </button>
        </div>
      </div>
    ` : ''}

    ${hasB && !hasP ? `
      <!-- HERO 1: Baiget (Distance KM in ring, Heart Rate, SpO2, HRV, Body Temp in cards) -->
      <div class="hc">
        ${window.seg([['d', 'D'], ['w', 'W'], ['m', 'M']], r, 'sr')}
        <div class="rg">
          ${window.ring(p, 236, 18, 'url(#g1)', 'color-mix(in srgb, var(--ac) 18%, var(--ln))')}
          <div class="rc">
            <span>${lb}</span>
            <b data-cu="${t.toFixed(1)}" data-d="1">${t.toFixed(1)}</b>
            <small>of ${g} km goal</small>
          </div>
        </div>
        <div class="chs">
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--rd)">${window.I('heart', 15)}</span>
              <span class="chp-label">Heart Rate</span>
            </div>
            <div class="chp-val" style="color:var(--rd)">
              <b><span data-k="hr">${window.S.hr}</span></b>
              <small>bpm</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--bl)">${window.I('drop', 15)}</span>
              <span class="chp-label">SpO₂ Level</span>
            </div>
            <div class="chp-val" style="color:var(--bl)">
              <b><span data-k="sp">${window.fv('sp')}</span></b>
              <small>%</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--gr)">${window.I('pulse', 15)}</span>
              <span class="chp-label">Avg HRV</span>
            </div>
            <div class="chp-val" style="color:var(--gr)">
              <b><span data-k="hv">${window.fv('hv')}</span></b>
              <small>ms</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--or)">${window.I('temp', 15)}</span>
              <span class="chp-label">Body Temp</span>
            </div>
            <div class="chp-val" style="color:var(--or)">
              <b><span data-k="tp">${window.fv('tp')}</span></b>
              <small>°C</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time ECG Rhythm Waveform Banner on Home -->
      <div class="cd" onclick="go('ecg')" style="cursor:pointer;padding:12px 14px;margin-top:14px;background:linear-gradient(180deg, color-mix(in srgb, var(--gr) 8%, var(--cd)) 0%, var(--cd) 100%)">
        <div class="rw" style="color:var(--gr);font-weight:700;font-size:12px;gap:6px">
          ${window.I('pulse', 16)}
          <span style="flex:1">Real-Time ECG Rhythm Tracing</span>
          <span class="tag" style="font-size:10px;padding:2px 6px">Live · View ECG</span>
        </div>
        <svg viewBox="0 0 300 44" style="width:100%;margin-top:6px">
          <path class="dr" pathLength="1" d="M0 24H60L68 22L74 6L80 38L86 24H130L138 22L144 6L150 38L156 24H200L208 22L214 6L220 38L226 24H300" fill="none" stroke="var(--gr)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    ` : ''}

    ${hasP && !hasB ? `
      <!-- HERO 2: Physilog (Cadence in ring, Distance, Speed, Leg balance, Energy in cards) -->
      <div class="hc" style="background:linear-gradient(165deg, color-mix(in srgb, var(--pu) 15%, var(--cd)) 0%, var(--cd) 100%)">
        ${window.seg([['d', 'D'], ['w', 'W'], ['m', 'M']], r, 'sr')}
        <div class="rg">
          ${window.ring(Math.min(1, window.S.cd / 100), 236, 18, 'url(#g1)', 'color-mix(in srgb, var(--pu) 22%, var(--ln))')}
          <div class="rc">
            <span style="color:var(--pu);font-weight:700">Cadence</span>
            <b data-k="cd" style="color:var(--tx)">${window.S.cd}</b>
            <small style="color:var(--pu)">rpm · live rhythm</small>
          </div>
        </div>
        <div class="chs">
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--ac)">${window.I('run', 15)}</span>
              <span class="chp-label">Steps Count</span>
            </div>
            <div class="chp-val" style="color:var(--ac)">
              <b>${window.f(Math.round(t * 480))}</b>
              <small>steps</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--gr)">${window.I('timer', 15)}</span>
              <span class="chp-label">Walking Speed</span>
            </div>
            <div class="chp-val" style="color:var(--gr)">
              <b>5.2</b>
              <small>km/h</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--pu)">${window.I('pulse', 15)}</span>
              <span class="chp-label">Leg Balance</span>
            </div>
            <div class="chp-val" style="color:var(--pu)">
              <b><span data-k="lm">${window.fv('lm')}</span></b>
              <small>%</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--or)">${window.I('bolt', 15)}</span>
              <span class="chp-label">Calories</span>
            </div>
            <div class="chp-val" style="color:var(--or)">
              <b>${window.f(t * 25)}</b>
              <small>kcal</small>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    ${hasBoth ? `
      <!-- HERO 3: Combined Dual Goal Card (Baiget + Physilog) -->
      <div class="hc">
        ${window.seg([['d', 'D'], ['w', 'W'], ['m', 'M']], r, 'sr')}
        <div class="rg">
          ${window.ring(p, 236, 18, 'url(#g1)', 'color-mix(in srgb, var(--ac) 18%, var(--ln))')}
          <div class="rc">
            <span>${lb} Distance</span>
            <b data-cu="${t.toFixed(1)}" data-d="1">${t.toFixed(1)}</b>
            <small>of ${g} km goal</small>
          </div>
        </div>
        <div class="chs">
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--rd)">${window.I('heart', 15)}</span>
              <span class="chp-label">Heart Rate</span>
            </div>
            <div class="chp-val" style="color:var(--rd)">
              <b><span data-k="hr">${window.S.hr}</span></b>
              <small>bpm</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--pu)">${window.I('physilog', 15)}</span>
              <span class="chp-label">Cadence</span>
            </div>
            <div class="chp-val" style="color:var(--pu)">
              <b><span data-k="cd">${window.S.cd}</span></b>
              <small>rpm</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--bl)">${window.I('drop', 15)}</span>
              <span class="chp-label">SpO₂ Level</span>
            </div>
            <div class="chp-val" style="color:var(--bl)">
              <b><span data-k="sp">${window.fv('sp')}</span></b>
              <small>%</small>
            </div>
          </div>
          <div class="chp">
            <div class="chp-head">
              <span class="chp-icon" style="color:var(--or)">${window.I('bolt', 15)}</span>
              <span class="chp-label">Total Energy</span>
            </div>
            <div class="chp-val" style="color:var(--or)">
              <b>${window.f(t * 25)}</b>
              <small>kcal</small>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Quick Start CTA -->
    <button class="btn" onclick="go('start')" style="margin-top:14px;margin-bottom:6px">
      ${window.I('play', 18)}Start session
    </button>



    ${!hasB && hasP || hasBoth ? `
      <!-- 7-Day Distance Activity Trend (Shown for Physilog & Both) -->
      <div class="t2">
        Distance · last 7 days
        <a onclick="go('rides')">See activity</a>
      </div>
      <div class="cd" style="padding:14px 10px 10px">
        ${window.crv(window.WK, 320, 110, 'var(--ac)')}
        <div class="wl">
          ${window.l7().map((d, i) => `
            <span class="${i === 6 ? 'on' : ''}">${d}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${hasB && !hasP ? `
      <!-- 7-Day Heart Rate Rest & Strain Trend (Shown for Baiget) -->
      <div class="t2">
        Resting heart rate · last 7 days
        <a onclick="go('hl')">See vitals</a>
      </div>
      <div class="cd" style="padding:14px 10px 10px">
        ${window.crv([62, 64, 61, 63, 60, 62, 61], 320, 110, 'var(--rd)')}
        <div class="wl">
          ${window.l7().map((d, i) => `
            <span class="${i === 6 ? 'on' : ''}">${d}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Recent Session Card -->
    ${recent ? `
      <div class="t2">
        Recent session
        <a onclick="go('rd', 0)">Details</a>
      </div>
      <div class="cd" onclick="go('rd', 0)">
        ${recent.km ? window.route(recent.s || 1, 110) : ''}
        <div class="rw" style="margin-top:${recent.km ? '12px' : '0'}">
          <span class="ic" style="color:${recent.ty === 'baiget' ? 'var(--rd)' : 'var(--pu)'}">
            ${window.I(recent.ty === 'baiget' ? 'baiget' : recent.ty === 'physilog' ? 'physilog' : 'dual', 20)}
          </span>
          <div style="flex:1;margin-left:8px">
            <b>${recent.n}</b>
            <div class="mu">${recent.d}</div>
          </div>
          <div style="text-align:right">
            <b>${recent.km ? recent.km.toFixed(1) + ' km' : (recent.hr || 136) + ' bpm'}</b>
            <div class="mu">${window.hm(recent.m)}</div>
          </div>
        </div>
      </div>
    ` : ''}
  `;
};
