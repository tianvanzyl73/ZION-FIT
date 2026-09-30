import React, { useLayoutEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Empty, T } from '../components/ui';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { timeAgo } from '../lib/utils';

const ROUTE: Record<string, [string, any?]> = {
  workout: ['Tabs', { screen: 'Train', params: { tab: 'My Program' } }],
  nutrition: ['Tabs', { screen: 'Fuel' }],
  academy: ['Tabs', { screen: 'Learn' }],
  buddy: ['Chat'],
  faith: ['Devotional'],
  recovery: ['Recovery'],
};

export default function NotificationsScreen({ navigation }: any) {
  const c = useColors();
  const { state, update } = useStore();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable hitSlop={10} onPress={() => navigation.navigate('Settings', { section: 'notifications' })}>
          <Ionicons name="settings-outline" size={22} color={c.accent} />
        </Pressable>
      ),
    });
  }, [navigation, c.accent]);

  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <FlatList
      data={state.notifications}
      keyExtractor={(n) => n.id}
      contentContainerStyle={{ padding: 20, gap: 8 }}
      ListHeaderComponent={
        state.notifications.length ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <T sub size={12}>{unread} unread</T>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Text onPress={() => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }))} style={{ color: c.accent, fontWeight: '800', fontSize: 12 }}>Mark all read</Text>
              <Text onPress={() => update((s) => ({ ...s, notifications: [] }))} style={{ color: c.muted, fontWeight: '800', fontSize: 12 }}>Clear</Text>
            </View>
          </View>
        ) : null
      }
      ListEmptyComponent={<Empty icon="notifications-off-outline" title="You're all caught up" body="Workout, nutrition, academy and buddy alerts show up here." />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === item.id ? { ...n, read: true } : n)) }));
            const r = ROUTE[item.kind];
            if (r) navigation.navigate(r[0], r[1]);
          }}
          style={{ flexDirection: 'row', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: item.read ? c.border : c.accent, padding: 14 }}
        >
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={item.icon as any} size={18} color={c.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <T bold size={14}>{item.title}</T>
            <T sub size={13}>{item.body}</T>
            <Text style={{ color: c.muted, fontSize: 11, marginTop: 4 }}>{timeAgo(item.date)}</Text>
          </View>
          {!item.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.accent, marginTop: 6 }} />}
        </Pressable>
      )}
    />
  );
}
