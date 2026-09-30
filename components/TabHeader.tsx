import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { Avatar, initialsOf } from './ui';

export default function TabHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const c = useColors();
  const nav = useNavigation<any>();
  const { state } = useStore();
  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, gap: 12 }}>
      <View style={{ flex: 1 }}>
        {subtitle ? <Text style={{ color: c.accent, fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>{subtitle}</Text> : null}
        <Text style={{ fontFamily: HEAD, fontSize: 30, color: c.text, lineHeight: 36 }}>{title}</Text>
      </View>
      <Pressable onPress={() => nav.navigate('Notifications')} hitSlop={8} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="notifications-outline" size={20} color={c.text} />
        {unread > 0 && (
          <View style={{ position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
            <Text style={{ color: c.onAccent, fontSize: 9, fontWeight: '900' }}>{unread}</Text>
          </View>
        )}
      </Pressable>
      <Pressable onPress={() => nav.navigate('Profile')} hitSlop={8}>
        <Avatar initials={initialsOf(state.profile.name)} size={42} />
      </Pressable>
    </View>
  );
}
