import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Button, Card, H1, Input, Label, Pill, Progress, Stepper, T } from '../components/ui';
import { Profile, useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { Activity, calcTargets } from '../lib/utils';

const ACTS: [Activity, string][] = [['sedentary', 'Desk job, little exercise'], ['light', '1-2 sessions / week'], ['moderate', '3-4 sessions / week'], ['very', '5-6 sessions / week'], ['athlete', 'Twice a day / pro']];

export default function OnboardingScreen() {
  const c = useColors();
  const { state, update } = useStore();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(state.profile);
  const set = <K extends keyof Profile>(k: K) => (v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));
  const t = calcTargets(p);

  const finish = () => update((s) => ({ ...s, onboarded: true, profile: { ...p, name: p.name.trim() || 'Athlete' } }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {step > 0 && (
          <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
            <Progress value={step / 3} />
          </View>
        )}
        <ScrollView contentContainerStyle={{ padding: 24, gap: 16, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <Animated.View entering={FadeInRight} style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
              <Text style={{ color: c.accent, fontWeight: '900', letterSpacing: 3 }}>FAITH & IRON</Text>
              <Text style={{ fontFamily: HEAD, fontSize: 72, color: c.text, lineHeight: 80 }}>ZION{'\n'}FIT</Text>
              <T sub size={16}>Strength & Conditioning Academy and training platform. Discipline as worship.</T>
              <Card style={{ gap: 10 }}>
                {[['barbell', '400+ exercises & free program builder'], ['nutrition', '400+ foods incl. SA staples'], ['school', 'S&C Academy: biomechanics, body, nutrition'], ['people', 'Community, buddy system & coaching']].map(([i, l]) => (
                  <View key={l} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <Ionicons name={i as any} size={18} color={c.accent} />
                    <T size={14}>{l}</T>
                  </View>
                ))}
              </Card>
              <T sub size={12} style={{ textAlign: 'center' }}>70% FREE forever • 30% PREMIUM</T>
              <Button title="GET STARTED" onPress={() => setStep(1)} />
            </Animated.View>
          )}
          {step === 1 && (
            <Animated.View entering={FadeInRight} style={{ gap: 16 }}>
              <H1>ABOUT YOU</H1>
              <T sub>Used to estimate your nutrition targets. You can change this anytime.</T>
              <Input label="Your name" value={p.name} onChangeText={(v) => set('name')(v)} returnKeyType="done" />
              <Label>SEX</Label>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pill label="Male" active={p.gender === 'male'} onPress={() => set('gender')('male')} />
                <Pill label="Female" active={p.gender === 'female'} onPress={() => set('gender')('female')} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 }}>
                <Stepper label="Age" value={p.age} onChange={set('age')} min={13} max={90} />
                <Stepper label="Height" value={p.heightCm} onChange={set('heightCm')} min={120} max={230} suffix="cm" />
                <Stepper label="Weight" value={p.weightKg} onChange={set('weightKg')} min={35} max={250} step={0.5} suffix="kg" />
              </View>
              <Button title="CONTINUE" onPress={() => setStep(2)} />
            </Animated.View>
          )}
          {step === 2 && (
            <Animated.View entering={FadeInRight} style={{ gap: 14 }}>
              <H1>YOUR GOAL</H1>
              {([['build', 'Build Muscle', 'barbell'], ['maintain', 'Maintain', 'shield-checkmark'], ['lose', 'Lose Weight', 'flame']] as const).map(([g, l, i]) => (
                <Card key={g} onPress={() => set('goal')(g)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderColor: p.goal === g ? c.accent : c.border, borderWidth: p.goal === g ? 2 : 1 }}>
                  <Ionicons name={i} size={22} color={c.accent} />
                  <T bold style={{ flex: 1 }}>{l}</T>
                  {p.goal === g && <Ionicons name="checkmark-circle" size={22} color={c.accent} />}
                </Card>
              ))}
              <Label>ACTIVITY</Label>
              {ACTS.map(([a, d]) => (
                <Card key={a} onPress={() => set('activity')(a)} style={{ paddingVertical: 12, flexDirection: 'row', alignItems: 'center', borderColor: p.activity === a ? c.accent : c.border }}>
                  <View style={{ flex: 1 }}>
                    <T bold style={{ textTransform: 'capitalize' }}>{a}</T>
                    <T sub size={12}>{d}</T>
                  </View>
                  {p.activity === a && <Ionicons name="checkmark-circle" size={20} color={c.accent} />}
                </Card>
              ))}
              <Stepper label="Workouts per week" value={p.workoutsPerWeek} onChange={set('workoutsPerWeek')} min={1} max={14} />
              <Button title="CONTINUE" onPress={() => setStep(3)} />
            </Animated.View>
          )}
          {step === 3 && (
            <Animated.View entering={FadeInRight} style={{ gap: 16 }}>
              <H1>YOUR TARGETS</H1>
              <T sub>Calculated from goal, age, sex, height, weight and activity — estimates, not medical advice.</T>
              <Card accent style={{ alignItems: 'center', gap: 6, paddingVertical: 24 }}>
                <Text style={{ fontFamily: HEAD, fontSize: 56, color: c.accent }}>{t.calories}</Text>
                <Label>KCAL / DAY</Label>
                <View style={{ flexDirection: 'row', gap: 22, marginTop: 10 }}>
                  {[['PROTEIN', t.protein], ['CARBS', t.carbs], ['FAT', t.fat]].map(([l, v]) => (
                    <View key={l as string} style={{ alignItems: 'center' }}>
                      <Text style={{ fontFamily: HEAD, fontSize: 24, color: c.text }}>{v}g</Text>
                      <Label style={{ fontSize: 9 }}>{l}</Label>
                    </View>
                  ))}
                </View>
                <T sub size={12} style={{ marginTop: 8 }}>Water {(t.waterMl / 1000).toFixed(1)}L • BMR {t.bmr} • TDEE {t.tdee}</T>
              </Card>
              <Card>
                <T style={{ fontStyle: 'italic', textAlign: 'center' }}>“I can do all things through Christ who strengthens me.”</T>
                <T sub style={{ textAlign: 'center', marginTop: 4 }}>Philippians 4:13</T>
              </Card>
              <Button title="START TRAINING" icon="flash" onPress={finish} />
            </Animated.View>
          )}
          {step > 0 && <Button variant="ghost" title="BACK" onPress={() => setStep(step - 1)} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
