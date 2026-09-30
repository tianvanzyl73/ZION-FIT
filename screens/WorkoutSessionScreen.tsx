import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, Card, H1, Label, Progress, T } from '../components/ui';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { dateKey, fmtTime, uid } from '../lib/utils';
import { confirm, notice } from './TrainScreen';

type SetRow = { kg: string; reps: string; done: boolean };

export default function WorkoutSessionScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify, streak } = useStore();
  const day = state.program.days.find((d) => d.id === route.params?.dayId);
  const [start] = useState(Date.now());
  const [now, setNow] = useState(Date.now());
  const [rest, setRest] = useState(0);
  const [rows, setRows] = useState<Record<string, SetRow[]>>(() => {
    const r: Record<string, SetRow[]> = {};
    day?.exercises.forEach((e) => {
      r[e.id] = Array.from({ length: e.sets }, () => ({ kg: e.kg ? String(e.kg) : '', reps: e.reps.replace(/[^0-9]/g, '') || '', done: false }));
    });
    return r;
  });

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      setRest((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable hitSlop={10} onPress={() => confirm('Discard session?', 'Your logged sets will not be saved.', () => navigation.goBack(), 'Discard')}>
          <Ionicons name="close" size={24} color={c.accent} />
        </Pressable>
      ),
    });
  }, [navigation, c.accent]);

  const all = Object.values(rows).flat();
  const done = all.filter((s) => s.done);
  const volume = useMemo(() => done.reduce((a, s) => a + (parseFloat(s.kg) || 0) * (parseInt(s.reps, 10) || 0), 0), [rows]);

  if (!day) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <T>This training day no longer exists.</T>
      </View>
    );
  }

  const setRow = (exId: string, i: number, patch: Partial<SetRow>) => {
    setRows((r) => ({ ...r, [exId]: r[exId].map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  };

  const toggle = (exId: string, i: number) => {
    const cur = rows[exId][i];
    setRow(exId, i, { done: !cur.done });
    if (!cur.done) setRest(90);
  };

  const addSet = (exId: string) => setRows((r) => ({ ...r, [exId]: [...r[exId], { ...(r[exId][r[exId].length - 1] ?? { kg: '', reps: '' }), done: false }] }));

  const finish = () => {
    if (!done.length) return notice('No sets completed', 'Tick at least one set before finishing.');
    const prs: string[] = [];
    const newPrs = { ...state.prs };
    day.exercises.forEach((e) => {
      (rows[e.id] ?? []).filter((s) => s.done).forEach((s) => {
        const w = parseFloat(s.kg) || 0;
        const r = parseInt(s.reps, 10) || 0;
        if (!w || !r) return;
        const cur = newPrs[e.name];
        if (!cur || w * (1 + r / 30) > cur.weight * (1 + cur.reps / 30)) {
          newPrs[e.name] = { weight: w, reps: r, date: dateKey() };
          if (!prs.includes(e.name)) prs.push(e.name);
        }
      });
    });
    const minutes = Math.max(1, Math.round((Date.now() - start) / 60000));
    update((s) => ({
      ...s,
      prs: newPrs,
      sessions: [{ id: uid(), date: new Date().toISOString(), dayName: day.name, sets: done.length, volume: Math.round(volume), minutes, prs }, ...s.sessions],
    }));
    notify('workout', 'Session complete 💪', `${day.name}: ${done.length} sets • ${Math.round(volume)}kg volume${prs.length ? ` • ${prs.length} PR` : ''}`, 'checkmark-circle');
    prs.forEach((p) => notify('workout', 'New personal record! 🏆', `${p}: ${newPrs[p].weight}kg × ${newPrs[p].reps}`, 'trophy'));
    notice('SESSION COMPLETE 💪', `${done.length} sets • ${Math.round(volume).toLocaleString()} kg volume • ${minutes} min${prs.length ? `\nNew PRs: ${prs.join(', ')}` : ''}\nStreak: ${Math.max(streak, 1)} days`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <Label color={c.accent}>{state.program.name}</Label>
            <H1 size={26}>{day.name.toUpperCase()}</H1>
          </View>
          <Text style={{ fontFamily: HEAD, fontSize: 28, color: c.text }}>{fmtTime((now - start) / 1000)}</Text>
        </View>
        <Progress value={all.length ? done.length / all.length : 0} />
        <T sub size={12}>{done.length}/{all.length} sets • {Math.round(volume).toLocaleString()} kg volume</T>
      </View>
      {rest > 0 && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={{ marginHorizontal: 20, marginBottom: 8, backgroundColor: c.accent, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="timer" size={20} color={c.onAccent} />
          <Text style={{ color: c.onAccent, fontWeight: '900', flex: 1 }}>REST {fmtTime(rest)}</Text>
          <Pressable onPress={() => setRest((r) => r + 30)}><Text style={{ color: c.onAccent, fontWeight: '900' }}>+30s</Text></Pressable>
          <Pressable onPress={() => setRest(0)}><Text style={{ color: c.onAccent, fontWeight: '900', marginLeft: 12 }}>SKIP</Text></Pressable>
        </Animated.View>
      )}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }} keyboardShouldPersistTaps="handled">
        {day.exercises.map((e) => {
          const pr = state.prs[e.name];
          return (
            <Card key={e.id} style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T bold style={{ flex: 1 }}>{e.name}</T>
                {pr ? <Text style={{ color: c.green, fontSize: 11, fontWeight: '800' }}>PR {pr.weight}×{pr.reps}</Text> : null}
              </View>
              <View style={{ flexDirection: 'row', paddingHorizontal: 4 }}>
                <Label style={{ width: 36 }}>SET</Label>
                <Label style={{ flex: 1 }}>KG</Label>
                <Label style={{ flex: 1 }}>REPS</Label>
                <Label style={{ width: 40, textAlign: 'right' }}>✓</Label>
              </View>
              {(rows[e.id] ?? []).map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: s.done ? 'rgba(52,211,153,0.10)' : 'transparent', borderRadius: 10, padding: 4 }}>
                  <Text style={{ width: 28, color: c.sub, fontWeight: '900', textAlign: 'center' }}>{i + 1}</Text>
                  <TextInput value={s.kg} onChangeText={(t) => setRow(e.id, i, { kg: t })} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={c.muted} style={{ flex: 1, backgroundColor: c.card2, color: c.text, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, fontWeight: '700' }} />
                  <TextInput value={s.reps} onChangeText={(t) => setRow(e.id, i, { reps: t })} keyboardType="number-pad" placeholder="0" placeholderTextColor={c.muted} style={{ flex: 1, backgroundColor: c.card2, color: c.text, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, fontWeight: '700' }} />
                  <Pressable onPress={() => toggle(e.id, i)} hitSlop={6} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: s.done ? c.green : c.card2, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="checkmark" size={20} color={s.done ? '#052e16' : c.muted} />
                  </Pressable>
                </View>
              ))}
              <Pressable onPress={() => addSet(e.id)} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
                <Text style={{ color: c.accent, fontWeight: '800', fontSize: 12 }}>+ ADD SET</Text>
              </Pressable>
            </Card>
          );
        })}
        <Button title="FINISH SESSION" icon="flag" onPress={finish} style={{ marginTop: 8 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
