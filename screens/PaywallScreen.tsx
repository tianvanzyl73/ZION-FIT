import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, Card, H1, Label, T } from '../components/ui';
import { useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { confirm, notice } from './TrainScreen';

const FREE = ['400+ exercise library with PR tracking', '400+ foods incl. South African staples', 'Custom program builder & session tracker', 'Nutrition tracking, meal planner & shopping list', 'Recovery, breathing & mobility assessment', 'GPS run, ladder, buddy system & community', '21 S&C Academy topics (73 lessons)'];
const PREMIUM = ['7 elite training protocols (Hypertrophy, Isometric, Power, Eccentric, Concentric, Strength, Plyometric)', '7 nutrition programs (Carnivore, Paleo, Keto, High-Protein, High-Carb, Vegan, Vegetarian)', '9 advanced academy topics: power, eccentrics, isometrics, creatine, electrolytes, testing, youth & female athletes', 'Certificates & priority coaching'];

export default function PaywallScreen({ navigation }: any) {
  const c = useColors();
  const { state, update, notify } = useStore();
  const [plan, setPlan] = useState<'year' | 'month'>('year');
  const [busy, setBusy] = useState(false);

  const buy = () => {
    setBusy(true);
    setTimeout(() => {
      update((s) => ({ ...s, premium: true }));
      notify('academy', 'Premium unlocked 🔓', 'Academy + 7 Training + 7 Nutrition programs are yours.', 'diamond');
      setBusy(false);
      notice('Welcome to Premium!', 'All protocols, nutrition programs and academy topics are now unlocked.');
      navigation.goBack();
    }, 1200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16 }}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="close" size={26} color={c.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 14, paddingBottom: 40 }}>
        <Animated.View entering={FadeInDown} style={{ alignItems: 'center', gap: 6 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="diamond" size={34} color={c.onAccent} />
          </View>
          <H1 size={34} style={{ textAlign: 'center' }}>{state.premium ? 'PREMIUM ACTIVE' : 'UNLOCK PREMIUM'}</H1>
          <T sub style={{ textAlign: 'center' }}>Academy + 7 Training + 7 Nutrition Programs</T>
        </Animated.View>

        <View style={{ flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' }}>
          <View style={{ flex: 70, backgroundColor: c.green, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 9, fontWeight: '900', color: '#052e16' }}>70% FREE</Text></View>
          <View style={{ flex: 30, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 9, fontWeight: '900', color: '#000' }}>30% PREMIUM</Text></View>
        </View>

        <Card style={{ gap: 8 }}>
          <Label color={c.green}>ALWAYS FREE • 70%</Label>
          {FREE.map((x) => (
            <View key={x} style={{ flexDirection: 'row', gap: 8 }}>
              <Ionicons name="checkmark-circle" size={16} color={c.green} style={{ marginTop: 2 }} />
              <T size={13} style={{ flex: 1 }}>{x}</T>
            </View>
          ))}
        </Card>
        <Card accent style={{ gap: 8 }}>
          <Label color={c.accent}>PREMIUM • 30%</Label>
          {PREMIUM.map((x) => (
            <View key={x} style={{ flexDirection: 'row', gap: 8 }}>
              <Ionicons name="star" size={15} color={c.accent} style={{ marginTop: 2 }} />
              <T size={13} style={{ flex: 1 }}>{x}</T>
            </View>
          ))}
        </Card>

        {state.premium ? (
          <>
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="checkmark-done-circle" size={28} color={c.green} />
              <View style={{ flex: 1 }}>
                <T bold>Premium unlocked</T>
                <T sub size={12}>Manage your subscription in your app store account.</T>
              </View>
            </Card>
            <Button variant="ghost" title="CANCEL PREMIUM (DEMO)" onPress={() => confirm('Cancel Premium?', 'Premium content will be locked again.', () => { update((s) => ({ ...s, premium: false })); navigation.goBack(); }, 'Cancel Premium')} />
          </>
        ) : (
          <>
            {([['year', 'YEARLY', 'R899 / year', 'R74.92/mo • Save 37%'], ['month', 'MONTHLY', 'R119 / month', 'Cancel anytime']] as const).map(([k, l, price, sub]) => (
              <Pressable key={k} onPress={() => setPlan(k)}>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderColor: plan === k ? c.accent : c.border, borderWidth: plan === k ? 2 : 1 }}>
                  <Ionicons name={plan === k ? 'radio-button-on' : 'radio-button-off'} size={22} color={plan === k ? c.accent : c.muted} />
                  <View style={{ flex: 1 }}>
                    <Label>{l}</Label>
                    <Text style={{ fontFamily: HEAD, fontSize: 22, color: c.text }}>{price}</Text>
                    <T sub size={12}>{sub}</T>
                  </View>
                  {k === 'year' && <View style={{ backgroundColor: c.accent, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ fontSize: 10, fontWeight: '900', color: '#000' }}>BEST VALUE</Text></View>}
                </Card>
              </Pressable>
            ))}
            {busy ? <ActivityIndicator color={c.accent} style={{ padding: 14 }} /> : <Button title="UPGRADE TO PREMIUM" icon="lock-open" onPress={buy} />}
            <Pressable onPress={() => notice('Restore purchases', 'No previous purchases were found for this account.')}>
              <Text style={{ color: c.sub, textAlign: 'center', fontWeight: '700' }}>Restore purchases</Text>
            </Pressable>
            <T sub size={11} style={{ textAlign: 'center' }}>Demo checkout — no real payment is taken.</T>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
