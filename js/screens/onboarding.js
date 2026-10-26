/* ==========================================================================
   LifePro Fit - Screen: Onboarding & Profile Setup
   ========================================================================== */

window.Screens = window.Screens || {};

window.Screens.ob = function() {
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
    // Age / Height / Weight Slider
    const [mn, mx, st, label, unit] = window.RL[k];
    inputHtml = `
      <div class="mu" style="text-align:center;margin-top:28px">${label}</div>
      <div class="bn" id="bn">
        <span>${window.S.u[k]}</span><small>${unit}</small>
      </div>
      <div class="rl">
        <input type="range" min="${mn}" max="${mx}" step="${st}" value="${window.S.u[k]}" 
               oninput="window.S.u['${k}'] = +this.value; window.$('#bn span').textContent = this.value">
      </div>
    `;
  }

  // Header back button logic: on step 0 when not editing, keep invisible for layout stability
  const showBack = i > 0 || isEditing;
  const backStyle = showBack ? 'background:rgba(255,255,255,0.25);border:0;color:#fff' : 'visibility:hidden';
  const progressPercent = (i + 1) * 20;

  return `
    <div class="obh">
      <div class="pb">
        <button onclick="back()" class="ib" aria-label="Back" style="${backStyle}">
          ${window.I('back', 20)}
        </button>
        <i><b style="width:${progressPercent}%"></b></i>
        <span>${isEditing ? 'Profile' : `${i + 1}/5`}</span>
        ${!isEditing ? `<button onclick="nx(1)" style="font-size:15px;font-weight:600">Skip</button>` : `<div style="width:38px"></div>`}
      </div>
      <h2>${isEditing ? 'Update Profile' : a}</h2>
    </div>
    <div class="obs">
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

// Navigation actions for Onboarding
window.back = function() {
  if (window.S.ob > 0 && !window.S.edit) {
    window.S.ob--;
    window.go('ob');
  } else if (window.S.edit) {
    window.S.edit = 0;
    window.go('me');
  }
};

window.nx = function(sk) {
  if (window.S.edit) {
    window.S.edit = 0;
    window.toast('Profile updated');
    return window.go('me');
  }
  if (sk || window.S.ob === 4) {
    window.S.ob = 0;
    return window.go('home');
  }
  window.S.ob++;
  window.go('ob');
};

window.edit = function(i) {
  window.S.ob = i;
  window.S.edit = 1;
  window.go('ob');
};
