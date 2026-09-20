import type { Achievement, Animal, Challenge, EcosystemStats, LocationSpot, WildlifeFact } from './types';

export const ecosystemStatsDefault: EcosystemStats = {
  wildlife: 82,
  habitat: 76,
  water: 68,
  community: 90,
};

const animalArt = (name: string, emoji: string, primary: string, secondary: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${secondary}"/>
          <stop offset="100%" stop-color="${primary}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="260" cy="170" r="90" fill="rgba(255,255,255,0.18)"/>
      <path d="M0 700 C200 620 350 560 540 620 S930 760 1200 650 L1200 900 L0 900 Z" fill="rgba(15, 90, 39, 0.2)"/>
      <text x="600" y="500" text-anchor="middle" font-size="260">${emoji}</text>
      <rect x="180" y="680" width="840" height="120" rx="60" fill="rgba(15, 22, 20, 0.18)"/>
      <text x="600" y="760" text-anchor="middle" fill="#ffffff" font-size="72" font-weight="700" font-family="Verdana, Arial, sans-serif">${name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createAnimalArtSet = (name: string, emoji: string, primary: string, secondary: string, accent: string) => {
  const baseImage = animalArt(name, emoji, primary, secondary);

  return {
    image: baseImage,
    images: [
      baseImage,
      animalArt(name, emoji, accent, primary),
      animalArt(name, emoji, secondary, accent),
    ],
  };
};

export const animals: Animal[] = [
  { id: 'lion', name: 'Lion', emoji: '🦁', habitat: 'Savannah grasslands', diet: 'Large herbivores', conservation: 'Protected areas and anti-poaching efforts', whyItMatters: 'Lions help keep herbivore populations balanced, which supports healthier grasslands.', role: 'Predator', funFact: 'A lion pride often rests together during the hottest part of the day to save energy.', ...createAnimalArtSet('Lion', '🦁', '#f59e0b', '#7c2d12', '#fef3c7') },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', habitat: 'Savannah and forests', diet: 'Plants', conservation: 'Water source protection and wildlife corridors', whyItMatters: 'Elephants spread seeds and shape habitats, helping many other species survive.', role: 'Seed disperser', funFact: 'Elephants can remember water sources and routes across huge distances.', ...createAnimalArtSet('Elephant', '🐘', '#a16207', '#14532d', '#fef3c7') },
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', habitat: 'Open woodlands', diet: 'Leaves and acacia', conservation: 'Habitat conservation and anti-poaching', whyItMatters: 'Giraffes browse high leaves and help shape plant communities across the savannah.', role: 'Browser', funFact: 'A giraffe’s tongue is dark blue to protect it from the harsh sun while feeding.', ...createAnimalArtSet('Giraffe', '🦒', '#facc15', '#14532d', '#fef9c3') },
  { id: 'zebra', name: 'Zebra', emoji: '🦓', habitat: 'Grasslands', diet: 'Grass', conservation: 'Protected migration routes', whyItMatters: 'Zebras graze grassland, supporting food chains and helping maintain ecosystem balance.', role: 'Grazing herbivore', funFact: 'Each zebra’s stripes are unique, like a fingerprint.', ...createAnimalArtSet('Zebra', '🦓', '#d97706', '#111827', '#fef3c7') },
  { id: 'rhino', name: 'Rhino', emoji: '🦏', habitat: 'Grasslands and bush', diet: 'Plants', conservation: 'Anti-poaching and habitat protection', whyItMatters: 'Rhinos help keep vegetation balanced and are a key part of Kenya’s wildlife heritage.', role: 'Large grazer', funFact: 'Rhinos can use their horns to clear paths through thick bush and help open space for other animals.', ...createAnimalArtSet('Rhino', '🦏', '#94a3b8', '#166534', '#e2e8f0') },
  { id: 'leopard', name: 'Leopard', emoji: '🐆', habitat: 'Woodlands and hills', diet: 'Small mammals and birds', conservation: 'Habitat protection and prey conservation', whyItMatters: 'Leopards control prey populations and keep food webs healthy.', role: 'Stealth predator', funFact: 'Leopards are excellent climbers and often drag their food into trees to keep it safe.', ...createAnimalArtSet('Leopard', '🐆', '#f97316', '#3f3f46', '#fed7aa') },
  { id: 'hippo', name: 'Hippo', emoji: '🦛', habitat: 'Rivers and lakes', diet: 'Grass', conservation: 'River health and safe corridors', whyItMatters: 'Hippos help maintain riverbank ecosystems and support many other species.', role: 'River engineer', funFact: 'Hippos can stay underwater for several minutes and use the riverbank as a resting place during the day.', ...createAnimalArtSet('Hippo', '🦛', '#64748b', '#0f172a', '#e2e8f0') },
  { id: 'cheetah', name: 'Cheetah', emoji: '🐆', habitat: 'Open grasslands', diet: 'Antelope', conservation: 'Habitat corridors and protection of prey', whyItMatters: 'Cheetahs help regulate antelope populations and keep ecosystems dynamic.', role: 'Fast predator', funFact: 'Cheetahs are the fastest land animals and can sprint in short bursts to catch prey.', ...createAnimalArtSet('Cheetah', '🐆', '#f59e0b', '#713f12', '#fef3c7') },
  { id: 'wild-dog', name: 'African Wild Dog', emoji: '🐕', habitat: 'Open plains and woodlands', diet: 'Small antelope and scavenged meat', conservation: 'Habitat connectivity and anti-poaching', whyItMatters: 'Wild dogs help control prey numbers and keep the savannah food web balanced.', role: 'Pack hunter', funFact: 'African wild dogs live in packs and often share food with one another.', ...createAnimalArtSet('Wild Dog', '🐕', '#fbbf24', '#78350f', '#fef3c7') },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', habitat: 'Lakes and wetlands', diet: 'Algae and small aquatic life', conservation: 'Wetland protection', whyItMatters: 'Flamingos are indicators of healthy wetland ecosystems and attract eco-tourism.', role: 'Wetland sentinel', funFact: 'Flamingos stand on one leg to help conserve body heat in cool water.', ...createAnimalArtSet('Flamingo', '🦩', '#f472b6', '#7c2d12', '#f9a8d4') },
  { id: 'eagle', name: 'Eagle', emoji: '🦅', habitat: 'Cliffs and open skies', diet: 'Small mammals and birds', conservation: 'Tree and nesting site protection', whyItMatters: 'Eagles help control smaller animal populations and show ecosystem health.', role: 'Apex bird', funFact: 'Some eagles can spot prey from high in the sky because of their excellent vision.', ...createAnimalArtSet('Eagle', '🦅', '#fbbf24', '#0f172a', '#fef3c7') },
  { id: 'bee', name: 'Bee', emoji: '🐝', habitat: 'Flowering plants and trees', diet: 'Nectar and pollen', conservation: 'Native flower planting and pesticide reduction', whyItMatters: 'Bees pollinate plants, helping forests and crops grow and support other wildlife.', role: 'Pollinator', funFact: 'Bees communicate with each other by dancing to show where flowers are located.', ...createAnimalArtSet('Bee', '🐝', '#fbbf24', '#78350f', '#fde68a') },
  { id: 'buffalo', name: 'African Buffalo', emoji: '🐃', habitat: 'Wet grasslands and savannah', diet: 'Grass', conservation: 'Healthy grazing areas and anti-poaching', whyItMatters: 'Buffaloes are powerful grazers that shape the landscape and support predators and scavengers alike.', role: 'Grazer', funFact: 'Buffaloes often stay together in herds for protection and can defend one another from danger.', ...createAnimalArtSet('Buffalo', '🐃', '#a78bfa', '#14532d', '#ddd6fe') },
  { id: 'gazelle', name: 'Gazelle', emoji: '🦌', habitat: 'Open plains', diet: 'Grass and leaves', conservation: 'Safe migration corridors and grassland care', whyItMatters: 'Gazelles are quick-moving grazers that help keep grasslands productive and support predator food webs.', role: 'Fast grazer', funFact: 'Gazelles can leap high to signal danger and escape predators.', ...createAnimalArtSet('Gazelle', '🦌', '#facc15', '#166534', '#fef9c3') },
  { id: 'baboon', name: 'Baboon', emoji: '🐒', habitat: 'Rocky hills and savanna', diet: 'Fruit, seeds, insects', conservation: 'Habitat and human-wildlife balance', whyItMatters: 'Baboons spread seeds and shape the landscape while teaching us how adaptable wildlife can be.', role: 'Omnivore explorer', funFact: 'Baboons are social and use teamwork to defend their group and protect babies.', ...createAnimalArtSet('Baboon', '🐒', '#d97706', '#3f3f46', '#fed7aa') },
  { id: 'monkey', name: 'Sykes Monkey', emoji: '🐵', habitat: 'Forest edges and riverine trees', diet: 'Fruit and leaves', conservation: 'Forest connectivity and habitat protection', whyItMatters: 'Monkeys help spread seeds and show the health of forest edges and river systems.', role: 'Seed spreader', funFact: 'Sykes monkeys are quick and alert, often using trees to move safely between feeding areas.', ...createAnimalArtSet('Monkey', '🐵', '#f59e0b', '#166534', '#fef3c7') },
  { id: 'warthog', name: 'Warthog', emoji: '🐗', habitat: 'Grasslands and open bush', diet: 'Roots, tubers, and grass', conservation: 'Grassland and soil health protection', whyItMatters: 'Warthogs help turn over soil and contribute to a dynamic, healthy grassland food web.', role: 'Soil helper', funFact: 'Warthogs often kneel down to graze, using their snouts to dig carefully for food.', ...createAnimalArtSet('Warthog', '🐗', '#d97706', '#4b5563', '#fef3c7') },
];
export const challenges: Challenge[] = [
  {
    id: 'water',
    title: 'The Water Problem',
    emoji: '💧',
    description: 'During the dry season, animals are struggling to find water.',
    question: 'What should the Wildlife Guardian do?',
    reward: 50,
    options: [
      { id: 'a', text: 'Protect the water source', correct: true, explanation: 'Excellent! Protecting water helps elephants, birds, zebras and many other species.' },
      { id: 'b', text: 'Ignore the problem', correct: false, explanation: 'Think about the ecosystem. Water is needed by many different species.' },
      { id: 'c', text: 'Destroy nearby vegetation', correct: false, explanation: 'Healthy plants and water systems work together. Removing vegetation makes water even scarcer.' },
    ],
  },
  {
    id: 'habitat',
    title: 'Habitat Restoration',
    emoji: '🌳',
    description: 'A section of forest is being cleared for firewood and grazing.',
    question: 'What is the best action for the guardian?',
    reward: 60,
    options: [
      { id: 'a', text: 'Restore native trees and protect the area', correct: true, explanation: 'Great choice! Healthy habitats give animals shelter, shade, and food.' },
      { id: 'b', text: 'Cut more trees for space', correct: false, explanation: 'Removing trees removes shelter and increases erosion, making life harder for many animals.' },
      { id: 'c', text: 'Leave it alone and hope it fixes itself', correct: false, explanation: 'Nature needs active care, especially when homes are damaged.' },
    ],
  },
  {
    id: 'food-chain',
    title: 'Food Chain Balance',
    emoji: '🦁',
    description: 'The grassland food web is shifting after a species disappears.',
    question: 'What happens when grass is removed from the food chain?',
    reward: 70,
    options: [
      { id: 'a', text: 'Zebras lose food and lions may struggle too', correct: true, explanation: 'Right! Plants provide energy for herbivores, and predators depend on those herbivores.' },
      { id: 'b', text: 'The ecosystem becomes stronger', correct: false, explanation: 'Ecosystems depend on every link. Removing one part weakens the whole chain.' },
      { id: 'c', text: 'Only the lion population grows', correct: false, explanation: 'Predators need prey, so a broken food chain affects many species.' },
    ],
  },
  {
    id: 'conflict',
    title: 'Human-Wildlife Coexistence',
    emoji: '🐘',
    description: 'Farmers and elephants both need space, but conflict is rising near the border.',
    question: 'What helps both communities and wildlife?',
    reward: 80,
    options: [
      { id: 'a', text: 'Build wildlife-safe fences and community education', correct: true, explanation: 'Yes! Safe shared spaces help people and animals coexist with less stress.' },
      { id: 'b', text: 'Chase elephants away with no plan', correct: false, explanation: 'Harming wildlife without solutions can increase conflict and fear.' },
      { id: 'c', text: 'Ignore the issue and close the area', correct: false, explanation: 'Communities and wildlife can share land if conservation and safety plans are in place.' },
    ],
  },
  {
    id: 'protection',
    title: 'Wildlife Protection',
    emoji: '🦏',
    description: 'A rare rhino is being threatened by poaching and habitat loss.',
    question: 'How can the guardian best protect it?',
    reward: 90,
    options: [
      { id: 'a', text: 'Support anti-poaching patrols and safe habitat', correct: true, explanation: 'Exactly! Endangered animals need both protection and healthy ecosystems to thrive.' },
      { id: 'b', text: 'Do nothing because it is a wild animal', correct: false, explanation: 'Many species need human protection when their populations are shrinking.' },
      { id: 'c', text: 'Remove all other animals from the area', correct: false, explanation: 'Healthy ecosystems need balance, not isolation or disruption.' },
    ],
  },
  {
    id: 'pollinators',
    title: 'Bee Buzz Mission',
    emoji: '🐝',
    description: 'A local farm is using too many pesticides near flowering plants.',
    question: 'Why is protecting bees important?',
    reward: 55,
    options: [
      { id: 'a', text: 'They help plants make fruits and seeds', correct: true, explanation: 'Correct! Pollinators help plants reproduce and support food webs.' },
      { id: 'b', text: 'They are only useful for honey', correct: false, explanation: 'Bees do much more than make honey—they help many plants and animals survive.' },
      { id: 'c', text: 'They hurt gardens', correct: false, explanation: 'Healthy pollinator populations are a sign of a strong habitat.' },
    ],
  },
  {
    id: 'migration',
    title: 'Migration Mission',
    emoji: '🦓',
    description: 'A herd must cross a road during migration season.',
    question: 'What would be the safest solution?',
    reward: 65,
    options: [
      { id: 'a', text: 'Create safe crossing routes and community awareness', correct: true, explanation: 'Right! Safe wildlife corridors reduce accidents and protect important routes.' },
      { id: 'b', text: 'Block all migration routes', correct: false, explanation: 'Animals need space to move naturally, not harder barriers.' },
      { id: 'c', text: 'Chase the herd into the city', correct: false, explanation: 'That would create danger for both animals and people.' },
    ],
  },
  {
    id: 'wetlands',
    title: 'Wetland Watch',
    emoji: '🦩',
    description: 'A local wetland is drying up because of drainage and pollution.',
    question: 'Why do wetlands matter so much?',
    reward: 75,
    options: [
      { id: 'a', text: 'They store water and support many birds, fish, and animals', correct: true, explanation: 'Exactly! Wetlands are biodiversity hotspots and natural water filters.' },
      { id: 'b', text: 'They are only for bird watching', correct: false, explanation: 'Wetlands protect countless species and help communities too.' },
      { id: 'c', text: 'They should be filled in for roads', correct: false, explanation: 'Destroying wetlands increases water loss and harms habitats.' },
    ],
  },
  {
    id: 'predator',
    title: 'Predator Balance',
    emoji: '🦁',
    description: 'An area has too many antelope and too few predators.',
    question: 'What is the most balanced result?',
    reward: 85,
    options: [
      { id: 'a', text: 'Protect the predator and its habitat', correct: true, explanation: 'Excellent! Predators help keep prey numbers in balance and support healthy ecosystems.' },
      { id: 'b', text: 'Remove all predators instantly', correct: false, explanation: 'This can create a chain reaction that damages the whole food web.' },
      { id: 'c', text: 'Ignore the problem', correct: false, explanation: 'Balance is essential when ecosystems are out of sync.' },
    ],
  },
  {
    id: 'forest',
    title: 'Forest Friend',
    emoji: '🌲',
    description: 'A young tree planting project is ready to begin in the community.',
    question: 'What makes the project strongest?',
    reward: 95,
    options: [
      { id: 'a', text: 'Plant native species and protect them as they grow', correct: true, explanation: 'Perfect! Native trees fit the habitat and support wildlife better than random species.' },
      { id: 'b', text: 'Plant only one kind of tree everywhere', correct: false, explanation: 'Biodiversity creates stronger and healthier habitats.' },
      { id: 'c', text: 'Cut down old trees to make room', correct: false, explanation: 'Old trees are valuable shelters and habitats for many animals.' },
    ],
  },
];

export const achievements: Achievement[] = [
  { id: 'elephant', title: 'Elephant Protector', emoji: '🐘', unlocked: true, description: 'Saved water and habitat for elephants.' },
  { id: 'forest', title: 'Forest Guardian', emoji: '🌳', unlocked: false, description: 'Protected native habitats and restored balance.' },
  { id: 'water', title: 'Water Defender', emoji: '💧', unlocked: false, description: 'Helped safeguard essential water sources.' },
  { id: 'expert', title: 'Ecosystem Expert', emoji: '🦁', unlocked: false, description: 'Mastered the balance of species and food webs.' },
  { id: 'wildlife', title: 'Wildlife Protector', emoji: '🦏', unlocked: false, description: 'Supported conservation for endangered animals.' },
];

export const wildlifeFacts: WildlifeFact[] = [
  { id: 'fact-1', fact: 'Elephants can help spread seeds across large distances, helping plants grow in different areas.' },
  { id: 'fact-2', fact: 'Healthy forests provide shelter, clean air, and water for animals and people.' },
  { id: 'fact-3', fact: 'Predators like lions help keep prey numbers balanced so habitats stay healthy.' },
  { id: 'fact-4', fact: 'Bees pollinate flowers, helping plants produce fruits and seeds that feed wildlife.' },
  { id: 'fact-5', fact: 'Wetlands are home to birds, fish, and mammals, and they help store water naturally.' },
  { id: 'fact-6', fact: 'Many animals travel long distances between feeding areas and water sources, so safe corridors matter.' },
  { id: 'fact-7', fact: 'A single healthy ecosystem can support insects, birds, mammals, plants, and people at the same time.' },
  { id: 'fact-8', fact: 'When one species disappears, the whole food web can feel the impact, even if we do not see it right away.' },
  { id: 'fact-9', fact: 'Some animals are called “ecosystem engineers” because their actions shape the land around them.' },
  { id: 'fact-10', fact: 'Protecting nature often means protecting the water, food, and safety that people also depend on.' },
];

export const mapLocations: LocationSpot[] = [
  { id: 'maasai-mara', name: 'Maasai Mara', x: '38%', y: '36%', ecosystem: 'Open grasslands', animals: ['Lion', 'Zebra', 'Cheetah'], fact: 'The Mara is famous for the Great Migration, where wildebeest and zebra move in search of food and water.', challenge: 'Food chains and migration routes' },
  { id: 'amboseli', name: 'Amboseli', x: '46%', y: '65%', ecosystem: 'Savannah near mountains', animals: ['Elephant', 'Giraffe', 'Buffalo'], fact: 'Elephants here often gather near water and can shape the landscape around it.', challenge: 'Water and habitat protection' },
  { id: 'tsavo', name: 'Tsavo', x: '60%', y: '56%', ecosystem: 'Semi-arid savannah', animals: ['Rhino', 'Leopard', 'Hippo'], fact: 'Tsavo is one of the world’s largest wildlife sanctuaries and is home to many threatened species.', challenge: 'Wildlife protection' },
  { id: 'nakuru', name: 'Lake Nakuru', x: '49%', y: '43%', ecosystem: 'Wetlands and lake', animals: ['Flamingo', 'Eagle', 'Hippo'], fact: 'Lake Nakuru attracts flamingos and many birds because of its shallow, alkaline waters.', challenge: 'Wetland health' },
  { id: 'nairobi', name: 'Nairobi National Park', x: '51%', y: '53%', ecosystem: 'Urban wildlife reserve', animals: ['Lion', 'Giraffe', 'Rhino'], fact: 'This park shows how wildlife can live near a big city when habitats and corridors are protected.', challenge: 'Human-wildlife coexistence' },
];
