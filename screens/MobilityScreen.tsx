import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInRight, ZoomIn } from 'react-native-reanimated';
import { Button, Card, H1, Label, Progress, T } from '../components/ui';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { dateKey, grade } from '../lib/utils';

const TESTS = [
  { key: 'ankle', name: 'Ankle Dorsiflexion', how: 'Knee-to-wall test: foot facing a wall, drive your knee forward to touch the wall without lifting the heel. Move the foot back until you can’t.', options: [['< 5 cm', 40], ['5-8 cm', 60], ['8-11 cm', 78], ['12 cm +', 95]] },
  { key: 'hip', name: 'Hip Rotation (90/90)', how: 'Sit in 90/90. Can you rotate from one side to the other without hands and keep your chest tall?', options: [['Need hands', 45], ['Hands-free, torso leans', 65], ['Hands-free, upright', 82], ['Smooth & controlled', 95]] },
  { key: 'tspine', name: 'T-Spine Rotation', how: 'Seated with a stick across your shoulders, rotate as far as you can without the hips moving.', options: [['< 30°', 45], ['30-45°', 62], ['45-60°', 80], ['> 60°', 95]] },
  { key: 'shoulder', name: 'Shoulder Flexion', how: 'Lying on your back, knees bent, lower back flat. Raise straight arms overhead toward the floor.', options: [['Hands far from floor', 45], ['Hands 10cm off floor', 65], ['Touch with back arch', 78], ['Touch, back flat', 95]] },
] as const;

export default function MobilityScreen({ navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const [step, setStep] = useState(-1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<null | { overall: number }>(null);

  const pick = (k: string, v: number) => {
    const next = { ...scores, [k]: v };
    setScores(next);
    if (step < TESTS.length - 1) setStep(step + 1);
    else {
      const overall = Math.round((next.ankle + next.hip + next.tspine + next.shoulder) / 4);
      update((s) => ({ ...s, mobility: [...s.mobility, { date: dateKey(), ankle: next.ankle, hip: next.hip, tspine: next.tspine, shoulder: next.shoulder, overall }] }));
      notify('recovery', 'Mobility assessed', `Overall ${overall}% (${grade(overall)})`, 'body');
      setResult({ overall });
    }
  };

  if (result) {
    const weakest = TESTS.reduce((a, t) => (scores[t.key] < scores[a.key] ? t : a), TESTS[0] as (typeof TESTS)[number]);
    return (
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', gap: 16 }}>
        <Animated.View entering={ZoomIn.springify()} style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: HEAD, fontSize: 48, color: c.onAccent }}>{grade(result.overall)}</Text>
        </Animated.View>
        <H1>{result.overall}% MOBILITY</H1>
        <Card style={{ alignSelf: 'stretch', gap: 10 }}>
          {TESTS.map((t) => (
            <View key={t.key} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T size={13}>{t.name}</T>
                <T sub size={12}>{scores[t.key]}%</T>
              </View>
              <Progress value={scores[t.key] / 100} height={6} color={scores[t.key] < 70 ? c.orange : c.green} />
            </View>
          ))}
        </Card>
        <Card accent style={{ alignSelf: 'stretch', gap: 4 }}>
          <Label color={c.accent}>RECOMMENDED FOCUS</Label>
          <T bold>{weakest.name}</T>
          <T sub size={12}>Add 5 minutes of targeted mobility before each session. Re-test in 4-6 weeks.</T>
        </Card>
        <Button title="DONE" onPress={() => navigation.goBack()} style={{ alignSelf: 'stretch' }} />
      </ScrollView>
    );
  }

  if (step === -1) {
    const last = state.mobility[state.mobility.length - 1];
    return (
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <H1>MOBILITY ASSESSMENT</H1>
        <T sub>Four quick self-screens based on the overhead squat breakdown: ankle, hip, thoracic spine and shoulder. About 5 minutes. FREE.</T>
        {TESTS.map((t, i) => (
          <Card key={t.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: c.accent, fontWeight: '900' }}>{i + 1}</Text>
            </View>
            <T bold style={{ flex: 1 }}>{t.name}</T>
            {last ? <T sub size={12}>Last: {(last as any)[t.key]}%</T> : null}
          </Card>
        ))}
        <Button title="START MOBILITY ASSESSMENT" icon="play" onPress={() => setStep(0)} />
      </ScrollView>
    );
  }

  const t = TESTS[step];
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Progress value={step / TESTS.length} />
      <Label>TEST {step + 1} OF {TESTS.length}</Label>
      <Animated.View key={t.key} entering={FadeInRight} style={{ gap: 14 }}>
        <H1>{t.name.toUpperCase()}</H1>
        <Card style={{ flexDirection: 'row', gap: 10 }}>
          <Ionicons name="information-circle" size={20} color={c.accent} />
          <T style={{ flex: 1 }} size={14}>{t.how}</T>
        </Card>
        <Label>YOUR RESULT</Label>
        {t.options.map(([label, v]) => (
          <Pressable key={label} onPress={() => pick(t.key, v)}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <T bold style={{ flex: 1 }}>{label}</T>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Card>
          </Pressable>
        ))}
        {step > 0 && <Button variant="ghost" title="BACK" onPress={() => setStep(step - 1)} />}
      </Animated.View>
    </ScrollView>
  );
}
