import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Badge, Bars, Button, Card, H1, IconName, Label, Progress, Row, T, initialsOf } from '../components/ui';
import { dayTotals, fmtD, fmtW, useStore } from '../lib/store';
import { ALL_LESSONS } from '../lib/academy';
import { HEAD, useColors } from '../lib/theme';
import { dateKey, daysAgo, grade, streakFrom } from '../lib/utils';

function Section({ title, icon, children, action, onAction }: { title: string; icon: IconName; children: React.ReactNode; action?: string; onAction?: () => void }) {
  const c = useColors();
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name={icon} size={16} color={c.accent} />
        <Label color={c.text} style={{ flex: 1 }}>{title}</Label>
        {action ? <Text onPress={onAction} style={{ color: c.accent, fontWeight: '800', fontSize: 12 }}>{action}</Text> : null}
      </View>
      {children}
    </Card>
  );
}

function KV({ items }: { items: [string, string][] }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 }}>
      {items.map(([k, v]) => (
        <View key={k} style={{ width: '50%' }}>
          <Text style={{ color: c.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{k.toUpperCase()}</Text>
          <Text style={{ color: c.text, fontWeight: '800', fontSize: 15, marginTop: 2 }}>{v}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen({ navigation }: any) {
  const c = useColors();
  const { state, targets, streak } = useStore();
  const p = state.profile;
  const u = state.settings.units;
  const bmi = p.weightKg / Math.pow(p.heightCm / 100, 2);
  const lean = p.weightKg * (1 - p.bodyFat / 100);
  const total = p.squat1RM + p.bench1RM + p.deadlift1RM;
  const lastRec = state.recovery[state.recovery.length - 1];
  const mob = state.mobility[state.mobility.length - 1];
  const km = state.runs.reduce((a, r) => a + r.km, 0);
  const protStreak = streakFrom(Object.keys(state.logs).filter((k) => dayTotals(state.logs[k]).protein >= targets.protein * 0.9));
  const devStreak = streakFrom(state.devotional.dates);
  const quizVals = Object.values(state.quizScores);
  const quizAvg = quizVals.length ? Math.round(quizVals.reduce((a, b) => a + b, 0) / quizVals.length) : 0;
  const goalLabel = p.goal === 'build' ? 'Build Muscle' : p.goal === 'lose' ? 'Lose Weight' : 'Maintain';
  const achievements: { icon: IconName; label: string; got: boolean }[] = [
    { icon: 'flame', label: '7-day streak', got: streak >= 7 },
    { icon: 'trophy', label: '10 sessions', got: state.sessions.length >= 10 },
    { icon: 'barbell', label: '500kg total', got: total >= 500 },
    { icon: 'walk', label: '25km run', got: km >= 25 },
    { icon: 'school', label: '10 lessons', got: state.completedLessons.length >= 10 },
    { icon: 'nutrition', label: 'Protein week', got: protStreak >= 7 },
    { icon: 'book', label: 'Faithful 14', got: devStreak >= 14 },
    { icon: 'people', label: 'Squad member', got: state.posts.some((x) => x.author === p.name) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 60 }}>
      {/* 1. Header */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Avatar initials={initialsOf(p.name)} size={88} />
        <H1 size={28}>{p.name.toUpperCase()}</H1>
        <T sub>{p.handle}</T>
        <T style={{ textAlign: 'center' }} size={13}>{p.bio}</T>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {state.premium ? <Badge label="PREMIUM" /> : <Badge label="FREE PLAN" tone="muted" />}
          <Badge label={state.settings.privacy.publicProfile ? 'PUBLIC' : 'PRIVATE'} tone="blue" />
        </View>
        <Button small variant="ghost" icon="create-outline" title="EDIT PROFILE" onPress={() => navigation.navigate('EditProfile')} />
      </View>

      {/* 2. Quick stats */}
      <Card style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {[['WEIGHT', fmtW(p.weightKg, u)], ['HEIGHT', `${p.heightCm} cm`], ['SESSIONS', `${state.sessions.length}`], ['STREAK', `${streak}d`]].map(([l, v]) => (
          <View key={l} style={{ alignItems: 'center' }}>
            <Text style={{ fontFamily: HEAD, fontSize: 18, color: c.text }}>{v}</Text>
            <Label style={{ fontSize: 9 }}>{l}</Label>
          </View>
        ))}
      </Card>

      {/* 3. Training goals */}
      <Section title="Training Goals" icon="flag" action="Edit" onAction={() => navigation.navigate('EditProfile')}>
        <KV items={[['Goal', goalLabel], ['Target weight', fmtW(p.targetWeightKg, u)], ['Workouts / week', `${p.workoutsPerWeek}`], ['Activity', p.activity]]} />
        <Progress value={1 - Math.abs(p.targetWeightKg - p.weightKg) / Math.max(1, Math.abs(p.targetWeightKg - (state.weightLog[0]?.kg ?? p.weightKg)) + Math.abs(p.targetWeightKg - p.weightKg))} />
        <T sub size={11}>{Math.abs(p.targetWeightKg - p.weightKg).toFixed(1)} kg to target</T>
      </Section>

      {/* 4. Body composition */}
      <Section title="Body Composition" icon="body">
        <KV items={[['Body fat', `${p.bodyFat}%`], ['Lean mass', fmtW(lean, u)], ['BMI', bmi.toFixed(1)], ['Age / Sex', `${p.age} • ${p.gender}`]]} />
      </Section>

      {/* 5. Performance */}
      <Section title="Performance" icon="barbell">
        <KV items={[['Squat 1RM', fmtW(p.squat1RM, u)], ['Bench 1RM', fmtW(p.bench1RM, u)], ['Deadlift 1RM', fmtW(p.deadlift1RM, u)], ['Total', fmtW(total, u)]]} />
        <T sub size={11}>{Object.keys(state.prs).length} exercise PRs tracked • Relative strength {(total / p.weightKg).toFixed(1)}× BW</T>
      </Section>

      {/* 6. Body metrics */}
      <Section title="Body Metrics • Weight Trend" icon="analytics">
        <Bars data={state.weightLog.slice(-8).map((w, i, a) => ({ label: w.date.slice(5), value: w.kg - Math.min(...a.map((x) => x.kg)) + 1, highlight: i === a.length - 1 }))} height={70} />
        <T sub size={11}>{state.settings.privacy.bodyMetricsPrivate ? '🔒 Body metrics are private • ' : ''}Confidential progress photos stay on-device</T>
      </Section>

      {/* 7. Nutrition profile */}
      <Section title="Nutrition Profile" icon="nutrition" action="Fuel →" onAction={() => navigation.navigate('Tabs', { screen: 'Fuel' })}>
        <T size={13}>Goal: {p.goal.toUpperCase()} • {targets.calories} kcal • P{targets.protein} C{targets.carbs} F{targets.fat}</T>
        <T sub size={12}>Dietary: {p.dietary} • Allergies: {p.allergies} • Favourites: {p.favouriteFoods}</T>
        <T sub size={12}>Meal pref: {p.mealsPerDay} meals • SA foods priority • {state.customFoods.length} custom foods</T>
      </Section>

      {/* 8. Recovery profile */}
      <Section title="Recovery Profile" icon="moon" action="Open →" onAction={() => navigation.navigate('Recovery')}>
        <T size={13}>{lastRec ? `Sleep ${lastRec.sleepHours.toFixed(1)}h • Soreness ${lastRec.soreness}/10 • Fatigue ${lastRec.fatigue}/10` : 'No check-ins yet'}</T>
        <T sub size={12}>{state.recovery.length} check-ins logged</T>
      </Section>

      {/* 9. Mobility profile */}
      <Section title="Mobility Profile" icon="accessibility" action="Assess →" onAction={() => navigation.navigate('Mobility')}>
        <T size={13}>{mob ? `Latest ${mob.overall}% ${grade(mob.overall)} • Ankle ${mob.ankle}% Hip ${mob.hip}% T-Spine ${mob.tspine}%` : 'Not assessed yet'}</T>
      </Section>

      {/* 10. Current program */}
      <Section title="Current Program" icon="list" action="Train →" onAction={() => navigation.navigate('Tabs', { screen: 'Train', params: { tab: 'My Program' } })}>
        <T size={13}>{state.program.name} • Week {state.program.week} • {state.program.phase} • {state.program.days.length} days</T>
      </Section>

      {/* 11. Running */}
      <Section title="Running" icon="walk" action="Run →" onAction={() => navigation.navigate('Run')}>
        <T size={13}>{state.runs.length} runs • {fmtD(km, state.settings.distance)} total</T>
      </Section>

      {/* 12. Buddy */}
      <Section title="Buddy" icon="people" action="Squad →" onAction={() => navigation.navigate('Tabs', { screen: 'Squad', params: { tab: 'Buddy' } })}>
        <T size={13}>Sipho Dlamini • ZION-4829 • Online • {state.joinedChallenges.length} shared challenges</T>
      </Section>

      {/* 13. Achievements */}
      <Section title={`Achievements • ${achievements.filter((a) => a.got).length}/${achievements.length}`} icon="medal">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 }}>
          {achievements.map((a) => (
            <View key={a.label} style={{ width: '25%', alignItems: 'center', gap: 4, opacity: a.got ? 1 : 0.35 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: a.got ? c.accent : c.card2, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={a.icon} size={20} color={a.got ? c.onAccent : c.muted} />
              </View>
              <Text style={{ color: c.sub, fontSize: 10, textAlign: 'center', fontWeight: '700' }}>{a.label}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* 14. Streaks */}
      <Section title="Streaks" icon="flame">
        <KV items={[['Training', `${streak} days`], ['Protein target', `${protStreak} days`], ['Devotional', `${devStreak} days`], ['Nutrition logging', `${Object.keys(state.logs).filter((k) => state.logs[k].meals.length).length} days`]]} />
      </Section>

      {/* 15. Faith */}
      <Section title="Faith Profile" icon="book" action="Open →" onAction={() => navigation.navigate('Devotional')}>
        <T size={13}>Devotional streak {devStreak} • Completed {state.devotional.completed}</T>
        <T sub size={12}>Favourites: {state.devotional.favourites.join(', ') || 'None yet'}</T>
      </Section>

      {/* 16. Academy */}
      <Section title="S&C Academy" icon="school" action="Learn →" onAction={() => navigation.navigate('Tabs', { screen: 'Learn' })}>
        <T size={13}>Lessons {state.completedLessons.length}/{ALL_LESSONS.length} • Quiz avg {quizAvg}%</T>
        <Progress value={state.completedLessons.length / ALL_LESSONS.length} height={6} />
      </Section>

      {/* 17-22. Account menu */}
      <Card style={{ paddingVertical: 4 }}>
        <Row icon="diamond" title="Subscription" sub={state.premium ? 'Premium active • Manage' : 'Free plan • Upgrade to Premium'} onPress={() => navigation.navigate('Paywall')} />
        <Row icon="person-add" title="Personalized Coaching" sub={`Request status: ${state.coaching?.status ?? 'None'}`} onPress={() => navigation.navigate('Coaching')} />
        <Row icon="notifications" title="Notifications" sub="Reminders & alerts" onPress={() => navigation.navigate('Settings', { section: 'notifications' })} />
        <Row icon="shield-checkmark" title="Privacy & Visibility" sub="Profile, metrics, ladder, buddy" onPress={() => navigation.navigate('Settings', { section: 'privacy' })} />
        <Row icon="key" title="Account & Security" sub={p.email} onPress={() => navigation.navigate('Settings', { section: 'account' })} />
        <Row icon="settings" title="App Settings" sub={`Units ${u.toUpperCase()} • ${state.settings.distance.toUpperCase()} • Theme ${state.settings.theme}`} onPress={() => navigation.navigate('Settings', { section: 'app' })} />
        <Row icon="help-buoy" title="Support" sub="Help center, FAQ, contact" onPress={() => navigation.navigate('Settings', { section: 'support' })} />
        <Row icon="information-circle" title="About ZION FIT" sub="Faith & Iron • v2.4.0" onPress={() => navigation.navigate('Settings', { section: 'about' })} last />
      </Card>
    </ScrollView>
  );
}
