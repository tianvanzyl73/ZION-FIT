import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, H1, Input, Stepper, T } from '../components/ui';
import { ProgramExercise, useStore } from '../lib/store';
import { useColors } from '../lib/theme';

export default function EditExerciseScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const { dayId, exId } = route.params ?? {};
  const day = state.program.days.find((d) => d.id === dayId);
  const ex = day?.exercises.find((e) => e.id === exId);
  const [name, setName] = useState(ex?.name ?? '');
  const [sets, setSets] = useState(ex?.sets ?? 3);
  const [reps, setReps] = useState(ex?.reps ?? '10');
  const [kg, setKg] = useState(ex?.kg ?? 0);

  if (!day || !ex) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <T>Exercise not found.</T>
      </View>
    );
  }

  const patch = (fn: (list: ProgramExercise[]) => ProgramExercise[]) =>
    update((s) => ({ ...s, program: { ...s.program, days: s.program.days.map((d) => (d.id === dayId ? { ...d, exercises: fn(d.exercises) } : d)) } }));

  const idx = day.exercises.findIndex((e) => e.id === exId);
  const move = (dir: -1 | 1) =>
    patch((list) => {
      const j = idx + dir;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[idx], copy[j]] = [copy[j], copy[idx]];
      return copy;
    });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
        <T sub>{day.name}</T>
        <H1>{ex.name.toUpperCase()}</H1>
        <Card style={{ gap: 16 }}>
          <Input label="Exercise name" value={name} onChangeText={setName} returnKeyType="done" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <Stepper label="Sets" value={sets} onChange={setSets} min={1} max={12} />
            <View style={{ width: 120 }}>
              <Input label="Reps / secs" value={reps} onChangeText={setReps} keyboardType="default" returnKeyType="done" />
            </View>
          </View>
          <Stepper label="Load" value={kg} onChange={setKg} min={0} max={400} step={2.5} suffix="kg" />
        </Card>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button variant="secondary" icon="arrow-up" title="UP" onPress={() => move(-1)} style={{ flex: 1 }} disabled={idx === 0} />
          <Button variant="secondary" icon="arrow-down" title="DOWN" onPress={() => move(1)} style={{ flex: 1 }} disabled={idx === day.exercises.length - 1} />
        </View>
        <Button
          title="SAVE CHANGES"
          onPress={() => {
            patch((list) => list.map((e) => (e.id === exId ? { ...e, name: name.trim() || e.name, sets, reps: reps.trim() || '10', kg } : e)));
            navigation.goBack();
          }}
        />
        <Button
          variant="danger"
          icon="trash"
          title="REMOVE FROM DAY"
          onPress={() => {
            patch((list) => list.filter((e) => e.id !== exId));
            navigation.goBack();
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
