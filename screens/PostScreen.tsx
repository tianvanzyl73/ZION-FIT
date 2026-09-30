import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Empty, Label, T, initialsOf } from '../components/ui';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { uid } from '../lib/utils';
import { PostCard } from './SquadScreen';

export default function PostScreen({ route }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const post = state.posts.find((p) => p.id === route.params?.id);
  const [text, setText] = useState('');
  if (!post) return <Empty icon="alert-circle" title="Post not found" />;
  const send = () => {
    if (!text.trim()) return;
    const first = state.profile.name.split(' ')[0];
    update((s) => ({ ...s, posts: s.posts.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, { id: uid(), author: first, text: text.trim() }] } : p)) }));
    setText('');
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        data={post.comments}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        ListHeaderComponent={<View style={{ gap: 14, marginBottom: 6 }}><PostCard post={post} /><Label>{post.comments.length} COMMENTS</Label></View>}
        ListEmptyComponent={<T sub>Be the first to encourage them.</T>}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Avatar initials={initialsOf(item.author)} size={30} color={c.card2} />
            <View style={{ flex: 1, backgroundColor: c.card, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: c.border }}>
              <T bold size={12}>{item.author}</T>
              <T size={13}>{item.text}</T>
            </View>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: c.border, backgroundColor: c.bg }}>
        <TextInput value={text} onChangeText={setText} placeholder="Write a comment…" placeholderTextColor={c.muted} returnKeyType="send" onSubmitEditing={send} style={{ flex: 1, backgroundColor: c.card, color: c.text, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: c.border }} />
        <Pressable onPress={send} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="send" size={18} color={c.onAccent} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
