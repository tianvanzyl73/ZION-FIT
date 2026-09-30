import React from 'react';
import { ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Badge, Button, Card, H1, Label, PremiumBadge, T } from '../components/ui';
import { PROTOCOLS } from '../lib/data';
import { parseProtocolExercise, useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { uid } from '../lib/utils';
import { confirm, notice } from './TrainScreen';

export default function ProgramDetailScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const p = PROTOCOLS.find((x) => x.id === route.params?.id) ?? PROTOCOLS[0];
  const unlocked = state.premium;

  const load = () =>
    confirm('Load protocol?', `This replaces "${state.program.name}" with ${p.name} week 1. Your history and PRs are kept.`, () => {
      const days = p.weeks[0].sessions.map((s) => ({ id: uid(), name: `${s.day} • ${s.name}`, exercises: s.exercises.map(parseProtocolExercise) }));
      update((st) => ({ ...st, program: { name: p.name, phase: p.type === 'power' || p.type === 'plyometrics' || p.type === 'concentric' ? 'Power' : p.type === 'strength' || p.type === 'isometrics' ? 'Strength' : 'Hypertrophy', week: 1, days, source: p.name } }));
      notify('workout', 'Protocol loaded', `${p.name} is now your active program.`, 'barbell');
      notice('Protocol loaded', 'Find it under Train → My Program.');
      navigation.navigate('Tabs', { screen: 'Train', params: { tab: 'My Program' } });
    }, 'Load');

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <PremiumBadge unlocked={unlocked} />
        <Badge label={p.duration.toUpperCase()} tone="muted" />
        <Badge label={p.level.toUpperCase()} tone="blue" />
      </View>
      <H1 size={32}>{p.name}</H1>
      <T sub>{p.description}</T>

      {p.weeks.map((w, wi) => (
        <View key={w.week} style={{ gap: 10 }}>
          <Label style={{ marginTop: 10 }}>WEEK {w.week} • {w.focus.toUpperCase()}</Label>
          {w.sessions.map((s, si) => {
            const locked = !unlocked && (wi > 0 || si > 0);
            return (
              <Card key={s.name} style={{ gap: 6, opacity: locked ? 0.55 : 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <T bold>{s.day} • {s.name}</T>
                  {locked ? <Ionicons name="lock-closed" size={16} color={c.accent} /> : !unlocked ? <Badge label="PREVIEW" tone="green" /> : null}
                </View>
                {locked ? (
                  <T sub size={12}>{s.exercises.length} exercises • unlock to view</T>
                ) : (
                  s.exercises.map((e) => <T key={e} size={13} sub>• {e}</T>)
                )}
              </Card>
            );
          })}
        </View>
      ))}

      <Card style={{ gap: 6, marginTop: 6 }}>
        <Label>WHAT'S INCLUDED</Label>
        {['Progressive weekly structure', 'Loads straight into your program + session tracker', 'PR detection & volume tracking', 'Coaching notes grounded in S&C research'].map((x) => (
          <View key={x} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={16} color={c.green} />
            <T size={13}>{x}</T>
          </View>
        ))}
      </Card>

      {unlocked ? (
        <Button title="LOAD INTO MY PROGRAM" icon="download" onPress={load} />
      ) : (
        <Button title="UNLOCK PREMIUM" icon="lock-open" onPress={() => navigation.navigate('Paywall')} />
      )}
    </ScrollView>
  );
}
