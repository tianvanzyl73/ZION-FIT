import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabHeader from '../components/TabHeader';
import { Badge, Button, Card, Empty, H1, Label, Pill, PremiumBadge, Segmented, T } from '../components/ui';
import { CATEGORIES, EXERCISES, MUSCLES, PROTOCOLS } from '../lib/data';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { uid } from '../lib/utils';

const TABS = ['Library', 'My Program', 'Protocols'];

export function notice(title: string, msg?: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(msg ? `${title}\n\n${msg}` : title);
  } else Alert.alert(title, msg);
}

export function confirm(title: string, msg: string, onYes: () => void, yes = 'Delete') {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (window.confirm(`${title}\n\n${msg}`)) onYes();
  } else Alert.alert(title, msg, [{ text: 'Cancel', style: 'cancel' }, { text: yes, style: 'destructive', onPress: onYes }]);
}

export default function TrainScreen({ navigation, route }: any) {
  const c = useColors();
  const [tab, setTab] = useState('Library');
  useEffect(() => {
    if (route.params?.tab) setTab(route.params.tab);
  }, [route.params?.tab]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="TRAIN" subtitle="400+ EXERCISES • FREE BUILDER" />
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <Segmented options={TABS} value={tab} onChange={setTab} />
      </View>
      {tab === 'Library' && <Library navigation={navigation} />}
      {tab === 'My Program' && <MyProgram navigation={navigation} goLibrary={() => setTab('Library')} />}
      {tab === 'Protocols' && <Protocols navigation={navigation} />}
    </SafeAreaView>
  );
}

function Library({ navigation }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('all');
  const [cat, setCat] = useState('all');
  const [favOnly, setFavOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    return EXERCISES.filter(
      (e) =>
        (muscle === 'all' || e.muscle === muscle) &&
        (cat === 'all' || e.category === cat) &&
        (!favOnly || state.favourites.includes(e.id)) &&
        (!s || e.name.toLowerCase().includes(s) || e.equipment.includes(s) || e.pattern.includes(s)),
    );
  }, [q, muscle, cat, favOnly, state.favourites]);

  const toggleFav = (id: number) =>
    update((st) => ({ ...st, favourites: st.favourites.includes(id) ? st.favourites.filter((f) => f !== id) : [...st.favourites, id] }));

  return (
    <FlatList
      data={data}
      keyExtractor={(e) => String(e.id)}
      initialNumToRender={14}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} tintColor={c.accent} onRefresh={() => { setRefreshing(true); setQ(''); setMuscle('all'); setCat('all'); setFavOnly(false); setTimeout(() => setRefreshing(false), 500); }} />}
      ListHeaderComponent={
        <View style={{ gap: 10, marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, borderRadius: 999, borderWidth: 1, borderColor: c.border, paddingHorizontal: 14 }}>
            <Ionicons name="search" size={18} color={c.muted} />
            <TextInput value={q} onChangeText={setQ} placeholder="Search 400+ exercises..." placeholderTextColor={c.muted} returnKeyType="search" style={{ flex: 1, color: c.text, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15 }} />
            {q ? <Ionicons name="close-circle" size={18} color={c.muted} onPress={() => setQ('')} /> : null}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <Pill label="★ Saved" active={favOnly} onPress={() => setFavOnly(!favOnly)} />
            {['all', ...MUSCLES].map((m) => <Pill key={m} label={m} active={muscle === m} onPress={() => setMuscle(m)} />)}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {['all', ...CATEGORIES].map((m) => <Pill key={m} label={m === 'all' ? 'all categories' : m} active={cat === m} onPress={() => setCat(m)} />)}
          </ScrollView>
          <Label>EXERCISE LIBRARY • {data.length} RESULTS • 100% FREE</Label>
        </View>
      }
      ListEmptyComponent={<Empty icon="search" title="No exercises found" body="Try a different search or filter." />}
      renderItem={({ item }) => {
        const fav = state.favourites.includes(item.id);
        const pr = state.prs[item.name];
        return (
          <Pressable onPress={() => navigation.navigate('ExerciseDetail', { id: item.id })} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 12, opacity: pressed ? 0.7 : 1 })}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={item.category === 'mobility' || item.category === 'recovery' ? 'body' : item.category === 'plyometrics' || item.category === 'speed' ? 'flash' : 'barbell'} size={20} color={c.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <T bold numberOfLines={1}>{item.name}</T>
              <T sub size={12} style={{ textTransform: 'capitalize' }}>{item.muscle} • {item.equipment} • {item.difficulty}</T>
              {pr ? <Text style={{ color: c.green, fontSize: 11, fontWeight: '800', marginTop: 2 }}>PR {pr.weight}kg × {pr.reps}</Text> : null}
            </View>
            {item.recommended && <Badge label="PICK" />}
            <Pressable hitSlop={10} onPress={() => toggleFav(item.id)}>
              <Ionicons name={fav ? 'star' : 'star-outline'} size={20} color={fav ? c.accent : c.muted} />
            </Pressable>
          </Pressable>
        );
      }}
    />
  );
}

function MyProgram({ navigation, goLibrary }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const pr = state.program;
  const [newDay, setNewDay] = useState('');
  const completed = state.sessions.length % Math.max(1, pr.days.length);
  const pct = pr.days.length ? Math.round(((state.sessions.length % 12) / 12) * 100) : 0;

  const setProgram = (fn: (p: typeof pr) => typeof pr) => update((s) => ({ ...s, program: fn(s.program) }));

  const addDay = () => {
    const name = newDay.trim() || `Day ${pr.days.length + 1}`;
    setProgram((p) => ({ ...p, days: [...p.days, { id: uid(), name, exercises: [] }] }));
    setNewDay('');
  };

  return (
    <FlatList
      data={pr.days}
      keyExtractor={(d) => d.id}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
      ListHeaderComponent={
        <Card accent style={{ gap: 12, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Label color={c.accent}>CUSTOM PROGRAM BUILDER</Label>
            <Badge label="FREE" tone="green" />
          </View>
          <TextInput
            value={pr.name}
            onChangeText={(t) => setProgram((p) => ({ ...p, name: t }))}
            style={{ fontFamily: HEAD, fontSize: 26, color: c.text, padding: 0 }}
            placeholder="PROGRAM NAME"
            placeholderTextColor={c.muted}
          />
          <T sub size={12}>CURRENT: Week {pr.week} • Phase: {pr.phase} • {pct}% of block • {completed}/{pr.days.length} days this rotation</T>
          <Segmented options={['Hypertrophy', 'Strength', 'Power']} value={pr.phase} onChange={(v) => setProgram((p) => ({ ...p, phase: v as any }))} />
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Label>WEEK</Label>
            {[1, 2, 3, 4, 5, 6].map((w) => (
              <Pressable key={w} onPress={() => setProgram((p) => ({ ...p, week: w }))} style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: pr.week === w ? c.accent : c.card2 }}>
                <Text style={{ color: pr.week === w ? c.onAccent : c.sub, fontWeight: '900', fontSize: 12 }}>{w}</Text>
              </Pressable>
            ))}
          </View>
          {pr.source ? <T sub size={11}>Loaded from premium protocol: {pr.source}</T> : null}
          <T sub size={12}>Includes progress tracking, streaks, PR tracking. No premium needed.</T>
        </Card>
      }
      ListEmptyComponent={<Empty icon="barbell-outline" title="No training days yet" body="Add a day below, then add exercises from the library." />}
      renderItem={({ item: day, index }) => (
        <Card style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: c.accent, fontWeight: '900' }}>{index + 1}</Text>
            </View>
            <TextInput
              value={day.name}
              onChangeText={(t) => setProgram((p) => ({ ...p, days: p.days.map((d) => (d.id === day.id ? { ...d, name: t } : d)) }))}
              style={{ flex: 1, color: c.text, fontWeight: '900', fontSize: 16, padding: 0 }}
            />
            <Pressable hitSlop={8} onPress={() => confirm('Delete day?', `Remove "${day.name}" and its exercises?`, () => setProgram((p) => ({ ...p, days: p.days.filter((d) => d.id !== day.id) })))}>
              <Ionicons name="trash-outline" size={18} color={c.muted} />
            </Pressable>
          </View>
          {day.exercises.length === 0 ? (
            <T sub size={12}>No exercises yet. Tap + ADD from the Exercise Library.</T>
          ) : (
            day.exercises.map((e) => (
              <Pressable key={e.id} onPress={() => navigation.navigate('EditExercise', { dayId: day.id, exId: e.id })} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: c.border }}>
                <T style={{ flex: 1 }} numberOfLines={1}>{e.name}</T>
                <T sub size={13}>{e.sets}×{e.reps}{e.kg ? ` • ${e.kg}kg` : ''}</T>
                <Ionicons name="create-outline" size={16} color={c.muted} style={{ marginLeft: 8 }} />
              </Pressable>
            ))
          )}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <Button small variant="secondary" icon="add" title="ADD" onPress={goLibrary} style={{ flex: 1 }} />
            <Button small icon="play" title="START" disabled={!day.exercises.length} onPress={() => navigation.navigate('WorkoutSession', { dayId: day.id })} style={{ flex: 1 }} />
          </View>
        </Card>
      )}
      ListFooterComponent={
        <View style={{ gap: 10, marginTop: 4 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={newDay} onChangeText={setNewDay} onSubmitEditing={addDay} returnKeyType="done" placeholder="New day name (e.g. Legs)" placeholderTextColor={c.muted} style={{ flex: 1, backgroundColor: c.card, borderRadius: 999, borderWidth: 1, borderColor: c.border, paddingHorizontal: 16, color: c.text }} />
            <Button title="+ DAY" onPress={addDay} />
          </View>
          <Button variant="light" title="SAVE PROGRAM (FREE)" icon="checkmark-circle" onPress={() => notice('Custom program saved!', 'FREE • Your program is stored on this device.')} />
        </View>
      }
    />
  );
}

function Protocols({ navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  return (
    <FlatList
      data={PROTOCOLS}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 4 }}>
          <Card onPress={() => navigation.navigate('Recovery')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="moon" size={22} color={c.purple} />
            <View style={{ flex: 1 }}>
              <T bold>Recovery • Mobility • Breathe</T>
              <T sub size={12}>Free tools to recover smarter</T>
            </View>
            <Badge label="FREE" tone="green" />
          </Card>
          <Label>PREMIUM PROTOCOLS • 7 PROGRAMS</Label>
        </View>
      }
      renderItem={({ item }) => (
        <Card onPress={() => navigation.navigate('ProgramDetail', { id: item.id })} style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Badge label={item.duration.toUpperCase()} tone="muted" />
              <Badge label={item.level.toUpperCase()} tone="blue" />
            </View>
            <PremiumBadge unlocked={state.premium} />
          </View>
          <H1 size={22}>{item.name}</H1>
          <T sub size={13}>{item.description}</T>
        </Card>
      )}
    />
  );
}
