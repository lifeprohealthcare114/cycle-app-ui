/* ==========================================================================
   LifePro Fit - Screen: Settings, Customization & Share Modal
   ========================================================================== */

window.Screens = window.Screens || {};

window.Screens.me = function() {
  const count = window.nc();
  const bmi = window.calcBMI();

  return `
    <div class="t1">Settings</div>

    <!-- User Profile Hero Card -->
    <div class="cd rw" style="margin-top:16px;gap:14px" onclick="edit(0)">
      <div class="av" style="width:56px;height:56px;font-size:18px">
        ${window.ini()}
      </div>
      <div style="flex:1">
        <b style="font-size:16px;font-weight:700">${window.nm()}</b>
        <div class="mu">
          ${window.S.u.age} yrs · ${window.S.u.h} cm · ${window.S.u.w} kg · <span style="color:${bmi.color};font-weight:700">BMI ${bmi.text}</span>
        </div>
      </div>
      ${window.I('chev', 18)}
    </div>

    <!-- Sensors Shortcut -->
    <div class="cd rw" onclick="go('dev')">
      <span class="ic" style="--c:var(--bl)">${window.I('bt')}</span>
      <div style="flex:1">
        <b>Bluetooth sensors</b>
        <div class="mu">${count ? `${count} connected` : 'None connected'}</div>
      </div>
      ${window.I('chev', 18)}
    </div>

    <!-- Profile Data Attributes -->
    <div class="t2">Profile settings</div>
    <div class="cd ls" style="padding:2px 16px;margin-bottom:8px">
      ${[
        ['Name', window.S.u.name.trim() ? window.nm() : 'Set your name'],
        ['Gender', window.S.u.g],
        ['Age', window.S.u.age + ' yrs'],
        ['Height', window.S.u.h + ' cm'],
        ['Weight', window.S.u.w + ' kg']
      ].map(([l, v], i) => `
        <div class="li" onclick="edit(${i})">
          <b style="flex:1">${l}</b>
          <span style="color:var(--ac);font-weight:600">${v}</span>
          ${window.I('chev', 16)}
        </div>
      `).join('')}

      <!-- Auto-calculated BMI Field -->
      <div class="li" style="cursor:default">
        <b style="flex:1;display:flex;align-items:center;gap:6px">
          BMI
          <span class="tag" style="font-size:10px;padding:2px 7px;background:var(--s2);color:var(--mu);font-weight:700">Auto</span>
        </b>
        <span style="color:${bmi.color};font-weight:700;display:flex;align-items:center;gap:6px">
          ${bmi.text}
          <small style="color:var(--mu);font-weight:600;font-size:12px">(${bmi.cat})</small>
        </span>
      </div>
    </div>

    <!-- BMI Clinical Category Spectrum Indicator -->
    <div class="cd" style="padding:14px 16px">
      <div class="rw" style="justify-content:space-between;margin-bottom:8px">
        <span class="lb">Body Mass Index</span>
        <b style="color:${bmi.color};font-size:13px">${bmi.text} kg/m² · ${bmi.cat}</b>
      </div>
      <div style="height:6px;border-radius:99px;display:flex;gap:3px;overflow:hidden;background:var(--s2)">
        <div style="flex:18.5;border-radius:3px;background:var(--bl);opacity:${bmi.val < 18.5 ? '1' : '0.35'}" title="Underweight (<18.5)"></div>
        <div style="flex:6.4;border-radius:3px;background:var(--gr);opacity:${bmi.val >= 18.5 && bmi.val < 25 ? '1' : '0.35'}" title="Normal (18.5-24.9)"></div>
        <div style="flex:5;border-radius:3px;background:var(--or);opacity:${bmi.val >= 25 && bmi.val < 30 ? '1' : '0.35'}" title="Overweight (25-29.9)"></div>
        <div style="flex:10;border-radius:3px;background:var(--rd);opacity:${bmi.val >= 30 ? '1' : '0.35'}" title="Obese (30+)"></div>
      </div>
      <div class="rw" style="justify-content:space-between;font-size:11px;font-weight:600;color:var(--mu);margin-top:6px">
        <span>Under (<18.5)</span>
        <span>Normal (18.5–24.9)</span>
        <span>Over (25–29.9)</span>
        <span>Obese (30+)</span>
      </div>
    </div>

    <!-- Daily Distance Goal -->
    <div class="t2">Daily distance target</div>
    <div class="cd rw">
      <button class="ib" aria-label="Decrease goal" onclick="window.S.goal = Math.max(5, window.S.goal - 5); go('me')">
        ${window.I('minus', 18)}
      </button>
      <div class="bm" style="flex:1;text-align:center">
        ${window.S.goal}<small>km / day</small>
      </div>
      <button class="ib" aria-label="Increase goal" onclick="window.S.goal += 5; go('me')">
        ${window.I('plus', 18)}
      </button>
    </div>

    <!-- Appearance Theme & Accent Color -->
    <div class="t2">Appearance</div>
    <div class="cd">
      <div class="lb" style="margin-bottom:10px">Color mode</div>
      ${window.seg([['a', 'Auto'], ['l', 'Light'], ['d', 'Dark']], window.S.th, 'sth')}
      
      <div class="lb" style="margin-top:14px">Accent palette</div>
      <div class="sws">
        ${Object.entries(window.ACC).map(([k, [n, c]]) => `
          <button class="swt ${k === window.S.ac ? 'on' : ''}" 
                  data-k="${k}" 
                  aria-label="${n}" 
                  style="background:${c};color:${c}" 
                  onclick="sa('${k}')">
            <span style="color:#fff;display:grid">${window.I('check', 20)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
};

// Appearance actions
window.sth = function(k) {
  window.S.th = k;
  window.ap();
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
