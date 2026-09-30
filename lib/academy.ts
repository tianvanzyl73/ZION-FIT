export type Lesson = { id: number; topicId: number; title: string; duration: string; type: 'video' | 'article' | 'quiz' };
export type QuizQ = { q: string; options: string[]; answer: number };
export type Topic = {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  premium: boolean;
  points: string[];
  quiz: QuizQ[];
  lessons: Lesson[];
};

type RawTopic = Omit<Topic, 'id' | 'lessons' | 'premium'> & { premium?: boolean };

const RAW: RawTopic[] = [
  { title: 'Introduction to S&C Coaching', description: 'Role, ethics, philosophy of a Strength & Conditioning coach.', icon: 'school', category: 'Coaching',
    points: ['The S&C coach bridges sport science and the field: improve performance, reduce injury risk.', 'Scope of practice: train and educate — refer medical issues to physios and doctors.', 'Ethics: athlete welfare over results, informed consent, clean-sport education.', 'A coaching philosophy guides every decision — write yours down and revisit it yearly.'],
    quiz: [{ q: 'Primary aims of S&C are…', options: ['Only aesthetics', 'Performance and injury risk reduction', 'Diagnosing injuries', 'Selling supplements'], answer: 1 }, { q: 'An athlete reports sharp knee pain. You should…', options: ['Train through it', 'Refer to a medical professional', 'Prescribe medication', 'Ignore it'], answer: 1 }] },
  { title: 'Coaching Fundamentals & Communication', description: 'Cueing, leadership, building buy-in.', icon: 'megaphone', category: 'Coaching',
    points: ['External cues ("push the floor away") usually beat internal cues ("extend your knees") for performance.', 'Keep cues short: one cue per rep, 3-5 words.', 'Demonstrate, cue, let them move, then give feedback — in that order.', 'Buy-in comes from relationships: know the person before the athlete.'],
    quiz: [{ q: 'Which is an external cue?', options: ['Squeeze your glutes', 'Push the floor away', 'Contract your quads', 'Flex your lats'], answer: 1 }, { q: 'Ideal cue length is…', options: ['One paragraph', '3-5 words', '20 words', 'No cues ever'], answer: 1 }] },
  { title: 'Functional Anatomy 101', description: 'How the body works: bones, joints, muscle actions.', icon: 'body', category: 'Body',
    points: ['206 bones form levers; joints are the fulcrums; muscles supply the force.', 'Planes of motion: sagittal (flex/extend), frontal (ab/adduct), transverse (rotation).', 'Agonist produces movement, antagonist opposes, synergists assist, stabilisers hold.', 'Muscles only pull — pushing movements are pulls at different joints.'],
    quiz: [{ q: 'A squat mostly occurs in which plane?', options: ['Frontal', 'Transverse', 'Sagittal', 'Oblique'], answer: 2 }, { q: 'Muscles can…', options: ['Only pull', 'Only push', 'Push and pull', 'Neither'], answer: 0 }] },
  { title: 'Biomechanics of Human Movement', description: 'Levers, force vectors, torque, joint kinematics.', icon: 'analytics', category: 'Biomechanics',
    points: ['Torque = force × moment arm. Longer moment arm = harder exercise at that joint.', 'Most joints are 3rd-class levers: built for speed and range, not force.', 'Newton’s 3rd law: you push the ground, the ground pushes you — ground reaction force.', 'Bar path over mid-foot minimises moment arms in the squat and deadlift.'],
    quiz: [{ q: 'Torque equals…', options: ['Mass × speed', 'Force × moment arm', 'Power ÷ time', 'Work × distance'], answer: 1 }, { q: 'Most human joints are which lever class?', options: ['1st', '2nd', '3rd', 'None'], answer: 2 }] },
  { title: 'Energy Systems & Conditioning', description: 'ATP-PC, Glycolytic, Oxidative - programming energy system work.', icon: 'flash', category: 'Physiology',
    points: ['ATP-PC: 0-10s maximal efforts, full recovery in ~3-5 min.', 'Glycolytic: ~10s-2min high efforts, produces lactate which is re-used as fuel.', 'Oxidative: >2 min, fats and carbs, the base for recovery between efforts.', 'All systems work together — the ratio depends on intensity and duration.'],
    quiz: [{ q: 'A 100m sprint relies mostly on…', options: ['Oxidative', 'ATP-PC', 'Ketones', 'Protein'], answer: 1 }, { q: 'Lactate is…', options: ['Pure waste', 'Re-usable fuel', 'The cause of DOMS', 'A vitamin'], answer: 1 }] },
  { title: 'Muscle Physiology & Hypertrophy', description: 'Mechanotransduction, protein synthesis, sarcomeres.', icon: 'fitness', category: 'Body',
    points: ['Sarcomeres are the contractile units: actin and myosin sliding filaments.', 'Mechanical tension is the primary driver of muscle growth.', 'Muscle protein synthesis stays elevated 24-48h after training.', 'Growth = synthesis > breakdown over time: train, eat protein, sleep.'],
    quiz: [{ q: 'Primary hypertrophy driver?', options: ['Sweat', 'Mechanical tension', 'Soreness', 'Stretching'], answer: 1 }, { q: 'MPS stays elevated for about…', options: ['1 hour', '24-48 hours', '7 days', '1 month'], answer: 1 }] },
  { title: 'Nervous System & Strength', description: 'Motor units, rate coding, inter/intramuscular coordination.', icon: 'pulse', category: 'Body',
    points: ['Size principle: small motor units recruit first, large high-threshold units last.', 'Rate coding: faster firing frequency = more force.', 'Early strength gains (first 6-8 weeks) are mostly neural.', 'Heavy loads and fast intent both recruit high-threshold motor units.'],
    quiz: [{ q: 'Early strength gains are mostly…', options: ['Neural', 'Bone growth', 'Fat loss', 'Hydration'], answer: 0 }, { q: 'Motor units recruit…', options: ['Largest first', 'Randomly', 'Smallest first', 'All at once always'], answer: 2 }] },
  { title: 'Program Design Foundations', description: 'Needs analysis, periodization, progressive overload.', icon: 'clipboard', category: 'Programming',
    points: ['Needs analysis: sport demands + athlete profile + injury history.', 'Progressive overload: gradually increase load, volume, density or complexity.', 'Periodization organises training into macro, meso and micro cycles.', 'Specificity (SAID): the body adapts to the specific demands placed on it.'],
    quiz: [{ q: 'SAID stands for…', options: ['Specific Adaptation to Imposed Demands', 'Strength And Intensity Development', 'Speed Agility In Drills', 'Sets And Intensity Design'], answer: 0 }, { q: 'A mesocycle is typically…', options: ['1 day', '3-6 weeks', '4 years', '1 hour'], answer: 1 }] },
  { title: 'Gym Equipment Mastery', description: 'Barbell, dumbbell, kettlebell, cables, machines - proper use.', icon: 'construct', category: 'Equipment',
    points: ['Barbells allow heaviest loading; dumbbells expose asymmetries.', 'Kettlebells shine for ballistic hinge work (swings, cleans).', 'Cables provide constant tension through the range.', 'Machines are great for isolating and safely training to failure.'],
    quiz: [{ q: 'Best tool for constant tension?', options: ['Barbell', 'Cable', 'Foam roller', 'Plyo box'], answer: 1 }, { q: 'Kettlebells are ideal for…', options: ['Ballistic hinges', 'Leg extension', 'Stretching only', 'Bench press'], answer: 0 }] },
  { title: 'Barbell Lifts Deep Dive', description: 'Squat, hinge, push, pull technique breakdown.', icon: 'barbell', category: 'Equipment',
    points: ['Squat: brace, knees track toes, bar over mid-foot, depth you can own.', 'Deadlift: bar against shins, lats tight, push the floor away.', 'Bench: shoulder blades back and down, feet planted, bar to lower chest.', 'Overhead press: glutes tight, head through at lockout, stacked joints.'],
    quiz: [{ q: 'Squat bar path should stay over…', options: ['Toes', 'Mid-foot', 'Heels', 'Knees'], answer: 1 }, { q: 'In the deadlift, the bar should be…', options: ['Far in front', 'Close to shins', 'Behind heels', 'Irrelevant'], answer: 1 }] },
  { title: 'Mobility & Flexibility Science', description: 'Range of motion, FRC, stretch tolerance, joint health.', icon: 'body', category: 'Mobility',
    points: ['Flexibility = passive range; mobility = range you can control actively.', 'Most stretching gains come from increased stretch tolerance.', 'Loaded end-range work (e.g. deficit lifts) builds usable mobility.', 'Consistency beats intensity: short daily sessions work best.'],
    quiz: [{ q: 'Mobility is…', options: ['Passive range', 'Controlled active range', 'Bone length', 'Muscle size'], answer: 1 }, { q: 'Early stretching gains are mostly due to…', options: ['Stretch tolerance', 'Muscle lengthening', 'Bone growth', 'Hydration'], answer: 0 }] },
  { title: 'Warm-Ups & Movement Prep', description: 'RAMP protocol, activation, potentiation.', icon: 'flame', category: 'Programming',
    points: ['RAMP: Raise, Activate & Mobilise, Potentiate.', 'Raise temperature and heart rate with low-intensity movement.', 'Activate and mobilise the specific joints needed for the session.', 'Potentiate with fast, sport-specific drills before the main work.'],
    quiz: [{ q: 'The P in RAMP stands for…', options: ['Push', 'Potentiate', 'Pause', 'Protein'], answer: 1 }, { q: 'Warm-ups should end with…', options: ['Long static stretches', 'Fast specific drills', 'A nap', 'Heavy maxes'], answer: 1 }] },
  { title: 'Speed & Agility', description: 'Acceleration, max velocity, COD mechanics.', icon: 'speedometer', category: 'Performance',
    points: ['Acceleration: forward lean, big horizontal force, piston-like legs.', 'Max velocity: upright posture, front-side mechanics, short ground contacts.', 'Change of direction: lower centre of mass, decelerate, re-accelerate.', 'Agility includes perception and decision making, not just COD.'],
    quiz: [{ q: 'Acceleration posture is…', options: ['Upright', 'Forward lean', 'Leaning back', 'Seated'], answer: 1 }, { q: 'Agility includes…', options: ['Only legs', 'Perception & decisions', 'Only arms', 'Stretching'], answer: 1 }] },
  { title: 'Plyometrics Science', description: 'SSC, stiffness, contact times, depth jumps.', icon: 'trending-up', category: 'Performance',
    points: ['Stretch-shortening cycle: eccentric load → amortisation → concentric explosion.', 'Fast SSC: <250ms contact (pogo, sprinting). Slow SSC: >250ms (CMJ).', 'Progress from landings → jumps → bounds → depth jumps.', 'Count contacts: quality over quantity, full recovery between sets.'],
    quiz: [{ q: 'Fast SSC ground contact is…', options: ['<250ms', '>1s', '500ms', '2s'], answer: 0 }, { q: 'Plyo progression starts with…', options: ['Depth jumps', 'Landings', 'Max bounds', 'Olympic lifts'], answer: 1 }] },
  { title: 'Strength Development', description: 'Max strength, methods, intensification.', icon: 'barbell', category: 'Training',
    points: ['Max strength is best built at 80-95% 1RM for 1-6 reps.', 'RPE / RIR autoregulation adapts load to daily readiness.', 'Long rests (3-5 min) maximise quality on heavy sets.', 'Strength is a skill: practice the lift frequently with good technique.'],
    quiz: [{ q: 'Ideal max-strength intensity is…', options: ['30-50%', '80-95% 1RM', '100%+ every set', '60% only'], answer: 1 }, { q: 'RIR means…', options: ['Reps In Reserve', 'Rest In Rows', 'Rate Increase Ratio', 'Run In Rhythm'], answer: 0 }] },
  { title: 'Hypertrophy Methods', description: 'Mechanical tension, metabolic stress, volume landmarks.', icon: 'fitness', category: 'Training',
    points: ['10-20 hard sets per muscle per week is a strong starting range.', 'Train 0-3 reps from failure for most sets.', 'Lengthened partials and stretch-focused exercises boost growth.', 'Myo-reps and drop sets increase effective reps in less time.'],
    quiz: [{ q: 'Weekly sets per muscle starting range?', options: ['1-2', '10-20', '50+', '0'], answer: 1 }, { q: 'Proximity to failure for most sets?', options: ['10+ RIR', '0-3 RIR', 'Never near', 'Always past failure'], answer: 1 }] },
  { title: 'Faith & Iron: Mental Fortitude', description: 'ZION FIT philosophy - discipline as worship.', icon: 'heart', category: 'Mindset',
    points: ['Discipline is doing the right thing when no one is watching.', 'Process goals (show up, execute) beat outcome goals for consistency.', 'Gratitude and purpose lower stress and improve adherence.', '“I discipline my body” — 1 Corinthians 9:27. Training as stewardship.'],
    quiz: [{ q: 'Which goal type drives consistency best?', options: ['Outcome only', 'Process goals', 'No goals', 'Random'], answer: 1 }, { q: 'Philippians 4:13 is the ZION FIT…', options: ['Anchor verse', 'Diet plan', 'Warm-up', 'Supplement'], answer: 0 }] },
  { title: 'Recovery Science', description: 'Sleep, stress, HRV, parasympathetic tools.', icon: 'moon', category: 'Recovery',
    points: ['Sleep 7-9h is the #1 recovery tool — growth hormone peaks in deep sleep.', 'HRV trends reflect autonomic balance; track the trend, not a single day.', 'Slow nasal breathing (e.g. 4-7-8) shifts you toward parasympathetic.', 'Life stress counts as training stress — adjust load accordingly.'],
    quiz: [{ q: 'The #1 recovery tool is…', options: ['Ice baths', 'Sleep', 'Massage guns', 'BCAAs'], answer: 1 }, { q: 'For HRV you should watch…', options: ['Single readings', 'The trend', 'Nothing', 'Only max'], answer: 1 }] },
  { title: 'Nutrition for S&C', description: 'Fueling performance, macros, timing.', icon: 'restaurant', category: 'Nutrition',
    points: ['Protein 1.6-2.2 g/kg/day supports muscle gain and retention.', 'Carbs fuel high-intensity work: 3-10 g/kg depending on volume.', 'Total daily intake matters most; timing is the fine-tuning.', 'SA staples like pap, samp & beans, amasi and biltong fit any plan.'],
    quiz: [{ q: 'Protein target for athletes?', options: ['0.5 g/kg', '1.6-2.2 g/kg', '5 g/kg', '10 g/kg'], answer: 1 }, { q: 'What matters most?', options: ['Meal timing', 'Total daily intake', 'Supplements', 'Fasting'], answer: 1 }] },
  { title: 'Vitamins & Minerals Deep Dive', description: 'Fat/water soluble, deficiencies in athletes.', icon: 'medkit', category: 'Nutrition',
    points: ['Fat-soluble: A, D, E, K — stored in the body, can accumulate.', 'Water-soluble: B-complex and C — need regular intake.', 'Common athlete gaps: iron (esp. female athletes), vitamin D, calcium.', 'Food first: supplements fill verified gaps, ideally confirmed by bloodwork.'],
    quiz: [{ q: 'Which vitamin is fat-soluble?', options: ['C', 'B12', 'D', 'B6'], answer: 2 }, { q: 'Common deficiency in female athletes?', options: ['Iron', 'Sodium', 'Protein', 'Fat'], answer: 0 }] },
  { title: 'Injury Prevention & Management', description: 'Acute:chronic, return to play.', icon: 'bandage', category: 'Coaching',
    points: ['Spikes in workload (ACWR > 1.5) are linked with higher injury risk.', 'Nordic curls cut hamstring injury rates substantially.', 'Return-to-play is criteria-based, not just time-based.', 'Strength training is one of the best injury-risk reducers available.'],
    quiz: [{ q: 'Risky acute:chronic ratio is roughly…', options: ['< 0.8', '> 1.5', '1.0', '0'], answer: 1 }, { q: 'Return to play should be…', options: ['Time-based only', 'Criteria-based', 'Whenever', 'Coach mood'], answer: 1 }] },
  // ---------- PREMIUM (30%) ----------
  { premium: true, title: 'Power Development', description: 'Force-velocity curve, Olympic lifts, ballistics.', icon: 'flash', category: 'Training',
    points: ['Power = force × velocity; train both ends of the F-V curve.', 'Olympic lifts and derivatives (pulls, jumps) train triple extension.', 'Ballistics (jumps, throws) avoid deceleration at the end of range.', 'Contrast training pairs heavy lifts with explosive movements (PAPE).'],
    quiz: [{ q: 'Power equals…', options: ['Force × velocity', 'Mass × height', 'Sets × reps', 'Time ÷ force'], answer: 0 }, { q: 'Contrast training pairs…', options: ['Two stretches', 'Heavy + explosive', 'Cardio + sleep', 'Two isolations'], answer: 1 }] },
  { premium: true, title: 'Eccentric Training', description: 'Why lengthening matters, tempo, overload, injury prevention.', icon: 'arrow-down-circle', category: 'Training',
    points: ['We are ~20-50% stronger eccentrically than concentrically.', 'Eccentric overload builds muscle and tendon stiffness.', 'Tempo: 3-5s lowering creates tension without huge loads.', 'Expect more soreness initially — introduce gradually.'],
    quiz: [{ q: 'Eccentric strength vs concentric is…', options: ['Weaker', 'Stronger', 'Equal', 'Irrelevant'], answer: 1 }, { q: 'Eccentric overload helps…', options: ['Tendon resilience', 'Nothing', 'Only cardio', 'Flexibility only'], answer: 0 }] },
  { premium: true, title: 'Concentric & Isometric', description: 'Intent, overcoming vs yielding isometrics.', icon: 'arrow-up-circle', category: 'Training',
    points: ['Concentric intent: always try to move the load as fast as possible.', 'Yielding isometrics: hold a load; overcoming: push against immovable pins.', 'Isometrics are joint-angle specific (±15°).', 'Great for tendon pain management and sticking points.'],
    quiz: [{ q: 'Overcoming isometric means…', options: ['Holding a weight', 'Pushing an immovable object', 'Lowering slowly', 'Jumping'], answer: 1 }, { q: 'Isometric strength transfers…', options: ['Everywhere', '±15° of angle trained', 'Nowhere', 'Only upper body'], answer: 1 }] },
  { premium: true, title: 'Mobility Assessment', description: 'Overhead squat, ankle, hip, t-spine screens.', icon: 'search', category: 'Mobility',
    points: ['Overhead squat reveals ankle, hip, t-spine and shoulder limits together.', 'Knee-to-wall test: <10cm suggests limited ankle dorsiflexion.', 'Hip IR/ER screens with 90/90 positions.', 'Re-test every 4-6 weeks to track change.'],
    quiz: [{ q: 'Knee-to-wall tests…', options: ['Hip flexion', 'Ankle dorsiflexion', 'Grip', 'Neck'], answer: 1 }, { q: 'Re-test mobility every…', options: ['Day', '4-6 weeks', 'Year', 'Never'], answer: 1 }] },
  { premium: true, title: 'Supplements: Creatine', description: 'Mechanism, dosing, myths, creatine + electrolytes.', icon: 'flask', category: 'Supplements',
    points: ['Creatine boosts phosphocreatine stores → more ATP-PC work.', '3-5 g/day monohydrate; loading optional.', 'Weight gain is mostly intracellular water — a good thing.', 'Safe in healthy people; no evidence it damages kidneys or causes hair loss.'],
    quiz: [{ q: 'Standard creatine dose?', options: ['3-5 g/day', '50 g/day', '0.1 g/day', '1 kg'], answer: 0 }, { q: 'Creatine mainly supports which system?', options: ['Oxidative', 'ATP-PC', 'Digestive', 'Immune'], answer: 1 }] },
  { premium: true, title: 'Supplements: Calcium, Magnesium, Electrolytes', description: 'Importance for contraction, bone, cramp prevention.', icon: 'beaker', category: 'Supplements',
    points: ['Calcium triggers muscle contraction and builds bone.', 'Magnesium supports 300+ enzymes, sleep and relaxation.', 'Sodium and potassium maintain fluid balance and nerve signalling.', 'Heavy sweaters in SA heat can lose 1g+ sodium per litre.'],
    quiz: [{ q: 'Calcium triggers…', options: ['Muscle contraction', 'Digestion only', 'Hair growth', 'Nothing'], answer: 0 }, { q: 'Magnesium helps…', options: ['Sleep & enzymes', 'Only teeth', 'Vision only', 'Nothing'], answer: 0 }] },
  { premium: true, title: 'Hydration & Electrolytes', description: 'Sodium, potassium, fluid balance for SA heat.', icon: 'water', category: 'Nutrition',
    points: ['2% body-weight loss from sweat measurably impairs performance.', 'Weigh before/after: drink ~1.5 L per kg lost.', 'Urine colour: pale straw = good.', 'Add sodium for sessions >60 min or in heat.'],
    quiz: [{ q: 'Performance drops at about…', options: ['0.1% loss', '2% body weight loss', '20% loss', 'Never'], answer: 1 }, { q: 'Rehydrate per kg lost with…', options: ['~1.5 L', '100 ml', '10 L', 'Nothing'], answer: 0 }] },
  { premium: true, title: 'Testing & Monitoring', description: '1RM, jumps, sprints, wellness questionnaires.', icon: 'stats-chart', category: 'Testing',
    points: ['Valid + reliable tests only: same time, warm-up and conditions.', 'Estimated 1RM from reps-to-failure is safer than true maxes for most.', 'CMJ height tracks neuromuscular fatigue well.', 'Daily wellness (sleep, soreness, mood) catches trends early.'],
    quiz: [{ q: 'CMJ is useful to monitor…', options: ['Neuromuscular fatigue', 'Eye sight', 'Diet', 'Height'], answer: 0 }, { q: 'Good tests are…', options: ['Random', 'Valid & reliable', 'Always maximal', 'Rare'], answer: 1 }] },
  { premium: true, title: 'Youth & Female Athletes', description: 'LTAD, menstrual cycle, growth spurts.', icon: 'people', category: 'Special Pop',
    points: ['Long-term athlete development: fundamentals before specialisation.', 'Resistance training is safe and beneficial for youth when supervised.', 'Peak height velocity: reduce load, emphasise coordination.', 'Menstrual cycle: individualise — track symptoms, not assumptions.'],
    quiz: [{ q: 'Youth resistance training is…', options: ['Dangerous', 'Safe when supervised', 'Illegal', 'Useless'], answer: 1 }, { q: 'During growth spurts…', options: ['Max out', 'Reduce load, focus coordination', 'Stop moving', 'Only sprint'], answer: 1 }] },
];

const LESSON_TYPES = ['Foundation Lecture', 'Technique Breakdown', 'Case Study', 'Practical Demo', 'Common Mistakes', 'Programming Template', 'Research Review'];

function build(): Topic[] {
  let lid = 1;
  return RAW.map((t, i) => {
    const count = i < 10 ? 4 : 3;
    const lessons: Lesson[] = Array.from({ length: count }, (_, j) => {
      const isQuiz = j === count - 1;
      return {
        id: lid++,
        topicId: i + 1,
        title: isQuiz ? 'Quiz: Check Your Knowledge' : LESSON_TYPES[(i + j) % LESSON_TYPES.length],
        duration: `${8 + ((i * 7 + j * 5) % 14)} min`,
        type: isQuiz ? 'quiz' : j % 2 === 0 ? 'video' : 'article',
      };
    });
    return { ...t, id: i + 1, premium: !!t.premium, lessons };
  });
}

export const TOPICS = build();
export const ALL_LESSONS = TOPICS.flatMap((t) => t.lessons);
export const FREE_TOPICS = TOPICS.filter((t) => !t.premium).length;
