/* ==========================================================================
   LifePro Fit - Screen: Settings & Device Configuration (Production-Grade)
   ========================================================================== */

window.Screens = window.Screens || {};

window.Screens.me = function() {
  const count = window.nc();
  const bmi = window.calcBMI();

  // Ensure default preference flags in state
  if (window.S.autoConnect === undefined) window.S.autoConnect = true;
  if (window.S.units === undefined) window.S.units = 'm';
  if (window.S.tempUnit === undefined) window.S.tempUnit = 'c';
  if (window.S.goal === undefined) window.S.goal = 20;

  // BMI indicator needle position (clamped between 5% and 95%)
  const bmiPct = Math.max(5, Math.min(95, ((bmi.val - 15) / (35 - 15)) * 100));

  return `
    <div class="t1" style="margin-bottom:18px">Settings</div>

    <!-- 1. Profile Summary Hero Card -->
    <div class="cd" style="padding:16px;cursor:pointer;margin-bottom:12px" onclick="go('profile_edit')">
      <div class="rw" style="gap:14px;align-items:center">
        <div class="av" style="width:58px;height:58px;font-size:20px;border:2.5px solid var(--ac);box-shadow:0 4px 14px color-mix(in srgb, var(--ac) 25%, transparent);flex-shrink:0">
          ${window.ini()}
        </div>
        <div style="flex:1;min-width:0">
          <div class="rw" style="gap:8px;align-items:center;margin-bottom:2px">
            <b style="font-size:17px;font-weight:800;letter-spacing:-0.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${window.nm()}</b>
            <span class="setting-badge" style="font-size:10px;padding:2px 7px;background:color-mix(in srgb, var(--ac) 20%, transparent);color:var(--tx);font-weight:700">PRO</span>
          </div>
          <div class="mu" style="font-size:12px;margin-bottom:6px">john.doe@lifepro.fit</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span class="setting-badge">${window.S.u.age} yrs</span>
            <span class="setting-badge">${window.S.u.h} cm</span>
            <span class="setting-badge">${window.S.u.w} kg</span>
            <span class="setting-badge" style="color:${bmi.color};font-weight:700">BMI ${bmi.text}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;color:var(--ac);font-size:13px;font-weight:700;gap:2px;flex-shrink:0">
          <span>Edit</span>
          ${window.I('chev', 16)}
        </div>
      </div>
    </div>

    <!-- 2. Body Mass Index Spectrum Indicator -->
    <div class="cd" style="padding:14px 16px;margin-bottom:20px">
      <div class="rw" style="justify-content:space-between;margin-bottom:10px">
        <span class="lb" style="font-weight:700">Body Mass Index</span>
        <b style="color:${bmi.color};font-size:13px">${bmi.text} kg/m² · ${bmi.cat}</b>
      </div>
      <!-- Track bar with marker needle -->
      <div style="position:relative;margin:10px 0 6px">
        <div style="height:7px;border-radius:99px;display:flex;gap:3px;overflow:hidden;background:var(--s2)">
          <div style="flex:18.5;border-radius:3px;background:var(--bl);opacity:${bmi.val < 18.5 ? '1' : '0.4'}" title="Underweight (<18.5)"></div>
          <div style="flex:6.4;border-radius:3px;background:var(--gr);opacity:${bmi.val >= 18.5 && bmi.val < 25 ? '1' : '0.4'}" title="Normal (18.5-24.9)"></div>
          <div style="flex:5;border-radius:3px;background:var(--or);opacity:${bmi.val >= 25 && bmi.val < 30 ? '1' : '0.4'}" title="Overweight (25-29.9)"></div>
          <div style="flex:10;border-radius:3px;background:var(--rd);opacity:${bmi.val >= 30 ? '1' : '0.4'}" title="Obese (30+)"></div>
        </div>
        <!-- Pointer Needle -->
        <div style="position:absolute;top:-4px;left:${bmiPct}%;transform:translateX(-50%);width:15px;height:15px;border-radius:50%;background:var(--tx);border:2.5px solid var(--cd);box-shadow:0 2px 5px rgba(0,0,0,0.25);pointer-events:none;transition:left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)"></div>
      </div>
      <div class="rw" style="justify-content:space-between;font-size:11px;font-weight:600;color:var(--mu);margin-top:10px">
        <span>Under (<18.5)</span>
        <span>Normal (18.5–24.9)</span>
        <span>Over (25–29.9)</span>
        <span>Obese (30+)</span>
      </div>
    </div>

    <!-- 3. Workout Goals -->
    <div class="t2" style="font-size:13px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:0.04em;margin:0 4px 8px">Workout Goals</div>
    <div class="cd rw" style="justify-content:space-between;padding:16px;margin-bottom:20px">
      <div>
        <b style="font-size:15px">Daily distance target</b>
        <div class="mu" style="font-size:12px;margin-top:2px">Target to complete daily goal ring</div>
      </div>
      <div class="rw" style="gap:8px">
        <button class="ib" style="width:34px;height:34px" aria-label="Decrease Goal" onclick="window.S.goal = Math.max(5, window.S.goal - 5); go('me')">
          ${window.I('minus', 16)}
        </button>
        <span style="font-size:16px;font-weight:800;min-width:68px;text-align:center;font-variant-numeric:tabular-nums">${window.S.goal} km</span>
        <button class="ib" style="width:34px;height:34px" aria-label="Increase Goal" onclick="window.S.goal += 5; go('me')">
          ${window.I('plus', 16)}
        </button>
      </div>
    </div>

    <!-- 4. Devices & Sensors -->
    <div class="t2" style="font-size:13px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:0.04em;margin:0 4px 8px">Devices & Sensors</div>
    <div class="cd ls" style="padding:4px 16px;margin-bottom:20px">
      <!-- Bluetooth Devices -->
      <div class="li" onclick="go('dev')">
        <span class="ic" style="--c:var(--bl);width:36px;height:36px">${window.I('bt', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Devices</b>
          <div class="mu" style="font-size:12px">${count ? `${count} paired & connected` : 'Baiget & Physilog ready'}</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="setting-badge ${count ? 'success' : ''}" style="font-size:11px">
            <i class="dot"></i>${count ? `${count} Active` : 'Scan'}
          </span>
          ${window.I('chev', 16)}
        </div>
      </div>

      <!-- Auto-Reconnect Device -->
      <div class="li" onclick="window.toggleSetting('autoConnect')">
        <span class="ic" style="--c:var(--gr);width:36px;height:36px">${window.I('refresh', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Auto-reconnect device</b>
          <div class="mu" style="font-size:12px">Pair automatically on app launch</div>
        </div>
        <div class="toggle-switch ${window.S.autoConnect ? 'on' : ''}"></div>
      </div>
    </div>

    <!-- 5. App Preferences (Units & Appearance) -->
    <div class="t2" style="font-size:13px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:0.04em;margin:0 4px 8px">Preferences</div>
    <div class="cd" style="padding:16px;margin-bottom:20px">
      <!-- Distance / Speed Units -->
      <div class="rw" style="justify-content:space-between;align-items:center;gap:12px;margin-bottom:4px">
        <div style="flex:1;min-width:0">
          <b style="font-size:14px;white-space:nowrap">Units of measurement</b>
          <div class="mu" style="font-size:12px;margin-top:2px">Pace, speed and distance</div>
        </div>
        <div style="width:130px;flex-shrink:0">
          ${window.seg([['m', 'km / kg'], ['i', 'mi / lb']], window.S.units, 'setUnits')}
        </div>
      </div>

      <div style="height:1px;background:var(--ln);margin:14px 0"></div>

      <!-- Temperature Format -->
      <div class="rw" style="justify-content:space-between;align-items:center;gap:12px;margin-bottom:4px">
        <div style="flex:1;min-width:0">
          <b style="font-size:14px;white-space:nowrap">Temperature format</b>
          <div class="mu" style="font-size:12px;margin-top:2px">Sensors & weather metrics</div>
        </div>
        <div style="width:110px;flex-shrink:0">
          ${window.seg([['c', '°C'], ['f', '°F']], window.S.tempUnit, 'setTempUnit')}
        </div>
      </div>

      <div style="height:1px;background:var(--ln);margin:14px 0"></div>

      <!-- Color Mode -->
      <div class="lb" style="margin-bottom:10px">Color mode</div>
      ${window.seg([['a', 'Auto'], ['l', 'Light'], ['d', 'Dark']], window.S.th, 'sth')}
      
      <!-- Accent Palette -->
      <div class="lb" style="margin-top:16px;margin-bottom:10px">Accent palette</div>
      <div class="sws">
        ${Object.entries(window.ACC).map(([k, [n, c]]) => `
          <button class="swt ${k === window.S.ac ? 'on' : ''}" 
                  data-k="${k}" 
                  aria-label="${n}" 
                  style="background:${c};color:${c}" 
                  onclick="sa('${k}')">
            <span style="color:${k === 'yellow' ? '#161204' : '#fff'};display:grid">${window.I('check', 20)}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- 6. Data & Storage -->
    <div class="t2" style="font-size:13px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:0.04em;margin:0 4px 8px">Data & Storage</div>
    <div class="cd ls" style="padding:4px 16px;margin-bottom:20px">
      <!-- Export Workout Data -->
      <div class="li" onclick="window.toast('Exporting 14 workouts in GPX & FIT archive...')">
        <span class="ic" style="--c:var(--bl);width:36px;height:36px">${window.I('download', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Export workout records</b>
          <div class="mu" style="font-size:12px">Download GPX, FIT & CSV archives</div>
        </div>
        ${window.I('chev', 16)}
      </div>

      <!-- Offline Cache Cleanup -->
      <div class="li" onclick="window.clearCache()">
        <span class="ic" style="--c:var(--mu);width:36px;height:36px">${window.I('trash', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Offline map & telemetry cache</b>
          <div class="mu" style="font-size:12px">3.4 MB cached sensor tiles</div>
        </div>
        <button class="btn s" style="margin:0;padding:6px 12px;font-size:12px;width:auto">Clear</button>
      </div>
    </div>

    <!-- 7. About LifePro Fit & Production Version Information -->
    <div class="t2" style="font-size:13px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:0.04em;margin:0 4px 8px">About LifePro Fit</div>
    <div class="cd ls" style="padding:4px 16px;margin-bottom:24px">
      <!-- App Version Display -->
      <div class="li" style="cursor:default">
        <span class="ic" style="--c:var(--ac);width:36px;height:36px">${window.I('info', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Application Version</b>
          <div class="mu" style="font-size:12px">v2.4.2 (Build 204) · Production</div>
        </div>
        <span class="setting-badge success">
          <i class="dot"></i>Up to date
        </span>
      </div>

      <!-- Help Center -->
      <div class="li" onclick="window.toast('Opening LifePro Fit Knowledgebase...')">
        <span class="ic" style="--c:var(--bl);width:36px;height:36px">${window.I('info', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Help Center & FAQs</b>
          <div class="mu" style="font-size:12px">Guides, sensor setup & troubleshooting</div>
        </div>
        ${window.I('chev', 16)}
      </div>

      <!-- Terms of Service & Privacy -->
      <div class="li" onclick="window.toast('Opening Privacy & Terms...')">
        <span class="ic" style="--c:var(--mu);width:36px;height:36px">${window.I('shield', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Terms of Service & Privacy</b>
          <div class="mu" style="font-size:12px">Data privacy & clinical disclaimer</div>
        </div>
        ${window.I('chev', 16)}
      </div>

      <!-- Rate App -->
      <div class="li" onclick="window.toast('Thank you for rating LifePro Fit!')">
        <span class="ic" style="--c:var(--or);width:36px;height:36px">${window.I('star', 18)}</span>
        <div style="flex:1;margin-left:6px;min-width:0">
          <b>Rate LifePro Fit</b>
          <div class="mu" style="font-size:12px">Support us on App Store & Play Store</div>
        </div>
        <div style="display:flex;align-items:center;gap:4px">
          <span style="color:var(--or);font-size:12px">★★★★★</span>
          ${window.I('chev', 16)}
        </div>
      </div>
    </div>

    <!-- 8. Account Danger Zone -->
    <div style="margin-bottom:28px">
      <button class="btn d" style="font-size:14px;padding:12px;width:100%" onclick="window.resetDemoData()">
        Reset demo data to defaults
      </button>
    </div>
  `;
};

// Setting Interaction Actions
window.toggleSetting = function(key) {
  window.S[key] = !window.S[key];
  window.go('me');
  const labels = {
    autoConnect: 'Auto-reconnect device'
  };
  const name = labels[key] || key;
  window.toast(`${name} ${window.S[key] ? 'enabled' : 'disabled'}`);
};

window.setUnits = function(unit) {
  window.S.units = unit;
  window.toast(`Units set to ${unit === 'm' ? 'Metric (km/kg)' : 'Imperial (mi/lb)'}`);
  window.go('me');
};

window.setTempUnit = function(unit) {
  window.S.tempUnit = unit;
  window.toast(`Temperature set to ${unit === 'c' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}`);
  window.go('me');
};

window.clearCache = function() {
  window.toast('Offline cache cleared · 3.4 MB freed');
};

window.resetDemoData = function() {
  window.S.u = { name: '', g: 'Male', age: 25, h: 173, w: 65 };
  window.S.goal = 20;
  window.toast('Demo profile reset to factory defaults');
  window.go('me');
};

// Appearance actions
window.sth = function(k) {
  window.S.th = k;
  window.ap();
  window.go('me');
};

window.sa = function(k) {
  window.S.ac = k;
  window.ap();
  document.querySelectorAll('.swt').forEach(e => {
    e.classList.toggle('on', e.dataset.k === k);
  });
  window.toast(window.ACC[k][0] + ' accent applied');
};

// Open share bottom sheet modal
window.shr = function(r) {
  window.S.sr = r;
  window.S.sheet = 'share';
  window.sh();
};

// Sheet Modal handler
window.sh = function() {
  const e = window.$('#sh');
  if (!e) return;
  e.className = window.S.sheet ? 'on' : '';
  e.onclick = ev => {
    if (ev.target === e) {
      window.S.sheet = '';
      window.sh();
    }
  };

  const r = window.S.sr || window.R[0];

  if (window.S.sheet === 'perm') {
    e.innerHTML = `
      <div class="sheet">
        <span class="ic" style="width:78px;height:78px;border-radius:50%;margin:0 auto 14px">
          ${window.I('pin', 32)}
        </span>
        <div class="t2" style="justify-content:center;margin:0 0 8px;font-size:18px">
          Enable Location Permissions
        </div>
        <p class="mu" style="font-size:14px;line-height:1.5;max-width:300px;margin:0 auto 16px">
          LifePro Fit uses Bluetooth scanning and location services to pair sensors and calculate route speed.
        </p>
        <button class="btn" style="background:var(--tx);color:var(--bg);box-shadow:none" onclick="perm(1)">
          Allow permissions
        </button>
        <button class="btn s" onclick="perm(0)">
          Not now
        </button>
      </div>
    `;
  } else if (window.S.sheet === 'share') {
    e.innerHTML = `
      <div class="sheet" style="text-align:left">
        <div class="shc" style="background:${window.GR[window.S.gi]}">
          <div style="position:absolute;top:18px;right:18px">
            ${window.qr()}
          </div>
          ${window.route(r.s, 115, '#fff', 'transparent')}
          <div style="opacity:0.85;font-weight:600;margin-top:12px;font-size:13px">Workout summary</div>
          <b>${r.km.toFixed(1)} km</b>
          <div style="opacity:0.9;margin-top:4px;font-size:14px">
            ${window.hm(r.m)} · ${r.ty === 'run' ? window.mm(60 / (r.km / (r.m / 60))) + ' /km' : (r.km / (r.m / 60)).toFixed(1) + ' km/h'} avg
          </div>
          <div style="margin-top:14px;font-weight:700">
            ${window.nm()} <span style="opacity:0.75;font-weight:500">· ${r.n}</span>
          </div>
        </div>

        <div class="th">
          ${window.GR.map((g, i) => `
            <i class="${i === window.S.gi ? 'on' : ''}" style="background:${g}" onclick="window.S.gi = ${i}; window.sh()"></i>
          `).join('')}
        </div>

        <button class="btn" onclick="window.S.sheet = ''; window.sh(); window.toast('Card saved to gallery')">
          ${window.I('share', 18)} Share activity card
        </button>
      </div>
    `;
  } else {
    e.innerHTML = '';
  }
};
