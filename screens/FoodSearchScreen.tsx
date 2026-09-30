import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Badge, Button, Empty, Label, Pill, Stepper, T } from '../components/ui';
import { FOODS, FOOD_CATEGORIES, Food, MEALS, MealType } from '../lib/data';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { dateKey, uid } from '../lib/utils';

export default function FoodSearchScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const mode: 'log' | 'plan' = route.params?.mode ?? 'log';
  const date: string = route.params?.date ?? dateKey();
  const planDay: string = route.params?.day;
  const [meal, setMeal] = useState<MealType>(route.params?.meal ?? 'Snacks');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [saOnly, setSaOnly] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [servings, setServings] = useState(1);

  const all = useMemo(() => [...state.customFoods, ...FOODS], [state.customFoods]);
  const recent = useMemo(() => {
    const names = new Set<string>();
    const out: Food[] = [];
    Object.keys(state.logs).sort().reverse().forEach((k) =>
      state.logs[k].meals.forEach((m) => {
        if (names.has(m.name) || out.length >= 8) return;
        const f = all.find((x) => x.name === m.name);
        if (f) { names.add(m.name); out.push(f); }
      }),
    );
    return out;
  }, [state.logs, all]);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    return all.filter((f) => (cat === 'all' || f.category === cat) && (!saOnly || f.isSA) && (!s || f.name.toLowerCase().includes(s) || f.tags.some((t) => t.includes(s))));
  }, [q, cat, saOnly, all]);

  const add = (f: Food, n: number) => {
    const r = (v: number) => Math.round(v * n * 10) / 10;
    if (mode === 'plan') {
      update((s) => {
        const dayPlan = s.mealPlan[planDay] ?? {};
        return { ...s, mealPlan: { ...s.mealPlan, [planDay]: { ...dayPlan, [meal]: [...(dayPlan[meal] ?? []), { name: f.name + (n !== 1 ? ` ×${n}` : ''), calories: r(f.calories), protein: r(f.protein), carbs: r(f.carbs), fat: r(f.fat) }] } } };
      });
    } else {
      update((s) => {
        const log = s.logs[date] ?? { meals: [], waterMl: 0 };
        return {
          ...s,
          logs: {
            ...s.logs,
            [date]: { ...log, meals: [...log.meals, { id: uid(), foodId: f.id, name: f.name, servings: n, meal, calories: r(f.calories), protein: r(f.protein), carbs: r(f.carbs), fat: r(f.fat), calcium: r(f.calcium), iron: r(f.iron), magnesium: r(f.magnesium) }] },
          },
        };
      });
      if (f.protein * n >= 30) notify('nutrition', 'Protein hit 💪', `${f.name} added ${Math.round(f.protein * n)}g protein to ${meal}.`, 'nutrition');
    }
    setSel(null);
    setServings(1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ padding: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {MEALS.map((m) => <Pill key={m} label={m} active={meal === m} onPress={() => setMeal(m)} />)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, borderRadius: 999, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14 }}>
          <Ionicons name="search" size={18} color={c.muted} />
          <TextInput autoFocus={false} value={q} onChangeText={setQ} placeholder="Search meat, pap, biltong, rice..." placeholderTextColor={c.muted} returnKeyType="search" style={{ flex: 1, color: c.text, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15 }} />
          {q ? <Ionicons name="close-circle" size={18} color={c.muted} onPress={() => setQ('')} /> : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Pill label="🇿🇦 SA foods" active={saOnly} onPress={() => setSaOnly(!saOnly)} />
          {['all', ...FOOD_CATEGORIES].map((x) => <Pill key={x} label={x} active={cat === x} onPress={() => setCat(x)} />)}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(f) => f.id}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 8 }}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 6 }}>
            {recent.length > 0 && !q && (
              <>
                <Label>QUICK ADD • RECENT</Label>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {recent.map((f) => (
                    <Pressable key={f.id} onPress={() => add(f, 1)} style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 10, width: 140 }}>
                      <T size={12} bold numberOfLines={1}>{f.name}</T>
                      <T sub size={11}>{f.calories} kcal • tap to add</T>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>{data.length} FOODS • FREE DATABASE</Label>
              <Pressable onPress={() => navigation.navigate('CustomFood', { date, meal })}>
                <Text style={{ color: c.accent, fontWeight: '800', fontSize: 12 }}>+ CUSTOM FOOD</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={<Empty icon="fast-food-outline" title="No foods found" body="Create it as a custom food — it will be saved for reuse." action="CREATE CUSTOM FOOD" onAction={() => navigation.navigate('CustomFood', { date, meal, name: q })} />}
        renderItem={({ item: f }) => {
          const open = sel === f.id;
          return (
            <Pressable onPress={() => { setSel(open ? null : f.id); setServings(1); }} style={{ backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: open ? c.accent : c.border, padding: 12, gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <T bold numberOfLines={1} style={{ flexShrink: 1 }}>{f.name}</T>
                    {f.isSA && <Badge label="SA" tone="green" />}
                    {f.custom && <Badge label="MINE" tone="blue" />}
                  </View>
                  <T sub size={11}>{f.serving} • P{f.protein} C{f.carbs} F{f.fat}</T>
                </View>
                <T bold>{f.calories}</T>
                <T sub size={11}>kcal</T>
                <Pressable hitSlop={8} onPress={() => add(f, 1)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="add" size={18} color={c.onAccent} />
                </Pressable>
              </View>
              {open && (
                <Animated.View entering={FadeIn} style={{ gap: 10, borderTopWidth: 1, borderTopColor: c.border, paddingTop: 10 }}>
                  <T sub size={12}>Ca {f.calcium}mg • Fe {f.iron}mg • Mg {f.magnesium}mg{f.tags.length ? ` • ${f.tags.join(', ')}` : ''}</T>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stepper value={servings} onChange={setServings} min={0.25} max={20} step={0.25} suffix="serv" />
                    <Button small title={`ADD ${Math.round(f.calories * servings)} KCAL`} onPress={() => add(f, servings)} />
                  </View>
                </Animated.View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
