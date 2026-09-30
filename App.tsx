import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoreProvider, useStore } from './lib/store';
import { HEAD, useColors } from './lib/theme';

import HomeScreen from './screens/HomeScreen';
import TrainScreen from './screens/TrainScreen';
import FuelScreen from './screens/FuelScreen';
import LearnScreen from './screens/LearnScreen';
import SquadScreen from './screens/SquadScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import ProgramDetailScreen from './screens/ProgramDetailScreen';
import WorkoutSessionScreen from './screens/WorkoutSessionScreen';
import EditExerciseScreen from './screens/EditExerciseScreen';
import FoodSearchScreen from './screens/FoodSearchScreen';
import CustomFoodScreen from './screens/CustomFoodScreen';
import MealPlannerScreen from './screens/MealPlannerScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import NutritionProgramScreen from './screens/NutritionProgramScreen';
import TopicScreen from './screens/TopicScreen';
import LessonScreen from './screens/LessonScreen';
import QuizScreen from './screens/QuizScreen';
import ChatScreen from './screens/ChatScreen';
import NewPostScreen from './screens/NewPostScreen';
import PostScreen from './screens/PostScreen';
import RunScreen from './screens/RunScreen';
import RecoveryScreen from './screens/RecoveryScreen';
import LogRecoveryScreen from './screens/LogRecoveryScreen';
import BreatheScreen from './screens/BreatheScreen';
import MobilityScreen from './screens/MobilityScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PaywallScreen from './screens/PaywallScreen';
import CoachingScreen from './screens/CoachingScreen';
import DevotionalScreen from './screens/DevotionalScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, [React.ComponentProps<typeof Ionicons>['name'], React.ComponentProps<typeof Ionicons>['name']]> = {
  Home: ['home', 'home-outline'],
  Train: ['barbell', 'barbell-outline'],
  Fuel: ['nutrition', 'nutrition-outline'],
  Learn: ['school', 'school-outline'],
  Squad: ['people', 'people-outline'],
};

function Tabs() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.mode === 'dark' ? '#0C0C0D' : '#fff', borderTopColor: c.border, height: 60 + insets.bottom, paddingTop: 6 },
        tabBarLabelStyle: { fontWeight: '800', fontSize: 10, letterSpacing: 0.6 },
        tabBarIcon: ({ focused, color, size }) => <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size - 2} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Train" component={TrainScreen} />
      <Tab.Screen name="Fuel" component={FuelScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Squad" component={SquadScreen} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready, state } = useStore();
  const c = useColors();
  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Text style={{ fontFamily: HEAD, fontSize: 40, color: c.accent }}>ZION FIT</Text>
        <ActivityIndicator color={c.accent} />
      </View>
    );
  }
  const navTheme = c.mode === 'dark' ? DarkTheme : DefaultTheme;
  const modal = { presentation: 'modal' as const };
  return (
    <NavigationContainer theme={{ ...navTheme, colors: { ...navTheme.colors, background: c.bg, card: c.bg, primary: c.accent, text: c.text, border: c.border } }}>
      <StatusBar style={c.mode === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.accent,
          headerTitleStyle: { fontFamily: HEAD, fontSize: 20, color: c.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: c.bg },
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        {!state.onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'EXERCISE' }} />
            <Stack.Screen name="ProgramDetail" component={ProgramDetailScreen} options={{ title: 'PROTOCOL' }} />
            <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} options={{ title: 'SESSION', gestureEnabled: false }} />
            <Stack.Screen name="EditExercise" component={EditExerciseScreen} options={{ ...modal, title: 'EDIT EXERCISE' }} />
            <Stack.Screen name="FoodSearch" component={FoodSearchScreen} options={{ ...modal, title: 'FOOD DATABASE' }} />
            <Stack.Screen name="CustomFood" component={CustomFoodScreen} options={{ ...modal, title: 'CUSTOM FOOD' }} />
            <Stack.Screen name="MealPlanner" component={MealPlannerScreen} options={{ title: 'MEAL PLANNER' }} />
            <Stack.Screen name="ShoppingList" component={ShoppingListScreen} options={{ title: 'SHOPPING LIST' }} />
            <Stack.Screen name="NutritionProgram" component={NutritionProgramScreen} options={{ title: 'NUTRITION PROGRAM' }} />
            <Stack.Screen name="Topic" component={TopicScreen} options={{ title: 'ACADEMY' }} />
            <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'LESSON' }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'QUIZ' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'SIPHO DLAMINI' }} />
            <Stack.Screen name="NewPost" component={NewPostScreen} options={{ ...modal, title: 'NEW POST' }} />
            <Stack.Screen name="Post" component={PostScreen} options={{ title: 'POST' }} />
            <Stack.Screen name="Run" component={RunScreen} options={{ title: 'GPS RUN' }} />
            <Stack.Screen name="Recovery" component={RecoveryScreen} options={{ title: 'RECOVERY' }} />
            <Stack.Screen name="LogRecovery" component={LogRecoveryScreen} options={{ ...modal, title: 'LOG RECOVERY' }} />
            <Stack.Screen name="Breathe" component={BreatheScreen} options={{ ...modal, title: 'BREATHE' }} />
            <Stack.Screen name="Mobility" component={MobilityScreen} options={{ title: 'MOBILITY ASSESSMENT' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'PROFILE' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ ...modal, title: 'EDIT PROFILE & GOALS' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'SETTINGS' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'NOTIFICATIONS' }} />
            <Stack.Screen name="Paywall" component={PaywallScreen} options={{ ...modal, headerShown: false }} />
            <Stack.Screen name="Coaching" component={CoachingScreen} options={{ title: 'PERSONAL COACHING' }} />
            <Stack.Screen name="Devotional" component={DevotionalScreen} options={{ title: 'FAITH & IRON' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font, Anton_400Regular });
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#080808' }} />;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <Root />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
