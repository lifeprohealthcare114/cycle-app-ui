/* ==========================================================================
   LifePro Fit - Main Application Controller & Router
   ========================================================================== */

// Apply Theme and Accent Color System
window.ap = function() {
  const isDark = window.S.th === 'd' || (window.S.th === 'a' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const doc = document.documentElement;
  doc.dataset.theme = isDark ? 'dark' : 'light';
  doc.dataset.ac = window.S.ac;

  // Dynamically update SVG linearGradient stop colors for Chromium/WebKit compatibility
  const stop1 = window.$('#g1-stop1');
  const stop2 = window.$('#g1-stop2');
  if (stop1 && stop2) {
    const computedStyles = getComputedStyle(doc);
    stop1.setAttribute('stop-color', computedStyles.getPropertyValue('--r1').trim());
    stop2.setAttribute('stop-color', computedStyles.getPropertyValue('--r2').trim());
  }
};

// Segmented Control Animated Transition
window.sg = function(el, i, fn, k) {
  const p = el.parentNode;
  p.style.setProperty('--seg-i', i);
  p.style.setProperty('--i', i);
  p.querySelectorAll('button').forEach((b, j) => b.classList.toggle('on', j === i));
  setTimeout(() => {
    if (typeof window[fn] === 'function') {
      window[fn](k);
    }
  }, 180);
};

// Range switcher for Home / Activity
window.sr = function(k) {
  window.S.rg = k;
  window.go(window.S.sc);
};

// Animated Number Count-Up
window.cu = function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-cu]').forEach(e => {
    const target = +e.dataset.cu;
    const decimals = +(e.dataset.d || 0);
    const startTime = performance.now();
    const duration = 850;

    const step = currentTime => {
      const progress = Math.min(1, (currentTime - startTime) / duration);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      e.textContent = (target * ease).toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        e.textContent = target.toFixed(decimals);
      }
    };
    requestAnimationFrame(step);
  });
};

// Main Screen Navigation Router
window.go = function(s, a) {
  if (s === 'dev' && !['dev', 'scan', 'pair'].includes(window.S.sc)) {
    window.S.dvb = window.S.sc;
  }
  window.S.sc = s;
  window.S.a = a;

  const mainTabs = ['home', 'rides', 'hl', 'me'];
  const isMainTab = mainTabs.includes(s);
  const v = window.$('#v');
  const tb = window.$('#tb');
  const statusBar = window.$('#status-bar');

  if (isMainTab) window.S.tab = s;

  // Toggle bottom tab bar
  if (tb) {
    tb.style.display = isMainTab ? 'flex' : 'none';
    if (!tb.dataset.initialized) {
      tb.innerHTML = window.TABS.map(([k, l, icon]) => `
        <button data-t="${k}" aria-label="${l}" onclick="go('${k}')">
          ${window.I(icon, 22)}<span>${l}</span>
        </button>
      `).join('');
      tb.dataset.initialized = 'true';
    }
    tb.querySelectorAll('button').forEach(b => {
      b.classList.toggle('on', b.dataset.t === window.S.tab);
    });
  }

  // Adjust Status Bar color contrast to match active theme
  if (statusBar) {
    const isDarkTheme = document.documentElement.dataset.theme === 'dark';
    if (s === 'ob' || isDarkTheme) {
      statusBar.classList.add('light-content');
    } else {
      statusBar.classList.remove('light-content');
    }
  }

  // Set container layout mode
  v.className = s === 'ob' ? 'ob' : (s === 'live' || s === 'cnt' ? 'live-view' : '');
  if (isMainTab) v.classList.add('has-tabs');

  // Render view from modular Screens registry
  if (window.Screens && typeof window.Screens[s] === 'function') {
    v.innerHTML = window.Screens[s](a);
  } else {
    v.innerHTML = `<div class="ctr"><div class="mu">Screen not found</div></div>`;
  }

  // Set stagger animations for elements
  [...v.children].forEach((e, i) => e.style.setProperty('--v-anim-i', Math.min(i, 8)));
  v.querySelectorAll('.g2, .ls').forEach(g => {
    [...g.children].forEach((e, i) => e.style.setProperty('--j', i));
  });

  // Reset scroll position unless viewing live continuous charts
  if (s !== 'det' && s !== 'ecg') {
    v.scrollTop = 0;
  }

  // Trigger stroke-dashoffset transitions for progress rings
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.rr').forEach(e => {
        if (e.dataset.o !== undefined) {
          e.style.strokeDashoffset = e.dataset.o;
        }
      });
    });
  });

  window.upd();
  if (s === 'live') {
    window.updW();
  }
  window.cu();
};

// Update live data elements across the DOM
window.upd = function() {
  document.querySelectorAll('[data-k]').forEach(e => {
    const k = e.dataset.k;
    if (k in window.M && window.avail(k)) {
      e.textContent = window.fv(k);
    }
  });
};

// Update Clock in Simulated Status Bar
function updateStatusBarClock() {
  const clockEl = window.$('#status-bar-clock');
  if (clockEl) {
    const now = new Date();
    const hours = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}`;
  }
}

// Global 1-Second Interval Heartbeat Simulation
setInterval(() => {
  const rand = (a, b) => Math.random() * (b - a) + a;
  const w = window.S.w;
  const isRiding = w && w.on;
  const isRun = w && w.ty === 'run';
  const targetHr = isRiding ? (isRun ? 158 : 138) : 72;

  // Realistic vital simulations
  window.S.hr = Math.round(Math.max(55, Math.min(185, window.S.hr + (targetHr - window.S.hr) * 0.12 + rand(-2.5, 2.5))));
  window.S.sp = Math.round(Math.max(94, Math.min(100, window.S.sp + rand(-0.8, 0.8))));
  window.S.tp = +Math.max(35.8, Math.min(37.6, window.S.tp + rand(-0.06, 0.06))).toFixed(1);
  window.S.hv = Math.round(Math.max(25, Math.min(90, window.S.hv + rand(-3, 3))));
  window.S.hy = Math.round(Math.max(60, Math.min(100, window.S.hy + rand(-0.25, 0.1))));
  window.S.cd = Math.round(isRiding ? (isRun ? rand(160, 178) : rand(68, 92)) : rand(52, 74));
  window.S.lm = Math.round(rand(86, 98));

  // Push to telemetry history buffer
  for (const k in window.S.H) {
    if (window.avail(k)) {
      window.S.H[k].push(window.S[k]);
      if (window.S.H[k].length > 40) {
        window.S.H[k].shift();
      }
    }
  }

  // Active workout progression
  if (isRiding) {
    w.t++;
    const deltaSpd = isRun ? 0.6 : 1.5;
    w.spd = Math.max(isRun ? 7.5 : 12.0, Math.min(isRun ? 15.0 : 38.0, w.spd + rand(-deltaSpd, deltaSpd)));
    w.km += w.spd / 3600;
    w.kc += (w.spd / 3600) * (isRun ? 62 : 26);
    w.mx = Math.max(w.mx, w.spd);
    w.hs.push(window.S.hr);
    if (window.S.c.p) w.cs.push(window.S.cd);
  }

  window.upd();
  window.updW();

  // Dynamic real-time chart repaint if viewing live vital details
  if (window.S.sc === 'det' && window.S.dr === 'live' && window.$('#dc')) {
    const k = window.S.a;
    if (window.avail(k)) {
      window.$('#dc').innerHTML = window.crv(window.S.H[k], 320, 150, window.M[k][3], 0);
      const rnEl = window.$('#rn');
      if (rnEl) {
        rnEl.textContent = (window.inr(k) ? 'Within normal clinical range' : 'Out of range') + ' · streaming';
      }
    }
  }

  // Update ECG animation cycle to match live heart rate
  const ekEl = window.$('.ek');
  if (ekEl) {
    ekEl.style.animationDuration = (60 / Math.max(window.S.hr, 40)).toFixed(2) + 's';
  }

  updateStatusBarClock();
}, 1000);

// App Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  window.ap();
  updateStatusBarClock();
  window.go('ob');
});
