import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Card, H1, Input, Label, Row, Segmented, T, ToggleRow } from '../components/ui';
import { NotifKind, Settings, useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { confirm, notice } from './TrainScreen';

const TITLES: Record<string, string> = { notifications: 'NOTIFICATIONS', privacy: 'PRIVACY & VISIBILITY', account: 'ACCOUNT & SECURITY', app: 'APP SETTINGS', support: 'SUPPORT', about: 'ABOUT ZION FIT' };

const FAQ = [
  ['What is free?', '70% of ZION FIT is free forever: 400+ exercises, 400+ foods, the custom program builder, nutrition tracking, meal planner, recovery & mobility tools, GPS run, community, buddy system and 21 academy topics.'],
  ['What does Premium add?', '30% premium content: 7 training protocols, 7 nutrition programs, 9 advanced academy topics (power, eccentrics, supplements, testing and more) and certificates.'],
  ['Is my data private?', 'Your data is stored on your device. Body metrics are private by default and you control what your buddy and the ladder can see.'],
  ['How are nutrition targets calculated?', 'Mifflin-St Jeor BMR × activity factor, adjusted for your goal. They are estimates, not medical advice.'],
];

export default function SettingsScreen({ route, navigation }: any) {
  const c = useColors();
  const section: string = route.params?.section ?? 'app';
  const { state, update, resetAll } = useStore();
  const s = state.settings;
  const [open, setOpen] = useState<number | null>(null);
  const [pw, setPw] = useState({ cur: '', next: '', confirm: '' });
  const [report, setReport] = useState('');
  const [connected, setConnected] = useState({ google: true, apple: false, strava: false });

  useLayoutEffect(() => navigation.setOptions({ title: TITLES[section] ?? 'SETTINGS' }), [section]);

  const setS = (fn: (x: Settings) => Settings) => update((st) => ({ ...st, settings: fn(st.settings) }));
  const notif = (k: NotifKind) => (v: boolean) => setS((x) => ({ ...x, notif: { ...x.notif, [k]: v } }));
  const priv = (k: keyof Settings['privacy']) => (v: boolean) => setS((x) => ({ ...x, privacy: { ...x.privacy, [k]: v } }));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        {section === 'notifications' && (
          <>
            <T sub>Choose which reminders and alerts ZION FIT sends to your inbox.</T>
            <Card style={{ paddingVertical: 4 }}>
              <ToggleRow icon="barbell" title="Workout reminders" sub="Sessions, PRs, runs" value={s.notif.workout} onChange={notif('workout')} />
              <ToggleRow icon="nutrition" title="Nutrition reminders" sub="Meal logging, protein targets" value={s.notif.nutrition} onChange={notif('nutrition')} />
              <ToggleRow icon="school" title="Academy reminders" sub="Lessons, quizzes, certificates" value={s.notif.academy} onChange={notif('academy')} />
              <ToggleRow icon="chatbubbles" title="Buddy activity" sub="Messages & challenges" value={s.notif.buddy} onChange={notif('buddy')} />
              <ToggleRow icon="book" title="Faith activity" sub="Verse of the day, devotionals" value={s.notif.faith} onChange={notif('faith')} />
              <ToggleRow icon="moon" title="Recovery check-ins" sub="Fatigue & mobility alerts" value={s.notif.recovery} onChange={notif('recovery')} last />
            </Card>
            <Button variant="secondary" title="OPEN NOTIFICATION INBOX" icon="mail-open" onPress={() => navigation.navigate('Notifications')} />
          </>
        )}

        {section === 'privacy' && (
          <>
            <T sub>You’re in control. Data stays on your device unless you share it.</T>
            <Card style={{ paddingVertical: 4 }}>
              <ToggleRow icon="globe" title="Public profile" sub="Anyone in the community can view your profile" value={s.privacy.publicProfile} onChange={priv('publicProfile')} />
              <ToggleRow icon="barbell" title="Show workouts" sub="Share session summaries in the feed" value={s.privacy.showWorkouts} onChange={priv('showWorkouts')} />
              <ToggleRow icon="lock-closed" title="Keep body metrics private" sub="Weight, body fat and photos" value={s.privacy.bodyMetricsPrivate} onChange={priv('bodyMetricsPrivate')} />
              <ToggleRow icon="medal" title="Achievements public" value={s.privacy.achievementsPublic} onChange={priv('achievementsPublic')} />
              <ToggleRow icon="podium" title="Appear on ladder" sub="Show your ranking on the GPS ladder" value={s.privacy.appearOnLadder} onChange={priv('appearOnLadder')} />
              <ToggleRow icon="people" title="Share progress with buddy" value={s.privacy.shareWithBuddy} onChange={priv('shareWithBuddy')} />
              <ToggleRow icon="stats-chart" title="Anonymous analytics" sub="Help improve ZION FIT" value={s.privacy.analytics} onChange={priv('analytics')} last />
            </Card>
            <Button variant="ghost" icon="download-outline" title="EXPORT MY DATA" onPress={() => notice('Data export', `Your data (${state.sessions.length} sessions, ${Object.keys(state.logs).length} nutrition days, ${state.runs.length} runs) is stored locally on this device.`)} />
          </>
        )}

        {section === 'account' && (
          <>
            <Card style={{ paddingVertical: 4 }}>
              <Row icon="mail" title="Email" sub={state.profile.email} onPress={() => navigation.navigate('EditProfile')} last />
            </Card>
            <Card style={{ gap: 10 }}>
              <Label>CHANGE PASSWORD</Label>
              <Input placeholder="Current password" secureTextEntry value={pw.cur} onChangeText={(v) => setPw({ ...pw, cur: v })} />
              <Input placeholder="New password (8+ chars)" secureTextEntry value={pw.next} onChangeText={(v) => setPw({ ...pw, next: v })} />
              <Input placeholder="Confirm new password" secureTextEntry value={pw.confirm} onChangeText={(v) => setPw({ ...pw, confirm: v })} returnKeyType="done" />
              <Button small title="UPDATE PASSWORD" onPress={() => {
                if (!pw.cur) return notice('Enter your current password');
                if (pw.next.length < 8) return notice('Password too short', 'Use at least 8 characters.');
                if (pw.next !== pw.confirm) return notice('Passwords don’t match');
                setPw({ cur: '', next: '', confirm: '' });
                notice('Password updated', 'Your password was changed successfully.');
              }} />
            </Card>
            <Card style={{ paddingVertical: 4 }}>
              <Label style={{ marginTop: 10 }}>CONNECTED ACCOUNTS</Label>
              <ToggleRow icon="logo-google" title="Google" value={connected.google} onChange={(v) => setConnected({ ...connected, google: v })} />
              <ToggleRow icon="logo-apple" title="Apple" value={connected.apple} onChange={(v) => setConnected({ ...connected, apple: v })} />
              <ToggleRow icon="bicycle" title="Strava" value={connected.strava} onChange={(v) => setConnected({ ...connected, strava: v })} last />
            </Card>
            <Button variant="secondary" icon="log-out-outline" title="SIGN OUT" onPress={() => confirm('Sign out?', 'Your data stays on this device.', () => update((st) => ({ ...st, onboarded: false })), 'Sign out')} />
            <Button variant="danger" icon="trash" title="DELETE ACCOUNT" onPress={() => confirm('Delete account?', 'This permanently erases all your ZION FIT data on this device.', resetAll)} />
          </>
        )}

        {section === 'app' && (
          <>
            <Card style={{ gap: 14 }}>
              <Label>THEME</Label>
              <Segmented options={['dark', 'light', 'system']} value={s.theme} onChange={(v) => setS((x) => ({ ...x, theme: v as any }))} />
              <Label>WEIGHT UNITS</Label>
              <Segmented options={['kg', 'lb']} value={s.units} onChange={(v) => setS((x) => ({ ...x, units: v as any }))} />
              <Label>DISTANCE</Label>
              <Segmented options={['km', 'mi']} value={s.distance} onChange={(v) => setS((x) => ({ ...x, distance: v as any }))} />
            </Card>
            <Card style={{ paddingVertical: 4 }}>
              <ToggleRow icon="volume-high" title="Sound" value={s.sound} onChange={(v) => setS((x) => ({ ...x, sound: v }))} />
              <ToggleRow icon="phone-portrait" title="Vibration" value={s.vibration} onChange={(v) => setS((x) => ({ ...x, vibration: v }))} />
              <Row icon="language" title="Language" sub="English (EN)" last />
            </Card>
          </>
        )}

        {section === 'support' && (
          <>
            <Label>FAQ</Label>
            {FAQ.map(([q, a], i) => (
              <Pressable key={q} onPress={() => setOpen(open === i ? null : i)}>
                <Card style={{ gap: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <T bold style={{ flex: 1 }}>{q}</T>
                    <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={c.muted} />
                  </View>
                  {open === i && <T sub size={13}>{a}</T>}
                </Card>
              </Pressable>
            ))}
            <Card style={{ paddingVertical: 4 }}>
              <Row icon="mail" title="Contact Support" sub="support@zionfit.sa" onPress={() => Linking.openURL('mailto:support@zionfit.sa?subject=ZION%20FIT%20Support')} last />
            </Card>
            <Card style={{ gap: 10 }}>
              <Label>REPORT A PROBLEM / SEND FEEDBACK</Label>
              <Input value={report} onChangeText={setReport} placeholder="Tell us what happened…" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
              <Button small title="SEND" icon="send" onPress={() => { if (!report.trim()) return notice('Please describe the issue'); setReport(''); notice('Thank you!', 'Your feedback was received. We reply within 48 hours.'); }} />
            </Card>
          </>
        )}

        {section === 'about' && (
          <View style={{ gap: 14, alignItems: 'center' }}>
            <H1 size={48} style={{ color: c.accent }}>ZION FIT</H1>
            <T bold>FAITH & IRON</T>
            <T sub style={{ textAlign: 'center' }}>ZION FIT mission: Faith & Iron • Discipline as worship. A strength & conditioning academy and training platform built in South Africa.</T>
            <Card style={{ alignSelf: 'stretch' }}>
              <T style={{ fontStyle: 'italic', textAlign: 'center' }}>“I can do all things through Christ who strengthens me.”</T>
              <T sub style={{ textAlign: 'center', marginTop: 4 }}>Philippians 4:13</T>
            </Card>
            <Card style={{ alignSelf: 'stretch', paddingVertical: 4 }}>
              <Row icon="document-text" title="Terms of Service" onPress={() => notice('Terms of Service', 'ZION FIT provides educational fitness content. Consult a medical professional before starting any program.')} />
              <Row icon="shield" title="Privacy Policy" onPress={() => notice('Privacy Policy', 'Your data is stored locally on your device. We never sell personal data.')} />
              <Row icon="heart" title="Acknowledgements" onPress={() => notice('Acknowledgements', 'Built with React Native & Expo. Thanks to our coaches, athletes and community.')} last />
            </Card>
            <T sub size={12}>App Version: v2.4.0 (2026.09.30)</T>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
