import React from 'react';
import { ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Badge, Button, Card, H1, Label, PremiumBadge, T } from '../components/ui';
import { MEALS, NUTRITION_PROGRAMS, WEEK_DAYS } from '../lib/data';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { confirm, notice } from './TrainScreen';

function parseMacros(s: string) {
  const p = Number(s.match(/(\d+)P/)?.[1] ?? 0);
  const cb = Number(s.match(/(\d+)C/)?.[1] ?? 0);
  const f = Number(s.match(/(\d+)F/)?.[1] ?? 0);
  return { protein: p, carbs: cb, fat: f, calories: p * 4 + cb * 4 + f * 9 };
}

export default function NutritionProgramScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const p = NUTRITION_PROGRAMS.find((x) => x.id === route.params?.id) ?? NUTRITION_PROGRAMS[0];
  const unlocked = state.premium;

  const apply = () =>
    confirm('Apply to meal planner?', `Fill Mon–Sun with ${p.name} meals? This replaces your current plan.`, () => {
      const dayPlan: Record<string, any[]> = {};
      p.meals.forEach((m) => {
        const slot = (MEALS as readonly string[]).includes(m.type) ? m.type : 'Snacks';
        dayPlan[slot] = [...(dayPlan[slot] ?? []), { name: m.foods.join(' + '), ...parseMacros(m.macros) }];
      });
      update((s) => ({ ...s, mealPlan: Object.fromEntries(WEEK_DAYS.map((d) => [d, JSON.parse(JSON.stringify(dayPlan))])) }));
      notify('nutrition', 'Nutrition program applied', `${p.name} is now in your Mon–Sun planner.`, 'nutrition');
      notice('Applied!', 'Open the Meal Planner to review or tweak.');
      navigation.navigate('MealPlanner');
    }, 'Apply');

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        <PremiumBadge unlocked={unlocked} />
        <Badge label={`${p.calories} KCAL`} tone="muted" />
      </View>
      <H1 size={32}>{p.name.toUpperCase()}</H1>
      <T sub>{p.description}</T>
      <Label style={{ marginTop: 8 }}>SAMPLE DAY</Label>
      {p.meals.map((m, i) => {
        const locked = !unlocked && i > 0;
        return (
          <Card key={m.type} style={{ gap: 6, opacity: locked ? 0.55 : 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T bold>{m.type}</T>
              {locked ? <Ionicons name="lock-closed" size={16} color={c.accent} /> : <Badge label={m.macros} tone="muted" />}
            </View>
            <T sub size={13}>{locked ? 'Unlock premium to view this meal' : m.foods.join(' • ')}</T>
          </Card>
        );
      })}
      {unlocked ? (
        <Button title="APPLY TO MEAL PLANNER" icon="calendar" onPress={apply} />
      ) : (
        <Button title="UNLOCK PREMIUM" icon="lock-open" onPress={() => navigation.navigate('Paywall')} />
      )}
    </ScrollView>
  );
}
