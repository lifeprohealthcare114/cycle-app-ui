/* ==========================================================================
   LifePro Fit - Configuration & Constants
   ========================================================================== */

window.DV = {
  baiget: ['Baiget', 'PPG + ECG Biosensor (HR, SpO₂, ECG, HRV, Temp)', 'var(--rd)'],
  physilog: ['Physilog', 'Motion & Gait Telemetry (Cadence, Leg Movement)', 'var(--pu)'],
  g: ['Baiget PPG', 'Heart rate, SpO₂, skin temperature', 'var(--bl)'],
  e: ['Baiget ECG', 'Heart rhythm, HRV', 'var(--gr)'],
  p: ['Physilog', 'Cadence, leg movement & balance', 'var(--pu)']
};

window.DK = {
  baiget: ['hr', 'sp', 'tp', 'hv', 'kc', 'rpe', 'hs'],
  physilog: ['cd', 'lm'],
  g: ['hr', 'sp', 'tp', 'kc', 'rpe'],
  e: ['hv', 'hs'],
  p: ['cd', 'lm']
};

window.M = {
  hr: ['Heart rate', 'bpm', 'heart', 'var(--rd)', 50, 180, 0, 'ge'],
  sp: ['Blood oxygen', '%', 'drop', 'var(--bl)', 95, 100, 0, 'g'],
  tp: ['Skin temp', '°C', 'temp', 'var(--or)', 35.9, 37.4, 1, 'g'],
  hv: ['HRV', 'ms', 'pulse', 'var(--gr)', 20, 100, 0, 'e'],
  kc: ['Calories burn', 'kcal', 'bolt', 'var(--or)', 0, 3000, 0, 'g'],
  rpe: ['Perceived exertion', 'RPE', 'award', '#3B82F6', 1, 10, 0, 'g'],
  hs: ['Heart stress', '%', 'pulse', '#8B5CF6', 0, 100, 0, 'e'],
  cd: ['Cadence', 'rpm', 'bolt', 'var(--pu)', 0, 200, 0, 'p'],
  lm: ['Leg movement', '%', 'pulse', 'var(--pu)', 70, 100, 0, 'p']
};

window.R = [
  { n: 'Baiget Cardio Session', d: 'Today, 6:10 PM', km: 0, m: 45, kc: 390, hr: 136, cd: 0, mx: 0, s: 1, ty: 'baiget' },
  { n: 'Physilog Motion Ride', d: 'Yesterday, 7:40 AM', km: 18.2, m: 38, kc: 340, hr: 0, cd: 82, mx: 31.5, s: 2, ty: 'physilog' },
  { n: 'Dual-Sync Training', d: 'Sat, 6:05 AM', km: 38.6, m: 110, kc: 940, hr: 142, cd: 79, mx: 37.2, s: 3, ty: 'both' },
  { n: 'Physilog Interval Run', d: 'Fri, 6:30 AM', km: 6.4, m: 34, kc: 360, hr: 0, cd: 168, mx: 13.5, s: 5, ty: 'physilog' },
  { n: 'Baiget Recovery Session', d: 'Thu, 5:50 PM', km: 0, m: 40, kc: 260, hr: 118, cd: 0, mx: 0, s: 4, ty: 'baiget' }
];

window.TOT = { d: 18.2, w: 128.7, m: 486 };
window.WK = [22.4, 0, 41.3, 12.7, 9.6, 24.5, 18.2];

window.TY = [
  ['baiget', 'Baiget', 'PPG + ECG biometrics · Heart rate, SpO₂, ECG rhythm & HRV'],
  ['physilog', 'Physilog', 'Motion telemetry · Cadence, leg balance & speed']
];

window.ACC = {
  yellow: ['Amber Gold', '#FCC232'],
  teal: ['Teal', '#0E9F8F']
};

window.LB = {
  home: 'Home',
  rides: 'Activity',
  hl: 'Health',
  me: 'Settings'
};

window.TABS = [
  ['home', 'Home', 'home'],
  ['rides', 'Activity', 'timer'],
  ['hl', 'Health', 'heart'],
  ['me', 'Settings', 'gear']
];

window.OBS = [
  ['Welcome!', 'What’s your name?', 'We’ll use it to personalise your app.'],
  ['Great start!', 'What’s your gender?', 'Gender helps us estimate calories burned.'],
  ['Let’s continue!', 'What’s your age?', 'Age sets your heart-rate zones.'],
  ['You’re doing great!', 'What’s your height?', 'Height helps us calculate BMI.'],
  ['Almost there!', 'What’s your weight?', 'Weight is used for calorie and effort estimates.']
];

window.RL = {
  age: [12, 80, 1, 'Age (years)', 'yrs'],
  h: [120, 220, 1, 'Height (cm)', 'cm'],
  w: [30, 200, 0.5, 'Weight (kg)', 'kg']
};

window.KS = ['name', 'g', 'age', 'h', 'w'];

window.GR = [
  'linear-gradient(160deg, #FF9A3D, #E85A0C)',
  'linear-gradient(160deg, #19D3BE, #0B7F9E)',
  'linear-gradient(160deg, #8B6CF0, #3B3FD6)',
  'linear-gradient(160deg, #2A3A44, #0B1418)'
];

window.HB = {
  hr: [71, 16],
  sp: [97, 1.6],
  tp: [36.6, 0.35],
  hv: [48, 12],
  kc: [420, 80],
  rpe: [4, 1.2],
  hs: [22, 6],
  cd: [74, 16],
  lm: [92, 6]
};

window.DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
