import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Bars, Button, Card, Label, Progress, SectionHeader, Stat, T } from '../components/ui';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { grade, shortDay } from '../lib/utils';

export default function RecoveryScreen({ navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  const rec = state.recovery.slice(-14);
  const last7 = rec.slice(-7);
  const prev7 = rec.slice(-14, -7);
  const score = (r: (typeof rec)[number]) => Math.round(((r.sleepQuality / 10) * 0.35 + Math.min(1, r.sleepHours / 8) * 0.25 + (1 - r.soreness / 10) * 0.2 + (1 - r.fatigue / 10) * 0.1 + (1 - r.stress / 10) * 0.1) * 100);
  const avg = (arr: typeof rec, f: (r: (typeof rec)[number]) => number) => (arr.length ? arr.reduce((a, r) => a + f(r), 0) / arr.length : 0);
  const nowScore = Math.round(avg(last7, score));
  const prevScore = Math.round(avg(prev7, score));
  const trendUp = nowScore >= prevScore;
  const mob = state.mobility[state.mobility.length - 1];
  const readiness = rec.length ? score(rec[rec.length - 1]) : 0;
  const advice = readiness >= 75 ? 'Green light: push intensity today.' : readiness >= 60 ? 'Amber: train as planned, keep RPE ≤ 8.' : 'Red: prioritise mobility, breathing and an easy session.';

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 60 }}>
      <Card accent style={{ gap: 8 }}>
        <Label color={c.accent}>TODAY'S READINESS</Label>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
          <Text style={{ fontFamily: HEAD, fontSize: 52, color: c.text }}>{readiness}</Text>
          <Text style={{ color: c.muted, marginBottom: 12 }}>/ 100</Text>
        </View>
        <Progress value={readiness / 100} color={readiness >= 75 ? c.green : readiness >= 60 ? c.accent : c.red} />
        <T sub size={13}>{advice}</T>
        <Button title="LOG RECOVERY" icon="add-circle" onPress={() => navigation.navigate('LogRecovery')} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Avg Sleep" value={`${avg(last7, (r) => r.sleepHours).toFixed(1)}h`} sub={`Quality ${avg(last7, (r) => r.sleepQuality).toFixed(1)}/10`} icon="moon" color={c.purple} />
        <Stat label="Soreness" value={`${avg(last7, (r) => r.soreness).toFixed(1)}`} sub="/10 avg" icon="medkit" color={c.red} />
        <Stat label="Fatigue" value={`${avg(last7, (r) => r.fatigue).toFixed(1)}`} sub="/10 avg" icon="battery-half" color={c.orange} />
      </View>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Ionicons name={trendUp ? 'trending-up' : 'trending-down'} size={26} color={trendUp ? c.green : c.red} />
        <View style={{ flex: 1 }}>
          <T bold>Recovery trend {nowScore}%</T>
          <T sub size={12}>{trendUp ? '↗ Improving' : '↘ Declining'} vs previous week ({prevScore}%)</T>
        </View>
      </Card>

      <SectionHeader title="Recovery History • 14 Days" />
      <Card>
        {rec.length ? <Bars data={rec.map((r, i) => ({ label: shortDay(r.date), value: score(r), highlight: i === rec.length - 1 }))} height={100} max={100} /> : <T sub>No logs yet.</T>}
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Card onPress={() => navigation.navigate('Breathe')} style={{ flex: 1, gap: 6 }}>
          <Ionicons name="leaf" size={24} color={c.green} />
          <T bold>Breathe Tool</T>
          <T sub size={11}>4-7-8 & box breathing</T>
        </Card>
        <Card onPress={() => navigation.navigate('Mobility')} style={{ flex: 1, gap: 6 }}>
          <Ionicons name="body" size={24} color={c.accent} />
          <T bold>Mobility Test</T>
          <T sub size={11}>4 screens • 5 min</T>
        </Card>
      </View>

      <SectionHeader title="Mobility Profile" action="Assess →" onAction={() => navigation.navigate('Mobility')} />
      {mob ? (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Label>LATEST ASSESSMENT</Label>
              <T sub size={12}>Overhead Squat • {mob.date}</T>
            </View>
            <Text style={{ fontFamily: HEAD, fontSize: 28, color: c.accent }}>{mob.overall}% {grade(mob.overall)}</Text>
          </View>
          {[['Ankle', mob.ankle], ['Hip', mob.hip], ['T-Spine', mob.tspine], ['Shoulder', mob.shoulder]].map(([l, v]) => (
            <View key={l as string} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T size={13}>{l as string}</T>
                <T sub size={12}>{v as number}%</T>
              </View>
              <Progress value={(v as number) / 100} color={(v as number) < 70 ? c.orange : c.green} height={6} />
            </View>
          ))}
          <T sub size={12}>History: {state.mobility.length} assessments • Recommended: {mob.ankle <= Math.min(mob.hip, mob.tspine, mob.shoulder) ? 'Ankle flow' : mob.tspine <= Math.min(mob.hip, mob.shoulder) ? 'T-spine openers' : mob.hip <= mob.shoulder ? 'Hip 90/90 flow' : 'Shoulder CARs'}</T>
        </Card>
      ) : (
        <Card><T sub>No assessments yet.</T></Card>
      )}
    </ScrollView>
  );
}
