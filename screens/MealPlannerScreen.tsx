import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Card, Label, T } from '../components/ui';
import { MEALS, WEEK_DAYS } from '../lib/data';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { confirm } from './TrainScreen';

export default function MealPlannerScreen({ navigation }: any) {
  const c = useColors();
  const { state, update, targets } = useStore();
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [day, setDay] = useState(WEEK_DAYS[todayIdx]);
  const plan = state.mealPlan[day] ?? {};
  const all = MEALS.flatMap((m) => plan[m] ?? []);
  const tot = all.reduce((a, x) => ({ calories: a.calories + x.calories, protein: a.protein + x.protein, carbs: a.carbs + x.carbs, fat: a.fat + x.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remove = (meal: string, i: number) =>
    update((s) => ({ ...s, mealPlan: { ...s.mealPlan, [day]: { ...(s.mealPlan[day] ?? {}), [meal]: (s.mealPlan[day]?.[meal] ?? []).filter((_, j) => j !== i) } } }));

  const copyToAll = () =>
    confirm('Copy to whole week?', `Copy ${day}'s plan to every day Mon–Sun?`, () =>
      update((s) => ({ ...s, mealPlan: Object.fromEntries(WEEK_DAYS.map((d) => [d, JSON.parse(JSON.stringify(s.mealPlan[day] ?? {}))])) })), 'Copy');

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {WEEK_DAYS.map((d) => {
          const has = MEALS.some((m) => (state.mealPlan[d]?.[m] ?? []).length);
          return (
            <Pressable key={d} onPress={() => setDay(d)} style={{ flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center', backgroundColor: day === d ? c.accent : c.card, borderWidth: 1, borderColor: day === d ? c.accent : c.border }}>
              <Text style={{ color: day === d ? c.onAccent : c.text, fontWeight: '900', fontSize: 12 }}>{d}</Text>
              <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 4, backgroundColor: has ? (day === d ? c.onAccent : c.accent) : 'transparent' }} />
            </Pressable>
          );
        })}
      </View>
      {MEALS.map((m) => (
        <Card key={m} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <T bold style={{ flex: 1 }}>{m}</T>
            <Pressable hitSlop={8} onPress={() => navigation.navigate('FoodSearch', { mode: 'plan', day, meal: m })}>
              <Text style={{ color: c.accent, fontWeight: '800', fontSize: 12 }}>+ ADD</Text>
            </Pressable>
          </View>
          {(plan[m] ?? []).length === 0 ? (
            <T sub size={12}>Nothing planned</T>
          ) : (
            (plan[m] ?? []).map((x, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: c.border }}>
                <T size={13} style={{ flex: 1 }} numberOfLines={1}>{x.name}</T>
                <T sub size={12}>{Math.round(x.calories)} kcal</T>
                <Pressable hitSlop={8} onPress={() => remove(m, i)} style={{ marginLeft: 10 }}>
                  <Ionicons name="close-circle" size={18} color={c.muted} />
                </Pressable>
              </View>
            ))
          )}
        </Card>
      ))}
      <Card accent style={{ gap: 6 }}>
        <Label color={c.accent}>PLANNED DAILY TOTAL • {day.toUpperCase()}</Label>
        <Text style={{ fontFamily: HEAD, fontSize: 26, color: c.text }}>{Math.round(tot.calories)} <Text style={{ fontSize: 14, color: c.muted }}>/ {targets.calories} kcal</Text></Text>
        <T sub size={13}>P {Math.round(tot.protein)}g • C {Math.round(tot.carbs)}g • F {Math.round(tot.fat)}g</T>
      </Card>
      <Button variant="secondary" icon="copy" title={`COPY ${day.toUpperCase()} TO ALL DAYS`} onPress={copyToAll} />
      <Button title="GENERATE SHOPPING LIST →" onPress={() => navigation.navigate('ShoppingList')} />
    </ScrollView>
  );
}
