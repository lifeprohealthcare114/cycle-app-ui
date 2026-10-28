/* ==========================================================================
   LifePro Fit - Screen: Sensor Management & Bluetooth Pairing
   ========================================================================== */

window.Screens = window.Screens || {};

// Sensor Management Screen
window.Screens.dev = function() {
  const count = window.nc();
  const backTarget = window.S.dvb || 'home';
  const hasB = window.hasBaiget();
  const hasP = window.hasPhysilog();

  const products = [
    {
      id: 'baiget',
      name: 'Baiget',
      badge: 'PPG + ECG Biosensor',
      desc: 'Heart rate, SpO₂, continuous ECG rhythm, HRV & temp',
      connected: hasB,
      color: 'var(--rd)',
      icon: 'baiget',
      metrics: ['hr', 'sp', 'hv', 'tp']
    },
    {
      id: 'physilog',
      name: 'Physilog',
      badge: 'Motion & Gait Telemetry',
      desc: 'Live cadence, leg symmetry, speed & distance',
      connected: hasP,
      color: 'var(--pu)',
      icon: 'physilog',
      metrics: ['cd', 'lm']
    }
  ];

  return `
    ${window.bk(backTarget, window.LB[backTarget] || 'Back')}
    <div class="t1" style="margin:12px 0 6px">Devices & Sensors</div>
    <p class="mu" style="margin-bottom:14px;font-size:14px">
      Manage your Baiget (PPG+ECG) and Physilog sensors. Each communicates over secure BLE telemetry.
    </p>

    <div style="display:flex;align-items:center;justify-content:flex-end;margin-bottom:12px">
      <button class="tag" style="background:var(--ac);color:var(--ax);font-weight:700" onclick="add()">
        + Pair New Device
      </button>
    </div>

    <!-- Product Sensor Cards -->
    <div class="cd ls" style="padding:2px 16px;margin-top:12px">
      ${products.map(prod => `
        <div class="li" style="cursor:default;align-items:flex-start;padding:16px 0">
          <span class="ic" style="color:${prod.color};background:color-mix(in srgb, ${prod.color} 14%, transparent);width:44px;height:44px;border-radius:12px;margin-top:2px">
            ${window.I(prod.icon, 22)}
          </span>
          <div style="flex:1;min-width:0;padding:0 10px">
            <div style="display:flex;align-items:center;gap:8px">
              <b style="font-size:17px">${prod.name}</b>
            </div>
            <div class="mu" style="margin-top:2px;font-size:12px;line-height:1.3">${prod.desc}</div>
            
            ${prod.connected ? `
              <div class="dm" style="margin-top:8px">
                ${prod.metrics.map(q => `
                  <span style="color:${window.M[q][3]};font-size:12px">
                    ${window.M[q][0]} <span data-k="${q}">${window.fv(q)}</span> ${window.M[q][1]}
                  </span>
                `).join('')}
              </div>
            ` : `
              <div class="mu" style="margin-top:6px;font-size:11px;color:var(--mu)">
                Disconnected · Ready to pair
              </div>
            `}
          </div>
          <div>
            ${prod.connected ? `
              <button class="tag" onclick="window.toggleDevice('${prod.id}')" style="cursor:pointer">
                Disconnect
              </button>
            ` : `
              <button class="tag" style="background:${prod.color};color:#fff;cursor:pointer" onclick="window.toggleDevice('${prod.id}')">
                Connect
              </button>
            `}
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

// Bluetooth Scanning Screen
window.Screens.scan = function() {
  const availableSensors = [
    { id: 'baiget', name: 'Baiget', desc: 'PPG + ECG Biosensor · Signal −54 dBm', color: 'var(--rd)', icon: 'baiget' },
    { id: 'physilog', name: 'Physilog', desc: 'Motion Telemetry · Signal −58 dBm', color: 'var(--pu)', icon: 'physilog' }
  ].filter(p => !window.S.c[p.id]);

  return `
    ${window.bk('dev', 'Sensors')}
    <div class="t1" style="margin:12px 0 4px">Add Device</div>
    <p class="mu" style="font-size:14px">Searching for nearby BLE fitness sensors…</p>

    ${window.S.sf ? `
      <div class="cd ls" style="margin-top:18px;padding:2px 16px">
        ${availableSensors.length ? availableSensors.map(prod => `
          <div class="li" onclick="pr('${prod.id}')" style="cursor:pointer">
            <span class="ic" style="color:${prod.color};background:color-mix(in srgb, ${prod.color} 14%, transparent)">
              ${window.I(prod.icon, 20)}
            </span>
            <div style="flex:1">
              <b>${prod.name}</b>
              <div class="mu">${prod.desc}</div>
            </div>
            ${window.I('chev', 18)}
          </div>
        `).join('') : `
          <div class="mu" style="padding:16px 0;text-align:center">Both Baiget and Physilog are already connected.</div>
        `}
      </div>
    ` : `
      <div class="rw" style="justify-content:center;margin-top:64px;gap:12px">
        <span class="sp"></span>
        <span class="mu">Discovering Bluetooth devices…</span>
      </div>
    `}
  `;
};

// Bluetooth Pairing Flow Screen
window.Screens.pair = function() {
  const steps = [
    'Finding your device',
    'Pairing securely via BLE',
    'Syncing telemetry channels',
    'Connected successfully'
  ];

  return `
    <div class="ctr">
      <div class="pu">
        ${window.I('bt', 36)}
      </div>
      <div class="t2" style="margin:12px 0 0">
        ${steps[window.S.ps] || steps[0]}
      </div>
      <div class="mu">Keep your phone close to the device</div>
    </div>
  `;
};

// Sensor initiation flow
window.add = function() {
  window.S.org = window.S.sc === 'dev' ? 'dev' : window.S.sc;
  if (window.S.sc !== 'dev') window.S.dvb = window.S.sc;
  if (window.S.perm) return window.perm(1);
  window.S.sheet = 'perm';
  window.sh();
};

window.perm = function(ok) {
  window.S.sheet = '';
  window.sh();
  if (!ok) return window.toast('Bluetooth requires location access');
  window.S.perm = 1;
  window.S.sf = 0;
  window.go('scan');
  setTimeout(() => {
    if (window.S.sc === 'scan') {
      window.S.sf = 1;
      window.go('scan');
    }
  }, 1200);
};

window.pr = function(k) {
  window.S.ps = 0;
  window.go('pair');

  [1, 2, 3].forEach(stepIdx => {
    setTimeout(() => {
      if (window.S.sc !== 'pair') return;
      window.S.ps = stepIdx;
      if (stepIdx < 3) {
        return window.go('pair');
      }

      // Connect device
      if (k === 'baiget') {
        window.S.c.baiget = 1;
        window.S.c.g = 1;
        window.S.c.e = 1;
      } else if (k === 'physilog') {
        window.S.c.physilog = 1;
        window.S.c.p = 1;
      }

      for (const q in window.M) {
        if (window.avail(q)) {
          window.S.H[q] = Array.from({ length: 24 }, () => window.S[q]);
        }
      }
      window.go(window.S.org || 'dev');
      window.toast((k === 'baiget' ? 'Baiget (PPG+ECG)' : 'Physilog') + ' connected');
    }, stepIdx * 800);
  });
};
