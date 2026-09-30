import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, RefreshControl, ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabHeader from '../components/TabHeader';
import { Avatar, Badge, Button, Card, H1, Label, Progress, Segmented, T, initialsOf } from '../components/ui';
import { Post, useStore } from '../lib/store';
import { HEAD, useColors } from '../lib/theme';
import { timeAgo, uid } from '../lib/utils';

const TABS = ['Feed', 'Buddy', 'Ladder', 'Coach'];

const FRESH: Omit<Post, 'id' | 'date' | 'liked' | 'comments'>[] = [
  { author: 'Naledi Khoza', avatar: 'NK', text: 'Finished my first Isometric Fortress week. Knees have never felt better. Consistency > intensity.', likes: 12, tag: 'Progress' },
  { author: 'Coach Zion', avatar: 'CZ', text: 'Tip: log your breakfast — athletes who eat within 2h of waking hit protein targets far more consistently.', likes: 64, tag: 'Coach Tip' },
  { author: 'Pieter Botha', avatar: 'PB', text: 'Deadlift 200kg at 82kg bodyweight. Joshua 1:9 on repeat. 💪', likes: 33, tag: 'PR' },
  { author: 'Ayanda Zulu', avatar: 'AZ', text: 'Morning 8km in the Durban humidity. Electrolytes saved me today 🧂', likes: 19, tag: 'Run' },
];

export default function SquadScreen({ navigation, route }: any) {
  const c = useColors();
  const [tab, setTab] = useState('Feed');
  useEffect(() => {
    if (route.params?.tab) setTab(route.params.tab);
  }, [route.params?.tab]);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <TabHeader title="SQUAD" subtitle="COMMUNITY • BUDDY • COACHING" />
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <Segmented options={TABS} value={tab} onChange={setTab} />
      </View>
      {tab === 'Feed' && <Feed navigation={navigation} />}
      {tab === 'Buddy' && <Buddy navigation={navigation} />}
      {tab === 'Ladder' && <Ladder navigation={navigation} />}
      {tab === 'Coach' && <Coach navigation={navigation} />}
    </SafeAreaView>
  );
}

export function PostCard({ post, onPress }: { post: Post; onPress?: () => void }) {
  const c = useColors();
  const { update } = useStore();
  const like = () => update((s) => ({ ...s, posts: s.posts.map((p) => (p.id === post.id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)) }));
  return (
    <Card onPress={onPress} style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar initials={post.avatar} size={38} color={post.author === 'Coach Zion' ? c.accent : c.card2} />
        <View style={{ flex: 1 }}>
          <T bold>{post.author}</T>
          <T sub size={11}>{timeAgo(post.date)}</T>
        </View>
        {post.tag ? <Badge label={post.tag.toUpperCase()} tone={post.tag === 'PR' ? 'accent' : post.tag === 'Coach Tip' ? 'green' : 'muted'} /> : null}
      </View>
      <T>{post.text}</T>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Pressable onPress={like} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={19} color={post.liked ? c.red : c.sub} />
          <Text style={{ color: c.sub, fontWeight: '700' }}>{post.likes}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="chatbubble-outline" size={18} color={c.sub} />
          <Text style={{ color: c.sub, fontWeight: '700' }}>{post.comments.length}</Text>
        </View>
        <Pressable hitSlop={8} onPress={() => Share.share({ message: `${post.author} on ZION FIT: ${post.text}` })}>
          <Ionicons name="share-social-outline" size={18} color={c.sub} />
        </Pressable>
      </View>
    </Card>
  );
}

function Feed({ navigation }: any) {
  const c = useColors();
  const { state, update } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const existing = new Set(state.posts.map((p) => p.text));
      const fresh = FRESH.find((f) => !existing.has(f.text));
      if (fresh) update((s) => ({ ...s, posts: [{ ...fresh, id: uid(), date: new Date().toISOString(), liked: false, comments: [] }, ...s.posts] }));
      setRefreshing(false);
    }, 700);
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={state.posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={c.accent} />}
        ListHeaderComponent={<T sub size={12}>Pull down for new posts from the ZION FIT community.</T>}
        renderItem={({ item }) => <PostCard post={item} onPress={() => navigation.navigate('Post', { id: item.id })} />}
      />
      <Pressable onPress={() => navigation.navigate('NewPost')} style={{ position: 'absolute', right: 20, bottom: 20, width: 58, height: 58, borderRadius: 29, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
        <Ionicons name="add" size={30} color={c.onAccent} />
      </Pressable>
    </View>
  );
}

const CHALLENGES = [
  { name: '100km Run', desc: 'Run 100km this month together', icon: 'walk' },
  { name: '30 Day Pushup', desc: '100 push-ups a day for 30 days', icon: 'fitness' },
  { name: 'Academy Sprint', desc: 'Complete 10 academy lessons in 14 days', icon: 'school' },
  { name: 'Protein Streak', desc: 'Hit protein target 7 days straight', icon: 'nutrition' },
];

function Buddy({ navigation }: any) {
  const c = useColors();
  const { state, update, streak } = useStore();
  const monthKm = state.runs.filter((r) => Date.now() - new Date(r.date).getTime() < 30 * 864e5).reduce((a, r) => a + r.km, 0);
  const week = state.sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 7 * 864e5).length;
  const lessons30 = state.completedLessons.length;
  const metrics = [
    ['Workouts / wk', week, 5],
    ['Run km (30d)', Math.round(monthKm * 10) / 10, 12.4],
    ['Streak', streak, 9],
    ['Squat PR kg', state.prs['Back Squat']?.weight ?? 0, 170],
    ['Lessons done', lessons30, 14],
  ] as const;
  const progressFor = (n: string) => (n === '100km Run' ? monthKm / 100 : n === 'Academy Sprint' ? Math.min(1, lessons30 / 10) : n === '30 Day Pushup' ? 0.4 : 0.57);
  const toggle = (n: string) => update((s) => ({ ...s, joinedChallenges: s.joinedChallenges.includes(n) ? s.joinedChallenges.filter((x) => x !== n) : [...s.joinedChallenges, n] }));
  const lastBuddy = [...state.chat].reverse().find((m) => m.from === 'buddy');

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}>
      <Card accent style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar initials="SD" size={52} />
          <View style={{ flex: 1 }}>
            <T bold size={16}>Sipho Dlamini</T>
            <T sub size={12}>Level 12 • Code ZION-4829</T>
          </View>
          <Badge label="● ONLINE" tone="green" />
        </View>
        {lastBuddy && <T sub size={13} numberOfLines={1}>“{lastBuddy.text}”</T>}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button small icon="chatbubbles" title="MESSAGE" onPress={() => navigation.navigate('Chat')} style={{ flex: 1 }} />
          <Button small variant="secondary" icon="flash" title="CHALLENGE" onPress={() => toggle('30 Day Pushup')} style={{ flex: 1 }} />
        </View>
      </Card>

      <Label style={{ marginTop: 8 }}>COMPARE PROGRESS</Label>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row' }}>
          <T sub size={11} style={{ flex: 1 }}>METRIC</T>
          <Text style={{ color: c.accent, fontWeight: '900', fontSize: 11, width: 60, textAlign: 'right' }}>YOU</Text>
          <Text style={{ color: c.sub, fontWeight: '900', fontSize: 11, width: 60, textAlign: 'right' }}>SIPHO</Text>
        </View>
        {metrics.map(([l, me, him]) => (
          <View key={l} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row' }}>
              <T size={13} style={{ flex: 1 }}>{l}</T>
              <Text style={{ color: me >= him ? c.green : c.text, fontWeight: '900', width: 60, textAlign: 'right' }}>{me}</Text>
              <Text style={{ color: c.sub, fontWeight: '700', width: 60, textAlign: 'right' }}>{him}</Text>
            </View>
            <Progress value={me / Math.max(me, him, 1)} height={4} />
          </View>
        ))}
        {!state.settings.privacy.shareWithBuddy && <T sub size={11}>Sharing with buddy is OFF — Sipho can’t see your numbers.</T>}
      </Card>

      <Label style={{ marginTop: 8 }}>SHARED CHALLENGES</Label>
      {CHALLENGES.map((ch) => {
        const joined = state.joinedChallenges.includes(ch.name);
        return (
          <Card key={ch.name} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name={ch.icon as any} size={20} color={c.accent} />
              <View style={{ flex: 1 }}>
                <T bold>{ch.name}</T>
                <T sub size={12}>{ch.desc}</T>
              </View>
              <Button small variant={joined ? 'secondary' : 'primary'} title={joined ? 'JOINED ✓' : 'JOIN'} onPress={() => toggle(ch.name)} />
            </View>
            {joined && <Progress value={progressFor(ch.name)} height={5} />}
          </Card>
        );
      })}

      <Label style={{ marginTop: 8 }}>SHARED ACHIEVEMENTS</Label>
      <Card style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {[['medal', '5 shared'], ['flame', '2 co-streaks'], ['trophy', `${state.joinedChallenges.length} active`]].map(([i, l]) => (
          <View key={l} style={{ alignItems: 'center', gap: 4 }}>
            <Ionicons name={i as any} size={24} color={c.accent} />
            <T size={12} bold>{l}</T>
          </View>
        ))}
      </Card>

      <Card onPress={() => Share.share({ message: 'Train with me on ZION FIT — Faith & Iron. My buddy code: ZION-4829' })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Ionicons name="qr-code" size={26} color={c.accent} />
        <View style={{ flex: 1 }}>
          <Label>BUDDY CODE</Label>
          <Text style={{ fontFamily: HEAD, fontSize: 22, color: c.text }}>ZION-4829</Text>
        </View>
        <T sub size={12}>Invite →</T>
      </Card>
    </ScrollView>
  );
}

function Ladder({ navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const monthKm = state.runs.filter((r) => Date.now() - new Date(r.date).getTime() < 30 * 864e5).reduce((a, r) => a + r.km, 0);
  const sessions30 = state.sessions.filter((s) => Date.now() - new Date(s.date).getTime() < 30 * 864e5).length;
  const mob = state.mobility[state.mobility.length - 1]?.overall ?? 0;
  const myPts = Math.round(monthKm * 10 + sessions30 * 20 + mob);
  const rows = useMemo(() => {
    const others = [
      { name: 'Sipho D.', km: 12.4, pts: 124 + 16 * 20 + 80 },
      { name: 'Lerato M.', km: 11.8, pts: 118 + 14 * 20 + 77 },
      { name: 'Jaco V.', km: 9.2, pts: 92 + 12 * 20 + 70 },
      { name: 'Naledi K.', km: 7.5, pts: 75 + 13 * 20 + 81 },
      { name: 'Pieter B.', km: 4.1, pts: 41 + 15 * 20 + 66 },
      { name: 'Ayanda Z.', km: 15.6, pts: 156 + 8 * 20 + 72 },
    ];
    const me = state.settings.privacy.appearOnLadder ? [{ name: 'You', km: monthKm, pts: myPts }] : [];
    return [...others, ...me].sort((a, b) => b.pts - a.pts).map((r, i) => ({ ...r, pos: i + 1 }));
  }, [monthKm, myPts, state.settings.privacy.appearOnLadder]);

  return (
    <FlatList
      data={rows}
      keyExtractor={(r) => r.name}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 8 }}
      refreshControl={<RefreshControl refreshing={refreshing} tintColor={c.accent} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 600); }} />}
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 6 }}>
          <Card accent style={{ gap: 8 }}>
            <Label color={c.accent}>LADDER WITH GPS RUN • FREE</Label>
            <T sub size={12}>Ranking = run km × 10 + workouts (30d) × 20 + mobility score. GPS verified.</T>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[['YOUR PTS', myPts], ['KM', monthKm.toFixed(1)], ['WORKOUTS', sessions30]].map(([l, v]) => (
                <View key={l as string}>
                  <Text style={{ fontFamily: HEAD, fontSize: 24, color: c.text }}>{v}</Text>
                  <Label style={{ fontSize: 9 }}>{l}</Label>
                </View>
              ))}
            </View>
            <Button icon="navigate" title="JOIN GPS RUN" onPress={() => navigation.navigate('Run')} />
          </Card>
          <Label>LADDER LEADERBOARD • THIS MONTH</Label>
        </View>
      }
      ListFooterComponent={!state.settings.privacy.appearOnLadder ? <T sub size={12} style={{ marginTop: 10 }}>You’re hidden from the ladder (Privacy settings).</T> : null}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: item.name === 'You' ? (c.mode === 'dark' ? '#1d1a0a' : '#FEF9C3') : c.card, borderRadius: 999, borderWidth: 1, borderColor: item.name === 'You' ? c.accent : c.border, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text style={{ fontFamily: HEAD, fontSize: 18, color: item.pos <= 3 ? c.accent : c.sub, width: 30 }}>#{item.pos}</Text>
          <Avatar initials={item.name === 'You' ? initialsOf(state.profile.name) : initialsOf(item.name)} size={30} color={item.name === 'You' ? c.accent : c.card2} />
          <T bold style={{ flex: 1 }}>{item.name}</T>
          <T sub size={12}>{item.km.toFixed(1)} km</T>
          <Text style={{ color: c.text, fontWeight: '900', width: 50, textAlign: 'right' }}>{item.pts}</Text>
        </View>
      )}
    />
  );
}

const TIPS = [
  { icon: 'moon', t: 'Sleep 7-9 hours', b: 'The most powerful recovery tool you have.' },
  { icon: 'nutrition', t: 'Protein every meal', b: '30-40g per meal spreads MPS across the day.' },
  { icon: 'trending-up', t: 'Progressive overload', b: 'Add a rep or 2.5kg each week you can.' },
  { icon: 'heart', t: 'Discipline as worship', b: 'Show up on the hard days. Philippians 4:13.' },
];

function Coach({ navigation }: any) {
  const c = useColors();
  const { state } = useStore();
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 12 }}>
      <Card accent style={{ gap: 10, backgroundColor: c.mode === 'dark' ? '#15130A' : '#FEFCE8' }}>
        <Label color={c.accent}>PERSONALIZED COACHING</Label>
        <H1 size={26}>GET YOUR PERSONALIZED PROGRAM</H1>
        <T sub size={13}>A certified S&C coach builds your training + nutrition plan around your goals, schedule and sport.</T>
        <T size={12} bold>Request status: {state.coaching ? state.coaching.status : 'None'}</T>
        <Button title={state.coaching ? 'VIEW REQUEST' : 'REQUEST A COACH'} icon="person-add" onPress={() => navigation.navigate('Coaching')} />
        <Button variant="ghost" icon="open-outline" title="COACH ON FIVERR" onPress={() => Linking.openURL('https://fiverr.com/s/L3dX4g7')} />
      </Card>
      <Label style={{ marginTop: 8 }}>COACH TIPS</Label>
      {TIPS.map((x) => (
        <Card key={x.t} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Ionicons name={x.icon as any} size={22} color={c.accent} />
          <View style={{ flex: 1 }}>
            <T bold>{x.t}</T>
            <T sub size={12}>{x.b}</T>
          </View>
        </Card>
      ))}
      <Card onPress={() => navigation.navigate('Tabs', { screen: 'Learn' })} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Ionicons name="school" size={22} color={c.green} />
        <View style={{ flex: 1 }}>
          <T bold>Learn to coach yourself</T>
          <T sub size={12}>21 free S&C Academy topics</T>
        </View>
        <Ionicons name="chevron-forward" size={18} color={c.muted} />
      </Card>
    </ScrollView>
  );
}
