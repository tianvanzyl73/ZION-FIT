import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, Gender, Goal, calcTargets, dateKey, daysAgo, streakFrom, uid } from './utils';
import { Food, MealType } from './data';

export type ProgramExercise = { id: string; name: string; sets: number; reps: string; kg: number };
export type ProgramDay = { id: string; name: string; exercises: ProgramExercise[] };
export type Program = { name: string; phase: 'Hypertrophy' | 'Strength' | 'Power'; week: number; days: ProgramDay[]; source?: string };
export type Session = { id: string; date: string; dayName: string; sets: number; volume: number; minutes: number; prs: string[] };
export type FoodEntry = { id: string; foodId: string; name: string; servings: number; meal: MealType; calories: number; protein: number; carbs: number; fat: number; calcium: number; iron: number; magnesium: number };
export type DayLog = { meals: FoodEntry[]; waterMl: number };
export type RecoveryLog = { date: string; sleepHours: number; sleepQuality: number; soreness: number; fatigue: number; stress: number };
export type MobilityLog = { date: string; ankle: number; hip: number; tspine: number; shoulder: number; overall: number };
export type Run = { id: string; date: string; km: number; seconds: number };
export type PR = { weight: number; reps: number; date: string };
export type Post = { id: string; author: string; avatar: string; text: string; date: string; likes: number; liked: boolean; comments: { id: string; author: string; text: string }[]; tag?: string };
export type ChatMsg = { id: string; from: 'me' | 'buddy'; text: string; date: string };
export type Notif = { id: string; title: string; body: string; date: string; read: boolean; icon: string; kind: NotifKind };
export type NotifKind = 'workout' | 'nutrition' | 'academy' | 'buddy' | 'faith' | 'recovery';
export type CoachingRequest = { status: 'Pending' | 'In Review' | 'Accepted'; goal: string; days: number; notes: string; date: string };

export type Profile = {
  name: string; handle: string; bio: string; age: number; gender: Gender; heightCm: number; weightKg: number;
  bodyFat: number; targetWeightKg: number; activity: Activity; goal: Goal; workoutsPerWeek: number;
  dietary: string; allergies: string; mealsPerDay: number; favouriteFoods: string; email: string;
  squat1RM: number; bench1RM: number; deadlift1RM: number; customTargets?: { calories: number; protein: number; carbs: number; fat: number } | null;
};

export type Settings = {
  theme: 'dark' | 'light' | 'system'; units: 'kg' | 'lb'; distance: 'km' | 'mi'; sound: boolean; vibration: boolean;
  notif: Record<NotifKind, boolean>;
  privacy: { publicProfile: boolean; showWorkouts: boolean; bodyMetricsPrivate: boolean; achievementsPublic: boolean; appearOnLadder: boolean; shareWithBuddy: boolean; analytics: boolean };
};

export type State = {
  onboarded: boolean; premium: boolean; profile: Profile; settings: Settings; program: Program; sessions: Session[];
  logs: Record<string, DayLog>; customFoods: Food[]; mealPlan: Record<string, Record<string, { name: string; calories: number; protein: number; carbs: number; fat: number }[]>>;
  recovery: RecoveryLog[]; mobility: MobilityLog[]; runs: Run[]; prs: Record<string, PR>; favourites: number[];
  completedLessons: number[]; quizScores: Record<number, number>; weightLog: { date: string; kg: number }[];
  posts: Post[]; chat: ChatMsg[]; joinedChallenges: string[]; coaching: CoachingRequest | null; notifications: Notif[];
  devotional: { dates: string[]; completed: number; favourites: string[] };
};

const sampleProgram: Program = {
  name: 'My Zion Build', phase: 'Hypertrophy', week: 1,
  days: [
    { id: 'd1', name: 'Upper Push', exercises: [
      { id: 'e1', name: 'Bench Press', sets: 4, reps: '8', kg: 80 },
      { id: 'e2', name: 'Overhead Press', sets: 3, reps: '10', kg: 45 },
      { id: 'e3', name: 'Lateral Raise', sets: 4, reps: '15', kg: 10 },
      { id: 'e4', name: 'Tricep Pushdown', sets: 3, reps: '12', kg: 30 } ] },
    { id: 'd2', name: 'Lower Strength', exercises: [
      { id: 'e5', name: 'Back Squat', sets: 5, reps: '5', kg: 110 },
      { id: 'e6', name: 'Romanian Deadlift', sets: 3, reps: '10', kg: 90 },
      { id: 'e7', name: 'Bulgarian Split Squat', sets: 3, reps: '10', kg: 20 } ] },
    { id: 'd3', name: 'Upper Pull', exercises: [
      { id: 'e8', name: 'Pull-Up', sets: 4, reps: '8', kg: 0 },
      { id: 'e9', name: 'Bent-Over Row', sets: 4, reps: '10', kg: 70 },
      { id: 'e10', name: 'Face Pull', sets: 3, reps: '15', kg: 20 },
      { id: 'e11', name: 'Barbell Curl', sets: 3, reps: '12', kg: 30 } ] },
  ],
};

function seedSessions(): Session[] {
  const out: Session[] = [];
  const pattern = [0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 16, 18];
  pattern.forEach((d, i) => {
    out.push({ id: uid(), date: daysAgo(d).toISOString(), dayName: sampleProgram.days[i % 3].name, sets: 14 + (i % 4), volume: 5200 + ((i * 731) % 2400), minutes: 55 + (i % 5) * 4, prs: [] });
  });
  return out;
}

function seedRecovery(): RecoveryLog[] {
  return Array.from({ length: 14 }, (_, i) => ({
    date: dateKey(daysAgo(13 - i)), sleepHours: 6.8 + ((i * 37) % 17) / 10, sleepQuality: 6 + ((i * 3) % 4), soreness: 2 + ((i * 5) % 4), fatigue: 3 + ((i * 7) % 3), stress: 3 + ((i * 2) % 4),
  }));
}

function seedLogs(): Record<string, DayLog> {
  const logs: Record<string, DayLog> = {};
  for (let d = 1; d <= 6; d++) {
    const k = dateKey(daysAgo(d));
    const f = 1 + (d % 3) * 0.08;
    logs[k] = {
      waterMl: 2000 + (d % 3) * 250,
      meals: [
        { id: uid(), foodId: 'seed', name: 'Oats Rolled', servings: 1, meal: 'Breakfast', calories: Math.round(389 * f), protein: 17, carbs: 66, fat: 7, calcium: 54, iron: 4.7, magnesium: 177 },
        { id: uid(), foodId: 'seed', name: 'Chicken Breast · Double', servings: 1, meal: 'Lunch', calories: 330, protein: 62, carbs: 0, fat: 7, calcium: 22, iron: 1.4, magnesium: 58 },
        { id: uid(), foodId: 'seed', name: 'Pap / Maize Meal · Large', servings: 2, meal: 'Dinner', calories: 345, protein: 6, carbs: 72, fat: 1.5, calcium: 9, iron: 1.2, magnesium: 54 },
        { id: uid(), foodId: 'seed', name: 'Biltong (Beef) · Small', servings: 1, meal: 'Snacks', calories: 140, protein: 22.5, carbs: 1.5, fat: 4, calcium: 8, iron: 2.1, magnesium: 15 },
        { id: uid(), foodId: 'seed', name: 'Protein Shake Whey', servings: 2, meal: 'Snacks', calories: Math.round(240 * f), protein: 48, carbs: 6, fat: 3, calcium: 240, iron: 0.6, magnesium: 60 },
      ],
    };
  }
  return logs;
}

const now = () => new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600e3).toISOString();

export const initialState: State = {
  onboarded: false,
  premium: false,
  profile: {
    name: 'Thabo N. Khumalo', handle: '@thabo.zion', bio: 'S&C Coach in training. Faith & Iron. Philippians 4:13', age: 27, gender: 'male', heightCm: 180, weightKg: 84,
    bodyFat: 15, targetWeightKg: 88, activity: 'very', goal: 'build', workoutsPerWeek: 5, dietary: 'None', allergies: 'None', mealsPerDay: 4,
    favouriteFoods: 'Chicken, Rice, Amasi', email: 'thabo@zionfit.sa', squat1RM: 150, bench1RM: 110, deadlift1RM: 190, customTargets: null,
  },
  settings: {
    theme: 'dark', units: 'kg', distance: 'km', sound: true, vibration: true,
    notif: { workout: true, nutrition: true, academy: true, buddy: true, faith: true, recovery: false },
    privacy: { publicProfile: false, showWorkouts: true, bodyMetricsPrivate: true, achievementsPublic: true, appearOnLadder: true, shareWithBuddy: true, analytics: false },
  },
  program: sampleProgram,
  sessions: seedSessions(),
  logs: seedLogs(),
  customFoods: [],
  mealPlan: {},
  recovery: seedRecovery(),
  mobility: [
    { date: dateKey(daysAgo(30)), ankle: 61, hip: 78, tspine: 66, shoulder: 72, overall: 69 },
    { date: dateKey(daysAgo(2)), ankle: 68, hip: 82, tspine: 71, shoulder: 75, overall: 74 },
  ],
  runs: [
    { id: uid(), date: daysAgo(1).toISOString(), km: 5.2, seconds: 1780 },
    { id: uid(), date: daysAgo(3).toISOString(), km: 3.4, seconds: 1150 },
    { id: uid(), date: daysAgo(6).toISOString(), km: 4.8, seconds: 1690 },
  ],
  prs: {
    'Back Squat': { weight: 150, reps: 1, date: dateKey(daysAgo(12)) },
    'Bench Press': { weight: 110, reps: 1, date: dateKey(daysAgo(9)) },
    Deadlift: { weight: 190, reps: 1, date: dateKey(daysAgo(20)) },
    'Overhead Press': { weight: 60, reps: 5, date: dateKey(daysAgo(4)) },
  },
  favourites: [],
  completedLessons: [1, 2, 3, 5, 6, 9, 10, 13],
  quizScores: { 1: 100 },
  weightLog: Array.from({ length: 8 }, (_, i) => ({ date: dateKey(daysAgo((7 - i) * 7)), kg: 81.2 + i * 0.4 + (i % 2 ? 0.2 : 0) })),
  posts: [
    { id: 'p1', author: 'Sipho Dlamini', avatar: 'SD', text: 'New squat PR this morning — 170kg for a clean single. God is good! 🙌 #FaithAndIron', date: hoursAgo(2), likes: 24, liked: false, tag: 'PR', comments: [{ id: 'c1', author: 'Lerato M.', text: 'Beast mode! 🔥' }] },
    { id: 'p2', author: 'Lerato Mokoena', avatar: 'LM', text: 'Week 3 of the Plyometric Ascension protocol. Vertical up 4cm already. Pogo hops are no joke.', date: hoursAgo(6), likes: 41, liked: false, tag: 'Progress', comments: [] },
    { id: 'p3', author: 'Coach Zion', avatar: 'CZ', text: 'Reminder: sleep is the most anabolic thing you can do. Aim for 7-9h tonight. Recovery is part of the program.', date: hoursAgo(20), likes: 88, liked: true, tag: 'Coach Tip', comments: [{ id: 'c2', author: 'Jaco V.', text: 'Needed this.' }, { id: 'c3', author: 'Sipho D.', text: 'Amen coach' }] },
    { id: 'p4', author: 'Jaco van Wyk', avatar: 'JV', text: 'Ran 10km along the Pretoria route today. Pap and wors to refuel 🇿🇦', date: hoursAgo(30), likes: 17, liked: false, tag: 'Run', comments: [] },
  ],
  chat: [
    { id: 'm1', from: 'buddy', text: 'Morning bro! Ready for the 100km challenge this month?', date: hoursAgo(5) },
    { id: 'm2', from: 'me', text: 'Born ready. I did 5.2km yesterday.', date: hoursAgo(4.8) },
    { id: 'm3', from: 'buddy', text: 'Lekker! I’m at 12.4 — catch me if you can 😂', date: hoursAgo(4.7) },
  ],
  joinedChallenges: ['100km Run'],
  coaching: null,
  notifications: [
    { id: 'n1', title: 'Workout reminder', body: 'Upper Push is scheduled for today. Let’s go!', date: hoursAgo(1), read: false, icon: 'barbell', kind: 'workout' },
    { id: 'n2', title: 'Sipho sent you a message', body: 'Lekker! I’m at 12.4 — catch me if you can', date: hoursAgo(4.7), read: false, icon: 'chatbubble', kind: 'buddy' },
    { id: 'n3', title: 'Verse of the day', body: 'Philippians 4:13 — I can do all things through Christ who strengthens me.', date: hoursAgo(9), read: true, icon: 'book', kind: 'faith' },
    { id: 'n4', title: 'Log your lunch', body: 'You’re 62g protein short of today’s target.', date: hoursAgo(26), read: true, icon: 'restaurant', kind: 'nutrition' },
  ],
  devotional: { dates: Array.from({ length: 18 }, (_, i) => dateKey(daysAgo(i + 1))), completed: 64, favourites: ['Philippians 4:13', 'Joshua 1:9'] },
};

const KEY = 'zionfit-state-v1';

type Ctx = {
  state: State;
  ready: boolean;
  update: (fn: (s: State) => State) => void;
  notify: (kind: NotifKind, title: string, body: string, icon: string) => void;
  targets: { calories: number; protein: number; carbs: number; fat: number; waterMl: number; bmr: number; tdee: number };
  streak: number;
  todayKey: string;
  resetAll: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          setState({ ...initialState, ...parsed, settings: { ...initialState.settings, ...parsed.settings }, profile: { ...initialState.profile, ...parsed.profile } });
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
  }, [state, ready]);

  const update = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const notify = useCallback((kind: NotifKind, title: string, body: string, icon: string) => {
    setState((s) => {
      if (!s.settings.notif[kind]) return s;
      return { ...s, notifications: [{ id: uid(), title, body, icon, kind, date: now(), read: false }, ...s.notifications].slice(0, 60) };
    });
  }, []);

  const resetAll = useCallback(() => {
    AsyncStorage.removeItem(KEY).catch(() => {});
    setState(initialState);
  }, []);

  const targets = useMemo(() => {
    const t = calcTargets(state.profile);
    const c = state.profile.customTargets;
    return c ? { ...t, ...c } : t;
  }, [state.profile]);

  const streak = useMemo(() => streakFrom(state.sessions.map((s) => dateKey(new Date(s.date)))), [state.sessions]);
  const todayKey = dateKey();

  const value = useMemo(() => ({ state, ready, update, notify, targets, streak, todayKey, resetAll }), [state, ready, update, notify, targets, streak, todayKey, resetAll]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('useStore outside provider');
  return c;
}

export function dayTotals(log?: DayLog) {
  const t = { calories: 0, protein: 0, carbs: 0, fat: 0, calcium: 0, iron: 0, magnesium: 0 };
  log?.meals.forEach((m) => {
    t.calories += m.calories; t.protein += m.protein; t.carbs += m.carbs; t.fat += m.fat;
    t.calcium += m.calcium; t.iron += m.iron; t.magnesium += m.magnesium;
  });
  return t;
}

export function parseProtocolExercise(s: string): ProgramExercise {
  const m = s.match(/^(.*?)\s+(\d+)x(\d+)\s*$/);
  if (m) return { id: uid(), name: m[1], sets: Number(m[2]), reps: m[3], kg: 0 };
  return { id: uid(), name: s, sets: 3, reps: '8', kg: 0 };
}

export const fmtW = (kg: number, units: 'kg' | 'lb') => (units === 'kg' ? `${Math.round(kg * 10) / 10} kg` : `${Math.round(kg * 2.2046)} lb`);
export const fmtD = (km: number, d: 'km' | 'mi') => (d === 'km' ? `${km.toFixed(2)} km` : `${(km * 0.6214).toFixed(2)} mi`);
