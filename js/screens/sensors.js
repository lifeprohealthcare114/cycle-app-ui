/* ==========================================================================
   LifePro Fit - Screen: Sensor Management & Bluetooth Pairing
   ========================================================================== */

window.Screens = window.Screens || {};

// Sensor Management Screen
window.Screens.dev = function() {
  const count = window.nc();
  const backTarget = window.S.dvb || 'me';

  return `
    ${window.bk(backTarget, window.LB[backTarget] || 'Back')}
    <div class="t1" style="margin:12px 0 6px">Sensors</div>
    <p class="mu" style="margin-bottom:14px;font-size:14px">
      Connect multiple sensors at once — each streams on its dedicated Bluetooth BLE channel.
    </p>

    <span class="tag">${count} of 3 connected</span>

    <div class="cd ls" style="padding:2px 16px;margin-top:16px">
      ${['g', 'e', 'p'].map(k => {
        const isConnected = Boolean(window.S.c[k]);
        return `
          <div class="li" style="cursor:default">
            <span class="ic" style="--c:${window.DV[k][2]}">
              ${window.I('bt')}
            </span>
            <div style="flex:1;min-width:0">
              <b>${window.DV[k][0]}</b>
              <div class="mu">${window.DV[k][1]}</div>
              ${isConnected ? `
                <div class="dm">
                  ${window.DK[k].map(q => `
                    <span style="color:${window.M[q][3]}">
                      ${window.M[q][0]} <span data-k="${q}">${window.fv(q)}</span> ${window.M[q][1]}
                    </span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            ${isConnected ? `
              <button class="tag" onclick="window.S.c['${k}'] = 0; window.toast('Disconnected'); go('dev')">
                Disconnect
              </button>
            ` : `
              <button class="tag" style="background:var(--ac);color:var(--ax)" onclick="add()">
                Connect
              </button>
            `}
          </div>
        `;
      }).join('')}
    </div>
  `;
};

// Bluetooth Scanning Screen
window.Screens.scan = function() {
  const availableSensors = ['g', 'e', 'p'].filter(k => !window.S.c[k]);

  return `
    ${window.bk('dev', 'Sensors')}
    <div class="t1" style="margin:12px 0 4px">Add sensor</div>
    <p class="mu" style="font-size:14px">Searching for nearby BLE fitness sensors…</p>

    ${window.S.sf ? `
      <div class="cd ls" style="margin-top:18px;padding:2px 16px">
        ${availableSensors.length ? availableSensors.map(k => `
          <div class="li" onclick="pr('${k}')">
            <span class="ic" style="--c:${window.DV[k][2]}">
              ${window.I('bt')}
            </span>
            <div style="flex:1">
              <b>${window.DV[k][0]}</b>
              <div class="mu">Signal strong · −${52 + (k.charCodeAt(0) % 9)} dBm</div>
            </div>
            ${window.I('chev', 18)}
          </div>
        `).join('') : `
          <div class="mu" style="padding:16px 0;text-align:center">All sensors are currently connected.</div>
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
    'Pairing securely',
    'Syncing sensors',
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
      <div class="mu">Keep your phone close to the sensor</div>
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
  }, 1400);
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

      // Final step: connect and initialize baseline streams
      window.S.c[k] = 1;
      for (const q in window.M) {
        if (window.M[q][7].includes(k)) {
          window.S.H[q] = Array.from({ length: 24 }, () => window.S[q]);
        }
      }
      window.go(window.S.org || 'dev');
      window.toast(window.DV[k][0] + ' connected');
    }, stepIdx * 900);
  });
};
