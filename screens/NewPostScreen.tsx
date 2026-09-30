import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { Button, Card, Label, Pill, T, ToggleRow, initialsOf } from '../components/ui';
import { useStore } from '../lib/store';
import { useColors } from '../lib/theme';
import { uid } from '../lib/utils';
import { notice } from './TrainScreen';

const TAGS = ['Progress', 'PR', 'Run', 'Nutrition', 'Faith', 'Question'];

export default function NewPostScreen({ navigation }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const [text, setText] = useState('');
  const [tag, setTag] = useState('Progress');
  const [attach, setAttach] = useState(false);
  const last = state.sessions[0];

  const post = () => {
    if (!text.trim()) return notice('Write something first');
    const extra = attach && last ? `\n\n🏋️ ${last.dayName}: ${last.sets} sets • ${last.volume.toLocaleString()}kg • ${last.minutes} min` : '';
    update((s) => ({ ...s, posts: [{ id: uid(), author: s.profile.name, avatar: initialsOf(s.profile.name), text: text.trim() + extra, date: new Date().toISOString(), likes: 0, liked: false, comments: [], tag }, ...s.posts] }));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
        <Card>
          <TextInput value={text} onChangeText={setText} multiline autoFocus placeholder="Share a win, a PR, or a prayer request…" placeholderTextColor={c.muted} style={{ minHeight: 140, color: c.text, fontSize: 16, textAlignVertical: 'top' }} maxLength={500} />
          <T sub size={11} style={{ textAlign: 'right' }}>{text.length}/500</T>
        </Card>
        <Label>TAG</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{TAGS.map((t) => <Pill key={t} label={t} active={tag === t} onPress={() => setTag(t)} />)}</View>
        {last && (
          <Card style={{ paddingVertical: 0 }}>
            <ToggleRow icon="barbell" title="Attach last workout" sub={`${last.dayName} • ${last.volume.toLocaleString()}kg volume`} value={attach} onChange={setAttach} last />
          </Card>
        )}
        <T sub size={12}>Visibility: {state.settings.privacy.publicProfile ? 'Public' : 'ZION FIT community only'}</T>
        <Button title="POST" icon="send" onPress={post} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
