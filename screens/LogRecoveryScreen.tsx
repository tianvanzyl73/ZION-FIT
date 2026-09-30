import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Label, Stepper, T } from '../components/ui';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { dateKey } from '../lib/utils';

export default function LogRecoveryScreen({ navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const today = state.recovery.find((r) => r.date === dateKey());
  const [v, setV] = useState({ sleepHours: today?.sleepHours ?? 7.5, sleepQuality: today?.sleepQuality ?? 7, soreness: today?.soreness ?? 3, fatigue: today?.fatigue ?? 3, stress: today?.stress ?? 3 });
  const set = (k: keyof typeof v) => (n: number) => setV((s) => ({ ...s, [k]: n }));
  const save = () => {
    update((s) => ({ ...s, recovery: [...s.recovery.filter((r) => r.date !== dateKey()), { date: dateKey(), ...v }].sort((a, b) => a.date.localeCompare(b.date)) }));
    if (v.soreness >= 7 || v.fatigue >= 7) notify('recovery', 'High fatigue detected', 'Consider a lighter session and a breathing protocol today.', 'medkit');
    navigation.goBack();
  };
  const rows: [keyof typeof v, string, string, number, number, number][] = [
    ['sleepHours', 'Sleep duration', 'hours', 0, 14, 0.5],
    ['sleepQuality', 'Sleep quality', '/10', 1, 10, 1],
    ['soreness', 'Muscle soreness', '/10', 0, 10, 1],
    ['fatigue', 'Fatigue', '/10', 0, 10, 1],
    ['stress', 'Life stress', '/10', 0, 10, 1],
  ];
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <T sub>Daily wellness check-in. Takes 20 seconds and powers your readiness score.</T>
      {rows.map(([k, l, s, min, max, step]) => (
        <Card key={k} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Label>{l}</Label>
            <T sub size={11}>{k === 'sleepHours' || k === 'sleepQuality' ? 'Higher is better' : 'Lower is better'}</T>
          </View>
          <Stepper value={v[k]} onChange={set(k)} min={min} max={max} step={step} suffix={s} />
        </Card>
      ))}
      <Button title="SAVE CHECK-IN" icon="checkmark" onPress={save} />
    </ScrollView>
  );
}
