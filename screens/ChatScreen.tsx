import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { timeAgo, uid } from '../lib/utils';

const REPLIES = [
  'Let’s gooo 🔥 Proud of you bro.',
  'Same time tomorrow? I’ll be at the gym by 6.',
  'Philippians 4:13 — we don’t stop.',
  'Did you hit your protein today? I’m on 190g.',
  'Send me your program, I want to try that split.',
  'Lekker! Rest up tonight, big session Thursday.',
  'I’m doing the GPS run later, going for 8km.',
];

export default function ChatScreen() {
  const c = useColors();
  const { state, update, notify } = useStore();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const list = useRef<FlatList>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    update((s) => ({ ...s, chat: [...s.chat, { id: uid(), from: 'me', text: t, date: new Date().toISOString() }] }));
    setText('');
    setTyping(true);
    timer.current = setTimeout(() => {
      const reply = REPLIES[(state.chat.length + t.length) % REPLIES.length];
      update((s) => ({ ...s, chat: [...s.chat, { id: uid(), from: 'buddy', text: reply, date: new Date().toISOString() }] }));
      notify('buddy', 'Sipho replied', reply, 'chatbubble');
      setTyping(false);
    }, 1400);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={list}
        data={state.chat}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const me = item.from === 'me';
          return (
            <Animated.View entering={FadeInUp.duration(250)} style={{ alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <View style={{ backgroundColor: me ? c.accent : c.card, borderRadius: 18, borderBottomRightRadius: me ? 4 : 18, borderBottomLeftRadius: me ? 18 : 4, paddingHorizontal: 14, paddingVertical: 10, borderWidth: me ? 0 : 1, borderColor: c.border }}>
                <Text style={{ color: me ? c.onAccent : c.text, fontSize: 15 }}>{item.text}</Text>
              </View>
              <Text style={{ color: c.muted, fontSize: 10, marginTop: 3, alignSelf: me ? 'flex-end' : 'flex-start' }}>{timeAgo(item.date)}</Text>
            </Animated.View>
          );
        }}
        ListFooterComponent={typing ? <Text style={{ color: c.muted, fontStyle: 'italic', marginTop: 4 }}>Sipho is typing…</Text> : null}
      />
      <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: c.border }}>
        <TextInput value={text} onChangeText={setText} placeholder="Message Sipho…" placeholderTextColor={c.muted} returnKeyType="send" onSubmitEditing={send} style={{ flex: 1, backgroundColor: c.card, color: c.text, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: c.border }} />
        <Pressable onPress={send} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="send" size={18} color={c.onAccent} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
