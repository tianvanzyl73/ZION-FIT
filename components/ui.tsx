import React, { useEffect } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle, Switch, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { HEAD, useColors } from '../lib/theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function H1({ children, style, size = 30 }: { children: React.ReactNode; style?: StyleProp<TextStyle>; size?: number }) {
  const c = useColors();
  return <Text style={[{ fontFamily: HEAD, fontSize: size, color: c.text, letterSpacing: 0.5, lineHeight: size * 1.18 }, style]}>{children}</Text>;
}

export function Label({ children, style, color }: { children: React.ReactNode; style?: StyleProp<TextStyle>; color?: string }) {
  const c = useColors();
  return <Text style={[{ fontSize: 11, fontWeight: '800', letterSpacing: 1.6, color: color ?? c.muted, textTransform: 'uppercase' }, style]}>{children}</Text>;
}

export function T({ children, style, sub, bold, size = 14, numberOfLines }: { children: React.ReactNode; style?: StyleProp<TextStyle>; sub?: boolean; bold?: boolean; size?: number; numberOfLines?: number }) {
  const c = useColors();
  return (
    <Text numberOfLines={numberOfLines} style={[{ color: sub ? c.sub : c.text, fontSize: size, fontWeight: bold ? '700' : '400', lineHeight: size * 1.4 }, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, style, onPress, accent }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accent?: boolean }) {
  const c = useColors();
  const base: ViewStyle = {
    backgroundColor: c.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: accent ? c.accent : c.border,
    padding: 16,
    ...(c.mode === 'dark' ? {} : { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 }),
  };
  if (!onPress) return <View style={[base, style]}>{children}</View>;
  return (
    <PressScale onPress={onPress} style={[base, style]}>
      {children}
    </PressScale>
  );
}

export function PressScale({ children, onPress, style, disabled }: { children: React.ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => (s.value = withSpring(0.97, { damping: 20, stiffness: 400 }))}
      onPressOut={() => (s.value = withSpring(1, { damping: 20, stiffness: 400 }))}
    >
      <Animated.View style={[style, a]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Button({ title, onPress, variant = 'primary', icon, style, disabled, small }: { title: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'light'; icon?: IconName; style?: StyleProp<ViewStyle>; disabled?: boolean; small?: boolean }) {
  const c = useColors();
  const bg = variant === 'primary' ? c.accent : variant === 'secondary' ? c.card2 : variant === 'danger' ? '#7F1D1D' : variant === 'light' ? c.text : 'transparent';
  const fg = variant === 'primary' ? c.onAccent : variant === 'danger' ? '#FECACA' : variant === 'light' ? c.bg : c.text;
  return (
    <PressScale
      disabled={disabled}
      onPress={onPress}
      style={[
        { backgroundColor: bg, borderRadius: 999, paddingVertical: small ? 9 : 14, paddingHorizontal: small ? 14 : 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disabled ? 0.45 : 1 },
        variant === 'ghost' && { borderWidth: 1, borderColor: c.border },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={small ? 15 : 18} color={fg} />}
      <Text style={{ color: fg, fontWeight: '900', fontSize: small ? 12 : 14, letterSpacing: 0.8 }}>{title}</Text>
    </PressScale>
  );
}

export function Pill({ label, active, onPress, icon, color }: { label: string; active?: boolean; onPress?: () => void; icon?: IconName; color?: string }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: active ? c.accent : c.card, borderWidth: 1, borderColor: active ? c.accent : c.border }}
    >
      {icon && <Ionicons name={icon} size={13} color={active ? c.onAccent : color ?? c.sub} />}
      <Text style={{ color: active ? c.onAccent : c.sub, fontWeight: '800', fontSize: 12, textTransform: 'capitalize' }}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'green' | 'muted' | 'red' | 'blue' }) {
  const c = useColors();
  const map = { accent: [c.accent, c.onAccent], green: ['rgba(52,211,153,0.16)', c.green], muted: [c.card2, c.sub], red: ['rgba(248,113,113,0.16)', c.red], blue: ['rgba(96,165,250,0.16)', c.blue] } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }}>{label}</Text>
    </View>
  );
}

export function PremiumBadge({ unlocked }: { unlocked?: boolean }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: unlocked ? 'rgba(52,211,153,0.16)' : 'rgba(250,204,21,0.14)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' }}>
      <Ionicons name={unlocked ? 'lock-open' : 'lock-closed'} size={10} color={unlocked ? c.green : c.accent} />
      <Text style={{ color: unlocked ? c.green : c.accent, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 }}>{unlocked ? 'UNLOCKED' : 'PREMIUM'}</Text>
    </View>
  );
}

export function Progress({ value, color, height = 8, track }: { value: number; color?: string; height?: number; track?: string }) {
  const c = useColors();
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 700 });
  }, [value]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={{ height, backgroundColor: track ?? c.card2, borderRadius: 999, overflow: 'hidden' }}>
      <Animated.View style={[{ height, backgroundColor: color ?? c.accent, borderRadius: 999 }, a]} />
    </View>
  );
}

export function Stat({ label, value, sub, icon, color }: { label: string; value: string; sub?: string; icon?: IconName; color?: string }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.border, padding: 14, gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon && <Ionicons name={icon} size={14} color={color ?? c.accent} />}
        <Label style={{ fontSize: 10 }}>{label}</Label>
      </View>
      <Text style={{ fontFamily: HEAD, fontSize: 24, color: c.text }}>{value}</Text>
      {sub ? <Text style={{ color: c.muted, fontSize: 11 }}>{sub}</Text> : null}
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 10 }}>
      <Label style={{ color: c.text }}>{title}</Label>
      {action && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={{ color: c.accent, fontWeight: '800', fontSize: 12 }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Empty({ icon, title, body, action, onAction }: { icon: IconName; title: string; body?: string; action?: string; onAction?: () => void }) {
  const c = useColors();
  return (
    <View style={{ alignItems: 'center', padding: 28, gap: 8 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={28} color={c.accent} />
      </View>
      <T bold size={16}>{title}</T>
      {body ? <T sub style={{ textAlign: 'center' }}>{body}</T> : null}
      {action ? <Button small title={action} onPress={onAction} style={{ marginTop: 6 }} /> : null}
    </View>
  );
}

export function Input(props: TextInputProps & { label?: string }) {
  const c = useColors();
  const { label, style, ...rest } = props;
  return (
    <View style={{ gap: 6 }}>
      {label && <Label>{label}</Label>}
      <TextInput
        placeholderTextColor={c.muted}
        {...rest}
        style={[{ backgroundColor: c.card2, borderRadius: 14, borderWidth: 1, borderColor: c.border, color: c.text, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 13 : 10, fontSize: 15 }, style]}
      />
    </View>
  );
}

export function Stepper({ value, onChange, min = 0, max = 999, step = 1, label, suffix }: { value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; label?: string; suffix?: string }) {
  const c = useColors();
  const btn = (icon: IconName, d: number) => (
    <Pressable
      onPress={() => onChange(Math.round(Math.max(min, Math.min(max, value + d)) * 100) / 100)}
      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.card2, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={icon} size={16} color={c.text} />
    </Pressable>
  );
  return (
    <View style={{ gap: 6 }}>
      {label && <Label>{label}</Label>}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {btn('remove', -step)}
        <Text style={{ color: c.text, fontWeight: '900', fontSize: 16, minWidth: 54, textAlign: 'center' }}>
          {value}
          {suffix ? <Text style={{ color: c.muted, fontSize: 12 }}> {suffix}</Text> : null}
        </Text>
        {btn('add', step)}
      </View>
    </View>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: c.card, borderRadius: 999, padding: 4, borderWidth: 1, borderColor: c.border }}>
      {options.map((o) => (
        <Pressable key={o} onPress={() => onChange(o)} style={{ flex: 1, paddingVertical: 9, borderRadius: 999, backgroundColor: value === o ? c.accent : 'transparent', alignItems: 'center' }}>
          <Text style={{ color: value === o ? c.onAccent : c.sub, fontWeight: '900', fontSize: 12, letterSpacing: 0.5 }}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Row({ icon, title, sub, right, onPress, color, last }: { icon?: IconName; title: string; sub?: string; right?: React.ReactNode; onPress?: () => void; color?: string; last?: boolean }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderBottomColor: c.border, opacity: pressed ? 0.6 : 1 }]}>
      {icon && (
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: c.card2, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={17} color={color ?? c.accent} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.text, fontWeight: '700', fontSize: 14 }}>{title}</Text>
        {sub ? <Text style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={c.muted} /> : null)}
    </Pressable>
  );
}

export function ToggleRow({ icon, title, sub, value, onChange, last }: { icon?: IconName; title: string; sub?: string; value: boolean; onChange: (v: boolean) => void; last?: boolean }) {
  const c = useColors();
  return (
    <Row
      icon={icon}
      title={title}
      sub={sub}
      last={last}
      right={<Switch value={value} onValueChange={onChange} trackColor={{ false: c.border, true: c.accent }} thumbColor={Platform.OS === 'android' ? (value ? '#fff' : '#ccc') : undefined} />}
    />
  );
}

export function Bars({ data, height = 110, color, max, format }: { data: { label: string; value: number; highlight?: boolean }[]; height?: number; color?: string; max?: number; format?: (n: number) => string }) {
  const c = useColors();
  const m = max ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: height + 34 }}>
      {data.map((d, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
          {format ? <Text style={{ color: c.muted, fontSize: 9 }}>{format(d.value)}</Text> : null}
          <View style={{ width: '100%', height, justifyContent: 'flex-end' }}>
            <BarFill ratio={d.value / m} color={d.highlight ? c.accent : color ?? (c.mode === 'dark' ? '#3F3F46' : '#D4D4D8')} height={height} />
          </View>
          <Text style={{ color: d.highlight ? c.accent : c.muted, fontSize: 10, fontWeight: '700' }}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

function BarFill({ ratio, color, height }: { ratio: number; color: string; height: number }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withTiming(Math.max(3, ratio * height), { duration: 650 });
  }, [ratio, height]);
  const a = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[{ width: '100%', backgroundColor: color, borderRadius: 6 }, a]} />;
}

export function Ring({ value, size = 120, label, sub, color }: { value: number; size?: number; label: string; sub?: string; color?: string }) {
  // Segmented ring built from rotated ticks (no SVG dependency)
  const c = useColors();
  const ticks = 40;
  const on = Math.round(Math.max(0, Math.min(1, value)) * ticks);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: ticks }).map((_, i) => (
        <View
          key={i}
          style={{ position: 'absolute', width: 4, height: size, alignItems: 'center', transform: [{ rotate: `${(i * 360) / ticks}deg` }] }}
        >
          <View style={{ width: 4, height: size * 0.1, borderRadius: 2, backgroundColor: i < on ? color ?? c.accent : c.card2 }} />
        </View>
      ))}
      <Text style={{ fontFamily: HEAD, fontSize: size * 0.2, color: c.text }}>{label}</Text>
      {sub ? <Text style={{ color: c.muted, fontSize: 10, fontWeight: '700' }}>{sub}</Text> : null}
    </View>
  );
}

export function Avatar({ initials, size = 44, color }: { initials: string; size?: number; color?: string }) {
  const c = useColors();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color ?? c.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: c.onAccent, fontWeight: '900', fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

export const initialsOf = (n: string) =>
  n
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
