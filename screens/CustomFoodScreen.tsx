import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Card, Input, Label, Pill, T } from '../components/ui';
import { MEALS, MealType } from '../lib/data';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { dateKey, uid } from '../lib/utils';
import { notice } from './TrainScreen';

export default function CustomFoodScreen({ route, navigation }: any) {
  const c = useColors();
  const { update } = useStore();
  const date = route.params?.date ?? dateKey();
  const [meal, setMeal] = useState<MealType>(route.params?.meal ?? 'Snacks');
  const [f, setF] = useState({ name: route.params?.name ?? '', serving: '1 serving', calories: '', protein: '', carbs: '', fat: '', calcium: '', iron: '', magnesium: '' });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const n = (v: string) => Math.max(0, parseFloat(v.replace(',', '.')) || 0);

  const save = (alsoLog: boolean) => {
    if (!f.name.trim()) return notice('Name required', 'Give your food a name.');
    let kcal = n(f.calories);
    if (!kcal) kcal = Math.round(n(f.protein) * 4 + n(f.carbs) * 4 + n(f.fat) * 9);
    const food = { id: 'c_' + uid(), name: f.name.trim(), category: 'custom', serving: f.serving || '1 serving', calories: kcal, protein: n(f.protein), carbs: n(f.carbs), fat: n(f.fat), calcium: n(f.calcium), iron: n(f.iron), magnesium: n(f.magnesium), tags: [], isSA: false, custom: true };
    update((s) => {
      const next = { ...s, customFoods: [food, ...s.customFoods] };
      if (alsoLog) {
        const log = s.logs[date] ?? { meals: [], waterMl: 0 };
        next.logs = { ...s.logs, [date]: { ...log, meals: [...log.meals, { id: uid(), foodId: food.id, name: food.name, servings: 1, meal, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat, calcium: food.calcium, iron: food.iron, magnesium: food.magnesium }] } };
      }
      return next;
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <T sub>Quick add — no 5 screens for a banana. Custom foods are saved for reuse.</T>
        <Card style={{ gap: 12 }}>
          <Input label="Food name" value={f.name} onChangeText={set('name')} placeholder="e.g. Mom's chicken curry" returnKeyType="next" />
          <Input label="Serving" value={f.serving} onChangeText={set('serving')} placeholder="1 bowl" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Input label="Calories" value={f.calories} onChangeText={set('calories')} keyboardType="decimal-pad" placeholder="auto" /></View>
            <View style={{ flex: 1 }}><Input label="Protein g" value={f.protein} onChangeText={set('protein')} keyboardType="decimal-pad" placeholder="0" /></View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Input label="Carbs g" value={f.carbs} onChangeText={set('carbs')} keyboardType="decimal-pad" placeholder="0" /></View>
            <View style={{ flex: 1 }}><Input label="Fat g" value={f.fat} onChangeText={set('fat')} keyboardType="decimal-pad" placeholder="0" /></View>
          </View>
          <Label>MICROS (OPTIONAL)</Label>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Input value={f.calcium} onChangeText={set('calcium')} keyboardType="decimal-pad" placeholder="Ca mg" /></View>
            <View style={{ flex: 1 }}><Input value={f.iron} onChangeText={set('iron')} keyboardType="decimal-pad" placeholder="Fe mg" /></View>
            <View style={{ flex: 1 }}><Input value={f.magnesium} onChangeText={set('magnesium')} keyboardType="decimal-pad" placeholder="Mg mg" /></View>
          </View>
        </Card>
        <Label>LOG TO</Label>
        <View style={{ flexDirection: 'row', gap: 8 }}>{MEALS.map((m) => <Pill key={m} label={m} active={meal === m} onPress={() => setMeal(m)} />)}</View>
        <Button title="SAVE & LOG" icon="checkmark" onPress={() => save(true)} />
        <Button variant="ghost" title="SAVE TO MY FOODS ONLY" onPress={() => save(false)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
