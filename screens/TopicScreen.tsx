import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Badge, Button, Card, H1, Label, PremiumBadge, Progress, T } from '../components/ui';
import { TOPICS } from '../lib/academy';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';

export default function TopicScreen({ route, navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  const t = TOPICS.find((x) => x.id === route.params?.id) ?? TOPICS[0];
  const locked = t.premium && !state.premium;
  const comp = t.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
  const allDone = comp === t.lessons.length;
  const score = state.quizScores[t.id];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {t.premium ? <PremiumBadge unlocked={state.premium} /> : <Badge label="FREE" tone="green" />}
        <Badge label={t.category.toUpperCase()} tone="muted" />
      </View>
      <H1 size={30}>{t.title.toUpperCase()}</H1>
      <T sub>{t.description}</T>
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <T size={12} sub>{comp}/{t.lessons.length} lessons complete</T>
          {score !== undefined ? <T size={12} bold style={{ color: c.green }}>Quiz {score}%</T> : null}
        </View>
        <Progress value={comp / t.lessons.length} color={allDone ? c.green : c.accent} />
      </View>

      {allDone && (
        <Card accent style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="ribbon" size={30} color={c.accent} />
          <View style={{ flex: 1 }}>
            <T bold>Certificate of Completion</T>
            <T sub size={12}>{state.profile.name} • {t.title}</T>
          </View>
        </Card>
      )}

      <Card style={{ gap: 8 }}>
        <Label>WHAT YOU'LL LEARN</Label>
        {(locked ? t.points.slice(0, 1) : t.points).map((p) => (
          <View key={p} style={{ flexDirection: 'row', gap: 8 }}>
            <Ionicons name="checkmark-circle" size={16} color={c.green} style={{ marginTop: 2 }} />
            <T size={13} style={{ flex: 1 }}>{p}</T>
          </View>
        ))}
        {locked && <T sub size={12}>+ {t.points.length - 1} more key points with Premium</T>}
      </Card>

      <Label>LESSONS</Label>
      {t.lessons.map((l, i) => {
        const done = state.completedLessons.includes(l.id);
        return (
          <Card
            key={l.id}
            onPress={() => (locked ? navigation.navigate('Paywall') : l.type === 'quiz' ? navigation.navigate('Quiz', { topicId: t.id }) : navigation.navigate('Lesson', { id: l.id }))}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, opacity: locked ? 0.6 : 1 }}
          >
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: done ? c.green : c.card2, alignItems: 'center', justifyContent: 'center' }}>
              {done ? <Ionicons name="checkmark" size={18} color="#052e16" /> : <Text style={{ color: c.sub, fontWeight: '900' }}>{i + 1}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <T bold size={14}>{l.title}</T>
              <T sub size={12}>{l.type === 'video' ? 'Video' : l.type === 'article' ? 'Article' : 'Quiz'} • {l.duration}</T>
            </View>
            <Ionicons name={locked ? 'lock-closed' : l.type === 'video' ? 'play-circle' : l.type === 'article' ? 'document-text' : 'help-circle'} size={22} color={locked ? c.accent : c.muted} />
          </Card>
        );
      })}
      {locked && <Button title="UNLOCK THIS TOPIC" icon="lock-open" onPress={() => navigation.navigate('Paywall')} />}
    </ScrollView>
  );
}
