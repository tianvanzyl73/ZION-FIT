import React, { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Badge, Button, Card, H1, Input, Label, Pill, Stepper, T } from '../components/ui';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { prettyDate } from '../lib/utils';
import { confirm, notice } from './TrainScreen';

const GOALS = ['Build muscle', 'Get stronger', 'Lose fat', 'Sport performance', 'Run faster', 'Return from injury'];
const STEPS = ['Pending', 'In Review', 'Accepted'] as const;

export default function CoachingScreen() {
  const c = useColors();
  const { state, update, notify } = useStore();
  const [goal, setGoal] = useState(GOALS[0]);
  const [days, setDays] = useState(state.profile.workoutsPerWeek);
  const [notes, setNotes] = useState('');
  const req = state.coaching;

  const submit = () => {
    if (notes.trim().length < 10) return notice('Tell the coach a bit more', 'Add at least a sentence about your background and schedule.');
    update((s) => ({ ...s, coaching: { status: 'Pending', goal, days, notes: notes.trim(), date: new Date().toISOString() } }));
    notify('workout', 'Coaching request sent', `Goal: ${goal} • ${days} days/week. A coach will review within 48h.`, 'person-add');
    setTimeout(() => {
      update((s) => (s.coaching ? { ...s, coaching: { ...s.coaching, status: 'In Review' } } : s));
      notify('workout', 'Coach is reviewing your request', 'Coach Zion is building your personalized plan.', 'person');
    }, 4000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <H1>GET YOUR PERSONALIZED PROGRAM</H1>
        <T sub>1-on-1 programming from a qualified S&C coach: training, nutrition and recovery built around you.</T>
        {req ? (
          <>
            <Card accent style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Label color={c.accent}>YOUR REQUEST</Label>
                <Badge label={req.status.toUpperCase()} tone={req.status === 'Accepted' ? 'green' : 'accent'} />
              </View>
              <T bold>{req.goal} • {req.days} days/week</T>
              <T sub size={13}>{req.notes}</T>
              <T sub size={11}>Submitted {prettyDate(req.date)}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {STEPS.map((s, i) => {
                  const reached = STEPS.indexOf(req.status) >= i;
                  return (
                    <React.Fragment key={s}>
                      <View style={{ alignItems: 'center', gap: 4 }}>
                        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: reached ? c.accent : c.card2, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="checkmark" size={14} color={reached ? c.onAccent : c.muted} />
                        </View>
                        <T size={10} sub>{s}</T>
                      </View>
                      {i < STEPS.length - 1 && <View style={{ flex: 1, height: 2, backgroundColor: STEPS.indexOf(req.status) > i ? c.accent : c.card2, marginBottom: 16 }} />}
                    </React.Fragment>
                  );
                })}
              </View>
            </Card>
            <Button variant="danger" title="CANCEL REQUEST" onPress={() => confirm('Cancel request?', 'Your coaching request will be withdrawn.', () => update((s) => ({ ...s, coaching: null })), 'Withdraw')} />
          </>
        ) : (
          <Card style={{ gap: 14 }}>
            <Label>PRIMARY GOAL</Label>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{GOALS.map((g) => <Pill key={g} label={g} active={goal === g} onPress={() => setGoal(g)} />)}</View>
            <Stepper label="Training days / week" value={days} onChange={setDays} min={1} max={7} />
            <Input label="About you" value={notes} onChangeText={setNotes} multiline placeholder="Training age, sport, injuries, equipment, schedule…" style={{ minHeight: 110, textAlignVertical: 'top' }} />
            <T sub size={11}>Your profile stats ({state.profile.weightKg}kg, {state.profile.heightCm}cm, goal {state.profile.goal}) are shared with the coach.</T>
            <Button title="SEND REQUEST" icon="send" onPress={submit} />
          </Card>
        )}
        <Card onPress={() => Linking.openURL('https://fiverr.com/s/L3dX4g7')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="open-outline" size={22} color={c.green} />
          <View style={{ flex: 1 }}>
            <T bold>Prefer Fiverr?</T>
            <T sub size={12}>fiverr.com/s/L3dX4g7 • Program access via link</T>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
