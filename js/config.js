/* ==========================================================================
   LifePro Fit - Configuration & Constants
   ========================================================================== */

window.DV = {
  g: ['SmartGrip PPG', 'Heart rate, SpO₂, skin temperature', 'var(--bl)'],
  e: ['SmartGrip ECG', 'Heart rhythm, HRV, hydration', 'var(--gr)'],
  p: ['PhysiLog', 'Cadence, leg movement', 'var(--pu)']
};

window.DK = {
  g: ['hr', 'sp', 'tp'],
  e: ['hv', 'hy'],
  p: ['cd', 'lm']
};

window.M = {
  hr: ['Heart rate', 'bpm', 'heart', 'var(--rd)', 50, 180, 0, 'ge'],
  sp: ['Blood oxygen', '%', 'drop', 'var(--bl)', 95, 100, 0, 'g'],
  tp: ['Skin temp', '°C', 'temp', 'var(--or)', 35.9, 37.4, 1, 'g'],
  hv: ['HRV', 'ms', 'pulse', 'var(--gr)', 20, 100, 0, 'e'],
  hy: ['Hydration', '%', 'drop', 'var(--ac)', 60, 100, 0, 'e'],
  cd: ['Cadence', 'rpm', 'bolt', 'var(--pu)', 0, 200, 0, 'p'],
  lm: ['Leg movement', '%', 'pulse', 'var(--pu)', 70, 100, 0, 'p']
};

window.R = [
  { n: 'Evening Ride', d: 'Today, 6:10 PM', km: 18.2, m: 52, kc: 455, hr: 134, cd: 78, mx: 34.6, s: 1, ty: 'bike' },
  { n: 'Morning Commute', d: 'Yesterday, 7:40 AM', km: 9.6, m: 28, kc: 240, hr: 121, cd: 72, mx: 29.8, s: 2, ty: 'bike' },
  { n: 'Weekend Long Ride', d: 'Sat, 6:05 AM', km: 41.3, m: 128, kc: 1030, hr: 139, cd: 81, mx: 38.2, s: 3, ty: 'bike' },
  { n: 'Easy Run', d: 'Fri, 6:30 AM', km: 5.2, m: 31, kc: 322, hr: 148, cd: 166, mx: 12.9, s: 5, ty: 'run' },
  { n: 'Hill Intervals', d: 'Thu, 5:50 PM', km: 22.7, m: 74, kc: 610, hr: 152, cd: 70, mx: 36.1, s: 4, ty: 'bike' }
];

window.TOT = { d: 18.2, w: 128.7, m: 486 };
window.WK = [22.4, 0, 41.3, 12.7, 9.6, 24.5, 18.2];

window.TY = [
  ['bike', 'Cycling', 'Track speed, distance and your route'],
  ['run', 'Running', 'Track pace, distance and your route']
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
  hy: [84, 7],
  cd: [74, 16],
  lm: [92, 6]
};

window.DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
