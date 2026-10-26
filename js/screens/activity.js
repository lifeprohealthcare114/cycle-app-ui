/* ==========================================================================
   LifePro Fit - Screen: Activity & Workout History
   ========================================================================== */

window.Screens = window.Screens || {};

// Row component for workout list
window.rrow = function(r, i) {
  return `
    <div class="li" onclick="go('rd', ${i})">
      <span class="ic" style="border-radius:50%">
        ${window.I(r.ty === 'run' ? 'run' : 'bike')}
      </span>
      <div style="flex:1;min-width:0">
        <b>${r.n}</b>
        <div class="mu">${r.d}</div>
      </div>
      <div style="text-align:right">
        <b>${r.km.toFixed(1)} km</b>
        <div class="mu">${window.hm(r.m)}</div>
      </div>
    </div>
  `;
};

// Activity bar chart item selection
window.selectActivityBar = function(idx, val, unit, periodLabel) {
  window.S.activeBar = idx;
  const selEl = window.$('#sel');
  const selTitleEl = window.$('#sel-title');
  if (selEl) selEl.textContent = `${val.toFixed(1)} ${unit}`;
  if (selTitleEl) selTitleEl.textContent = periodLabel;

  // Clean, modern focus effect without any harsh border
  document.querySelectorAll('#activity-chart .bar').forEach((rect, i) => {
    rect.removeAttribute('stroke');
    rect.removeAttribute('stroke-width');
    if (i === idx) {
      rect.setAttribute('fill', 'var(--ac)');
      rect.style.opacity = '1';
      rect.style.filter = 'drop-shadow(0 2px 8px color-mix(in srgb, var(--ac) 40%, transparent))';
    } else {
      rect.style.opacity = '0.35';
      rect.style.filter = 'none';
    }
  });
};

window.Screens.rides = function() {
  const r = window.S.rg;
  const m = window.S.met;
  const { v, big, u, lab } = window.rdata(r, m);
  const n = v.length;
  const mx = Math.max(...v, 1);
  const A = v.reduce((a, c) => a + c, 0) / n;
  const t = window.TOT[r];
  const totalLabel = r === 'd' ? 'Total today' : r === 'w' ? 'Total this week' : 'Total this month';

  return `
    <!-- Screen Header -->
    <div class="rw">
      <div class="t1" style="flex:1">Activity</div>
      <button class="btn" style="width:auto;padding:10px 18px;margin:0;font-size:14px" onclick="go('start')">
        ${window.I('play', 16)}Start
      </button>
    </div>
    <div style="height:14px"></div>

    <!-- Period Segment Switcher -->
    ${window.seg([['d', 'Day'], ['w', 'Week'], ['m', 'Month']], r, 'sr')}

    <!-- Selected Stat Card -->
    <div class="rw">
      <span class="ic">${window.I('bar', 20)}</span>
      <div>
        <div class="lb" id="sel-title">${totalLabel}</div>
        <div class="bm" id="sel">${big}</div>
      </div>
    </div>

    <!-- Interactive Activity Bar Chart -->
    <div class="cd" style="margin-top:14px;padding:16px 12px 10px">
      <svg id="activity-chart" viewBox="0 0 320 150" style="width:100%;display:block">
        ${v.map((x, i) => {
          const w = 320 / n;
          const h = Math.max(3, (x / mx) * 115);
          const barWidth = Math.max(3, w * 0.65);
          const barX = i * w + (w - barWidth) / 2;
          const barY = 125 - h;
          const isSelected = window.S.activeBar === i;
          const hasSelection = window.S.activeBar !== null && window.S.activeBar !== undefined;
          const barOpacity = hasSelection ? (isSelected ? '1' : '0.35') : '1';
          const fillColor = isSelected ? 'var(--ac)' : (isHigh ? 'var(--ac)' : 'var(--s2)');
          const dropShadow = isSelected ? 'filter:drop-shadow(0 2px 8px color-mix(in srgb, var(--ac) 40%, transparent));' : '';
          const periodText = r === 'd' ? `${i}:00–${i + 1}:00` : r === 'w' ? window.l7()[i] : `Day ${i + 1}`;

          return `
            <rect class="bar" style="--d:${i};opacity:${barOpacity};${dropShadow}" 
                  x="${barX.toFixed(1)}" y="${barY.toFixed(1)}" 
                  width="${barWidth.toFixed(1)}" height="${h.toFixed(1)}" 
                  rx="${Math.min(4, barWidth / 2).toFixed(1)}" 
                  fill="${fillColor}" 
                  onclick="selectActivityBar(${i}, ${x}, '${u}', '${periodText}')" 
                  cursor="pointer"/>
          `;
        }).join('')}
        ${lab.map(({ i, l }) => {
          const w = 320 / n;
          const textX = (i + 0.5) * w;
          return `
            <text x="${textX.toFixed(1)}" y="144" text-anchor="middle" font-size="11" font-weight="600" fill="var(--mu)">
              ${l}
            </text>
          `;
        }).join('')}
      </svg>
    </div>

    <!-- Metric Filter Chips -->
    <div class="chip">
      ${[
        ['dist', 'Distance'],
        ['time', 'Time'],
        ['spd', 'Speed'],
        ['kc', 'Calories']
      ].map(([k, l]) => `
        <button class="${k === m ? 'on' : ''}" onclick="window.S.met = '${k}'; window.S.activeBar = null; go('rides')">
          ${l}
        </button>
      `).join('')}
    </div>

    <!-- Summary Statistics Grid -->
    <div class="sx" style="grid-template-columns:1fr 1fr">
      <div class="mu">Total distance<b>${t.toFixed(1)} km</b></div>
      <div class="mu">Active time<b>${window.hm(t * 60 / 21)}</b></div>
      <div class="mu">Avg speed<b>21.0 km/h</b></div>
      <div class="mu">Max speed<b>38.2 km/h</b></div>
    </div>

    <!-- Recent Workouts -->
    <div class="t2" style="margin-top:14px">Recent workouts</div>
    <div class="cd ls" style="padding:2px 16px">
      ${window.R.map(window.rrow).join('')}
    </div>
  `;
};
