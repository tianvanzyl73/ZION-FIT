import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation } from 'react-native-reanimated';
import { Button, Segmented, T } from '../components/ui';
import { HEAD, useColors } from '../lib/theme';

const PATTERNS: Record<string, { label: string; secs: number; scale: number }[]> = {
  '4-7-8': [{ label: 'INHALE', secs: 4, scale: 1 }, { label: 'HOLD', secs: 7, scale: 1 }, { label: 'EXHALE', secs: 8, scale: 0.45 }],
  Box: [{ label: 'INHALE', secs: 4, scale: 1 }, { label: 'HOLD', secs: 4, scale: 1 }, { label: 'EXHALE', secs: 4, scale: 0.45 }, { label: 'HOLD', secs: 4, scale: 0.45 }],
  Coherent: [{ label: 'INHALE', secs: 5, scale: 1 }, { label: 'EXHALE', secs: 5, scale: 0.45 }],
};

export default function BreatheScreen() {
  const c = useColors();
  const [mode, setMode] = useState('4-7-8');
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const scale = useSharedValue(0.45);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = PATTERNS[mode];

  useEffect(() => {
    if (!active) return;
    let p = 0;
    let l = steps[0].secs;
    setPhase(0);
    setLeft(l);
    scale.value = withTiming(steps[0].scale, { duration: steps[0].secs * 1000, easing: Easing.inOut(Easing.ease) });
    timer.current = setInterval(() => {
      l -= 1;
      if (l <= 0) {
        p = (p + 1) % steps.length;
        if (p === 0) setCycles((x) => x + 1);
        l = steps[p].secs;
        setPhase(p);
        scale.value = withTiming(steps[p].scale, { duration: steps[p].secs * 1000, easing: Easing.inOut(Easing.ease) });
      }
      setLeft(l);
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
      cancelAnimation(scale);
    };
  }, [active, mode]);

  const st = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={{ flex: 1, padding: 20, gap: 20, backgroundColor: c.bg }}>
      <Segmented options={Object.keys(PATTERNS)} value={mode} onChange={(m) => { setActive(false); setCycles(0); scale.value = withTiming(0.45); setMode(m); }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(250,204,21,0.12)', borderWidth: 2, borderColor: c.accent, position: 'absolute' }, st]} />
        <Animated.View style={[{ width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(250,204,21,0.22)', position: 'absolute' }, st]} />
        <Text style={{ fontFamily: HEAD, fontSize: 32, color: c.text }}>{active ? steps[phase].label : 'READY'}</Text>
        <Text style={{ fontFamily: HEAD, fontSize: 48, color: c.accent }}>{active ? left : '—'}</Text>
      </View>
      <T sub style={{ textAlign: 'center' }}>{cycles} cycles • Slow breathing shifts you toward parasympathetic recovery. “Be still, and know” — Psalm 46:10</T>
      <Button title={active ? 'STOP' : 'START'} icon={active ? 'stop' : 'play'} variant={active ? 'secondary' : 'primary'} onPress={() => { if (active) { setActive(false); scale.value = withTiming(0.45); } else setActive(true); }} />
    </View>
  );
}
