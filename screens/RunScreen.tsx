import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Button, Card, Empty, Label, T } from '../components/ui';
import { fmtD, useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { fmtTime, paceStr, prettyDate, uid } from '../lib/utils';
import { notice } from './TrainScreen';

// Route simulation: a loop around a Pretoria park, normalised 0..1 coordinates
const ROUTE = Array.from({ length: 80 }, (_, i) => {
  const t = (i / 80) * Math.PI * 2;
  return { x: 0.5 + 0.38 * Math.cos(t) + 0.06 * Math.sin(3 * t), y: 0.5 + 0.32 * Math.sin(t) + 0.05 * Math.cos(2 * t) };
});

export default function RunScreen() {
  const c = useColors();
  const { state, update, notify } = useStore();
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const [km, setKm] = useState(0);
  const [laps, setLaps] = useState<{ km: number; secs: number }[]>([]);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.8, { duration: 900 }), -1, false);
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: 2 - pulse.value }));

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs((s) => s + 1);
        // ~5:40/km with natural variance; sped up x10 so progress is visible during a demo
        setKm((k) => k + (1 / 340) * (0.9 + Math.random() * 0.2) * 10);
      }, 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const shownSecs = secs * 10;
  const dotIdx = Math.floor(((km % 2) / 2) * ROUTE.length);
  const stop = () => {
    setRunning(false);
    if (km < 0.05) return;
    const run = { id: uid(), date: new Date().toISOString(), km: Math.round(km * 100) / 100, seconds: shownSecs };
    update((s) => ({ ...s, runs: [run, ...s.runs] }));
    notify('workout', 'Run saved 🏃', `${run.km} km in ${fmtTime(run.seconds)} • Ladder updated`, 'navigate');
    notice('RUN SAVED', `${fmtD(run.km, state.settings.distance)} • ${fmtTime(run.seconds)} • ${paceStr(run.seconds, run.km)}/km\nLadder points +${Math.round(run.km * 10)}`);
    setSecs(0);
    setKm(0);
    setLaps([]);
  };

  return (
    <FlatList
      data={state.runs}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{ padding: 20, gap: 8, paddingBottom: 40 }}
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 10 }}>
          <View style={{ height: 220, borderRadius: 20, backgroundColor: c.mode === 'dark' ? '#0f1512' : '#E7F5EC', borderWidth: 1, borderColor: c.border, overflow: 'hidden' }}>
            {[0.25, 0.5, 0.75].map((g) => (
              <View key={'h' + g} style={{ position: 'absolute', left: 0, right: 0, top: `${g * 100}%`, height: 1, backgroundColor: c.border }} />
            ))}
            {[0.25, 0.5, 0.75].map((g) => (
              <View key={'v' + g} style={{ position: 'absolute', top: 0, bottom: 0, left: `${g * 100}%`, width: 1, backgroundColor: c.border }} />
            ))}
            {ROUTE.map((p, i) => (
              <View key={i} style={{ position: 'absolute', left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: 5, height: 5, borderRadius: 3, backgroundColor: km > 0 && (i <= dotIdx || km >= 2) ? c.accent : c.mode === 'dark' ? '#27302b' : '#bcd8c6' }} />
            ))}
            <View style={{ position: 'absolute', left: `${ROUTE[dotIdx].x * 100}%`, top: `${ROUTE[dotIdx].y * 100}%`, marginLeft: -6, marginTop: -6 }}>
              {running && <Animated.View style={[{ position: 'absolute', width: 17, height: 17, borderRadius: 9, backgroundColor: c.green }, pulseStyle]} />}
              <View style={{ width: 17, height: 17, borderRadius: 9, backgroundColor: c.green, borderWidth: 3, borderColor: '#fff' }} />
            </View>
            <View style={{ position: 'absolute', left: 12, top: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
              <Ionicons name="location" size={12} color={c.accent} />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>Pretoria • Magnolia Dell loop</Text>
            </View>
          </View>
          <Card style={{ gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: HEAD, fontSize: 56, color: c.text }}>{state.settings.distance === 'km' ? km.toFixed(2) : (km * 0.6214).toFixed(2)}</Text>
              <Label>{state.settings.distance === 'km' ? 'KILOMETRES' : 'MILES'}</Label>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {[['TIME', fmtTime(shownSecs)], ['PACE', `${paceStr(shownSecs, km)}/km`], ['KCAL', `${Math.round(km * state.profile.weightKg * 1.0)}`]].map(([l, v]) => (
                <View key={l} style={{ alignItems: 'center' }}>
                  <Text style={{ fontFamily: HEAD, fontSize: 22, color: c.text }}>{v}</Text>
                  <Label style={{ fontSize: 9 }}>{l}</Label>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {running ? (
                <>
                  <Button variant="secondary" title="PAUSE" icon="pause" onPress={() => setRunning(false)} style={{ flex: 1 }} />
                  <Button variant="danger" title="STOP & SAVE" icon="stop" onPress={stop} style={{ flex: 1 }} />
                </>
              ) : (
                <>
                  <Button title={secs ? 'RESUME' : 'START GPS RUN'} icon="play" onPress={() => setRunning(true)} style={{ flex: 1 }} />
                  {secs > 0 && <Button variant="danger" title="SAVE" icon="stop" onPress={stop} style={{ flex: 1 }} />}
                </>
              )}
              <Button variant="ghost" title="LAP" disabled={!running} onPress={() => setLaps((l) => [...l, { km, secs: shownSecs }])} />
            </View>
            {running && <Text style={{ color: c.green, fontSize: 11, fontWeight: '800', textAlign: 'center' }}>● Tracking live • demo mode runs at 10× speed</Text>}
            {laps.map((l, i) => (
              <T key={i} size={12} sub>Lap {i + 1}: {l.km.toFixed(2)} km • {fmtTime(l.secs)}</T>
            ))}
          </Card>
          <Label style={{ marginTop: 6 }}>RUN HISTORY • {state.runs.reduce((a, r) => a + r.km, 0).toFixed(1)} KM TOTAL</Label>
        </View>
      }
      ListEmptyComponent={<Empty icon="walk" title="No runs yet" body="Start your first GPS run to climb the ladder." />}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, padding: 12 }}>
          <Ionicons name="walk" size={20} color={c.accent} />
          <View style={{ flex: 1 }}>
            <T bold>{fmtD(item.km, state.settings.distance)}</T>
            <T sub size={12}>{prettyDate(item.date)} • {fmtTime(item.seconds)}</T>
          </View>
          <T sub size={12}>{paceStr(item.seconds, item.km)}/km</T>
        </View>
      )}
    />
  );
}
