import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Card, H1, Label, Progress, T } from '../components/ui';
import { ALL_LESSONS, TOPICS } from '../lib/academy';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { fmtTime } from '../lib/utils';

const INTRO: Record<string, string> = {
  'Foundation Lecture': 'This lecture lays the groundwork. Read each principle, then think about how it shows up in your own training.',
  'Technique Breakdown': 'Here we break the concept into observable technique checkpoints you can coach and self-assess.',
  'Case Study': 'Case study: a 24-year-old club rugby player preparing for pre-season in Pretoria. Apply each principle to his plan.',
  'Practical Demo': 'Practical demo: take these principles to the gym floor. Perform, film, and compare against the checkpoints.',
  'Common Mistakes': 'These are the principles coaches most often get wrong. Watch for the mistakes hiding behind each one.',
  'Programming Template': 'Use this as a programming template: each principle maps onto a decision in your weekly plan.',
  'Research Review': 'Research review: the consensus of current sports-science literature, summarised for practitioners.',
};

const APPLY = [
  'Apply it: pick one exercise this week and deliberately practise this principle.',
  'Coach it: explain this to a training partner in one sentence.',
  'Track it: note in your log how this changed your session.',
  'Reflect: “Whatever you do, work at it with all your heart” — Colossians 3:23.',
];

export default function LessonScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const lesson = ALL_LESSONS.find((l) => l.id === route.params?.id) ?? ALL_LESSONS[0];
  const topic = TOPICS[lesson.topicId - 1];
  const done = state.completedLessons.includes(lesson.id);
  const total = parseInt(lesson.duration, 10) * 60;
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => setPos((p) => Math.min(total, p + 20)), 250);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, total]);

  useEffect(() => {
    if (pos >= total && playing) setPlaying(false);
  }, [pos, total, playing]);

  const complete = () => {
    if (!done) {
      update((s) => ({ ...s, completedLessons: [...s.completedLessons, lesson.id] }));
      notify('academy', 'Lesson complete 🎓', `${topic.title} — ${lesson.title}`, 'school');
    }
    const idx = topic.lessons.findIndex((l) => l.id === lesson.id);
    const next = topic.lessons[idx + 1];
    if (!next) navigation.goBack();
    else if (next.type === 'quiz') navigation.replace('Quiz', { topicId: topic.id });
    else navigation.replace('Lesson', { id: next.id });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }}>
      <Label color={c.accent}>{topic.title}</Label>
      <H1 size={28}>{lesson.title.toUpperCase()}</H1>
      <T sub size={12}>{lesson.type === 'video' ? 'Video lesson' : 'Article'} • {lesson.duration}{done ? ' • ✓ Completed' : ''}</T>

      {lesson.type === 'video' && (
        <View style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: c.border }}>
          <View style={{ height: 200, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Text style={{ fontFamily: HEAD, color: 'rgba(250,204,21,0.18)', fontSize: 54, position: 'absolute' }}>ZION FIT</Text>
            <Pressable onPress={() => { if (pos >= total) setPos(0); setPlaying(!playing); }} style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={playing ? 'pause' : pos >= total ? 'refresh' : 'play'} size={30} color="#000" />
            </Pressable>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{topic.points[0].slice(0, 60)}…</Text>
          </View>
          <View style={{ padding: 12, gap: 6, backgroundColor: '#0d0d0d' }}>
            <Progress value={pos / total} height={4} track="#27272a" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#a1a1aa', fontSize: 11 }}>{fmtTime(pos)}</Text>
              <Text style={{ color: '#a1a1aa', fontSize: 11 }}>{fmtTime(total)}</Text>
            </View>
          </View>
        </View>
      )}

      <T>{INTRO[lesson.title] ?? INTRO['Foundation Lecture']}</T>
      {topic.points.map((p, i) => (
        <Card key={i} style={{ gap: 6 }}>
          <Label color={c.accent}>KEY POINT {i + 1}</Label>
          <T>{p}</T>
          <T sub size={12}>{APPLY[i % APPLY.length]}</T>
        </Card>
      ))}
      <Card style={{ gap: 6, backgroundColor: c.card2 }}>
        <Label>SUMMARY</Label>
        <T size={13}>{topic.description} Master these ideas and you’ll make better decisions in every session you plan or coach.</T>
      </Card>
      <Button title={done ? 'NEXT →' : 'MARK COMPLETE & CONTINUE'} icon={done ? undefined : 'checkmark-circle'} onPress={complete} />
    </ScrollView>
  );
}
