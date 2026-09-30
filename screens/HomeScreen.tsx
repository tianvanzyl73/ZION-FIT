import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import TabHeader from '../components/TabHeader';
import { Badge, Bars, Button, Card, H1, IconName, Label, Progress, Ring, SectionHeader, Stat, T } from '../components/ui';
import { dayTotals, fmtD, fmtW, useStore } from '../lib/store';
import { EXERCISES, VERSES } from '../lib/data';
import { TOPICS } from '../lib/academy';
import { HEAD, useColors } from '../lib/theme';
import { dateKey, daysAgo, grade } from '../lib/utils';

export default function HomeScreen({ navigation }: any) {
  const c = useColors();
  const { state, targets, streak, todayKey } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);
  const p = state.profile;
  const first = p.name.split(' ')[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = dayTotals(state.logs[todayKey]);
  const weekSessions = state.sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 7 * 864e5).length;
  const nextDay = state.program.days.length ? state.program.days[state.sessions.length % state.program.days.length] : null;
  const verse = VERSES[(new Date().getDate() + tick) % VERSES.length];
  const lastRec = state.recovery[state.recovery.length - 1];
  const lastMob = state.mobility[state.mobility.length - 1];
  const monthKm = state.runs.filter((r) => Date.now() - new Date(r.date).getTime() < 30 * 864e5).reduce((a, r) => a + r.km, 0);

  const recommended = useMemo(() => {
    const cat = p.goal === 'build' ? ['hypertrophy', 'strength'] : p.goal === 'lose' ? ['conditioning', 'plyometrics'] : ['strength', 'mobility'];
    const pool = EXERCISES.filter((e) => cat.includes(e.category));
    const start = (new Date().getDate() * 7 + tick * 3) % Math.max(1, pool.length - 6);
    return pool.slice(start, start + 6);
  }, [p.goal, tick]);
  const topic = TOPICS.filter((t) => !t.premium)[(new Date().getDate() + tick) % 21];

  const weekVolume = Array.from({ length: 7 }, (_, i) => {
    const k = dateKey(daysAgo(6 - i));
    const v = state.sessions.filter((s) => dateKey(new Date(s.date)) === k).reduce((a, s) => a + s.volume, 0);
    return { label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][daysAgo(6 - i).getDay()], value: v, highlight: i === 6 };
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTick((t) => t + 1);
      setRefreshing(false);
    }, 600);
  };

  const quick: { icon: IconName; label: string; go: () => void }[] = [
    { icon: 'add-circle', label: 'Log Food', go: () => navigation.navigate('FoodSearch', { meal: 'Snacks' }) },
    { icon: 'navigate', label: 'GPS Run', go: () => navigation.navigate('Run') },
    { icon: 'leaf', label: 'Breathe', go: () => navigation.navigate('Breathe') },
    { icon: 'body', label: 'Mobility', go: () => navigation.navigate('Mobility') },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="ZION FIT" subtitle="FAITH & IRON" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.accent} />}>
        <Animated.View entering={FadeInDown.duration(400)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <T sub>{greet},</T>
            <H1 size={26}>{first.toUpperCase()}</H1>
          </View>
          <Pressable onPress={() => navigation.navigate('Paywall')}>
            {state.premium ? <Badge label="PREMIUM ACTIVE" tone="green" /> : <Badge label="FREE 70% • UPGRADE" />}
          </Pressable>
        </Animated.View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat label="Streak" value={`${streak}`} sub="days" icon="flame" />
          <Stat label="Workouts" value={`${weekSessions}/${p.workoutsPerWeek}`} sub="this week" icon="barbell" />
          <Stat label="Sessions" value={`${state.sessions.length}`} sub="all time" icon="trophy" />
        </View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Card accent style={{ marginTop: 16, backgroundColor: c.mode === 'dark' ? '#15130A' : '#FEFCE8' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label color={c.accent}>TODAY'S WORKOUT</Label>
              <Badge label="FREE BUILD" tone="green" />
            </View>
            {nextDay ? (
              <>
                <H1 size={28} style={{ marginTop: 8 }}>{nextDay.name.toUpperCase()}</H1>
                <T sub>
                  {state.program.name} • Week {state.program.week} • {state.program.phase} • {nextDay.exercises.length} exercises
                </T>
                <View style={{ marginTop: 10, gap: 4 }}>
                  {nextDay.exercises.slice(0, 3).map((e) => (
                    <T key={e.id} size={13}>• {e.name} — {e.sets}×{e.reps}{e.kg ? ` @ ${e.kg}kg` : ''}</T>
                  ))}
                </View>
                <Button title="CONTINUE SESSION →" style={{ marginTop: 14 }} onPress={() => navigation.navigate('WorkoutSession', { dayId: nextDay.id })} />
              </>
            ) : (
              <>
                <H1 size={24} style={{ marginTop: 8 }}>BUILD YOUR OWN</H1>
                <T sub>Free program builder with 400+ exercises.</T>
                <Button title="BUILD OWN PROGRAM FREE" style={{ marginTop: 14 }} onPress={() => navigation.navigate('Train', { tab: 'My Program' })} />
              </>
            )}
          </Card>
        </Animated.View>

        <SectionHeader title="Today's Nutrition" action="Open →" onAction={() => navigation.navigate('Fuel')} />
        <Card onPress={() => navigation.navigate('Fuel')} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Ring value={today.calories / targets.calories} size={104} label={`${Math.round(today.calories)}`} sub={`/ ${targets.calories} kcal`} />
          <View style={{ flex: 1, gap: 10 }}>
            {[
              ['Protein', today.protein, targets.protein, c.accent],
              ['Carbs', today.carbs, targets.carbs, c.blue],
              ['Fat', today.fat, targets.fat, c.orange],
            ].map(([l, v, t, col]) => (
              <View key={l as string} style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T size={12} bold>{l as string}</T>
                  <T size={12} sub>{Math.round(v as number)}/{t as number}g</T>
                </View>
                <Progress value={(v as number) / (t as number)} color={col as string} height={6} />
              </View>
            ))}
          </View>
        </Card>

        <Card onPress={() => navigation.navigate('Devotional')} style={{ marginTop: 16, flexDirection: 'row', gap: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(250,204,21,0.14)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="book" size={20} color={c.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Label color={c.accent}>VERSE OF DAY • {verse.ref}</Label>
            <T style={{ marginTop: 6, fontStyle: 'italic' }}>“{verse.text}”</T>
          </View>
        </Card>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          {quick.map((q) => (
            <Card key={q.label} onPress={q.go} style={{ flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, gap: 6 }}>
              <Ionicons name={q.icon} size={22} color={c.accent} />
              <Text style={{ color: c.text, fontSize: 11, fontWeight: '800' }}>{q.label}</Text>
            </Card>
          ))}
        </View>

        <SectionHeader title="Recommended For You Today" action="Library" onAction={() => navigation.navigate('Train', { tab: 'Library' })} />
        <T sub size={12} style={{ marginTop: -4, marginBottom: 10 }}>Based on goal: {p.goal === 'build' ? 'Build Muscle' : p.goal === 'lose' ? 'Lose Weight' : 'Maintain'} • pull to refresh</T>
        <FlatList
          horizontal
          data={recommended}
          keyExtractor={(e) => String(e.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('ExerciseDetail', { id: item.id })} style={{ width: 170, gap: 6 }}>
              <Ionicons name="barbell-outline" size={20} color={c.accent} />
              <T bold numberOfLines={2}>{item.name}</T>
              <T sub size={11} style={{ textTransform: 'capitalize' }}>{item.muscle} • {item.equipment}</T>
              <Badge label={item.category.toUpperCase()} tone="muted" />
            </Card>
          )}
        />
        <Card onPress={() => navigation.navigate('Topic', { id: topic.id })} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="school" size={22} color={c.accent} />
          <View style={{ flex: 1 }}>
            <Label>ACADEMY PICK • FREE</Label>
            <T bold style={{ marginTop: 2 }}>{topic.title}</T>
            <T sub size={12}>{topic.description}</T>
          </View>
          <Ionicons name="chevron-forward" size={18} color={c.muted} />
        </Card>

        <SectionHeader title="Training Volume • 7 Days" />
        <Card>
          <Bars data={weekVolume} height={90} format={(n) => (n ? `${(n / 1000).toFixed(1)}t` : '')} />
        </Card>

        <SectionHeader title="Mobility & Recovery" action="Details →" onAction={() => navigation.navigate('Recovery')} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat label="Sleep" value={lastRec ? `${lastRec.sleepHours.toFixed(1)}h` : '--'} sub={lastRec ? `Quality ${lastRec.sleepQuality}/10` : 'Log today'} icon="moon" color={c.purple} />
          <Stat label="Soreness" value={lastRec ? `${lastRec.soreness}/10` : '--'} sub={lastRec && lastRec.soreness <= 3 ? 'Low' : 'Moderate'} icon="medkit" color={c.red} />
          <Stat label="Mobility" value={lastMob ? grade(lastMob.overall) : '--'} sub={lastMob ? `${lastMob.overall}% • Assess →` : 'Assess →'} icon="body" color={c.green} />
        </View>

        <SectionHeader title="Buddy & Ladder" action="Squad →" onAction={() => navigation.navigate('Squad')} />
        <Card onPress={() => navigation.navigate('Squad', { tab: 'Ladder' })} style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <T bold>Sipho • Level 12</T>
              <T sub size={12}>Shared challenge: 100km Run</T>
            </View>
            <Text style={{ fontFamily: HEAD, fontSize: 28, color: c.accent }}>#{monthKm >= 12.4 ? 1 : 3}</Text>
          </View>
          <Progress value={monthKm / 100} />
          <T sub size={12}>You: {fmtD(monthKm, state.settings.distance)} of 100 km this month • Weight {fmtW(p.weightKg, state.settings.units)}</T>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
