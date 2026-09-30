import React, { useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button, Card, H1, Input, Label, Stat, T } from '../components/ui';
import { VERSES } from '../lib/data';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { dateKey, streakFrom } from '../lib/utils';

const REFLECT = [
  'Where did discipline show up in your training this week?',
  'What fear can you lay down before your next heavy session?',
  'Who in your squad can you encourage today?',
  'How can you treat your body as stewardship, not vanity?',
  'What does “strength” mean beyond the barbell for you?',
  'Where do you need patience in your progress right now?',
  'What are you grateful for in your body today?',
];

export default function DevotionalScreen() {
  const c = useColors();
  const { state, update, notify } = useStore();
  const [idx, setIdx] = useState(new Date().getDate() % VERSES.length);
  const [note, setNote] = useState('');
  const v = VERSES[idx];
  const doneToday = state.devotional.dates.includes(dateKey());
  const streak = streakFrom(state.devotional.dates);
  const fav = state.devotional.favourites.includes(v.ref);

  const complete = () => {
    if (doneToday) return;
    update((s) => ({ ...s, devotional: { ...s.devotional, dates: [...s.devotional.dates, dateKey()], completed: s.devotional.completed + 1 } }));
    notify('faith', 'Devotional complete ✝️', `${streak + 1}-day streak. ${v.ref}`, 'book');
    setNote('');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat label="Streak" value={`${streak}`} sub="days" icon="flame" />
        <Stat label="Completed" value={`${state.devotional.completed}`} sub="devotionals" icon="checkmark-done" />
        <Stat label="Favourites" value={`${state.devotional.favourites.length}`} sub="verses" icon="heart" />
      </View>
      <Animated.View key={v.ref} entering={FadeIn}>
        <Card accent style={{ gap: 12, paddingVertical: 24, backgroundColor: c.mode === 'dark' ? '#15130A' : '#FEFCE8' }}>
          <Label color={c.accent}>VERSE OF DAY</Label>
          <Text style={{ fontFamily: HEAD, fontSize: 26, color: c.text, lineHeight: 34 }}>“{v.text}”</Text>
          <T bold>{v.ref}</T>
          <View style={{ flexDirection: 'row', gap: 18 }}>
            <Pressable hitSlop={8} onPress={() => update((s) => ({ ...s, devotional: { ...s.devotional, favourites: fav ? s.devotional.favourites.filter((f) => f !== v.ref) : [...s.devotional.favourites, v.ref] } }))}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? c.red : c.sub} />
            </Pressable>
            <Pressable hitSlop={8} onPress={() => Share.share({ message: `“${v.text}” — ${v.ref}\n\nZION FIT • Faith & Iron` })}>
              <Ionicons name="share-social-outline" size={22} color={c.sub} />
            </Pressable>
          </View>
        </Card>
      </Animated.View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="secondary" icon="chevron-back" title="PREV" onPress={() => setIdx((idx + VERSES.length - 1) % VERSES.length)} style={{ flex: 1 }} />
        <Button variant="secondary" title="NEXT" onPress={() => setIdx((idx + 1) % VERSES.length)} style={{ flex: 1 }} />
      </View>
      <Card style={{ gap: 10 }}>
        <Label>REFLECTION</Label>
        <T>{REFLECT[idx % REFLECT.length]}</T>
        <Input value={note} onChangeText={setNote} placeholder="Write a short prayer or reflection (private)…" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
        <Button title={doneToday ? 'COMPLETED TODAY ✓' : 'COMPLETE DEVOTIONAL'} disabled={doneToday} onPress={complete} />
      </Card>
      <H1 size={18}>FAITH & IRON</H1>
      <T sub size={13}>Discipline as worship. We train our bodies as an act of stewardship, and we build strength that serves others.</T>
    </ScrollView>
  );
}
