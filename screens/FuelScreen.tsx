import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabHeader from '../components/TabHeader';
import { Badge, Button, Card, H1, Label, PremiumBadge, Progress, Ring, SectionHeader, T } from '../components/ui';
import { MEALS, NUTRITION_PROGRAMS } from '../lib/data';
import { dayTotals, useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { dateKey, daysAgo } from '../lib/utils';

const MEAL_ICON: Record<string, any> = { Breakfast: 'sunny', Lunch: 'restaurant', Dinner: 'moon', Snacks: 'cafe' };

export default function FuelScreen({ navigation }: any) {
  const c = useColors();
  const { state, update, targets } = useStore();
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const key = dateKey(daysAgo(offset));
  const log = state.logs[key] ?? { meals: [], waterMl: 0 };
  const t = dayTotals(log);
  const label = offset === 0 ? 'TODAY' : offset === 1 ? 'YESTERDAY' : daysAgo(offset).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();

  const setWater = (d: number) =>
    update((s) => ({ ...s, logs: { ...s.logs, [key]: { meals: s.logs[key]?.meals ?? [], waterMl: Math.max(0, (s.logs[key]?.waterMl ?? 0) + d) } } }));
  const removeEntry = (id: string) =>
    update((s) => ({ ...s, logs: { ...s.logs, [key]: { ...(s.logs[key] ?? { waterMl: 0 }), meals: (s.logs[key]?.meals ?? []).filter((m) => m.id !== id) } } }));

  const insights = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => state.logs[dateKey(daysAgo(i))]);
    const logged = days.filter((d) => d && d.meals.length);
    const avgP = logged.length ? Math.round(logged.reduce((a, d) => a + dayTotals(d).protein, 0) / logged.length) : 0;
    const bf = days.filter((d) => d?.meals.some((m) => m.meal === 'Breakfast')).length;
    const water = days.filter(Boolean);
    const avgW = water.length ? water.reduce((a, d) => a + (d?.waterMl ?? 0), 0) / water.length / 1000 : 0;
    return { avgP, bf, avgW, loggedDays: logged.length };
  }, [state.logs]);

  const micros = [
    { l: 'Calcium', v: t.calcium, target: 1000, u: 'mg' },
    { l: 'Iron', v: t.iron, target: state.profile.gender === 'female' ? 18 : 8, u: 'mg' },
    { l: 'Magnesium', v: t.magnesium, target: state.profile.gender === 'female' ? 320 : 420, u: 'mg' },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="FUEL" subtitle="MY NUTRITION PROGRAM • FREE" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={c.accent} onRefresh={() => { setRefreshing(true); setOffset(0); setTimeout(() => setRefreshing(false), 500); }} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Pressable hitSlop={10} onPress={() => setOffset(offset + 1)} style={{ padding: 6 }}>
            <Ionicons name="chevron-back" size={22} color={c.text} />
          </Pressable>
          <Label color={c.text}>{label}</Label>
          <Pressable hitSlop={10} disabled={offset === 0} onPress={() => setOffset(offset - 1)} style={{ padding: 6, opacity: offset === 0 ? 0.3 : 1 }}>
            <Ionicons name="chevron-forward" size={22} color={c.text} />
          </Pressable>
        </View>

        <Card style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Ring value={t.calories / targets.calories} size={118} label={`${Math.round(t.calories)}`} sub={`of ${targets.calories} kcal`} />
            <View style={{ flex: 1, gap: 4 }}>
              <Label>REMAINING</Label>
              <Text style={{ fontFamily: HEAD, fontSize: 30, color: t.calories > targets.calories ? c.red : c.accent }}>{Math.round(targets.calories - t.calories)}</Text>
              <T sub size={12}>kcal • Goal {state.profile.goal.toUpperCase()}</T>
            </View>
          </View>
          {[
            ['Protein', t.protein, targets.protein, c.accent],
            ['Carbs', t.carbs, targets.carbs, c.blue],
            ['Fat', t.fat, targets.fat, c.orange],
          ].map(([l, v, tg, col]) => (
            <View key={l as string} style={{ gap: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T bold size={13}>{l as string}</T>
                <T sub size={13}>{Math.round(v as number)} / {tg as number} g</T>
              </View>
              <Progress value={(v as number) / (tg as number)} color={col as string} />
            </View>
          ))}
        </Card>

        <Card style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="water" size={26} color={c.blue} />
          <View style={{ flex: 1, gap: 6 }}>
            <T bold>{(log.waterMl / 1000).toFixed(2)} L <Text style={{ color: c.muted, fontWeight: '400' }}>/ {(targets.waterMl / 1000).toFixed(1)} L</Text></T>
            <Progress value={log.waterMl / targets.waterMl} color={c.blue} height={6} />
          </View>
          <Pressable onPress={() => setWater(-250)} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: c.card2 }}>
            <Text style={{ color: c.sub, fontWeight: '800', fontSize: 12 }}>-250</Text>
          </Pressable>
          <Pressable onPress={() => setWater(250)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: c.blue }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 12 }}>+250ml</Text>
          </Pressable>
        </Card>

        <SectionHeader title="Daily Meals" action="+ Custom food" onAction={() => navigation.navigate('CustomFood', { date: key })} />
        <View style={{ gap: 10 }}>
          {MEALS.map((m) => {
            const items = log.meals.filter((e) => e.meal === m);
            const kcal = items.reduce((a, e) => a + e.calories, 0);
            return (
              <Card key={m} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons name={MEAL_ICON[m]} size={18} color={c.accent} />
                  <T bold style={{ flex: 1 }}>{m}</T>
                  <T sub size={12}>{Math.round(kcal)} kcal</T>
                  <Pressable hitSlop={8} onPress={() => navigation.navigate('FoodSearch', { meal: m, date: key })} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="add" size={18} color={c.onAccent} />
                  </Pressable>
                </View>
                {items.length === 0 ? (
                  <T sub size={12}>No foods logged</T>
                ) : (
                  items.map((e) => (
                    <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: c.border }}>
                      <View style={{ flex: 1 }}>
                        <T size={13} numberOfLines={1}>{e.name}{e.servings !== 1 ? ` ×${e.servings}` : ''}</T>
                        <T sub size={11}>P{Math.round(e.protein)} C{Math.round(e.carbs)} F{Math.round(e.fat)}</T>
                      </View>
                      <T size={13} bold>{Math.round(e.calories)}</T>
                      <Pressable hitSlop={8} onPress={() => removeEntry(e.id)} style={{ marginLeft: 10 }}>
                        <Ionicons name="close-circle" size={18} color={c.muted} />
                      </Pressable>
                    </View>
                  ))
                )}
              </Card>
            );
          })}
        </View>

        <SectionHeader title="Micronutrients" />
        <Card style={{ gap: 10 }}>
          {micros.map((m) => (
            <View key={m.l} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T size={13}>{m.l}</T>
                <T sub size={12}>{Math.round(m.v * 10) / 10} / {m.target} {m.u}</T>
              </View>
              <Progress value={m.v / m.target} color={c.green} height={6} />
            </View>
          ))}
          <T sub size={11}>Calcium, iron & magnesium tracked where the food database has reliable values.</T>
        </Card>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Card onPress={() => navigation.navigate('MealPlanner')} style={{ flex: 1, gap: 6 }}>
            <Ionicons name="calendar" size={22} color={c.accent} />
            <T bold>Meal Planner</T>
            <T sub size={11}>Mon–Sun • FREE</T>
          </Card>
          <Card onPress={() => navigation.navigate('ShoppingList')} style={{ flex: 1, gap: 6 }}>
            <Ionicons name="cart" size={22} color={c.accent} />
            <T bold>Shopping List</T>
            <T sub size={11}>From your plan</T>
          </Card>
        </View>

        <SectionHeader title="Nutrition Targets • Estimates" action="Edit" onAction={() => navigation.navigate('EditProfile')} />
        <Card style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[['KCAL', targets.calories], ['PROTEIN', `${targets.protein}g`], ['CARBS', `${targets.carbs}g`], ['FAT', `${targets.fat}g`]].map(([l, v]) => (
              <View key={l as string} style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: HEAD, fontSize: 20, color: c.text }}>{v}</Text>
                <Label style={{ fontSize: 9 }}>{l}</Label>
              </View>
            ))}
          </View>
          <T sub size={11}>BMR {targets.bmr} • TDEE {targets.tdee}. Calculated from goal, age, gender, height, weight, activity — not medical advice.</T>
        </Card>

        <SectionHeader title="Nutrition Insights" />
        <Card style={{ gap: 6 }}>
          <T size={13}>• You're averaging <Text style={{ fontWeight: '900', color: c.accent }}>{insights.avgP}g protein/day</Text> this week</T>
          <T size={13}>• Logged breakfast {insights.bf}/7 days</T>
          <T size={13}>• Average hydration {insights.avgW.toFixed(1)}L/day</T>
          <T size={13}>• {insights.loggedDays}/7 days logged — {insights.loggedDays >= 5 ? 'great consistency!' : 'aim for 5+ days'}</T>
        </Card>

        <SectionHeader title="Premium Nutrition Programs" />
        <View style={{ gap: 10 }}>
          {NUTRITION_PROGRAMS.map((p) => (
            <Card key={p.id} onPress={() => navigation.navigate('NutritionProgram', { id: p.id })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={p.icon as any} size={20} color={c.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <T bold>{p.name}</T>
                <T sub size={12} numberOfLines={1}>{p.calories} kcal • {p.description}</T>
              </View>
              <PremiumBadge unlocked={state.premium} />
            </Card>
          ))}
        </View>
        {!state.premium && <Button title="UNLOCK 7 NUTRITION PROGRAMS" icon="lock-open" style={{ marginTop: 14 }} onPress={() => navigation.navigate('Paywall')} />}
      </ScrollView>
    </SafeAreaView>
  );
}
