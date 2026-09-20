import { motion } from 'framer-motion';
import { Cloud, Compass, Leaf, MapPinned, ShieldCheck, Sparkles, Sun, Trees, Trophy, Volume2, VolumeX, ArrowRight, PawPrint, Droplets, Home, Globe2, Landmark, BadgeCheck, Bot, CheckCircle2, Star, Info, Fish, Flame, Mountain, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { achievements, animals, challenges, ecosystemStatsDefault, mapLocations, wildlifeFacts } from './data';
import { askRangerAI } from './services/rangerAI';
import type { Achievement, Animal, Challenge, EcosystemStats, LocationSpot, PlayerProgress } from './types';

const navItems = [
  { label: 'Home', icon: Home, targetId: 'home-top' },
  { label: 'Explore', icon: Globe2, targetId: 'game-map' },
  { label: 'Wildlife', icon: PawPrint, targetId: 'wildlife-library' },
  { label: 'Challenges', icon: ShieldCheck, targetId: 'challenge-panel' },
  { label: 'Achievements', icon: Trophy, targetId: 'badge-panel' },
  { label: 'Ask Ranger', icon: Bot, targetId: 'ask-ranger-panel' },
];

const levelBadges = [
  '🌱 Nature Beginner',
  '🐾 Wildlife Explorer',
  '🌳 Habitat Guardian',
  '🦁 Ecosystem Protector',
  '🏆 Wildlife Champion',
];

const initialProgress: PlayerProgress = {
  name: 'Victor',
  points: 125,
  level: 'Wildlife Explorer',
  badges: ['Elephant Protector'],
  completedChallenges: 1,
  animalsDiscovered: 4,
};

const themeOptions = [
  { id: 'forest', label: 'Forest Green', primary: '#22c55e', secondary: '#dcfce7', accent: '#14532d' },
  { id: 'sunset', label: 'Sunset Gold', primary: '#f97316', secondary: '#ffedd5', accent: '#7c2d12' },
  { id: 'sky', label: 'Sky Blue', primary: '#0ea5e9', secondary: '#e0f2fe', accent: '#0f172a' },
  { id: 'rose', label: 'Rose Coral', primary: '#fb7185', secondary: '#ffe4e6', accent: '#9f1239' },
];

const extraAnimalChoices = ['Penguin', 'Koala', 'Dolphin', 'Tiger', 'Frog', 'Camel'];

const challengeIntro = 'WildQuest is powered by a mock AI service and is structured so a real Gemini/OpenAI backend can be plugged in later without exposing keys in client code.';

function App() {
  const [soundOn, setSoundOn] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'profile' | 'game'>('home');
  const [playerName, setPlayerName] = useState('Victor');
  const [selectedTheme, setSelectedTheme] = useState(themeOptions[1]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(() => animals.find((animal) => animal.id === 'giraffe') ?? animals[1]);
  const [selectedAnimalPhotoIndex, setSelectedAnimalPhotoIndex] = useState(0);
  const [stats, setStats] = useState<EcosystemStats>(ecosystemStatsDefault);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeResult, setChallengeResult] = useState<string>('');
  const [progress, setProgress] = useState<PlayerProgress>(initialProgress);
  const [selectedLocation, setSelectedLocation] = useState<LocationSpot | null>(mapLocations[0]);
  const [factIndex, setFactIndex] = useState(0);
  const [aiInput, setAiInput] = useState('Why are elephants important in Kenya?');
  const [aiResponse, setAiResponse] = useState('Elephants help spread seeds and shape habitats. Their actions can support many other species.');
  type ChatMessage = {
    id: string;
    sender: 'user' | 'ranger';
    text: string;
  };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ranger',
      text: 'Hi! I’m Ranger Amini. Ask me anything about Kenya’s wildlife, habitats, and animal roles.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [animalInsight, setAnimalInsight] = useState<string>('');
  const [isLoadingAnimal, setIsLoadingAnimal] = useState(false);
  const [showAnimalInsightInline, setShowAnimalInsightInline] = useState(true);
  const [foodChain, setFoodChain] = useState(['🌱 Grass', '🦓 Zebra', '🦁 Lion']);
  const [foodChainStatus, setFoodChainStatus] = useState('');
  const [previewBadge, setPreviewBadge] = useState<string | null>('Elephant Protector');
  const [levelIndex, setLevelIndex] = useState(0);

  const levelSets = useMemo(() => {
    const sets: Animal[][] = [];
    for (let i = 0; i < animals.length; i += 4) {
      sets.push(animals.slice(i, i + 4));
    }
    return sets;
  }, []);

  const activeChallenge = challenges[challengeIndex % challenges.length];
  const currentFact = wildlifeFacts[factIndex % wildlifeFacts.length];
  const activeLibraryAnimals = levelSets[levelIndex % levelSets.length];
  const themeStyle = {
    ['--theme-primary' as any]: selectedTheme.primary,
    ['--theme-secondary' as any]: selectedTheme.secondary,
    ['--theme-accent' as any]: selectedTheme.accent,
  };

  useEffect(() => {
    const targetLevel = Math.min(Math.floor(progress.completedChallenges / 2), levelSets.length - 1);
    if (targetLevel !== levelIndex) {
      setLevelIndex(targetLevel);
      setSelectedAnimal(levelSets[targetLevel][0]);
    }
  }, [levelIndex, levelSets, progress.completedChallenges]);

  useEffect(() => {
    setSelectedAnimalPhotoIndex(0);
  }, [selectedAnimal?.id]);

  const selectedAnimalPhotos = selectedAnimal ? (selectedAnimal.images?.length ? selectedAnimal.images : selectedAnimal.image ? [selectedAnimal.image] : []) : [];

  const topBadges = useMemo(() => {
    return [
      { id: 'elephant', title: 'Elephant Protector', emoji: '🐘', unlocked: true },
      { id: 'forest', title: 'Forest Guardian', emoji: '🌳', unlocked: false },
      { id: 'water', title: 'Water Defender', emoji: '💧', unlocked: false },
      { id: 'expert', title: 'Ecosystem Expert', emoji: '🦁', unlocked: false },
    ];
  }, []);

  const startAdventure = () => setCurrentScreen('profile');

  const jumpToSection = (targetId: string) => {
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (targetId === 'home-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentScreen('home');
      return;
    }

    setCurrentScreen('game');
    setTimeout(() => {
      const nextSection = document.getElementById(targetId);
      nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const becomeGuardian = () => {
    if (playerName.trim()) {
      setProgress((prev) => ({ ...prev, name: playerName.trim() || prev.name }));
      setCurrentScreen('game');
    }
  };

  const handleChoice = (option: { correct: boolean; explanation: string }, challenge: Challenge) => {
    if (option.correct) {
      setStats((prev) => ({
        wildlife: Math.min(prev.wildlife + 8, 100),
        habitat: Math.min(prev.habitat + 9, 100),
        water: Math.min(prev.water + 10, 100),
        community: Math.min(prev.community + 6, 100),
      }));
      setProgress((prev) => {
        const nextCompleted = prev.completedChallenges + 1;
        const nextLevel = Math.min(Math.floor(nextCompleted / 2), levelSets.length - 1);
        setLevelIndex(nextLevel);
        setSelectedAnimal(levelSets[nextLevel][0]);
        return {
          ...prev,
          points: prev.points + challenge.reward,
          completedChallenges: nextCompleted,
          badges: prev.badges.includes('Water Defender') || challenge.id === 'water' ? prev.badges : [...prev.badges, 'Water Defender'],
          level: nextLevel === 0 ? 'Wildlife Explorer' : nextLevel === 1 ? 'Habitat Guardian' : nextLevel === 2 ? 'Ecosystem Protector' : 'Wildlife Champion',
        };
      });
      setChallengeResult(`Excellent! ${option.explanation}`);
      setPreviewBadge(challenge.id === 'water' ? 'Water Defender' : 'Elephant Protector');
    } else {
      setChallengeResult(`Think about the ecosystem. ${option.explanation}`);
    }
  };

  const nextChallenge = () => {
    setChallengeIndex((prev) => (prev + 1) % challenges.length);
    setChallengeResult('');
  };

  const nextFact = () => {
    setFactIndex((prev) => (prev + 1) % wildlifeFacts.length);
  };

  const askAi = async (customPrompt?: string) => {
    const promptSource = customPrompt ?? chatInput ?? aiInput ?? 'Tell me about the role of elephants in Kenya.';
    const prompt = promptSource.trim();
    if (!prompt) return;

    setChatMessages((prev) => [...prev, { id: String(Date.now()), sender: 'user', text: prompt }]);
    setChatInput('');
    setAiInput(prompt);
    setIsChatLoading(true);

    const answer = await askRangerAI(prompt);
    setAiResponse(answer);
    setChatMessages((prev) => [...prev, { id: String(Date.now() + 1), sender: 'ranger', text: answer }]);
    setIsChatLoading(false);
  };

  const chooseAnimalPrompt = (animalName: string) => {
    const friendlyPrompt = `Tell me about the ${animalName} in a fun, child-friendly way. Explain what it eats, where it lives, and why it matters in nature.`;
    setChatInput(friendlyPrompt);
    void askAi(friendlyPrompt);
  };

  const loadAnimalInsight = async (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsLoadingAnimal(true);
    setAnimalInsight('');
    const prompt = `Tell me about the ${animal.name} in Kenya.`;
    setAiInput(prompt);
    setChatInput(prompt);
    const answer = await askRangerAI(
      `Give me a fun, child-friendly explanation about the ${animal.name}. Include why it matters in Kenya, its role in the ecosystem, and one amazing fact. Keep it to 3 short sentences.`
    );
    setAnimalInsight(answer);
    setAiResponse(answer);
    setShowAnimalInsightInline(true);
    setChatMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'user', text: prompt },
      { id: String(Date.now() + 1), sender: 'ranger', text: answer },
    ]);
    setIsLoadingAnimal(false);
  };

  const jumpToAnimalLevel = (nextLevel: number) => {
    const safeLevel = Math.max(0, Math.min(nextLevel, levelSets.length - 1));
    setLevelIndex(safeLevel);
    setSelectedAnimal(levelSets[safeLevel][0]);
  };

  const handleFoodChain = () => {
    const correct = foodChain[0] === '🌱 Grass' && foodChain[1] === '🦓 Zebra' && foodChain[2] === '🦁 Lion';
    if (correct) {
      setFoodChainStatus('Perfect! Plants provide energy for herbivores, while predators depend on herbivores. Ecosystems are connected.');
      setProgress((prev) => ({ ...prev, points: prev.points + 25 }));
    } else {
      setFoodChainStatus('Try this order: grass → zebra → lion. Each step depends on the one before it.');
    }
  };

  const reorderChain = (direction: 'up' | 'down') => {
    setFoodChain((prev) => {
      const next = [...prev];
      const index = direction === 'up' ? 0 : 1;
      if (direction === 'up' && next.length > 1) {
        [next[0], next[1]] = [next[1], next[0]];
      }
      if (direction === 'down' && next.length > 1) {
        [next[1], next[2]] = [next[2], next[1]];
      }
      return next;
    });
  };

  const renderHome = () => (
    <div style={themeStyle} className="min-h-screen savannah-bg text-slate-800">
      <header className="max-w-7xl mx-auto px-4 pt-6 pb-3">
        <nav className="flex items-center justify-between rounded-full bg-white/50 card-glass px-5 py-3 shadow-soft">
          <div id="home-top" className="flex items-center gap-2 font-bold text-2xl text-forest">
            <span className="text-3xl">🐾</span>
            WildQuest
          </div>
          <div className="hidden md:flex items-center gap-3 text-sm font-semibold text-slate-700">
            {navItems.map(({ label, icon: Icon, targetId }) => (
              <motion.button whileTap={{ scale: 0.96 }} key={label} onClick={() => jumpToSection(targetId)} className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-emerald-100">
                <Icon size={16} />
                {label}
              </motion.button>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSoundOn((v) => !v)} className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white shadow-md hover:bg-emerald-500" style={{ background: selectedTheme.primary }}>
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundOn ? 'Sound ON' : 'Sound OFF'}
          </motion.button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <section className="grid lg:grid-cols-2 gap-12 items-center py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 border border-amber-200">
              <Sparkles size={16} />
              Kenya’s wildlife adventure
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-forest">WILDQUEST</h1>
              <p className="mt-4 text-2xl md:text-3xl font-bold text-slate-700">Every Animal Has a Role.</p>
            </div>
            <p className="max-w-xl text-lg text-slate-600">Explore Kenya. Discover wildlife. Protect the ecosystem.</p>

            <div className="rounded-[28px] bg-white/70 p-4 shadow-soft card-glass">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Pick your favorite color</p>
              <div className="flex flex-wrap gap-3">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${selectedTheme.id === theme.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    <span className="h-4 w-4 rounded-full" style={{ background: theme.primary }} />
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button whileTap={{ scale: 0.97 }} onClick={startAdventure} className="rounded-full px-7 py-4 text-lg font-bold text-white shadow-xl transition" style={{ background: selectedTheme.primary }}>
                START YOUR ADVENTURE
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="rounded-full border border-emerald-700 bg-white/70 px-7 py-4 text-lg font-bold text-emerald-700 shadow-lg transition hover:-translate-y-0.5">
                HOW IT WORKS
              </motion.button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="theme-shell relative min-h-[540px] overflow-hidden rounded-[32px] border border-white/40 bg-white/25 p-5 shadow-soft card-glass">
            <div className="blur-orb blur-orb-one" style={{ background: selectedTheme.primary }} />
            <div className="blur-orb blur-orb-two" style={{ background: selectedTheme.secondary }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_55%)]" />
            <div className="absolute left-12 top-10 text-5xl float-slow">☀️</div>
            <div className="absolute right-14 top-14 text-4xl float-delay">☁️</div>
            <div className="absolute inset-x-0 bottom-0 h-36 rounded-b-[28px] bg-gradient-to-t from-green-600/60 to-green-300/60" />
            <div className="absolute left-12 bottom-14 text-6xl">🌳</div>
            <div className="absolute right-20 bottom-20 text-5xl">🌳</div>
            <div className="absolute right-32 bottom-32 text-6xl float-slow">🦒</div>
            <div className="absolute left-28 bottom-28 text-5xl float-delay">🐘</div>
            <div className="absolute left-48 bottom-24 text-5xl">🦓</div>
            <div className="absolute right-52 bottom-36 text-5xl">🦁</div>
            <div className="absolute inset-x-0 bottom-20 flex justify-center">💧</div>
          </motion.div>
        </section>

        <section id="how-it-works" className="py-10">
          <div className="text-center mb-10">
            <p className="text-4xl font-black text-forest">Why Wildlife Matters</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌱', title: 'Healthy Ecosystems', text: 'Animals and plants depend on one another in every habitat.' },
              { icon: '💧', title: 'Protecting Nature', text: 'Healthy habitats provide water, food and shelter for living things.' },
              { icon: '👨‍👩‍👧', title: 'People & Wildlife', text: 'Conservation helps both communities and wildlife thrive together.' },
            ].map((item) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} whileHover={{ y: -10, scale: 1.01 }} whileTap={{ scale: 0.99 }} className="rounded-[28px] bg-white/70 p-7 shadow-soft card-glass">
                <div className="text-5xl">{item.icon}</div>
                <h3 className="mt-4 text-2xl font-bold text-forest">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );

  const renderProfile = () => (
    <div style={themeStyle} className="min-h-screen savannah-bg p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5 }} className="w-full max-w-xl rounded-[32px] bg-white/70 p-8 shadow-soft card-glass">
        <div className="mb-6 flex items-center gap-3 text-forest">
          <ShieldCheck className="text-emerald-600" />
          <p className="text-sm font-bold uppercase tracking-[0.2em]">Wildlife Guardian</p>
        </div>
        <h2 className="text-4xl font-black text-forest">Welcome, Guardian!</h2>

        <div className="mt-6 rounded-[24px] bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Choose your vibe</p>
          <div className="flex flex-wrap gap-3">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${selectedTheme.id === theme.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <span className="h-4 w-4 rounded-full" style={{ background: theme.primary }} />
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-lg text-slate-600">What’s your ranger name?</p>
        <label className="mt-6 block text-sm font-semibold uppercase tracking-wide text-slate-500">Guardian nickname</label>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg text-slate-700 shadow-sm focus:border-emerald-500"
        />
        <motion.button whileTap={{ scale: 0.98 }} onClick={becomeGuardian} className="mt-8 w-full rounded-full px-6 py-4 text-lg font-bold text-white shadow-lg" style={{ background: selectedTheme.primary }}>
          BECOME A GUARDIAN
        </motion.button>
      </motion.div>
    </div>
  );

  const renderGame = () => (
    <div style={themeStyle} className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 p-4 md:p-6">
      <header className="max-w-7xl mx-auto rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-md soft-fade">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🐾</div>
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-700">WildQuest</div>
              <div className="text-xl font-black text-forest">Kenyan Savanna</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex md:items-center gap-4 text-sm">
            <div className="rounded-2xl bg-amber-100 px-3 py-2"><span className="font-semibold text-slate-600">Guardian:</span> {progress.name}</div>
            <div className="rounded-2xl bg-emerald-100 px-3 py-2"><span className="font-semibold text-slate-600">Conservation Points:</span> {progress.points}</div>
            <div className="rounded-2xl bg-sky-100 px-3 py-2"><span className="font-semibold text-slate-600">Level:</span> {progress.level}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
        <section className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.25 }} className="rounded-[32px] bg-white/65 p-6 shadow-soft card-glass">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-3xl font-black text-forest">KENYAN SAVANNAH</h2>
              <div className="text-sm font-semibold text-slate-500">Explore the ecosystem</div>
            </div>
            <div className="relative min-h-[360px] rounded-[28px] bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 overflow-hidden p-4">
              <div className="absolute left-8 top-8 text-4xl">☀️</div>
              <div className="absolute right-8 top-12 text-3xl">☁️</div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-700/70 to-transparent" />
              <div className="absolute bottom-12 left-8 text-3xl">🌳</div>
              <div className="absolute bottom-14 right-12 text-5xl">🌳</div>
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-5xl">💧</div>
              <div className="absolute left-16 bottom-20 text-5xl float-slow cursor-pointer" onClick={() => setSelectedAnimal(animals[1])}>🐘</div>
              <div className="absolute left-1/3 bottom-20 text-5xl float-delay cursor-pointer" onClick={() => setSelectedAnimal(animals[0])}>🦁</div>
              <div className="absolute right-1/3 bottom-24 text-5xl cursor-pointer" onClick={() => setSelectedAnimal(animals[2])}>🦒</div>
              <div className="absolute right-16 bottom-20 text-5xl cursor-pointer" onClick={() => setSelectedAnimal(animals[3])}>🦓</div>
              <div className="absolute bottom-12 left-2/3 text-4xl cursor-pointer" onClick={() => setSelectedAnimal(animals[10])}>🐝</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-4xl">🦅</div>
            </div>

            {selectedAnimal && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[28px] bg-emerald-50 p-5 border border-emerald-100">
                {selectedAnimalPhotos.length > 0 && (
                  <div className="mb-4 overflow-hidden rounded-2xl bg-white p-2 shadow-md">
                    <img src={selectedAnimalPhotos[selectedAnimalPhotoIndex % selectedAnimalPhotos.length]} alt={selectedAnimal.name} className="h-48 w-full rounded-xl object-cover" />
                    {selectedAnimalPhotos.length > 1 && (
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button onClick={() => setSelectedAnimalPhotoIndex((prev) => (prev - 1 + selectedAnimalPhotos.length) % selectedAnimalPhotos.length)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">Prev</button>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{selectedAnimalPhotoIndex + 1} / {selectedAnimalPhotos.length}</span>
                        <button onClick={() => setSelectedAnimalPhotoIndex((prev) => (prev + 1) % selectedAnimalPhotos.length)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">Next</button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 text-2xl font-black text-forest"><span>{selectedAnimal.emoji}</span> {selectedAnimal.name.toUpperCase()}</div>
                <div className="mt-3 grid gap-2 text-sm text-slate-700">
                  <div><span className="font-bold text-slate-800">Role:</span> {selectedAnimal.role}</div>
                  <div><span className="font-bold text-slate-800">Habitat:</span> {selectedAnimal.habitat}</div>
                  <div><span className="font-bold text-slate-800">Diet:</span> {selectedAnimal.diet}</div>
                  <div><span className="font-bold text-slate-800">Why it matters:</span> {selectedAnimal.whyItMatters}</div>
                  <div><span className="font-bold text-slate-800">Fun fact:</span> {selectedAnimal.funFact}</div>
                </div>
                <button onClick={() => loadAnimalInsight(selectedAnimal)} className="mt-4 rounded-full bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500">
                  {isLoadingAnimal ? 'Loading ranger insight...' : 'ASK RANGER ABOUT THIS ANIMAL'}
                </button>
                {showAnimalInsightInline && animalInsight && <div className="mt-3 rounded-2xl bg-white p-3 text-sm leading-relaxed text-slate-700">{animalInsight}</div>}
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-forest">ECOSYSTEM HEALTH</h3>
              <span className="text-2xl font-black text-emerald-700">{Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 4)}%</span>
            </div>
            <div className="mt-6 space-y-5">
              {[
                ['🐘 Wildlife', stats.wildlife],
                ['🌳 Habitat', stats.habitat],
                ['💧 Water', stats.water],
                ['👨‍👩‍👧 Community', stats.community],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700"><span>{label}</span><span>{value}%</span></div>
                  <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
            <h3 className="text-2xl font-black text-forest">BUILD THE FOOD CHAIN</h3>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {foodChain.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-center gap-3">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xl font-bold text-forest">{item}</div>
                  {index < foodChain.length - 1 && <ArrowRight className="text-slate-400" />}
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3 flex-wrap">
              <button onClick={() => reorderChain('up')} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50">Move Up</button>
              <button onClick={() => reorderChain('down')} className="rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50">Move Down</button>
              <button onClick={handleFoodChain} className="rounded-full bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500">CHECK ORDER</button>
            </div>
            {foodChainStatus && <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm font-medium text-amber-900">{foodChainStatus}</div>}
          </motion.div>
        </section>

        <aside className="space-y-8">
          <div id="challenge-panel" className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-black text-forest">CHALLENGE {challengeIndex + 1}</h3>
              <button onClick={nextChallenge} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">Next mission</button>
            </div>
            <div className="mt-3 text-4xl">{activeChallenge?.emoji}</div>
            <h4 className="mt-4 text-2xl font-bold text-forest">{activeChallenge?.title}</h4>
            <p className="mt-2 text-slate-600">{activeChallenge?.description}</p>
            <p className="mt-5 text-lg font-semibold text-slate-700">{activeChallenge?.question}</p>
            <div className="mt-4 space-y-3">
              {activeChallenge?.options.map((option) => (
                <button key={option.id} onClick={() => handleChoice(option, activeChallenge)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                  {option.text}
                </button>
              ))}
            </div>
            {challengeResult && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 rounded-2xl bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
                {challengeResult}
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.25 }} className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
            <h3 className="text-2xl font-black text-forest">TODAY’S WILDLIFE FACT 🐾</h3>
            <p className="mt-4 text-lg text-slate-700">“{currentFact.fact}”</p>
            <motion.button whileTap={{ scale: 0.97 }} onClick={nextFact} className="mt-5 rounded-full bg-amber-500 px-5 py-2 font-bold text-white hover:bg-amber-400" style={{ background: selectedTheme.primary }}>New Fact</motion.button>
          </motion.div>

          <motion.div id="badge-panel" initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.25 }} className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
            <h3 className="text-2xl font-black text-forest">BADGES</h3>
            <div className="mt-4 space-y-3">
              {topBadges.map((badge) => (
                <div key={badge.id} className={`flex items-center gap-3 rounded-2xl p-3 ${badge.unlocked ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <span className="text-2xl">{badge.emoji}</span>
                  <div>
                    <div className="font-bold text-slate-700">{badge.title}</div>
                    <div className="text-xs text-slate-500">{badge.unlocked ? 'Unlocked' : 'Locked'}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>
      </main>

      <div className="fixed bottom-5 left-5 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-3 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-500"
          >
            <Bot size={18} />
            Open Ranger
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-[340px] rounded-[28px] border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg">🤖</div>
                <div>
                  <div className="text-sm font-black text-forest">Ranger Bot</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-700">Online</div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">Close</button>
            </div>

            <div className="border-b border-slate-200 px-4 py-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Choose another animal</p>
              <div className="flex flex-wrap gap-2">
                {extraAnimalChoices.map((animalName) => (
                  <button
                    key={animalName}
                    onClick={() => chooseAnimalPrompt(animalName)}
                    className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    {animalName}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[290px] overflow-y-auto bg-slate-50 p-3">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                        message.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">Ranger is thinking...</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-200 p-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void askAi();
                  }
                }}
                placeholder="Ask about any animal..."
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
              <button onClick={() => void askAi()} className="rounded-full bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">Send</button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-8 grid gap-8 xl:grid-cols-[1.2fr_1.3fr_0.9fr]">
        <section id="wildlife-library" className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
          <h3 className="text-2xl font-black text-forest">WILDLIFE LIBRARY</h3>
          <div className="mt-5 flex items-center justify-between gap-3">
            <h4 className="text-lg font-black text-forest">Level {levelIndex + 1} cards</h4>
            <div className="flex gap-2">
              <button onClick={() => jumpToAnimalLevel(levelIndex - 1)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">Previous</button>
              <button onClick={() => jumpToAnimalLevel(levelIndex + 1)} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">Next level</button>
            </div>
          </div>
          <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeLibraryAnimals.map((animal) => (
              <button key={animal.id} onClick={() => void loadAnimalInsight(animal)} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-0 text-left transition hover:border-emerald-300 hover:bg-emerald-50">
                {animal.image && <img src={animal.image} alt={animal.name} className="h-28 w-full object-cover" />}
                <div className="p-4">
                  <div className="text-3xl">{animal.emoji}</div>
                  <div className="mt-2 font-bold text-forest">{animal.name}</div>
                  <div className="text-sm text-slate-600">{animal.role}</div>
                  <div className="mt-2 text-xs text-slate-500">{animal.habitat}</div>
                </div>
              </button>
            ))}
          </div>

          {selectedAnimal && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-[28px] border border-emerald-200 bg-emerald-50 p-4 shadow-soft">
              {selectedAnimal.image && <img src={selectedAnimal.image} alt={selectedAnimal.name} className="mb-4 h-40 w-full rounded-2xl object-cover shadow-md" />}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedAnimal.emoji}</div>
                  <div>
                    <div className="text-xl font-black text-forest">{selectedAnimal.name}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-emerald-700">Animals in focus</div>
                  </div>
                </div>
                <button onClick={() => setSelectedAnimal(null)} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">Close</button>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div><span className="font-bold text-slate-800">Role:</span> {selectedAnimal.role}</div>
                <div><span className="font-bold text-slate-800">Habitat:</span> {selectedAnimal.habitat}</div>
                <div><span className="font-bold text-slate-800">Diet:</span> {selectedAnimal.diet}</div>
                <div><span className="font-bold text-slate-800">Why it matters:</span> {selectedAnimal.whyItMatters}</div>
                <div><span className="font-bold text-slate-800">Fun fact:</span> {selectedAnimal.funFact}</div>
              </div>
              {isLoadingAnimal ? (
                <div className="mt-3 rounded-2xl bg-sky-50 p-3 text-sm font-medium text-sky-700">Loading Ranger insight...</div>
              ) : animalInsight ? (
                <div className="mt-3 rounded-2xl bg-sky-50 p-3 text-sm leading-relaxed text-slate-700">{animalInsight}</div>
              ) : null}
            </motion.div>
          )}
        </section>

        <section id="game-map" className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
          <h3 className="text-2xl font-black text-forest">EXPLORE KENYA 🇰🇪</h3>
          <div className="mt-5 relative h-[220px] rounded-[28px] bg-gradient-to-br from-emerald-100 via-lime-100 to-sky-100 overflow-hidden border border-emerald-200">
            <div className="absolute inset-x-6 top-8 h-20 rounded-full bg-white/50 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-[12px] border-emerald-200/60" />
            {mapLocations.map((location) => (
              <button key={location.id} onClick={() => setSelectedLocation(location)} style={{ left: location.x, top: location.y }} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white shadow-md">
                📍
              </button>
            ))}
          </div>
          {selectedLocation && (
            <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm text-slate-700">
              <div className="font-black text-forest">{selectedLocation.name}</div>
              <div className="mt-1">Ecosystem: {selectedLocation.ecosystem}</div>
              <div>Animals: {selectedLocation.animals.join(', ')}</div>
              <div className="mt-2 text-slate-600">{selectedLocation.fact}</div>
            </div>
          )}
        </section>

        <section id="ask-ranger-panel" className="rounded-[32px] bg-white/70 p-6 shadow-soft card-glass">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-black text-forest">🤖 ASK RANGER</h3>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Live</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['Why are elephants important?', 'How do lions help the food chain?', 'How can I protect forests?'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => void askAi(prompt)}
                className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-4 h-[280px] overflow-y-auto rounded-[24px] border border-slate-200 bg-slate-50 p-3">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-sky-600 text-white'
                        : 'bg-white text-slate-700 ring-1 ring-slate-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
                    Ranger is thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void askAi();
                }
              }}
              placeholder="Ask about any animal..."
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none ring-0 transition focus:border-sky-400"
            />
            <button
              onClick={() => void askAi()}
              className="rounded-full bg-sky-600 px-4 py-3 font-bold text-white hover:bg-sky-500"
            >
              Send
            </button>
          </div>

          {(showAnimalInsightInline && animalInsight) || aiResponse ? (
            <div className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm leading-relaxed whitespace-pre-line text-slate-700">
              {showAnimalInsightInline && animalInsight ? animalInsight : aiResponse}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );

  return currentScreen === 'home' ? renderHome() : currentScreen === 'profile' ? renderProfile() : renderGame();
}

export default App;
