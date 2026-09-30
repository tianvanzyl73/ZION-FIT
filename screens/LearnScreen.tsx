import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabHeader from '../components/TabHeader';
import { Badge, Button, Card, H1, Label, Pill, PremiumBadge, Progress, T } from '../components/ui';
import { ALL_LESSONS, FREE_TOPICS, TOPICS } from '../lib/academy';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';

const CATS = ['All', 'Free', 'Premium', ...Array.from(new Set(TOPICS.map((t) => t.category)))];

export default function LearnScreen({ navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  const [cat, setCat] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const done = state.completedLessons.length;
  const quizVals = Object.values(state.quizScores);
  const quizAvg = quizVals.length ? Math.round(quizVals.reduce((a, b) => a + b, 0) / quizVals.length) : 0;
  const certs = TOPICS.filter((t) => t.lessons.every((l) => state.completedLessons.includes(l.id))).length;
  const freeLessons = ALL_LESSONS.filter((l) => !TOPICS[l.topicId - 1].premium).length;

  const data = useMemo(
    () => TOPICS.filter((t) => cat === 'All' || (cat === 'Free' ? !t.premium : cat === 'Premium' ? t.premium : t.category === cat)),
    [cat],
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="S&C ACADEMY" subtitle="30 TOPICS • 100 LESSONS" />
      <FlatList
        data={data}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={c.accent} onRefresh={() => { setRefreshing(true); setCat('All'); setTimeout(() => setRefreshing(false), 500); }} />}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <Card accent style={{ gap: 10, backgroundColor: c.mode === 'dark' ? '#15130A' : '#FEFCE8' }}>
              <Label color={c.accent}>YOUR PROGRESS</Label>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[['LESSONS', `${done}/${ALL_LESSONS.length}`], ['QUIZ AVG', `${quizAvg}%`], ['CERTIFICATES', `${certs}`]].map(([l, v]) => (
                  <View key={l}>
                    <Text style={{ fontFamily: HEAD, fontSize: 26, color: c.text }}>{v}</Text>
                    <Label style={{ fontSize: 9 }}>{l}</Label>
                  </View>
                ))}
              </View>
              <Progress value={done / ALL_LESSONS.length} />
              <T sub size={12}>Biomechanics • Gym programs • Body functions • Nutrition • Programming • Supplements</T>
            </Card>
            <Card style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Label>CONTENT ACCESS</Label>
                {state.premium ? <Badge label="ALL UNLOCKED" tone="green" /> : null}
              </View>
              <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ flex: 70, backgroundColor: c.green }} />
                <View style={{ flex: 30, backgroundColor: c.accent }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T size={12}><Text style={{ color: c.green, fontWeight: '900' }}>70% FREE</Text> • {FREE_TOPICS} topics • {freeLessons} lessons</T>
                <T size={12}><Text style={{ color: c.accent, fontWeight: '900' }}>30% PREMIUM</Text></T>
              </View>
              {!state.premium && <Button small title="UNLOCK PREMIUM TOPICS" icon="lock-open" onPress={() => navigation.navigate('Paywall')} />}
            </Card>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CATS.map((x) => <Pill key={x} label={x} active={cat === x} onPress={() => setCat(x)} />)}
            </ScrollView>
          </View>
        }
        renderItem={({ item: t }) => {
          const comp = t.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
          const locked = t.premium && !state.premium;
          return (
            <Card onPress={() => navigation.navigate('Topic', { id: t.id })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={t.icon as any} size={22} color={locked ? c.muted : c.accent} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <Label style={{ fontSize: 9 }}>{t.category}</Label>
                  {t.premium ? <PremiumBadge unlocked={state.premium} /> : <Badge label="FREE" tone="green" />}
                </View>
                <T bold numberOfLines={1}>{t.title}</T>
                <T sub size={12} numberOfLines={1}>{t.description}</T>
                <Progress value={comp / t.lessons.length} height={4} color={comp === t.lessons.length ? c.green : c.accent} />
              </View>
              <Text style={{ color: c.muted, fontSize: 11, fontWeight: '800' }}>{comp}/{t.lessons.length}</Text>
            </Card>
          );
        }}
      />
    </SafeAreaView>
  );
}
