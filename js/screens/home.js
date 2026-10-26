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
  const r = window.S.rg;
  const t = window.TOT[r];
  const g = window.GL()[r];
  const p = Math.min(1, t / g);
  const lb = { d: 'Today', w: 'This week', m: 'This month' }[r];
  const lv = ['hr', 'cd', 'sp', 'tp', 'lm', 'hv', 'hy'].filter(window.avail).slice(0, 4);

  const ch = [
    [window.hm(t * 60 / 21), 'active time', '#C9BCFF'],
    ['21.0', 'avg km/h', '#9BE3FF'],
    ['34.6', 'max km/h', '#FFC48C'],
    [window.f(t * 25), 'calories', '#FFC48C']
  ];

  const recent = window.R[0];

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

    <!-- Hero Goal Progress Card -->
    <div class="hc">
      ${window.seg([['d', 'D'], ['w', 'W'], ['m', 'M']], r, 'sr')}
      <div class="rg">
        ${window.ring(p, 236, 18, 'url(#g1)', 'rgba(255,255,255,0.12)')}
        <div class="rc">
          <span>${lb}</span>
          <b data-cu="${t.toFixed(1)}" data-d="1">${t.toFixed(1)}</b>
          <small>of ${g} km goal</small>
        </div>
      </div>
      <div class="chs">
        ${ch.map(([v, l, c]) => `
          <div class="chp">
            <b style="color:${c}">${v}</b>
            <span>${l}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Quick Start CTA -->
    <button class="btn" onclick="go('start')" style="margin-bottom:6px">
      ${window.I('play', 18)}Start activity
    </button>

    <!-- Live Sensor Readings (if connected) -->
    ${lv.length ? `
      <div class="t2">
        Live vitals
        <a onclick="go('hl')">See all</a>
      </div>
      <div class="g2">
        ${lv.map(window.tl).join('')}
      </div>
    ` : ''}

    <!-- 7-Day Distance Activity Trend -->
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

    <!-- Recent Activity Card -->
    ${recent ? `
      <div class="t2">
        Recent workout
        <a onclick="go('rd', 0)">Details</a>
      </div>
      <div class="cd" onclick="go('rd', 0)">
        ${window.route(recent.s, 110)}
        <div class="rw" style="margin-top:12px">
          <div style="flex:1">
            <b>${recent.n}</b>
            <div class="mu">${recent.d}</div>
          </div>
          <div style="text-align:right">
            <b>${recent.km.toFixed(1)} km</b>
            <div class="mu">${window.hm(recent.m)}</div>
          </div>
          <span class="tag">${(recent.km / (recent.m / 60)).toFixed(1)} km/h</span>
        </div>
      </div>
    ` : ''}
  `;
};
