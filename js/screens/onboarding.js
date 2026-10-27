/* ==========================================================================
   LifePro Fit - Screen: Onboarding & Profile Setup
   ========================================================================== */

window.Screens = window.Screens || {};

window.Screens.ob = function () {
  const i = window.S.ob;
  const isEditing = Boolean(window.S.edit);
  const [a, q, d] = window.OBS[i];
  const k = window.KS[i];
  let inputHtml;

  if (i === 0) {
    // Name Input
    inputHtml = `
      <input class="ni" id="nm" type="text" placeholder="Your name" 
             value="${window.esc(window.S.u.name)}" maxlength="24" 
             autocomplete="name" 
             oninput="window.S.u.name = this.value" 
             onkeydown="if(event.key === 'Enter') nx()">
    `;
  } else if (i === 1) {
    // Gender Selection
    inputHtml = `
      <div class="gc">
        ${['Male', 'Female'].map(g => `
          <button class="gb ${window.S.u.g === g ? 'on' : ''}" onclick="window.S.u.g = '${g}'; go('ob')">
            ${g === 'Male' ? '♂' : '♀'}&nbsp; ${g}
          </button>
        `).join('')}
      </div>
    `;
  } else {
    // Age / Height / Weight Ruler Slider
    const [mn, mx, st, label, unit] = window.RL[k];
    const totalSteps = Math.round((mx - mn) / st);
    let ticksHtml = '';
    for (let stepIdx = 0; stepIdx <= totalSteps; stepIdx++) {
      const val = +(mn + stepIdx * st).toFixed(1);
      const isMajor = (val % 10 === 0);
      const isMid = (val % 5 === 0 && !isMajor);
      ticksHtml += `<div class="ruler-tick${isMajor ? ' major' : (isMid ? ' mid' : '')}" data-val="${val}"></div>`;
    }

    inputHtml = `
      <div class="mu" style="text-align:center;margin-top:28px;font-size:14px;font-weight:600">${label}</div>
      <div class="bn" id="bn">
        <span>${window.S.u[k]}</span><small>${unit}</small>
      </div>
      <div class="ruler-wrap" data-key="${k}" data-min="${mn}" data-max="${mx}" data-step="${st}" data-unit="${unit}" role="slider" aria-label="${label}" aria-valuemin="${mn}" aria-valuemax="${mx}" aria-valuenow="${window.S.u[k]}">
        <div class="ruler-needle"></div>
        <div class="ruler-track">
          ${ticksHtml}
        </div>
      </div>
    `;

    // Schedule auto-initialization of the ruler
    requestAnimationFrame(() => {
      if (typeof window.initRulerSlider === 'function') {
        window.initRulerSlider();
      }
    });
  }

  // Header back button logic: on step 0 when not editing, keep invisible for layout stability
  const showBack = i > 0 || isEditing;
  const backStyle = showBack ? 'color:var(--tx)' : 'visibility:hidden';
  const progressPercent = (i + 1) * 20;
  const animClass = window.S.obDir === 'back' ? 'anim-back' : 'anim-next';

  return `
    <div class="obh">
      <div class="pb">
        <button onclick="back()" class="ib" aria-label="Back" style="${backStyle}">
          ${window.I('back', 20)}
        </button>
        <i><b style="width:${progressPercent}%"></b></i>
        <span>${isEditing ? 'Profile' : `${i + 1}/5`}</span>
        ${!isEditing ? `<button onclick="nx(1)" style="font-size:14px;font-weight:600;color:var(--mu)">Skip</button>` : `<div style="width:38px"></div>`}
      </div>
      <h2 class="obh-title">${isEditing ? 'Update Profile' : a}</h2>
    </div>
    <div class="obs ${animClass}">
      <div class="t1" style="font-size:26px">${q}</div>
      <p class="mu" style="margin-top:6px;font-size:14px">${d}</p>
      ${inputHtml}
      <div class="nxw">
        <button class="btn" onclick="nx()">
          ${isEditing ? 'Save changes' : (i === 4 ? 'Finish & Start' : 'Next')}
        </button>
      </div>
    </div>
  `;
};

// Navigation actions for Onboarding with direction tracking for smooth slide transitions
window.back = function () {
  if (window.S.ob > 0 && !window.S.edit) {
    window.S.obDir = 'back';
    window.S.ob--;
    window.go('ob');
  } else if (window.S.edit) {
    window.S.edit = 0;
    window.go('me');
  }
};

window.nx = function (sk) {
  if (window.S.edit) {
    window.S.edit = 0;
    window.toast('Profile updated');
    return window.go('me');
  }
  if (sk || window.S.ob === 4) {
    window.S.ob = 0;
    return window.go('home');
  }
  window.S.obDir = 'next';
  window.S.ob++;
  window.go('ob');
};

window.edit = function (i) {
  window.S.obDir = 'next';
  window.S.ob = i;
  window.S.edit = 1;
  window.go('ob');
};

// Interactive Precision Ruler Scale Controller
window.initRulerSlider = function () {
  const wrap = document.querySelector('.ruler-wrap');
  if (!wrap) return;

  const track = wrap.querySelector('.ruler-track');
  if (!track || track.dataset.initialized === 'true') return;
  track.dataset.initialized = 'true';

  const key = wrap.dataset.key;
  const min = parseFloat(wrap.dataset.min);
  const max = parseFloat(wrap.dataset.max);
  const step = parseFloat(wrap.dataset.step) || 1;
  const tickWidth = 14; // pixels per step unit
  const totalSteps = Math.round((max - min) / step);

  const numSpan = document.querySelector('#bn span');

  let currentVal = window.S.u[key] !== undefined ? window.S.u[key] : min;
  let targetIndex = Math.round((currentVal - min) / step);

  // Position initial value under center needle immediately without animation
  track.style.scrollBehavior = 'auto';
  track.scrollLeft = targetIndex * tickWidth;

  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;
  let lastVal = currentVal;
  let lastActiveTick = null;
  let rafPending = false;
  let snapTimeout = null;

  function updateValue() {
    const rawIndex = Math.round(track.scrollLeft / tickWidth);
    const clampedIndex = Math.max(0, Math.min(totalSteps, rawIndex));
    let val = min + clampedIndex * step;
    if (step < 1) {
      val = parseFloat(val.toFixed(1));
    } else {
      val = Math.round(val);
    }

    if (val !== lastVal) {
      lastVal = val;
      window.S.u[key] = val;
      if (numSpan) {
        numSpan.textContent = val;
        // Subtle micro-pulse on number update for responsive, premium tactile feel
        numSpan.style.transform = 'scale(1.035)';
        setTimeout(() => { if (numSpan) numSpan.style.transform = 'scale(1)'; }, 75);
      }
      wrap.setAttribute('aria-valuenow', val);

      // Light haptic feedback if permitted
      if (navigator.vibrate && window.S.perm) {
        try { navigator.vibrate(5); } catch (_) { }
      }
    }

    // Update active tick indicator
    const activeTick = track.querySelector(`.ruler-tick[data-val="${val}"]`);
    if (activeTick && activeTick !== lastActiveTick) {
      if (lastActiveTick) lastActiveTick.classList.remove('active');
      activeTick.classList.add('active');
      lastActiveTick = activeTick;
    }
  }

  // RAF-throttled scroll listener for buttery-smooth 60/120fps updates
  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      updateValue();
    });
  }

  track.addEventListener('scroll', scheduleUpdate, { passive: true });

  // Touch gesture handling - disable snap while dragging for zero stutter
  track.addEventListener('touchstart', () => {
    track.style.scrollSnapType = 'none';
    clearTimeout(snapTimeout);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    clearTimeout(snapTimeout);
    snapTimeout = setTimeout(() => {
      track.style.scrollSnapType = 'x mandatory';
      const rawIndex = Math.round(track.scrollLeft / tickWidth);
      const clampedIndex = Math.max(0, Math.min(totalSteps, rawIndex));
      track.scrollTo({ left: clampedIndex * tickWidth, behavior: 'smooth' });
    }, 120);
  }, { passive: true });

  // Pointer drag support for desktop
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isPointerDown = true;
    hasDragged = false;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    track.style.scrollSnapType = 'none';
    track.classList.add('is-dragging');
    try { track.setPointerCapture(e.pointerId); } catch (_) { }
  });

  track.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 2) hasDragged = true;
    track.scrollLeft = startScrollLeft - dx;
  });

  function stopDrag(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    track.classList.remove('is-dragging');
    try { track.releasePointerCapture(e.pointerId); } catch (_) { }

    // Gracefully snap to exact nearest tick
    const rawIndex = Math.round(track.scrollLeft / tickWidth);
    const clampedIndex = Math.max(0, Math.min(totalSteps, rawIndex));
    track.scrollTo({ left: clampedIndex * tickWidth, behavior: 'smooth' });
    setTimeout(() => {
      track.style.scrollSnapType = 'x mandatory';
    }, 200);
  }

  track.addEventListener('pointerup', stopDrag);
  track.addEventListener('pointercancel', stopDrag);

  // Wheel listener with smooth debounced snapping
  let wheelTimeout = null;
  track.addEventListener('wheel', (e) => {
    e.preventDefault();
    track.style.scrollSnapType = 'none';
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    track.scrollLeft += (delta > 0 ? 1 : -1) * tickWidth;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      track.style.scrollSnapType = 'x mandatory';
      const rawIndex = Math.round(track.scrollLeft / tickWidth);
      const clampedIndex = Math.max(0, Math.min(totalSteps, rawIndex));
      track.scrollTo({ left: clampedIndex * tickWidth, behavior: 'smooth' });
    }, 100);
  }, { passive: false });

  // Click on tick mark to smoothly jump
  track.querySelectorAll('.ruler-tick').forEach(tick => {
    tick.addEventListener('click', () => {
      if (hasDragged) return;
      const v = parseFloat(tick.dataset.val);
      if (!isNaN(v)) {
        const idx = Math.round((v - min) / step);
        track.scrollTo({ left: idx * tickWidth, behavior: 'smooth' });
      }
    });
  });

  // Keyboard accessibility
  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const curr = Math.round(track.scrollLeft / tickWidth);
      const next = Math.max(0, curr - 1);
      track.scrollTo({ left: next * tickWidth, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const curr = Math.round(track.scrollLeft / tickWidth);
      const next = Math.min(totalSteps, curr + 1);
      track.scrollTo({ left: next * tickWidth, behavior: 'smooth' });
    }
  });

  // Verify alignment after layout stabilizes
  requestAnimationFrame(() => {
    track.scrollLeft = targetIndex * tickWidth;
    updateValue();
  });
};
