/* ==========================================================================
   LifePro Fit - Screen: Dedicated Single Profile Editor (Production-Grade)
   ========================================================================== */

window.Screens = window.Screens || {};

window.Screens.profile_edit = function() {
  const bmi = window.calcBMI();
  const u = window.S.u;

  // Generate ruler ticks for Height (120 - 220 cm)
  const [hMin, hMax, hStep] = [120, 220, 1];
  const hSteps = Math.round((hMax - hMin) / hStep);
  let hTicks = '';
  for (let s = 0; s <= hSteps; s++) {
    const val = +(hMin + s * hStep).toFixed(1);
    const isMajor = val % 10 === 0;
    const isMid = val % 5 === 0 && !isMajor;
    hTicks += `<div class="ruler-tick${isMajor ? ' major' : (isMid ? ' mid' : '')}" data-val="${val}"></div>`;
  }

  // Generate ruler ticks for Weight (30 - 200 kg)
  const [wMin, wMax, wStep] = [30, 200, 0.5];
  const wSteps = Math.round((wMax - wMin) / wStep);
  let wTicks = '';
  for (let s = 0; s <= wSteps; s++) {
    const val = +(wMin + s * wStep).toFixed(1);
    const isMajor = val % 10 === 0;
    const isMid = val % 5 === 0 && !isMajor;
    wTicks += `<div class="ruler-tick${isMajor ? ' major' : (isMid ? ' mid' : '')}" data-val="${val}"></div>`;
  }

  return `
    <!-- Top Bar Navigation -->
    <div class="rw" style="margin-bottom:18px;justify-content:space-between">
      <button onclick="go('me')" class="ib" aria-label="Back to Settings">
        ${window.I('back', 20)}
      </button>
      <div class="t1" style="font-size:18px;font-weight:800;letter-spacing:-0.01em">Edit Profile</div>
      <button onclick="saveProfile()" style="font-size:15px;font-weight:700;color:var(--ac);cursor:pointer;padding:6px 12px;border-radius:12px;background:color-mix(in srgb, var(--ac) 14%, transparent)">
        Save
      </button>
    </div>

    <!-- Avatar Identity Ring -->
    <div class="avatar-edit-container">
      <div class="avatar-edit-ring">
        <div class="avatar-edit-inner" id="pe-avatar">
          ${window.ini()}
        </div>
        <div class="avatar-edit-badge" onclick="window.toast('Photo upload ready')" title="Change Avatar">
          ${window.I('edit', 14)}
        </div>
      </div>
      <div class="mu" style="font-size:12px;font-weight:600;margin-top:8px">Personal Identity</div>
    </div>

    <!-- 1. Personal Information Card -->
    <div class="t2" style="font-size:15px;margin-bottom:8px">Personal details</div>
    <div class="cd" style="padding:16px;margin-bottom:14px">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input class="form-input" id="pe-name" type="text" 
               value="${window.esc(u.name)}" 
               placeholder="Enter your name" 
               maxlength="32" 
               oninput="window.S.u.name = this.value; window.updLiveProfileInitials()">
      </div>

      <div class="form-group" style="margin-bottom:14px">
        <label class="form-label">Gender</label>
        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px">
          ${['Male', 'Female', 'Other'].map(g => `
            <button class="gb ${u.g === g ? 'on' : ''}" id="gender-btn-${g}" 
                    style="padding:11px 8px;font-size:14px;border-radius:14px;text-align:center" 
                    onclick="window.setProfileGender('${g}')">
              ${g === 'Male' ? '♂ ' : (g === 'Female' ? '♀ ' : '✦ ')}${g}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="form-group" style="margin-bottom:4px">
        <label class="form-label">Age</label>
        <div class="rw" style="justify-content:space-between;background:var(--s2);padding:8px 14px;border-radius:16px;border:1.5px solid var(--ln)">
          <button class="ib" style="width:36px;height:36px;background:var(--cd)" aria-label="Decrease Age" onclick="window.stepProfileAge(-1)">
            ${window.I('minus', 16)}
          </button>
          <b id="pe-age" style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">${u.age} <small style="font-size:13px;color:var(--mu);font-weight:600">years</small></b>
          <button class="ib" style="width:36px;height:36px;background:var(--cd)" aria-label="Increase Age" onclick="window.stepProfileAge(1)">
            ${window.I('plus', 16)}
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Biometrics & Measurements Card -->
    <div class="t2" style="font-size:15px;margin-bottom:8px">Biometrics (Height & Weight)</div>
    <div class="cd" style="padding:16px;margin-bottom:14px">
      <!-- Height Slider Section -->
      <div class="rw" style="justify-content:space-between;margin-bottom:2px">
        <span class="form-label" style="margin:0">Height</span>
        <span class="tag" style="font-size:11px;padding:2px 8px;background:var(--s2);color:var(--ac);font-weight:700">cm</span>
      </div>
      <div class="bn" id="bn-h" style="height:64px;font-size:48px;margin-top:2px">
        <span style="min-width:92px">${u.h}</span><small style="font-size:20px">cm</small>
      </div>
      <div class="ruler-wrap" data-key="h" data-min="${hMin}" data-max="${hMax}" data-step="${hStep}" data-unit="cm" data-target="#bn-h span" data-onchange="updProfileLiveBMI" role="slider" aria-label="Height (cm)">
        <div class="ruler-needle"></div>
        <div class="ruler-track">
          ${hTicks}
        </div>
      </div>

      <div style="height:1px;background:var(--ln);margin:16px 0"></div>

      <!-- Weight Slider Section -->
      <div class="rw" style="justify-content:space-between;margin-bottom:2px">
        <span class="form-label" style="margin:0">Weight</span>
        <span class="tag" style="font-size:11px;padding:2px 8px;background:var(--s2);color:var(--ac);font-weight:700">kg</span>
      </div>
      <div class="bn" id="bn-w" style="height:64px;font-size:48px;margin-top:2px">
        <span style="min-width:92px">${u.w}</span><small style="font-size:20px">kg</small>
      </div>
      <div class="ruler-wrap" data-key="w" data-min="${wMin}" data-max="${wMax}" data-step="${wStep}" data-unit="kg" data-target="#bn-w span" data-onchange="updProfileLiveBMI" role="slider" aria-label="Weight (kg)">
        <div class="ruler-needle"></div>
        <div class="ruler-track">
          ${wTicks}
        </div>
      </div>
    </div>

    <!-- 3. Live BMI Calculation Card -->
    <div class="t2" style="font-size:15px;margin-bottom:8px">Calculated BMI</div>
    <div class="cd" style="padding:16px;margin-bottom:18px">
      <div class="rw" style="justify-content:space-between;margin-bottom:10px">
        <span class="lb" style="font-weight:700">Body Mass Index</span>
        <b id="pe-bmi-label" style="color:${bmi.color};font-size:14px;font-weight:800">
          ${bmi.text} kg/m² · ${bmi.cat}
        </b>
      </div>
      <div style="height:6px;border-radius:99px;display:flex;gap:3px;overflow:hidden;background:var(--s2)">
        <div id="bmi-bar-under" style="flex:18.5;border-radius:3px;background:var(--bl);opacity:${bmi.val < 18.5 ? '1' : '0.35'}"></div>
        <div id="bmi-bar-norm" style="flex:6.4;border-radius:3px;background:var(--gr);opacity:${bmi.val >= 18.5 && bmi.val < 25 ? '1' : '0.35'}"></div>
        <div id="bmi-bar-over" style="flex:5;border-radius:3px;background:var(--or);opacity:${bmi.val >= 25 && bmi.val < 30 ? '1' : '0.35'}"></div>
        <div id="bmi-bar-obese" style="flex:10;border-radius:3px;background:var(--rd);opacity:${bmi.val >= 30 ? '1' : '0.35'}"></div>
      </div>
      <div class="rw" style="justify-content:space-between;font-size:11px;font-weight:600;color:var(--mu);margin-top:6px">
        <span>Under (<18.5)</span>
        <span>Normal (18.5–24.9)</span>
        <span>Over (25–29.9)</span>
        <span>Obese (30+)</span>
      </div>
    </div>

    <!-- Save Changes Action -->
    <div style="margin:24px 0 36px">
      <button class="btn" onclick="saveProfile()" style="height:52px;font-size:16px">
        ${window.I('check', 18)} Save Changes
      </button>
    </div>
  `;
};

// Profile Editor Real-time Helpers
window.updLiveProfileInitials = function() {
  const el = document.querySelector('#pe-avatar');
  if (el) el.textContent = window.ini();
};

window.setProfileGender = function(g) {
  window.S.u.g = g;
  ['Male', 'Female', 'Other'].forEach(x => {
    const b = document.querySelector(`#gender-btn-${x}`);
    if (b) b.classList.toggle('on', x === g);
  });
};

window.stepProfileAge = function(delta) {
  window.S.u.age = Math.max(12, Math.min(100, window.S.u.age + delta));
  const el = document.querySelector('#pe-age');
  if (el) el.innerHTML = `${window.S.u.age} <small style="font-size:13px;color:var(--mu);font-weight:600">years</small>`;
};

window.updProfileLiveBMI = function() {
  const bmi = window.calcBMI();
  const label = document.querySelector('#pe-bmi-label');
  if (label) {
    label.style.color = bmi.color;
    label.textContent = `${bmi.text} kg/m² · ${bmi.cat}`;
  }
  const u = document.querySelector('#bmi-bar-under');
  const n = document.querySelector('#bmi-bar-norm');
  const o = document.querySelector('#bmi-bar-over');
  const b = document.querySelector('#bmi-bar-obese');
  if (u) u.style.opacity = bmi.val < 18.5 ? '1' : '0.35';
  if (n) n.style.opacity = bmi.val >= 18.5 && bmi.val < 25 ? '1' : '0.35';
  if (o) o.style.opacity = bmi.val >= 25 && bmi.val < 30 ? '1' : '0.35';
  if (b) b.style.opacity = bmi.val >= 30 ? '1' : '0.35';
};

window.saveProfile = function() {
  const nameInput = document.querySelector('#pe-name');
  if (nameInput) window.S.u.name = nameInput.value.trim();
  window.toast('Profile updated successfully');
  window.go('me');
};
