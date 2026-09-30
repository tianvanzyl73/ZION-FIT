import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Badge, Button, Card, H1, Input, Label, Pill, Stepper, T } from '../components/ui';
import { EXERCISES } from '../lib/data';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { dateKey, uid } from '../lib/utils';
import { notice } from './TrainScreen';

export default function ExerciseDetailScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const ex = EXERCISES.find((e) => e.id === route.params?.id) ?? EXERCISES[0];
  const pr = state.prs[ex.name];
  const [dayId, setDayId] = useState(state.program.days[0]?.id ?? '');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [kg, setKg] = useState(pr ? Math.round(pr.weight * 0.75) : 20);
  const [prW, setPrW] = useState('');
  const [prR, setPrR] = useState('');
  const fav = state.favourites.includes(ex.id);
  const related = EXERCISES.filter((e) => e.base === ex.base && e.id !== ex.id).slice(0, 6);

  const add = () => {
    let targetId = dayId;
    update((s) => {
      let days = s.program.days;
      if (!days.length) {
        targetId = uid();
        days = [{ id: targetId, name: 'Day 1', exercises: [] }];
      }
      return { ...s, program: { ...s.program, days: days.map((d) => (d.id === (targetId || days[0].id) ? { ...d, exercises: [...d.exercises, { id: uid(), name: ex.name, sets, reps: String(reps), kg }] } : d)) } };
    });
    const dn = state.program.days.find((d) => d.id === dayId)?.name ?? 'Day 1';
    notice('Added to your program', `${ex.name} → ${dn} (${sets}×${reps} @ ${kg}kg)`);
  };

  const savePR = () => {
    const w = parseFloat(prW);
    const r = parseInt(prR, 10);
    if (!w || !r) return notice('Enter weight and reps');
    const better = !pr || w * (1 + r / 30) > pr.weight * (1 + pr.reps / 30);
    update((s) => ({ ...s, prs: { ...s.prs, [ex.name]: { weight: w, reps: r, date: dateKey() } } }));
    if (better) notify('workout', 'New personal record! 🏆', `${ex.name}: ${w}kg × ${r}`, 'trophy');
    setPrW('');
    setPrR('');
    notice(better ? 'New PR logged! 🏆' : 'PR updated', `${ex.name}: ${w}kg × ${r}`);
  };

  const est1RM = pr ? Math.round(pr.weight * (1 + pr.reps / 30)) : null;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 14 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Badge label="FREE" tone="green" />
            <Badge label={ex.category.toUpperCase()} tone="muted" />
          </View>
          <H1 size={30}>{ex.name.toUpperCase()}</H1>
        </View>
        <Pressable hitSlop={10} onPress={() => update((s) => ({ ...s, favourites: fav ? s.favourites.filter((f) => f !== ex.id) : [...s.favourites, ex.id] }))}>
          <Ionicons name={fav ? 'star' : 'star-outline'} size={26} color={fav ? c.accent : c.muted} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {[
          ['MUSCLE GROUP', ex.muscle, 'body'],
          ['EQUIPMENT', ex.equipment, 'construct'],
          ['PATTERN', ex.pattern, 'git-branch'],
          ['DIFFICULTY', ex.difficulty, 'speedometer'],
        ].map(([l, v, i]) => (
          <Card key={l} style={{ width: '48%', flexGrow: 1, padding: 12, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name={i as any} size={13} color={c.accent} />
              <Label style={{ fontSize: 9 }}>{l}</Label>
            </View>
            <T bold style={{ textTransform: 'capitalize' }}>{v}</T>
          </Card>
        ))}
      </View>

      <Card>
        <T>{ex.description}</T>
      </Card>

      <Card style={{ flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: c.mode === 'dark' ? '#15130A' : '#FEFCE8' }}>
        <Ionicons name="videocam" size={22} color={c.accent} />
        <View style={{ flex: 1 }}>
          <Label color={c.accent}>COACHING CUE</Label>
          <T style={{ marginTop: 4 }}>{ex.tip}</T>
        </View>
      </Card>

      <Card style={{ gap: 10 }}>
        <Label>PERSONAL RECORD</Label>
        {pr ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <H1 size={28} style={{ color: c.green }}>{pr.weight}kg × {pr.reps}</H1>
              <T sub size={12}>Set on {pr.date}</T>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Label>EST. 1RM</Label>
              <H1 size={22}>{est1RM}kg</H1>
            </View>
          </View>
        ) : (
          <T sub>No PR yet — log your best set.</T>
        )}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
          <View style={{ flex: 1 }}>
            <Input placeholder="kg" keyboardType="decimal-pad" value={prW} onChangeText={setPrW} returnKeyType="next" />
          </View>
          <View style={{ flex: 1 }}>
            <Input placeholder="reps" keyboardType="number-pad" value={prR} onChangeText={setPrR} returnKeyType="done" onSubmitEditing={savePR} />
          </View>
          <Button small title="LOG PR" onPress={savePR} style={{ paddingVertical: 13 }} />
        </View>
      </Card>

      <Card accent style={{ gap: 14 }}>
        <Label color={c.accent}>ADD TO MY PROGRAM • FREE</Label>
        {state.program.days.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {state.program.days.map((d) => <Pill key={d.id} label={d.name} active={dayId === d.id} onPress={() => setDayId(d.id)} />)}
          </View>
        ) : (
          <T sub size={12}>A "Day 1" will be created for you.</T>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Stepper label="Sets" value={sets} onChange={setSets} min={1} max={10} />
          <Stepper label="Reps" value={reps} onChange={setReps} min={1} max={50} />
        </View>
        <Stepper label="Load" value={kg} onChange={setKg} min={0} max={400} step={2.5} suffix="kg" />
        <Button title="+ ADD TO MY PROGRAM" onPress={add} />
      </Card>

      {related.length > 0 && (
        <View style={{ gap: 8 }}>
          <Label>VARIATIONS</Label>
          {related.map((r) => (
            <Card key={r.id} onPress={() => navigation.push('ExerciseDetail', { id: r.id })} style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
              <T style={{ flex: 1 }}>{r.name}</T>
              <Text style={{ color: c.muted, fontSize: 12, textTransform: 'capitalize' }}>{r.difficulty}</Text>
              <Ionicons name="chevron-forward" size={16} color={c.muted} />
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
