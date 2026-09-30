export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function dateKey(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export function shortDay(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(y, m - 1, d).getDay()];
}

export function prettyDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export type Goal = 'build' | 'maintain' | 'lose';
export type Gender = 'male' | 'female';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'very' | 'athlete';

export const activityFactor: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  athlete: 1.9,
};

export function calcTargets(p: { age: number; gender: Gender; heightCm: number; weightKg: number; activity: Activity; goal: Goal }) {
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.gender === 'male' ? 5 : -161);
  const tdee = bmr * activityFactor[p.activity];
  const calories = Math.round((tdee + (p.goal === 'build' ? 350 : p.goal === 'lose' ? -450 : 0)) / 10) * 10;
  const protein = Math.round(p.weightKg * (p.goal === 'lose' ? 2.2 : p.goal === 'build' ? 2.0 : 1.8));
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(50, Math.round((calories - protein * 4 - fat * 9) / 4));
  const waterMl = Math.round((p.weightKg * 35) / 250) * 250;
  return { calories, protein, carbs, fat, waterMl, bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

export function streakFrom(dates: string[]) {
  const set = new Set(dates);
  let streak = 0;
  let offset = set.has(dateKey()) ? 0 : 1;
  while (set.has(dateKey(daysAgo(offset)))) {
    streak++;
    offset++;
  }
  return streak;
}

export function fmtTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function paceStr(sec: number, km: number) {
  if (km < 0.01) return '--:--';
  const p = sec / km;
  return `${Math.floor(p / 60)}:${String(Math.round(p % 60)).padStart(2, '0')}`;
}

export function grade(score: number) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 76) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  return 'D';
}
