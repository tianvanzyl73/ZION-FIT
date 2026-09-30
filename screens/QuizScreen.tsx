import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Button, Card, H1, Label, Progress, T } from '../components/ui';
import { QuizQ, TOPICS } from '../lib/academy';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';

export default function QuizScreen({ route, navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const topic = TOPICS.find((t) => t.id === route.params?.topicId) ?? TOPICS[0];
  const questions: QuizQ[] = useMemo(() => {
    const others = TOPICS.filter((t) => t.id !== topic.id);
    const wrong = [0, 1, 2].map((i) => others[(topic.id * 3 + i * 7) % others.length].points[i % 4]);
    const right = topic.points[topic.id % topic.points.length];
    const pos = topic.id % 4;
    const opts = [...wrong];
    opts.splice(pos, 0, right);
    return [...topic.quiz, { q: `Which statement belongs to “${topic.title}”?`, options: opts, answer: pos }];
  }, [topic]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = questions[i];

  const next = () => {
    const nc = correct + (picked === q.answer ? 1 : 0);
    if (i + 1 < questions.length) {
      setCorrect(nc);
      setI(i + 1);
      setPicked(null);
    } else {
      setCorrect(nc);
      setFinished(true);
      const score = Math.round((nc / questions.length) * 100);
      const quizLesson = topic.lessons[topic.lessons.length - 1];
      update((s) => ({
        ...s,
        quizScores: { ...s.quizScores, [topic.id]: Math.max(score, s.quizScores[topic.id] ?? 0) },
        completedLessons: score >= 60 && !s.completedLessons.includes(quizLesson.id) ? [...s.completedLessons, quizLesson.id] : s.completedLessons,
      }));
      notify('academy', score >= 60 ? 'Quiz passed ✅' : 'Quiz attempted', `${topic.title}: ${score}%`, 'help-circle');
    }
  };

  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    const pass = score >= 60;
    return (
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Animated.View entering={ZoomIn.springify()} style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: pass ? c.green : c.red, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={pass ? 'trophy' : 'refresh'} size={54} color="#0a0a0a" />
        </Animated.View>
        <Text style={{ fontFamily: HEAD, fontSize: 56, color: c.text }}>{score}%</Text>
        <T sub style={{ textAlign: 'center' }}>{correct}/{questions.length} correct • {pass ? 'Passed! Lesson marked complete.' : 'You need 60% to pass. Review the lessons and try again.'}</T>
        <Button title={pass ? 'BACK TO TOPIC' : 'TRY AGAIN'} onPress={() => { if (pass) navigation.goBack(); else { setI(0); setPicked(null); setCorrect(0); setFinished(false); } }} style={{ alignSelf: 'stretch' }} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Label color={c.accent}>{topic.title}</Label>
      <Progress value={(i + (picked !== null ? 1 : 0)) / questions.length} />
      <T sub size={12}>Question {i + 1} of {questions.length}</T>
      <H1 size={24}>{q.q}</H1>
      {q.options.map((o, j) => {
        const show = picked !== null;
        const isRight = j === q.answer;
        const isPicked = j === picked;
        const border = show ? (isRight ? c.green : isPicked ? c.red : c.border) : c.border;
        return (
          <Pressable key={j} disabled={show} onPress={() => setPicked(j)}>
            <Card style={{ borderColor: border, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: c.sub, fontWeight: '900' }}>{String.fromCharCode(65 + j)}</Text>
              </View>
              <T style={{ flex: 1 }} size={14}>{o}</T>
              {show && isRight && <Ionicons name="checkmark-circle" size={20} color={c.green} />}
              {show && isPicked && !isRight && <Ionicons name="close-circle" size={20} color={c.red} />}
            </Card>
          </Pressable>
        );
      })}
      {picked !== null && (
        <Animated.View entering={FadeIn}>
          <Button title={i + 1 < questions.length ? 'NEXT QUESTION' : 'SEE RESULTS'} onPress={next} />
        </Animated.View>
      )}
    </ScrollView>
  );
}
