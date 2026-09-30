import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Share, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Empty, Label, T } from '../components/ui';
import { MEALS, WEEK_DAYS } from '../lib/data';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';

export default function ShoppingListScreen({ navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const items = useMemo(() => {
    const map = new Map<string, number>();
    WEEK_DAYS.forEach((d) => MEALS.forEach((m) => (state.mealPlan[d]?.[m] ?? []).forEach((x) => {
      const base = x.name.replace(/ ×[\d.]+$/, '').replace(/ · (Small|Medium|Large|Double)$/, '');
      map.set(base, (map.get(base) ?? 0) + 1);
    })));
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }));
  }, [state.mealPlan]);

  const share = () => Share.share({ message: 'ZION FIT Shopping List\n\n' + items.map((i) => `${checked[i.name] ? '✓' : '☐'} ${i.name} (×${i.count})`).join('\n') });

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.name}
      contentContainerStyle={{ padding: 20, gap: 8, paddingBottom: 60 }}
      ListHeaderComponent={items.length ? <Label style={{ marginBottom: 6 }}>{items.length} ITEMS • FROM YOUR MON–SUN PLAN</Label> : null}
      ListEmptyComponent={<Empty icon="cart-outline" title="Your list is empty" body="Plan meals for the week and your shopping list builds itself." action="OPEN MEAL PLANNER" onAction={() => navigation.navigate('MealPlanner')} />}
      renderItem={({ item }) => (
        <Pressable onPress={() => setChecked((s) => ({ ...s, [item.name]: !s[item.name] }))} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, padding: 14 }}>
          <Ionicons name={checked[item.name] ? 'checkbox' : 'square-outline'} size={22} color={checked[item.name] ? c.green : c.muted} />
          <T style={{ flex: 1, textDecorationLine: checked[item.name] ? 'line-through' : 'none', opacity: checked[item.name] ? 0.5 : 1 }}>{item.name}</T>
          <T sub>×{item.count}</T>
        </Pressable>
      )}
      ListFooterComponent={items.length ? <View style={{ marginTop: 12 }}><Button icon="share-outline" title="SHARE LIST" onPress={share} /></View> : null}
    />
  );
}
