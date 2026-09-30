import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, Input, Label, Pill, Stepper, T, ToggleRow } from '../components/ui';
import { Profile, useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { Activity, calcTargets, dateKey } from '../lib/utils';
import { notice } from './TrainScreen';

const ACTS: Activity[] = ['sedentary', 'light', 'moderate', 'very', 'athlete'];

export default function EditProfileScreen({ navigation }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const [p, setP] = useState<Profile>(state.profile);
  const [custom, setCustom] = useState(!!state.profile.customTargets);
  const auto = calcTargets(p);
  const [ct, setCt] = useState(state.profile.customTargets ?? { calories: auto.calories, protein: auto.protein, carbs: auto.carbs, fat: auto.fat });
  const set = <K extends keyof Profile>(k: K) => (v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));
  const str = (k: keyof Profile) => (v: string) => setP((s) => ({ ...s, [k]: v }));

  const save = () => {
    if (!p.name.trim()) return notice('Name is required');
    if (!/^\S+@\S+\.\S+$/.test(p.email)) return notice('Please enter a valid email');
    update((s) => ({
      ...s,
      profile: { ...p, name: p.name.trim(), customTargets: custom ? ct : null },
      weightLog: p.weightKg !== s.profile.weightKg ? [...s.weightLog.filter((w) => w.date !== dateKey()), { date: dateKey(), kg: p.weightKg }] : s.weightLog,
    }));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 12 }}>
          <Label color={c.accent}>PERSONAL</Label>
          <Input label="Full name" value={p.name} onChangeText={str('name')} returnKeyType="next" />
          <Input label="Handle" value={p.handle} onChangeText={str('handle')} autoCapitalize="none" />
          <Input label="Bio" value={p.bio} onChangeText={str('bio')} multiline style={{ minHeight: 70, textAlignVertical: 'top' }} />
          <Input label="Email" value={p.email} onChangeText={str('email')} keyboardType="email-address" autoCapitalize="none" />
        </Card>

        <Card style={{ gap: 14 }}>
          <Label color={c.accent}>BODY STATS</Label>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pill label="Male" active={p.gender === 'male'} onPress={() => set('gender')('male')} />
            <Pill label="Female" active={p.gender === 'female'} onPress={() => set('gender')('female')} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
            <Stepper label="Age" value={p.age} onChange={set('age')} min={13} max={90} />
            <Stepper label="Height" value={p.heightCm} onChange={set('heightCm')} min={120} max={230} suffix="cm" />
            <Stepper label="Weight" value={p.weightKg} onChange={set('weightKg')} min={35} max={250} step={0.5} suffix="kg" />
            <Stepper label="Body fat" value={p.bodyFat} onChange={set('bodyFat')} min={3} max={60} suffix="%" />
          </View>
        </Card>

        <Card style={{ gap: 14 }}>
          <Label color={c.accent}>GOALS</Label>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <Pill label="Build Muscle" active={p.goal === 'build'} onPress={() => set('goal')('build')} />
            <Pill label="Maintain" active={p.goal === 'maintain'} onPress={() => set('goal')('maintain')} />
            <Pill label="Lose Weight" active={p.goal === 'lose'} onPress={() => set('goal')('lose')} />
          </View>
          <Label>ACTIVITY LEVEL</Label>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{ACTS.map((a) => <Pill key={a} label={a} active={p.activity === a} onPress={() => set('activity')(a)} />)}</View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
            <Stepper label="Target weight" value={p.targetWeightKg} onChange={set('targetWeightKg')} min={35} max={250} step={0.5} suffix="kg" />
            <Stepper label="Workouts / week" value={p.workoutsPerWeek} onChange={set('workoutsPerWeek')} min={1} max={14} />
          </View>
        </Card>

        <Card style={{ gap: 14 }}>
          <Label color={c.accent}>PERFORMANCE (1RM)</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
            <Stepper label="Squat" value={p.squat1RM} onChange={set('squat1RM')} min={0} max={500} step={2.5} suffix="kg" />
            <Stepper label="Bench" value={p.bench1RM} onChange={set('bench1RM')} min={0} max={400} step={2.5} suffix="kg" />
            <Stepper label="Deadlift" value={p.deadlift1RM} onChange={set('deadlift1RM')} min={0} max={500} step={2.5} suffix="kg" />
          </View>
        </Card>

        <Card style={{ gap: 12 }}>
          <Label color={c.accent}>NUTRITION PROFILE</Label>
          <Input label="Dietary preference" value={p.dietary} onChangeText={str('dietary')} placeholder="None, vegetarian, halal…" />
          <Input label="Allergies" value={p.allergies} onChangeText={str('allergies')} />
          <Input label="Favourite foods" value={p.favouriteFoods} onChangeText={str('favouriteFoods')} />
          <Stepper label="Meals per day" value={p.mealsPerDay} onChange={set('mealsPerDay')} min={1} max={8} />
        </Card>

        <Card style={{ gap: 12 }}>
          <Label color={c.accent}>NUTRITION TARGETS</Label>
          <T sub size={12}>Auto: {auto.calories} kcal • P{auto.protein} C{auto.carbs} F{auto.fat} (Mifflin-St Jeor × activity). Estimates, not medical advice.</T>
          <ToggleRow title="Use custom targets" value={custom} onChange={setCustom} last />
          {custom && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 }}>
              <Stepper label="Calories" value={ct.calories} onChange={(v) => setCt({ ...ct, calories: v })} min={1000} max={6000} step={50} />
              <Stepper label="Protein g" value={ct.protein} onChange={(v) => setCt({ ...ct, protein: v })} min={30} max={400} step={5} />
              <Stepper label="Carbs g" value={ct.carbs} onChange={(v) => setCt({ ...ct, carbs: v })} min={0} max={800} step={5} />
              <Stepper label="Fat g" value={ct.fat} onChange={(v) => setCt({ ...ct, fat: v })} min={20} max={300} step={5} />
            </View>
          )}
        </Card>
        <Button title="SAVE PROFILE" icon="checkmark" onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
