import { mulberry32 } from './utils';

/* ------------------------------ EXERCISES ------------------------------ */
export const MUSCLES = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'hip flexors', 'full body'];
export const EQUIPMENT = ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine', 'resistance band', 'bench', 'pull-up bar', 'medicine ball', 'plyometric box', 'sled', 'bodyweight'];
export const CATEGORIES = ['strength', 'hypertrophy', 'power', 'plyometrics', 'speed', 'conditioning', 'mobility', 'recovery', 'bodyweight', 'sport performance'];
export const DIFFICULTY = ['beginner', 'intermediate', 'advanced', 'elite'];
export const PATTERNS = ['squat', 'hinge', 'push', 'pull', 'carry', 'rotation', 'locomotion', 'jump', 'landing'];

// [name, muscle, equipment, category, pattern]
const BASE: [string, string, string, string, string][] = [
  ['Bench Press', 'chest', 'barbell', 'strength', 'push'],
  ['Incline Bench', 'chest', 'barbell', 'hypertrophy', 'push'],
  ['Decline Press', 'chest', 'barbell', 'hypertrophy', 'push'],
  ['Chest Fly', 'chest', 'dumbbell', 'hypertrophy', 'push'],
  ['Push-Up', 'chest', 'bodyweight', 'bodyweight', 'push'],
  ['Dips', 'chest', 'bodyweight', 'strength', 'push'],
  ['Cable Crossover', 'chest', 'cable', 'hypertrophy', 'push'],
  ['Bent-Over Row', 'back', 'barbell', 'strength', 'pull'],
  ['Lat Pulldown', 'back', 'cable', 'hypertrophy', 'pull'],
  ['Pull-Up', 'back', 'pull-up bar', 'strength', 'pull'],
  ['Seated Row', 'back', 'cable', 'hypertrophy', 'pull'],
  ['T-Bar Row', 'back', 'barbell', 'strength', 'pull'],
  ['Face Pull', 'shoulders', 'cable', 'hypertrophy', 'pull'],
  ['Deadlift', 'hamstrings', 'barbell', 'strength', 'hinge'],
  ['Romanian Deadlift', 'hamstrings', 'barbell', 'hypertrophy', 'hinge'],
  ['Sumo Deadlift', 'glutes', 'barbell', 'strength', 'hinge'],
  ['Trap Bar Deadlift', 'full body', 'barbell', 'strength', 'hinge'],
  ['Good Morning', 'hamstrings', 'barbell', 'strength', 'hinge'],
  ['Hip Thrust', 'glutes', 'barbell', 'hypertrophy', 'hinge'],
  ['Glute Bridge', 'glutes', 'bodyweight', 'bodyweight', 'hinge'],
  ['Back Squat', 'quadriceps', 'barbell', 'strength', 'squat'],
  ['Front Squat', 'quadriceps', 'barbell', 'strength', 'squat'],
  ['Goblet Squat', 'quadriceps', 'kettlebell', 'hypertrophy', 'squat'],
  ['Bulgarian Split Squat', 'quadriceps', 'dumbbell', 'hypertrophy', 'squat'],
  ['Lunges', 'quadriceps', 'dumbbell', 'hypertrophy', 'locomotion'],
  ['Step-Up', 'glutes', 'bench', 'sport performance', 'locomotion'],
  ['Pistol Squat', 'quadriceps', 'bodyweight', 'bodyweight', 'squat'],
  ['Overhead Press', 'shoulders', 'barbell', 'strength', 'push'],
  ['Lateral Raise', 'shoulders', 'dumbbell', 'hypertrophy', 'push'],
  ['Rear Delt Fly', 'shoulders', 'dumbbell', 'hypertrophy', 'pull'],
  ['Arnold Press', 'shoulders', 'dumbbell', 'hypertrophy', 'push'],
  ['Upright Row', 'shoulders', 'barbell', 'hypertrophy', 'pull'],
  ['Shrug', 'back', 'dumbbell', 'hypertrophy', 'carry'],
  ['Barbell Curl', 'biceps', 'barbell', 'hypertrophy', 'pull'],
  ['Hammer Curl', 'biceps', 'dumbbell', 'hypertrophy', 'pull'],
  ['Preacher Curl', 'biceps', 'machine', 'hypertrophy', 'pull'],
  ['Concentration Curl', 'biceps', 'dumbbell', 'hypertrophy', 'pull'],
  ['Chin-Up', 'biceps', 'pull-up bar', 'strength', 'pull'],
  ['Tricep Pushdown', 'triceps', 'cable', 'hypertrophy', 'push'],
  ['Skull Crusher', 'triceps', 'barbell', 'hypertrophy', 'push'],
  ['Overhead Tricep Extension', 'triceps', 'dumbbell', 'hypertrophy', 'push'],
  ['Diamond Push-Up', 'triceps', 'bodyweight', 'bodyweight', 'push'],
  ['Close Grip Bench', 'triceps', 'barbell', 'strength', 'push'],
  ['Wrist Curl', 'forearms', 'dumbbell', 'hypertrophy', 'pull'],
  ["Farmer's Carry", 'forearms', 'dumbbell', 'conditioning', 'carry'],
  ['Plank', 'core', 'bodyweight', 'bodyweight', 'rotation'],
  ['Russian Twist', 'core', 'medicine ball', 'conditioning', 'rotation'],
  ['Hanging Leg Raise', 'hip flexors', 'pull-up bar', 'bodyweight', 'rotation'],
  ['Ab Wheel', 'core', 'bodyweight', 'strength', 'rotation'],
  ['Cable Woodchopper', 'core', 'cable', 'sport performance', 'rotation'],
  ['Calf Raise', 'calves', 'machine', 'hypertrophy', 'locomotion'],
  ['Seated Calf Raise', 'calves', 'machine', 'hypertrophy', 'locomotion'],
  ['Nordic Hamstring Curl', 'hamstrings', 'bodyweight', 'strength', 'hinge'],
  ['Leg Curl', 'hamstrings', 'machine', 'hypertrophy', 'hinge'],
  ['Leg Extension', 'quadriceps', 'machine', 'hypertrophy', 'squat'],
  ['Leg Press', 'quadriceps', 'machine', 'hypertrophy', 'squat'],
  ['Box Jump', 'full body', 'plyometric box', 'plyometrics', 'jump'],
  ['Depth Jump', 'full body', 'plyometric box', 'plyometrics', 'landing'],
  ['Broad Jump', 'glutes', 'bodyweight', 'power', 'jump'],
  ['Tuck Jump', 'full body', 'bodyweight', 'plyometrics', 'jump'],
  ['Single-Leg Bound', 'glutes', 'bodyweight', 'speed', 'locomotion'],
  ['Pogo Hop', 'calves', 'bodyweight', 'plyometrics', 'jump'],
  ['Sled Push', 'full body', 'sled', 'conditioning', 'locomotion'],
  ['Sled Pull', 'full body', 'sled', 'conditioning', 'locomotion'],
  ['Battle Ropes', 'shoulders', 'bodyweight', 'conditioning', 'rotation'],
  ['Burpee', 'full body', 'bodyweight', 'conditioning', 'jump'],
  ['Mountain Climber', 'core', 'bodyweight', 'conditioning', 'locomotion'],
  ['Kettlebell Swing', 'glutes', 'kettlebell', 'power', 'hinge'],
  ['Clean', 'full body', 'barbell', 'power', 'hinge'],
  ['Snatch', 'full body', 'barbell', 'power', 'hinge'],
  ['Jerk', 'full body', 'barbell', 'power', 'push'],
  ['Thruster', 'full body', 'barbell', 'conditioning', 'squat'],
  ['Wall Ball', 'full body', 'medicine ball', 'conditioning', 'squat'],
  ['Med Ball Slam', 'core', 'medicine ball', 'power', 'rotation'],
  ['Med Ball Throw', 'chest', 'medicine ball', 'power', 'push'],
  ['Clap Push-Up', 'chest', 'bodyweight', 'plyometrics', 'push'],
  ['Muscle-Up', 'back', 'pull-up bar', 'bodyweight', 'pull'],
  ['L-Sit', 'core', 'bodyweight', 'bodyweight', 'rotation'],
  ['Handstand Push-Up', 'shoulders', 'bodyweight', 'bodyweight', 'push'],
  ['Plyo Push-Up', 'chest', 'bodyweight', 'plyometrics', 'push'],
  ['Resistance Band Pull-Apart', 'shoulders', 'resistance band', 'mobility', 'pull'],
  ['Band Chest Press', 'chest', 'resistance band', 'bodyweight', 'push'],
  ['Hip 90/90 Switch', 'hip flexors', 'bodyweight', 'mobility', 'rotation'],
  ['Couch Stretch', 'hip flexors', 'bodyweight', 'mobility', 'locomotion'],
  ['T-Spine Rotation', 'back', 'bodyweight', 'mobility', 'rotation'],
  ['Ankle Dorsiflexion Rock', 'calves', 'bodyweight', 'mobility', 'squat'],
  ['Foam Roll Quads', 'quadriceps', 'bodyweight', 'recovery', 'locomotion'],
  ['A-Skip', 'hip flexors', 'bodyweight', 'speed', 'locomotion'],
  ['Flying 20m Sprint', 'full body', 'bodyweight', 'speed', 'locomotion'],
  ['5-10-5 Shuttle', 'full body', 'bodyweight', 'speed', 'locomotion'],
];

const VARIANTS = ['', ' Tempo', ' Paused', ' Eccentric', ' Isometric Hold', ' Single-Arm', ' Single-Leg', ' Deficit', ' Banded', ' Chain', ' Wide Grip', ' Close Grip', ' Neutral Grip'];
const TIPS = ['Keep core braced and ribs down.', 'Exhale on exertion, breathe in on the lowering phase.', 'Control the eccentric — own every inch.', 'Use full range of motion before adding load.', 'Drive with intent: move the bar fast on the way up.', 'Set your feet, grip hard, create full-body tension.'];
const VARIANT_NOTE: Record<string, string> = {
  '': 'The foundational version of the movement.',
  ' Tempo': 'Use a 3-1-1 tempo to build positional strength and time under tension.',
  ' Paused': 'Pause 2s at the hardest position to kill the stretch-reflex and build strength out of the hole.',
  ' Eccentric': 'Lower over 4-5 seconds. Eccentric overload drives hypertrophy and tendon resilience.',
  ' Isometric Hold': 'Hold the mid-range position for 20-45s. Great for joint strength and pain-free loading.',
  ' Single-Arm': 'Unilateral loading to fix side-to-side imbalances and challenge anti-rotation.',
  ' Single-Leg': 'Unilateral lower body loading for balance, hip stability and sport transfer.',
  ' Deficit': 'Increased range of motion for more stretch-mediated hypertrophy.',
  ' Banded': 'Accommodating resistance: harder at lockout, trains rate of force development.',
  ' Chain': 'Chains add load as you rise, matching your strength curve.',
  ' Wide Grip': 'Shifts emphasis to the outer fibres and shortens range of motion.',
  ' Close Grip': 'Shifts emphasis to triceps / inner fibres with elbows tucked.',
  ' Neutral Grip': 'Palms facing each other — shoulder-friendly option.',
};

export type Exercise = {
  id: number;
  name: string;
  base: string;
  muscle: string;
  equipment: string;
  category: string;
  difficulty: string;
  pattern: string;
  description: string;
  tip: string;
  recommended: boolean;
};

function buildExercises(): Exercise[] {
  const rnd = mulberry32(4813);
  const combos: [number, number][] = [];
  for (let v = 1; v < VARIANTS.length; v++) {
    for (let i = 0; i < BASE.length; i++) {
      const pattern = BASE[i][4];
      const variant = VARIANTS[v];
      if (variant === ' Single-Leg' && !['squat', 'hinge', 'locomotion', 'jump'].includes(pattern)) continue;
      if (variant === ' Single-Arm' && !['push', 'pull', 'carry'].includes(pattern)) continue;
      if (variant.includes('Grip') && !['push', 'pull'].includes(pattern)) continue;
      combos.push([i, v]);
    }
  }
  for (let k = combos.length - 1; k > 0; k--) {
    const j = Math.floor(rnd() * (k + 1));
    [combos[k], combos[j]] = [combos[j], combos[k]];
  }
  const picked: [number, number][] = [...BASE.map((_, i) => [i, 0] as [number, number]), ...combos].slice(0, 420);
  picked.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return picked.map(([i, v], idx) => {
    const [name, muscle, equipment, category, pattern] = BASE[i];
    const variant = VARIANTS[v];
    const full = name + variant;
    const diffIdx = Math.min(3, Math.floor(rnd() * 3) + (v > 3 ? 1 : 0));
    return {
      id: idx + 1,
      name: full,
      base: name,
      muscle,
      equipment,
      category,
      difficulty: DIFFICULTY[diffIdx],
      pattern,
      description: `${full} develops the ${muscle} using ${equipment === 'bodyweight' ? 'your bodyweight' : 'a ' + equipment}. ${VARIANT_NOTE[variant]} Primary pattern: ${pattern}. Built for ${category}.`,
      tip: TIPS[(i + v) % TIPS.length],
      recommended: rnd() > 0.93,
    };
  });
}

export const EXERCISES = buildExercises();

/* ------------------------------ FOODS ------------------------------ */
export type Food = {
  id: string;
  name: string;
  category: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calcium: number;
  iron: number;
  magnesium: number;
  tags: string[];
  isSA: boolean;
  custom?: boolean;
};

// name, category, kcal, P, C, F, Ca, Fe, Mg, SA, serving
const F: [string, string, number, number, number, number, number, number, number, boolean, string][] = [
  ['Boerewors', 'meat', 320, 14, 2, 28, 20, 1.8, 18, true, '100g'],
  ['Biltong (Beef)', 'meat', 280, 45, 3, 8, 15, 4.2, 30, true, '100g'],
  ['Droëwors', 'meat', 450, 35, 1, 35, 25, 3.5, 22, true, '100g'],
  ['Chicken Breast', 'chicken', 165, 31, 0, 3.6, 11, 0.7, 29, false, '100g'],
  ['Chicken Thigh', 'chicken', 209, 26, 0, 10, 12, 1.1, 22, false, '100g'],
  ['Chicken Livers', 'chicken', 167, 24, 1, 6.5, 11, 9, 19, true, '100g'],
  ['Ostrich Steak', 'meat', 145, 26, 0, 3, 10, 3.2, 27, true, '100g'],
  ['Lamb Chops', 'meat', 294, 25, 0, 21, 18, 1.9, 21, true, '100g'],
  ['Beef Mince Lean', 'meat', 176, 26, 0, 8, 16, 2.6, 21, false, '100g'],
  ['Beef Sirloin', 'meat', 271, 26, 0, 18, 19, 3, 22, false, '100g'],
  ['Steak Rump', 'meat', 250, 27, 0, 15, 18, 2.8, 23, true, '100g'],
  ['Ribeye', 'meat', 291, 24, 0, 22, 12, 2.2, 21, false, '100g'],
  ['Venison', 'meat', 158, 30, 0, 3.2, 7, 4.5, 24, true, '100g'],
  ['Pork Chops', 'meat', 231, 26, 0, 14, 19, 0.9, 25, false, '100g'],
  ['Goat Meat', 'meat', 143, 27, 0, 3, 17, 3.7, 22, true, '100g'],
  ['Tripe / Mogodu', 'meat', 85, 12, 0, 4, 69, 0.6, 13, true, '100g'],
  ['Beef Liver', 'meat', 135, 20, 4, 3.6, 5, 4.9, 18, false, '100g'],
  ['Turkey Breast', 'chicken', 135, 30, 0, 1, 10, 0.7, 28, false, '100g'],
  ['Hake Fillet', 'fish', 111, 22, 0, 1.5, 40, 0.4, 35, true, '100g'],
  ['Snoek Smoked', 'fish', 200, 22, 0, 12, 30, 0.9, 28, true, '100g'],
  ['Salmon Atlantic', 'fish', 208, 20, 0, 13, 12, 0.8, 29, false, '100g'],
  ['Tuna Canned', 'fish', 144, 30, 0, 1, 11, 1.3, 27, false, '100g'],
  ['Pilchards in Tomato', 'fish', 185, 20, 2, 10, 250, 2.2, 35, true, '100g'],
  ['Sardines', 'fish', 208, 25, 0, 11, 382, 2.9, 39, false, '100g'],
  ['Mackerel', 'fish', 205, 19, 0, 14, 12, 1.6, 76, false, '100g'],
  ['Large Eggs', 'eggs', 140, 12, 1, 10, 56, 1.1, 12, false, '2 eggs'],
  ['Egg Whites', 'eggs', 52, 11, 0.7, 0.2, 7, 0.1, 11, false, '100g'],
  ['Full Cream Milk', 'dairy', 62, 3.2, 4.8, 3.3, 120, 0.1, 10, false, '100ml'],
  ['Amasi', 'dairy', 75, 3.5, 5, 4.5, 140, 0.2, 12, true, '100ml'],
  ['Plain Yogurt', 'dairy', 59, 3.5, 5, 3.3, 110, 0.1, 11, false, '100g'],
  ['Greek Yogurt', 'dairy', 97, 9, 4, 5, 100, 0.1, 11, false, '100g'],
  ['Cheddar Cheese', 'dairy', 402, 25, 1.3, 33, 721, 0.7, 28, false, '100g'],
  ['Cottage Cheese', 'dairy', 98, 11, 3.4, 4.3, 83, 0.1, 8, false, '100g'],
  ['Paneer', 'dairy', 265, 18, 3, 20, 480, 0.2, 8, false, '100g'],
  ['White Rice Cooked', 'rice', 130, 2.4, 28, 0.2, 10, 0.2, 12, false, '100g'],
  ['Brown Rice', 'rice', 123, 2.7, 25, 1, 11, 0.4, 39, false, '100g'],
  ['Pap / Maize Meal', 'rice', 115, 2.1, 24, 0.5, 3, 0.4, 18, true, '100g'],
  ['Samp & Beans', 'rice', 150, 5, 28, 1, 20, 1.2, 45, true, '100g'],
  ['Quinoa Cooked', 'rice', 120, 4.4, 21, 1.9, 17, 1.5, 64, false, '100g'],
  ['Millet', 'rice', 119, 3.5, 24, 1, 3, 0.6, 44, true, '100g'],
  ['Pasta Cooked', 'pasta', 158, 5.8, 30, 0.9, 7, 1.3, 18, false, '100g'],
  ['Whole Wheat Pasta', 'pasta', 149, 6, 30, 1, 12, 1.8, 42, false, '100g'],
  ['Brown Bread', 'bread', 160, 5, 30, 1.5, 80, 1.5, 22, false, '2 slices'],
  ['White Bread', 'bread', 265, 9, 49, 3.2, 150, 2.5, 20, false, '100g'],
  ['Roti', 'bread', 300, 7, 45, 10, 20, 2, 30, true, '1 roti'],
  ['Vetkoek', 'bread', 350, 6, 40, 18, 15, 1.8, 16, true, '1 vetkoek'],
  ['Wors Roll', 'bread', 420, 18, 38, 22, 60, 2.4, 25, true, '1 roll'],
  ['Broccoli', 'vegetables', 34, 2.8, 7, 0.4, 47, 0.7, 21, false, '100g'],
  ['Spinach / Morogo', 'vegetables', 23, 2.9, 3.6, 0.4, 99, 2.7, 79, true, '100g'],
  ['Butternut', 'vegetables', 45, 1, 11, 0.1, 48, 0.7, 34, true, '100g'],
  ['Sweet Potato', 'vegetables', 86, 1.6, 20, 0.1, 30, 0.6, 25, false, '100g'],
  ['Potatoes', 'vegetables', 77, 2, 17, 0.1, 12, 0.8, 23, false, '100g'],
  ['Carrots', 'vegetables', 41, 0.9, 10, 0.2, 33, 0.3, 12, false, '100g'],
  ['Green Beans', 'vegetables', 31, 1.8, 7, 0.2, 37, 1, 25, false, '100g'],
  ['Cabbage', 'vegetables', 25, 1.3, 6, 0.1, 40, 0.5, 12, false, '100g'],
  ['Tomatoes', 'vegetables', 18, 0.9, 3.9, 0.2, 10, 0.3, 11, false, '100g'],
  ['Gem Squash', 'vegetables', 40, 1, 9, 0.1, 30, 0.6, 20, true, '100g'],
  ['Beetroot', 'vegetables', 43, 1.6, 10, 0.2, 16, 0.8, 23, false, '100g'],
  ['Mielie (Sweet Corn)', 'vegetables', 96, 3.4, 21, 1.5, 3, 0.5, 37, true, '1 cob'],
  ['Chakalaka', 'sauces', 70, 2, 10, 2.5, 25, 1, 15, true, '100g'],
  ['Banana', 'fruit', 89, 1.1, 23, 0.3, 5, 0.3, 27, false, '1 medium'],
  ['Apple', 'fruit', 52, 0.3, 14, 0.2, 6, 0.1, 5, false, '1 medium'],
  ['Naartjie', 'fruit', 53, 0.8, 13, 0.3, 37, 0.1, 12, true, '1 fruit'],
  ['Orange', 'fruit', 47, 0.9, 12, 0.1, 40, 0.1, 10, false, '1 fruit'],
  ['Mango', 'fruit', 60, 0.8, 15, 0.4, 11, 0.2, 10, false, '100g'],
  ['Pineapple', 'fruit', 50, 0.5, 13, 0.1, 13, 0.3, 12, false, '100g'],
  ['Watermelon', 'fruit', 30, 0.6, 8, 0.2, 7, 0.2, 10, false, '100g'],
  ['Avocado', 'fruit', 160, 2, 9, 15, 12, 0.6, 29, true, '100g'],
  ['Blueberries', 'fruit', 57, 0.7, 14, 0.3, 6, 0.3, 6, false, '100g'],
  ['Dates', 'fruit', 282, 2.5, 75, 0.4, 39, 1, 43, false, '100g'],
  ['Almonds', 'nuts', 579, 21, 22, 50, 269, 3.7, 270, false, '100g'],
  ['Peanuts Roasted', 'nuts', 585, 24, 21, 50, 54, 2.3, 176, true, '100g'],
  ['Cashews', 'nuts', 553, 18, 30, 44, 37, 6.7, 292, false, '100g'],
  ['Peanut Butter', 'nuts', 588, 25, 20, 50, 43, 1.9, 154, false, '100g'],
  ['Macadamia Nuts', 'nuts', 718, 8, 14, 76, 85, 3.7, 130, true, '100g'],
  ['Chia Seeds', 'seeds', 486, 17, 42, 31, 631, 7.7, 335, false, '100g'],
  ['Pumpkin Seeds', 'seeds', 559, 30, 11, 49, 46, 8.8, 592, false, '100g'],
  ['Sunflower Seeds', 'seeds', 584, 21, 20, 51, 78, 5.3, 325, false, '100g'],
  ['Lentils Cooked', 'legumes', 116, 9, 20, 0.4, 19, 3.3, 36, false, '100g'],
  ['Chickpeas', 'legumes', 164, 8.9, 27, 2.6, 49, 2.9, 48, false, '100g'],
  ['Sugar Beans', 'legumes', 127, 8.7, 23, 0.5, 35, 2.2, 45, true, '100g'],
  ['Kidney Beans', 'legumes', 127, 8.7, 23, 0.5, 28, 2.9, 45, false, '100g'],
  ['Tofu', 'legumes', 144, 17, 3, 9, 350, 2.7, 58, false, '100g'],
  ['Oats Rolled', 'cereals', 389, 17, 66, 7, 54, 4.7, 177, false, '100g'],
  ['FutureLife', 'cereals', 402, 18, 60, 8, 400, 7, 100, true, '100g'],
  ['Weet-Bix', 'cereals', 355, 12, 68, 1.4, 35, 11, 110, true, '100g'],
  ['Muesli', 'cereals', 370, 10, 66, 6, 50, 3, 80, false, '100g'],
  ['Peri-Peri Sauce', 'sauces', 90, 1, 6, 7, 10, 0.5, 8, true, '100g'],
  ['Olive Oil', 'sauces', 119, 0, 0, 13.5, 0, 0.1, 0, false, '1 tbsp'],
  ['Rooibos Tea', 'drinks', 2, 0, 0.3, 0, 7, 0.1, 2, true, '250ml'],
  ['Black Coffee', 'drinks', 2, 0.3, 0, 0, 5, 0, 7, false, '250ml'],
  ['Bone Broth', 'drinks', 40, 9, 0.5, 0.5, 10, 0.5, 5, false, '250ml'],
  ['Protein Shake Whey', 'supplements', 120, 24, 3, 1.5, 120, 0.3, 30, false, '1 scoop'],
  ['Casein Protein', 'supplements', 120, 24, 3, 1, 500, 0.5, 20, false, '1 scoop'],
  ['Mass Gainer', 'supplements', 640, 50, 100, 6, 300, 4, 80, false, '1 serving'],
  ['Creatine Monohydrate', 'supplements', 0, 0, 0, 0, 0, 0, 0, false, '5g'],
  ['Magnesium Citrate', 'supplements', 0, 0, 0, 0, 0, 0, 200, false, '1 tablet'],
  ['Calcium Carbonate', 'supplements', 0, 0, 0, 0, 500, 0, 0, false, '1 tablet'],
  ['Electrolyte Drink', 'supplements', 25, 0, 6, 0, 20, 0, 25, false, '500ml'],
  ['Omega-3 Fish Oil', 'supplements', 10, 0, 0, 1, 0, 0, 0, false, '1 capsule'],
  ['Vitamin D3', 'supplements', 0, 0, 0, 0, 0, 0, 0, false, '1 capsule'],
];

const PREPS: { suffix: string; mult: number; serving?: string }[] = [
  { suffix: '', mult: 1 },
  { suffix: ' · Small', mult: 0.5 },
  { suffix: ' · Medium', mult: 0.75 },
  { suffix: ' · Large', mult: 1.5 },
  { suffix: ' · Double', mult: 2 },
];

function tagFor(p: number, c: number, kcal: number, ca: number, fe: number, mg: number, cat: string) {
  const t: string[] = [];
  if (p >= 15) t.push('high protein');
  if (c >= 20) t.push('high carbohydrate');
  if (kcal > 0 && kcal <= 120) t.push('low calorie');
  if (ca >= 100) t.push('high calcium');
  if (fe >= 2.5) t.push('high iron');
  if (mg >= 60) t.push('high magnesium');
  if (!['meat', 'chicken', 'fish'].includes(cat)) t.push('vegetarian');
  return t;
}

function buildFoods(): Food[] {
  const out: Food[] = [];
  for (const pr of PREPS) {
    F.forEach(([name, category, kcal, p, c, f, ca, fe, mg, sa, serving], i) => {
      if (pr.mult !== 1 && category === 'supplements' && kcal === 0) return;
      const m = pr.mult;
      const r1 = (n: number) => Math.round(n * m * 10) / 10;
      out.push({
        id: `f${i}_${m}`,
        name: name + pr.suffix,
        category,
        serving: m === 1 ? serving : `${m}× ${serving}`,
        calories: Math.round(kcal * m),
        protein: r1(p),
        carbs: r1(c),
        fat: r1(f),
        calcium: Math.round(ca * m),
        iron: r1(fe),
        magnesium: Math.round(mg * m),
        tags: tagFor(p * m, c * m, kcal * m, ca * m, fe * m, mg * m, category),
        isSA: sa,
      });
    });
  }
  return out;
}

export const FOODS = buildFoods();
export const FOOD_CATEGORIES = ['meat', 'chicken', 'fish', 'eggs', 'dairy', 'rice', 'pasta', 'bread', 'vegetables', 'fruit', 'nuts', 'seeds', 'legumes', 'cereals', 'sauces', 'drinks', 'supplements'];

/* ------------------------------ TRAINING PROTOCOLS (PREMIUM) ------------------------------ */
export type ProtocolSession = { day: string; name: string; exercises: string[] };
export type Protocol = {
  id: string;
  name: string;
  type: string;
  duration: string;
  level: string;
  description: string;
  icon: string;
  weeks: { week: number; focus: string; sessions: ProtocolSession[] }[];
};

export const PROTOCOLS: Protocol[] = [
  {
    id: 'hyper', name: 'ZION HYPERTROPHY PROTOCOL', type: 'hypertrophy', duration: '6 Weeks', level: 'Intermediate', icon: 'body',
    description: 'Mechanical tension + metabolic stress. 5x week push/pull/legs split with myo-reps & lengthened partials.',
    weeks: [
      { week: 1, focus: 'Foundation & Volume', sessions: [
        { day: 'Mon', name: 'Upper Pump', exercises: ['Incline Bench 4x10', 'Chest Fly Eccentric 3x12', 'Lateral Raise 4x15', 'Barbell Curl 3x12'] },
        { day: 'Tue', name: 'Lower Density', exercises: ['Back Squat 4x8', 'Romanian Deadlift 3x10', 'Leg Extension Isometric Hold 3x30', 'Calf Raise 4x20'] },
        { day: 'Thu', name: 'Pull Volume', exercises: ['Pull-Up 4x8', 'Seated Row 4x12', 'Face Pull 3x15', 'Hammer Curl 3x12'] },
      ] },
      { week: 2, focus: 'Overload', sessions: [
        { day: 'Mon', name: 'Push Hypertrophy', exercises: ['Bench Press 4x8', 'Overhead Press 3x10', 'Tricep Pushdown 4x12'] },
        { day: 'Wed', name: 'Pull Hypertrophy', exercises: ['Pull-Up 4x8', 'Bent-Over Row 4x10', 'Face Pull 3x15'] },
        { day: 'Fri', name: 'Legs Lengthened', exercises: ['Bulgarian Split Squat 3x10', 'Romanian Deadlift Deficit 3x8', 'Leg Press 3x15'] },
      ] },
    ],
  },
  {
    id: 'iso', name: 'ISOMETRIC FORTRESS', type: 'isometrics', duration: '4 Weeks', level: 'Advanced', icon: 'shield',
    description: 'Yielding & overcoming isometrics for joint strength and tendon resilience. Faith holds under pressure.',
    weeks: [
      { week: 1, focus: 'Yielding Isos', sessions: [
        { day: 'Mon', name: 'Isometric Lower', exercises: ['Wall Sit 3x45', 'Split Squat Hold 3x30', 'Nordic Hamstring Curl Hold 3x10'] },
        { day: 'Thu', name: 'Isometric Upper', exercises: ['Push-Up Isometric Hold 3x30', 'Pull-Up Isometric Hold 3x20', 'Plank 3x60'] },
      ] },
      { week: 2, focus: 'Overcoming Isos', sessions: [
        { day: 'Mon', name: 'Pin Press & Pull', exercises: ['Bench Press Isometric Hold 5x6', 'Deadlift Isometric Hold 5x6', 'L-Sit 4x15'] },
      ] },
    ],
  },
  {
    id: 'power', name: 'POWER & EXPLOSION', type: 'power', duration: '5 Weeks', level: 'Advanced', icon: 'flash',
    description: 'Force-velocity profiling, Olympic lifts, med ball throws, contrast training.',
    weeks: [
      { week: 1, focus: 'Rate of Force Development', sessions: [
        { day: 'Mon', name: 'Power Day', exercises: ['Clean 5x3', 'Box Jump 5x3', 'Sled Push 4x20'] },
        { day: 'Thu', name: 'Contrast Day', exercises: ['Back Squat 4x3', 'Broad Jump 4x3', 'Med Ball Throw 4x5'] },
      ] },
      { week: 2, focus: 'Velocity', sessions: [
        { day: 'Mon', name: 'Olympic Complex', exercises: ['Snatch 6x2', 'Jerk 5x2', 'Depth Jump 4x4'] },
      ] },
    ],
  },
  {
    id: 'ecc', name: 'ECCENTRIC OVERLOAD', type: 'eccentric', duration: '4 Weeks', level: 'Elite', icon: 'arrow-down-circle',
    description: 'Controlled lengthening, flywheel & tempo work for hypertrophy + injury resilience.',
    weeks: [
      { week: 1, focus: 'Tempo Eccentrics', sessions: [
        { day: 'Mon', name: 'Ecc Quad Focus', exercises: ['Back Squat Eccentric 4x5', 'Romanian Deadlift Eccentric 3x6', 'Nordic Hamstring Curl 3x5'] },
        { day: 'Thu', name: 'Ecc Upper', exercises: ['Bench Press Eccentric 4x5', 'Pull-Up Eccentric 4x5', 'Skull Crusher Eccentric 3x8'] },
      ] },
    ],
  },
  {
    id: 'conc', name: 'CONCENTRIC INTENT', type: 'concentric', duration: '3 Weeks', level: 'Intermediate', icon: 'arrow-up-circle',
    description: 'Intent to move fast, compensatory acceleration, speed-strength.',
    weeks: [
      { week: 1, focus: 'Speed', sessions: [
        { day: 'Mon', name: 'Dynamic Effort', exercises: ['Bench Press Banded 8x3', 'Tuck Jump 4x5', 'Med Ball Throw 4x5'] },
        { day: 'Thu', name: 'Speed Lower', exercises: ['Back Squat Banded 10x2', 'Kettlebell Swing 4x10', 'Broad Jump 4x3'] },
      ] },
    ],
  },
  {
    id: 'strength', name: 'ZION STRENGTH - FAITH OF IRON', type: 'strength', duration: '8 Weeks', level: 'Elite', icon: 'barbell',
    description: 'Peak strength peaking - squat, bench, deadlift + overhead. Built on Philippians 4:13.',
    weeks: [
      { week: 1, focus: 'Accumulation', sessions: [
        { day: 'Mon', name: 'Squat Strength', exercises: ['Back Squat 5x5', 'Back Squat Paused 3x3', 'Hip Thrust 3x8'] },
        { day: 'Wed', name: 'Bench Strength', exercises: ['Bench Press 5x5', 'Close Grip Bench 3x6', 'Bent-Over Row 4x8'] },
        { day: 'Fri', name: 'Pull Strength', exercises: ['Deadlift 5x3', 'Overhead Press 4x5', 'Pull-Up 4x6'] },
      ] },
      { week: 2, focus: 'Intensification', sessions: [
        { day: 'Mon', name: 'Heavy Singles', exercises: ['Back Squat 6x2', 'Bench Press 6x2', 'Deadlift 4x1'] },
      ] },
    ],
  },
  {
    id: 'plyo', name: 'PLYOMETRIC ASCENSION', type: 'plyometrics', duration: '6 Weeks', level: 'Advanced', icon: 'trending-up',
    description: 'Pogo hops to depth jumps - stiff ankles, elastic power, jump higher.',
    weeks: [
      { week: 1, focus: 'Ankle Stiffness', sessions: [
        { day: 'Mon', name: 'Low Plyos', exercises: ['Pogo Hop 3x30', 'Box Jump 4x5', 'Broad Jump 4x3'] },
        { day: 'Thu', name: 'Bounding', exercises: ['Single-Leg Bound 4x6', 'A-Skip 3x20', 'Tuck Jump 3x8'] },
      ] },
      { week: 2, focus: 'Reactive Strength', sessions: [
        { day: 'Mon', name: 'Depth Work', exercises: ['Depth Jump 5x3', 'Clap Push-Up 4x5', 'Flying 20m Sprint 6x1'] },
      ] },
    ],
  },
];

/* ------------------------------ NUTRITION PROGRAMS (PREMIUM) ------------------------------ */
export type NutritionProgram = {
  id: string;
  name: string;
  calories: number;
  description: string;
  icon: string;
  meals: { type: string; foods: string[]; macros: string }[];
};

export const NUTRITION_PROGRAMS: NutritionProgram[] = [
  { id: 'carn', name: 'Carnivore Cut', calories: 2800, icon: 'flame', description: 'Zero carb, nose-to-tail, electrolytes non-negotiable. AM pork belly, PM ribeye.', meals: [
    { type: 'Breakfast', foods: ['3 Eggs, Beef Mince', 'Salt + Electrolytes'], macros: '45P 0C 35F' },
    { type: 'Lunch', foods: ['Biltong 100g', 'Chicken Livers 150g'], macros: '70P 4C 18F' },
    { type: 'Dinner', foods: ['Ribeye 300g', 'Bone Broth'], macros: '60P 0C 50F' } ] },
  { id: 'paleo', name: 'Paleo Performance', calories: 2600, icon: 'leaf', description: 'Whole foods, no grains/legumes. Sweet potato + game meat.', meals: [
    { type: 'Breakfast', foods: ['Sweet Potato, Eggs, Avocado'], macros: '30P 40C 20F' },
    { type: 'Lunch', foods: ['Venison 200g, Butternut, Spinach'], macros: '60P 25C 8F' },
    { type: 'Dinner', foods: ['Hake 250g, Potatoes, Green Beans'], macros: '55P 45C 6F' } ] },
  { id: 'keto', name: 'Keto Zion', calories: 2500, icon: 'water', description: '70% fat, targeted electrolytes. Magnesium + sodium critical.', meals: [
    { type: 'Breakfast', foods: ['Eggs, Cheddar, Avocado'], macros: '30P 5C 45F' },
    { type: 'Lunch', foods: ['Salmon, Olive Oil, Spinach'], macros: '35P 10C 50F' },
    { type: 'Dinner', foods: ['Lamb Chops, Cabbage, Macadamias'], macros: '40P 8C 60F' } ] },
  { id: 'highp', name: 'High Protein Mass', calories: 3200, icon: 'barbell', description: '250g+ protein, South African twist - chicken, amasi, biltong.', meals: [
    { type: 'Breakfast', foods: ['Oats, Amasi, Whey'], macros: '45P 70C 12F' },
    { type: 'Post-Workout', foods: ['Whey 40g, Banana, Oats'], macros: '50P 60C 8F' },
    { type: 'Dinner', foods: ['Chicken Breast 300g, Pap, Chakalaka'], macros: '95P 60C 12F' } ] },
  { id: 'highc', name: 'High Carbs Endurance', calories: 3500, icon: 'walk', description: 'For runners & team sports. Pap, rice, pasta timing.', meals: [
    { type: 'Breakfast', foods: ['Weet-Bix, Milk, Banana'], macros: '25P 95C 8F' },
    { type: 'Lunch', foods: ['Pasta 250g, Tuna, Tomato'], macros: '45P 110C 10F' },
    { type: 'Dinner', foods: ['Rice 200g, Chicken, Broccoli'], macros: '40P 90C 10F' } ] },
  { id: 'vegan', name: 'Vegan Builder', calories: 2800, icon: 'nutrition', description: 'Complete amino acid pairing, B12, iron, calcium focus.', meals: [
    { type: 'Breakfast', foods: ['Tofu Scramble, Lentils, Avocado'], macros: '30P 40C 18F' },
    { type: 'Lunch', foods: ['Samp & Beans, Morogo'], macros: '28P 80C 6F' },
    { type: 'Dinner', foods: ['Chickpea Curry, Brown Rice'], macros: '30P 90C 14F' } ] },
  { id: 'veg', name: 'Vegetarian Power', calories: 2700, icon: 'egg', description: 'Dairy + eggs + plant power. Paneer, eggs, legumes.', meals: [
    { type: 'Breakfast', foods: ['Greek Yogurt, Oats, Berries'], macros: '30P 55C 10F' },
    { type: 'Lunch', foods: ['Cottage Cheese, Quinoa, Veggies'], macros: '35P 40C 15F' },
    { type: 'Dinner', foods: ['Paneer Tikka, Roti, Lentils'], macros: '40P 60C 28F' } ] },
];

export const VERSES = [
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
  { ref: 'Joshua 1:9', text: 'Be strong and courageous. Do not be afraid; do not be discouraged.' },
  { ref: 'Isaiah 40:31', text: 'Those who hope in the Lord will renew their strength. They will run and not grow weary.' },
  { ref: '1 Corinthians 9:27', text: 'I discipline my body and bring it into subjection.' },
  { ref: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.' },
  { ref: 'Hebrews 12:11', text: 'No discipline seems pleasant at the time, but later it produces a harvest of righteousness.' },
  { ref: 'Psalm 18:32', text: 'It is God who arms me with strength and keeps my way secure.' },
];

export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;
export type MealType = (typeof MEALS)[number];
export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
