import { createRequire } from 'module';
import bcrypt from 'bcryptjs';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Seeding is not allowed in production environment!');
  }

  console.log('🌱 Seeding database...');

  // ── Users ─────────────────────────────────────────
  const rawAdminPwd = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const rawUserPwd = process.env.SEED_USER_PASSWORD || 'user123';
  const adminPassword = await bcrypt.hash(rawAdminPwd, 12);
  const userPassword = await bcrypt.hash(rawUserPwd, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aqualuxe.vn' },
    update: {},
    create: {
      name: 'Admin AquaLuxe',
      email: 'admin@aqualuxe.vn',
      password: adminPassword,
      role: 'ADMIN',
      phone: '0901234567',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user@aqualuxe.vn' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@aqualuxe.vn',
      password: userPassword,
      phone: '0912345678',
      address: '123 Main Street, District 1, HCMC',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'fishfan@gmail.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'fishfan@gmail.com',
      password: userPassword,
      phone: '0923456789',
      address: '456 Ocean Avenue, District 3, HCMC',
    },
  });

  console.log('✅ Users seeded');

  // ── Fish Species ──────────────────────────────────
  const speciesData = [
    {
      name: 'Betta',
      scientificName: 'Betta splendens',
      description:
        'Also known as Siamese fighting fish, Bettas are famous for their vibrant, flowing fins and intense colors. Easy to care for and ideal for beginners.',
      careLevel: 'EASY',
      temperament: 'AGGRESSIVE',
      waterType: 'FRESHWATER',
      minTankSize: 10,
      minTemp: 24,
      maxTemp: 30,
      minPh: 6.0,
      maxPh: 7.5,
      maxSize: 7,
      lifespan: '3-5 years',
      diet: 'Omnivore',
      origin: 'Southeast Asia',
    },
    {
      name: 'Neon Tetra',
      scientificName: 'Paracheirodon innesi',
      description:
        'Small, colorful fish with a brilliant blue-and-red stripe. Best kept in schools. Extremely popular in community aquariums.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 40,
      minTemp: 22,
      maxTemp: 26,
      minPh: 5.5,
      maxPh: 7.0,
      maxSize: 4,
      lifespan: '5-8 years',
      diet: 'Omnivore',
      origin: 'South America',
    },
    {
      name: 'Discus',
      scientificName: 'Symphysodon',
      description:
        'Known as the "King of Freshwater Fish", Discus have a stunning disc-shaped body and come in an incredible variety of colors and patterns.',
      careLevel: 'HARD',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 200,
      minTemp: 26,
      maxTemp: 30,
      minPh: 5.5,
      maxPh: 7.0,
      maxSize: 20,
      lifespan: '10-15 years',
      diet: 'Omnivore',
      origin: 'Amazon, South America',
    },
    {
      name: 'Goldfish',
      scientificName: 'Carassius auratus',
      description:
        'One of the oldest domesticated ornamental fish, Goldfish symbolize luck and prosperity in many cultures.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 75,
      minTemp: 18,
      maxTemp: 24,
      minPh: 6.5,
      maxPh: 7.5,
      maxSize: 30,
      lifespan: '10-15 years',
      diet: 'Omnivore',
      origin: 'China',
    },
    {
      name: 'Clownfish (Nemo)',
      scientificName: 'Amphiprion ocellaris',
      description:
        'Made famous by the movie "Finding Nemo", Clownfish are bright orange with distinctive white stripes. Hardy and reef-safe.',
      careLevel: 'MODERATE',
      temperament: 'PEACEFUL',
      waterType: 'SALTWATER',
      minTankSize: 75,
      minTemp: 24,
      maxTemp: 28,
      minPh: 8.0,
      maxPh: 8.4,
      maxSize: 11,
      lifespan: '6-10 years',
      diet: 'Omnivore',
      origin: 'Indo-Pacific',
    },
    {
      name: 'Blue Tang (Dory)',
      scientificName: 'Paracanthurus hepatus',
      description:
        'The Blue Hippo Tang (Dory) features a stunning royal blue body with yellow tail. One of the most beautiful marine fish.',
      careLevel: 'HARD',
      temperament: 'SEMI_AGGRESSIVE',
      waterType: 'SALTWATER',
      minTankSize: 300,
      minTemp: 24,
      maxTemp: 28,
      minPh: 8.1,
      maxPh: 8.4,
      maxSize: 31,
      lifespan: '8-20 years',
      diet: 'Omnivore',
      origin: 'Indo-Pacific',
    },
    {
      name: 'Arowana',
      scientificName: 'Scleropages formosus',
      description:
        'The Arowana is the ultimate feng-shui fish, symbolizing power and fortune. Prized for its shimmering metallic scales.',
      careLevel: 'EXPERT',
      temperament: 'AGGRESSIVE',
      waterType: 'FRESHWATER',
      minTankSize: 500,
      minTemp: 24,
      maxTemp: 30,
      minPh: 6.5,
      maxPh: 7.5,
      maxSize: 90,
      lifespan: '20+ years',
      diet: 'Carnivore',
      origin: 'Southeast Asia',
    },
    {
      name: 'Koi',
      scientificName: 'Cyprinus rubrofuscus',
      description:
        'Japanese Koi with diverse and elegant patterns. Symbolizes perseverance and success.',
      careLevel: 'MODERATE',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 1000,
      minTemp: 15,
      maxTemp: 25,
      minPh: 7.0,
      maxPh: 8.0,
      maxSize: 90,
      lifespan: '25-35 years',
      diet: 'Omnivore',
      origin: 'Japan',
    },
    {
      name: 'Angelfish',
      scientificName: 'Pterophyllum scalare',
      description:
        'Elegant triangular-shaped fish with long, flowing fins. A graceful centerpiece for any freshwater aquarium.',
      careLevel: 'MODERATE',
      temperament: 'SEMI_AGGRESSIVE',
      waterType: 'FRESHWATER',
      minTankSize: 100,
      minTemp: 24,
      maxTemp: 30,
      minPh: 6.0,
      maxPh: 7.5,
      maxSize: 15,
      lifespan: '10-12 years',
      diet: 'Omnivore',
      origin: 'Amazon, South America',
    },
    {
      name: 'Guppy',
      scientificName: 'Poecilia reticulata',
      description:
        'Colorful and prolific breeders, Guppies are the perfect choice for beginners. Available in countless color varieties.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 20,
      minTemp: 22,
      maxTemp: 28,
      minPh: 6.5,
      maxPh: 8.0,
      maxSize: 6,
      lifespan: '2-3 years',
      diet: 'Omnivore',
      origin: 'South America',
    },
    {
      name: 'Corydoras',
      scientificName: 'Corydoras paleatus',
      description:
        'Peaceful bottom-dwelling catfish that diligently clean up leftover food. Best kept in groups.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 40,
      minTemp: 22,
      maxTemp: 26,
      minPh: 6.0,
      maxPh: 7.5,
      maxSize: 7,
      lifespan: '5-7 years',
      diet: 'Omnivore',
      origin: 'South America',
    },
    {
      name: 'Pearl Gourami',
      scientificName: 'Trichopodus leerii',
      description:
        'Pearl Gourami features beautiful pearlescent white spots across its entire body. Peaceful and elegant.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 75,
      minTemp: 24,
      maxTemp: 28,
      minPh: 6.0,
      maxPh: 7.5,
      maxSize: 12,
      lifespan: '4-6 years',
      diet: 'Omnivore',
      origin: 'Southeast Asia',
    },
    {
      name: 'Mandarin Dragonet',
      scientificName: 'Synchiropus splendidus',
      description:
        'The Mandarin Dragonet is arguably the most colorful fish in the ocean — a living work of art with psychedelic patterns.',
      careLevel: 'EXPERT',
      temperament: 'PEACEFUL',
      waterType: 'SALTWATER',
      minTankSize: 100,
      minTemp: 24,
      maxTemp: 28,
      minPh: 8.1,
      maxPh: 8.4,
      maxSize: 8,
      lifespan: '5-10 years',
      diet: 'Micro-carnivore',
      origin: 'Pacific Ocean',
    },
    {
      name: 'Oscar',
      scientificName: 'Astronotus ocellatus',
      description:
        'Oscars are intelligent fish that can recognize their owner. Large size with bold personality.',
      careLevel: 'MODERATE',
      temperament: 'AGGRESSIVE',
      waterType: 'FRESHWATER',
      minTankSize: 200,
      minTemp: 22,
      maxTemp: 28,
      minPh: 6.0,
      maxPh: 8.0,
      maxSize: 35,
      lifespan: '10-15 years',
      diet: 'Carnivore',
      origin: 'South America',
    },
    {
      name: 'Cherry Shrimp',
      scientificName: 'Neocaridina davidi',
      description:
        'Bright red Cherry Shrimp are easy to keep and help clean algae. Perfect for planted nano tanks.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 10,
      minTemp: 18,
      maxTemp: 28,
      minPh: 6.5,
      maxPh: 8.0,
      maxSize: 3,
      lifespan: '1-2 years',
      diet: 'Omnivore',
      origin: 'Taiwan',
    },
    {
      name: 'Pleco',
      scientificName: 'Hypostomus plecostomus',
      description:
        'Plecos are expert algae eaters that keep your tank sparkling clean. Most active at night.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 100,
      minTemp: 22,
      maxTemp: 28,
      minPh: 6.5,
      maxPh: 7.5,
      maxSize: 30,
      lifespan: '10-15 years',
      diet: 'Herbivore',
      origin: 'South America',
    },
    {
      name: 'Lionfish',
      scientificName: 'Pterois volitans',
      description:
        'Lionfish with majestic fan-like fins are awe-inspiring but have venomous spines — handle with caution.',
      careLevel: 'EXPERT',
      temperament: 'AGGRESSIVE',
      waterType: 'SALTWATER',
      minTankSize: 300,
      minTemp: 22,
      maxTemp: 28,
      minPh: 8.1,
      maxPh: 8.4,
      maxSize: 38,
      lifespan: '10-15 years',
      diet: 'Carnivore',
      origin: 'Indo-Pacific',
    },
    {
      name: 'Molly',
      scientificName: 'Poecilia sphenops',
      description:
        'Mollies come in many color varieties and breed easily. Suitable for both freshwater and brackish water.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 40,
      minTemp: 22,
      maxTemp: 28,
      minPh: 7.0,
      maxPh: 8.5,
      maxSize: 10,
      lifespan: '3-5 years',
      diet: 'Omnivore',
      origin: 'Central America',
    },
    {
      name: 'Red Rainbowfish',
      scientificName: 'Glossolepis incisus',
      description:
        'Brilliant red schooling fish from Indonesia. Males display stunning crimson coloration. Fast swimmers.',
      careLevel: 'MODERATE',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 100,
      minTemp: 22,
      maxTemp: 26,
      minPh: 7.0,
      maxPh: 8.0,
      maxSize: 15,
      lifespan: '5-8 years',
      diet: 'Omnivore',
      origin: 'Indonesia',
    },
    {
      name: 'Panda Corydoras',
      scientificName: 'Corydoras panda',
      description:
        'Adorable Panda Corydoras with black eye patches and tail spots resembling a panda bear. Extremely cute.',
      careLevel: 'EASY',
      temperament: 'PEACEFUL',
      waterType: 'FRESHWATER',
      minTankSize: 40,
      minTemp: 20,
      maxTemp: 26,
      minPh: 6.0,
      maxPh: 7.5,
      maxSize: 5,
      lifespan: '4-5 years',
      diet: 'Omnivore',
      origin: 'Peru',
    },
  ];

  const species = [];
  for (const s of speciesData) {
    const created = await prisma.fishSpecies.upsert({
      where: { scientificName: s.scientificName },
      update: {},
      create: s as any,
    });
    species.push(created);
  }
  console.log(`✅ ${species.length} fish species seeded`);

  // ── Products ──────────────────────────────────────
  const productData = [
    // Betta varieties
    {
      name: 'Betta Halfmoon Royal Red',
      slug: 'betta-halfmoon-do-royal',
      price: 180000,
      comparePrice: 250000,
      speciesIdx: 0,
      available: 15,
      size: 'M',
      age: '4 months',
      gender: 'Male',
      description:
        'Vibrant red Halfmoon Betta with a full 180° fin spread. Deep, even red coloring across the body. Healthy and active.',
    },
    {
      name: 'Betta Crowntail Galaxy',
      slug: 'betta-crowntail-galaxy',
      price: 220000,
      speciesIdx: 0,
      available: 8,
      size: 'M',
      age: '5 months',
      gender: 'Male',
      description:
        'Crown-tail Betta with a rare galaxy koi pattern. Striking blue-white coloration.',
    },
    {
      name: 'Betta Plakat Koi Nemo',
      slug: 'betta-plakat-koi-nemo',
      price: 350000,
      comparePrice: 450000,
      speciesIdx: 0,
      available: 5,
      size: 'S',
      age: '3 months',
      gender: 'Male',
      description:
        'Beautiful orange-white Koi Nemo Plakat Betta with sharp pattern definition. Imported Thai bloodline.',
    },
    {
      name: 'Betta Giant Blue-Purple',
      slug: 'betta-giant-xanh-tim',
      price: 500000,
      speciesIdx: 0,
      available: 3,
      size: 'L',
      age: '6 months',
      gender: 'Male',
      description:
        'Giant Betta — twice the size of a standard. Impressive blue-purple metallic coloring.',
    },
    {
      name: 'Betta Female Halfmoon Mix Color',
      slug: 'betta-cai-halfmoon-mix',
      price: 80000,
      speciesIdx: 0,
      available: 20,
      size: 'S',
      age: '3 months',
      gender: 'Female',
      description:
        'Female Halfmoon Betta in assorted colors. Easy to keep, great for breeding projects.',
    },
    // Neon Tetra
    {
      name: 'Neon Tetra (School of 10)',
      slug: 'neon-tetra-dan-10',
      price: 60000,
      speciesIdx: 1,
      available: 50,
      size: 'XS',
      description:
        'School of 10 healthy Neon Tetra. Stunning blue iridescent stripe glows under aquarium lighting.',
    },
    {
      name: 'Cardinal Tetra (School of 10)',
      slug: 'cardinal-tetra-dan-10',
      price: 80000,
      speciesIdx: 1,
      available: 30,
      size: 'XS',
      description:
        'Cardinal Tetra with a longer red stripe than Neons. More vivid colors. School of 10.',
    },
    // Discus
    {
      name: 'Discus Pigeon Blood Red',
      slug: 'dia-pigeon-blood-red',
      price: 1200000,
      comparePrice: 1500000,
      speciesIdx: 2,
      available: 4,
      size: 'L',
      age: '8 months',
      description:
        'Vibrant red-orange Pigeon Blood Discus with striking marble-like pattern. 12cm+.',
    },
    {
      name: 'Discus Blue Diamond',
      slug: 'dia-blue-diamond',
      price: 1800000,
      speciesIdx: 2,
      available: 3,
      size: 'L',
      age: '10 months',
      description: 'Solid turquoise-blue Blue Diamond Discus. German F1 bloodline.',
    },
    {
      name: 'Discus Leopard Snake Skin',
      slug: 'dia-leopard-snake-skin',
      price: 950000,
      speciesIdx: 2,
      available: 6,
      size: 'M',
      age: '6 months',
      description:
        'Leopard Discus with distinctive spotted pattern — evenly spaced dots on a blue base.',
    },
    // Goldfish
    {
      name: 'Goldfish Ranchu Japanese',
      slug: 'ca-vang-ranchu-nhat',
      price: 350000,
      speciesIdx: 3,
      available: 10,
      size: 'M',
      age: '5 months',
      description:
        'Japanese Ranchu with lion-head growth and round belly. Adorable swimming style. Bright red-orange color.',
    },
    {
      name: 'Goldfish Oranda Red-White',
      slug: 'ca-vang-oranda-do-trang',
      price: 250000,
      comparePrice: 300000,
      speciesIdx: 3,
      available: 12,
      size: 'M',
      description: 'Classic Red Cap Oranda — red head with white body. A symbol of good fortune.',
    },
    {
      name: 'Goldfish Ryukin Calico',
      slug: 'ca-vang-ryukin-calico',
      price: 200000,
      speciesIdx: 3,
      available: 8,
      size: 'S',
      description: 'Multi-colored Calico Ryukin with fan-shaped tail. Graceful and eye-catching.',
    },
    // Clownfish
    {
      name: 'Clownfish (Nemo) Tank-Bred',
      slug: 'ca-he-nemo-tank-bred',
      price: 250000,
      speciesIdx: 4,
      available: 10,
      size: 'S',
      description:
        'Tank-bred Ocellaris Clownfish, easy to acclimate. Bright orange with 3 white bands.',
    },
    {
      name: 'Clownfish Snowflake',
      slug: 'ca-he-snowflake',
      price: 450000,
      speciesIdx: 4,
      available: 5,
      size: 'S',
      description:
        'Rare Snowflake variant with irregular snowflake-like white markings. Designer clownfish.',
    },
    // Blue Tang
    {
      name: 'Blue Tang (Dory)',
      slug: 'ca-tang-xanh-dory',
      price: 800000,
      speciesIdx: 5,
      available: 4,
      size: 'M',
      age: '6 months',
      description:
        'Stunning royal blue Hippo Tang with bright yellow accents on tail. Active and always swimming.',
    },
    // Arowana
    {
      name: 'Arowana Banjar Red',
      slug: 'ca-rong-hong-vi',
      price: 5000000,
      comparePrice: 6000000,
      speciesIdx: 6,
      available: 2,
      size: 'L',
      age: '12 months',
      description:
        'Banjar Red Arowana with red-orange fins and silver body. Comes with CITES certification.',
    },
    {
      name: 'Arowana Golden Crossback (24K)',
      slug: 'ca-rong-kim-long-24k',
      price: 15000000,
      speciesIdx: 6,
      available: 1,
      size: 'XL',
      age: '18 months',
      description:
        'Premium 24K Golden Crossback Arowana with full gold scales across the body. Microchip certified.',
    },
    // Koi
    {
      name: 'Koi Kohaku F1 Japanese',
      slug: 'koi-kohaku-f1-nhat',
      price: 800000,
      speciesIdx: 7,
      available: 8,
      size: 'M',
      age: '6 months',
      description:
        'Red-and-white Kohaku Koi, F1 bloodline. Clean pattern definition, thick healthy body.',
    },
    {
      name: 'Koi Showa Sanke',
      slug: 'koi-showa-sanke',
      price: 1200000,
      speciesIdx: 7,
      available: 5,
      size: 'L',
      age: '10 months',
      description:
        'Three-color Showa Koi with balanced red-white-black pattern. Japanese-standard body shape.',
    },
    // Angelfish
    {
      name: 'Angelfish Altum Wild',
      slug: 'angel-altum-wild',
      price: 400000,
      speciesIdx: 8,
      available: 6,
      size: 'M',
      age: '5 months',
      description:
        'Wild-caught Altum Angelfish — taller than standard Angels with graceful long fins. Beautiful black vertical stripes.',
    },
    {
      name: 'Angelfish Koi Tank-Bred',
      slug: 'angel-koi-tank-bred',
      price: 150000,
      speciesIdx: 8,
      available: 15,
      size: 'S',
      description:
        'Orange-white-black spotted Koi Angelfish, tank-bred. Easy to keep, visually striking.',
    },
    // Guppy
    {
      name: 'Guppy Full Red Albino (Pair)',
      slug: 'guppy-full-red-albino-cap',
      price: 120000,
      speciesIdx: 9,
      available: 25,
      size: 'XS',
      description:
        'Pair of Full Red Albino Guppies — vivid red body and fins with distinctive red eyes.',
    },
    {
      name: 'Guppy Blue Moscow (Pair)',
      slug: 'guppy-blue-moscow-cap',
      price: 150000,
      speciesIdx: 9,
      available: 20,
      size: 'XS',
      description: 'Deep metallic dark-blue Moscow Guppies. Stable genetics, consistent coloring.',
    },
    {
      name: 'Guppy Dumbo Ear Bicolor (Pair)',
      slug: 'guppy-dumbo-ear-bicolor-cap',
      price: 200000,
      speciesIdx: 9,
      available: 10,
      size: 'XS',
      description:
        'Dumbo Ear Guppies with oversized pectoral fins and two-tone coloring. Adorable swimmers.',
    },
    // Corydoras
    {
      name: 'Corydoras Sterbai (Group of 5)',
      slug: 'corydoras-sterbai-nhom-5',
      price: 150000,
      speciesIdx: 10,
      available: 20,
      size: 'XS',
      description:
        'Group of 5 Sterbai Corydoras — white spots on dark body with orange pectoral fins. Diligent bottom cleaners.',
    },
    // Gourami
    {
      name: 'Pearl Gourami',
      slug: 'sac-gam-ngoc-trai',
      price: 80000,
      speciesIdx: 11,
      available: 15,
      size: 'M',
      description:
        'Pearl Gourami with sparkling white spots across the body. Peaceful, prefers calm water.',
    },
    {
      name: 'Golden Gourami',
      slug: 'sac-gam-vang',
      price: 60000,
      speciesIdx: 11,
      available: 18,
      size: 'M',
      description: 'Beautiful golden-bronze Gourami. Easy to care for, disease resistant.',
    },
    // Mandarin
    {
      name: 'Mandarin Dragonet',
      slug: 'mandarin-dragonet',
      price: 600000,
      speciesIdx: 12,
      available: 3,
      size: 'S',
      description:
        'The most colorful fish in the ocean. Vivid blue, orange, green, and purple psychedelic patterns.',
    },
    // Oscar
    {
      name: 'Oscar Tiger Red',
      slug: 'oscar-tiger-red',
      price: 150000,
      speciesIdx: 13,
      available: 8,
      size: 'M',
      age: '4 months',
      description:
        'Red-orange Tiger Oscar with black markings. Intelligent and recognizes its owner. Baby size, easy to raise.',
    },
    {
      name: 'Oscar Albino Red',
      slug: 'oscar-albino-red',
      price: 180000,
      speciesIdx: 13,
      available: 6,
      size: 'M',
      age: '4 months',
      description: 'White-and-red Albino Oscar with distinctive red eyes. Bold personality.',
    },
    // Cherry Shrimp
    {
      name: 'Cherry Shrimp Fire Red (Group of 20)',
      slug: 'tep-cherry-do-dan-20',
      price: 100000,
      speciesIdx: 14,
      available: 30,
      size: 'XS',
      description:
        'Group of 20 Fire Red Cherry Shrimp. Great algae cleaners, perfect for planted nano tanks.',
    },
    {
      name: 'Crystal Red Shrimp SS Grade (Group of 5)',
      slug: 'tep-crystal-red-ss-dan-5',
      price: 250000,
      speciesIdx: 14,
      available: 10,
      size: 'XS',
      description:
        'SS-grade Crystal Red Bee Shrimp. Crisp red-white banding with sharp color separation.',
    },
    // Pleco
    {
      name: 'Pleco Bristlenose L144',
      slug: 'pleco-bristlenose-l144',
      price: 120000,
      speciesIdx: 15,
      available: 12,
      size: 'S',
      description:
        'Yellow Bristlenose Pleco, expert algae eater. Small size suitable for most tanks.',
    },
    {
      name: 'Pleco Zebra L046',
      slug: 'pleco-zebra-l046',
      price: 2500000,
      speciesIdx: 15,
      available: 2,
      size: 'S',
      description: 'Rare black-and-white striped Zebra Pleco. A premium collector fish.',
    },
    // Lionfish
    {
      name: 'Lionfish Volitans',
      slug: 'ca-su-tu-volitans',
      price: 700000,
      speciesIdx: 16,
      available: 3,
      size: 'M',
      description:
        'Majestic Volitans Lionfish with wide fan-like fins. WARNING: Venomous spines, experts only.',
    },
    // Molly
    {
      name: 'Molly Silver Balloon',
      slug: 'molly-bac-balloon',
      price: 30000,
      speciesIdx: 17,
      available: 30,
      size: 'S',
      description:
        'Adorable round-bellied Balloon Molly with silver sheen. Easy to keep, breeds quickly.',
    },
    {
      name: 'Molly Black Lyretail',
      slug: 'molly-den-lyretail',
      price: 40000,
      speciesIdx: 17,
      available: 25,
      size: 'S',
      description:
        'Jet-black Lyretail Molly with elegant forked tail. Also helps control mild algae.',
    },
    // Rainbow
    {
      name: 'Red Rainbowfish Glossolepis',
      slug: 'ca-cau-vong-do-glossolepis',
      price: 100000,
      speciesIdx: 18,
      available: 12,
      size: 'M',
      description:
        'Indonesian Red Rainbowfish — males turn brilliant crimson. Fast swimming schooling fish.',
    },
    // Panda Cory
    {
      name: 'Corydoras Panda (Group of 5)',
      slug: 'corydoras-panda-nhom-5',
      price: 120000,
      speciesIdx: 19,
      available: 18,
      size: 'XS',
      description:
        'Group of 5 Panda Corydoras with adorable black eye patches. Active bottom dwellers.',
    },
    // More premium products
    {
      name: 'Discus Checkerboard Turquoise',
      slug: 'dia-checkerboard-turquoise',
      price: 2200000,
      speciesIdx: 2,
      available: 2,
      size: 'XL',
      age: '14 months',
      description: 'Show-grade Turquoise Discus with stunning checkerboard pattern. 15cm+.',
    },
    {
      name: 'Koi Platinum Ogon',
      slug: 'koi-platinum-ogon',
      price: 600000,
      speciesIdx: 7,
      available: 6,
      size: 'M',
      age: '6 months',
      description: 'Platinum silver-white Ogon Koi with metallic luster. Elegant and refined.',
    },
    {
      name: 'Betta Wild Mahachai',
      slug: 'betta-wild-mahachai',
      price: 300000,
      speciesIdx: 0,
      available: 4,
      size: 'S',
      age: '4 months',
      gender: 'Male',
      description:
        'Wild-type Mahachai Betta with green iridescent scales. Rare semi-wild species from Thailand.',
    },
    {
      name: 'Guppy Endler Tiger (Group of 6)',
      slug: 'guppy-endler-tiger-dan-6',
      price: 90000,
      speciesIdx: 9,
      available: 15,
      size: 'XS',
      description:
        'Small and colorful Tiger Endler Guppies with black-orange stripes. Beautiful in schools, easy breeders.',
    },
    {
      name: 'Blue Dream Shrimp (Group of 10)',
      slug: 'tep-blue-dream-dan-10',
      price: 150000,
      speciesIdx: 14,
      available: 12,
      size: 'XS',
      description:
        'Velvet blue Blue Dream Neocaridina shrimp with consistent coloring. Stunning in planted tanks.',
    },
    {
      name: 'Clownfish Maroon (Premnas)',
      slug: 'ca-he-maroon-premnas',
      price: 350000,
      speciesIdx: 4,
      available: 4,
      size: 'M',
      description:
        'Deep maroon Maroon Clownfish with gold-yellow stripes. Larger and more impressive than standard Nemo.',
    },
    {
      name: 'Angelfish Pinoy Blue',
      slug: 'angel-pinoy-blue',
      price: 250000,
      speciesIdx: 8,
      available: 8,
      size: 'M',
      age: '5 months',
      description:
        'Pinoy Blue Angelfish with paraiba-blue coloring on fins and body. Special Philippine strain.',
    },
    {
      name: 'Koi Tancho',
      slug: 'koi-tancho',
      price: 1500000,
      speciesIdx: 7,
      available: 3,
      size: 'L',
      age: '10 months',
      description:
        'White Tancho Koi with a single red dot on the head. Symbol of the Japanese flag.',
    },
    {
      name: 'Molly Dalmatian Lyretail',
      slug: 'molly-dalmatian-lyretail',
      price: 45000,
      speciesIdx: 17,
      available: 20,
      size: 'S',
      description: 'Black spots on white body like a Dalmatian dog. Graceful lyretail fins.',
    },
    {
      name: 'Oscar Lemon',
      slug: 'oscar-lemon',
      price: 200000,
      speciesIdx: 13,
      available: 5,
      size: 'M',
      age: '3 months',
      description: 'Full lemon-yellow Oscar with bright eyes. Unusual and eye-catching variant.',
    },
  ];

  const products = [];
  for (const p of productData) {
    const { speciesIdx, ...rest } = p;
    const created = await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {},
      create: {
        ...rest,
        speciesId: species[speciesIdx].id,
      } as any,
    });
    products.push(created);
  }
  console.log(`✅ ${products.length} products seeded`);

  // ── Product Images ────────────────────────────────
  // Real Unsplash images mapped per product (same order as productData)
  const unsplashImages: string[] = [
    // Betta varieties (0-4)
    'https://images.unsplash.com/photo-1573976366069-ee53f0cc76db?w=600&h=600&fit=crop&q=80', // Betta Halfmoon Royal Red
    'https://images.unsplash.com/photo-1540759893615-cb37a9f6027a?w=600&h=600&fit=crop&q=80', // Betta Crowntail Galaxy
    'https://images.unsplash.com/photo-1598674953515-32809625dfa2?w=600&h=600&fit=crop&q=80', // Betta Plakat Koi Nemo
    'https://images.unsplash.com/photo-1542242846-0cc508d981b4?w=600&h=600&fit=crop&q=80', // Betta Giant Blue-Purple
    'https://images.unsplash.com/photo-1653566983921-67e73a05156c?w=600&h=600&fit=crop&q=80', // Betta Female Halfmoon Mix
    // Neon Tetra (5-6)
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&h=600&fit=crop&q=80', // Neon Tetra School
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&h=400&fit=crop&q=80', // Cardinal Tetra School
    // Discus (7-9)
    'https://images.unsplash.com/photo-1573314268094-9df5fa2a014a?w=600&h=600&fit=crop&q=80', // Discus Pigeon Blood Red
    'https://images.unsplash.com/photo-1542242846-0cc508d981b4?w=600&h=400&fit=crop&q=80', // Discus Blue Diamond
    'https://images.unsplash.com/photo-1639770365554-2c3365af752f?w=600&h=600&fit=crop&q=80', // Discus Leopard Snake Skin
    // Goldfish (10-12)
    'https://images.unsplash.com/photo-1649816055585-508cac702fb6?w=600&h=600&fit=crop&q=80', // Goldfish Ranchu Japanese
    'https://images.unsplash.com/photo-1685974314665-0cad40d42127?w=600&h=600&fit=crop&q=80', // Goldfish Oranda Red-White
    'https://images.unsplash.com/photo-1695200241436-5e3da46d2b2a?w=600&h=600&fit=crop&q=80', // Goldfish Ryukin Calico
    // Clownfish (13-14)
    'https://images.unsplash.com/photo-1516022109437-ad7a1f89b0d1?w=600&h=600&fit=crop&q=80', // Clownfish Tank-Bred
    'https://images.unsplash.com/photo-1516022109437-ad7a1f89b0d1?w=600&h=400&fit=crop&q=80', // Clownfish Snowflake
    // Blue Tang (15)
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&h=500&fit=crop&q=80', // Blue Tang Dory
    // Arowana (16-17)
    'https://images.unsplash.com/photo-1659242549433-d7c825aa9fe2?w=600&h=600&fit=crop&q=80', // Arowana Banjar Red
    'https://images.unsplash.com/photo-1684127946837-9bca0bcf138e?w=600&h=600&fit=crop&q=80', // Arowana Golden Crossback
    // Koi (18-19)
    'https://images.unsplash.com/photo-1612493565024-5450ec0403ac?w=600&h=600&fit=crop&q=80', // Koi Kohaku F1
    'https://images.unsplash.com/photo-1762036997158-50fa6e41ecbd?w=600&h=600&fit=crop&q=80', // Koi Showa Sanke
    // Angelfish (20-21)
    'https://images.unsplash.com/photo-1653566983921-67e73a05156c?w=600&h=400&fit=crop&q=80', // Angelfish Altum Wild
    'https://images.unsplash.com/photo-1653566983921-67e73a05156c?w=500&h=500&fit=crop&q=80', // Angelfish Koi Tank-Bred
    // Guppy (22-24)
    'https://images.unsplash.com/photo-1540759893615-cb37a9f6027a?w=600&h=400&fit=crop&q=80', // Guppy Full Red Albino
    'https://images.unsplash.com/photo-1540759893615-cb37a9f6027a?w=500&h=500&fit=crop&q=80', // Guppy Blue Moscow
    'https://images.unsplash.com/photo-1598674953515-32809625dfa2?w=600&h=400&fit=crop&q=80', // Guppy Dumbo Ear
    // Corydoras (25)
    'https://images.unsplash.com/photo-1639770365554-2c3365af752f?w=600&h=400&fit=crop&q=80', // Corydoras Sterbai
    // Pearl Gourami (26-27)
    'https://images.unsplash.com/photo-1573314268094-9df5fa2a014a?w=600&h=400&fit=crop&q=80', // Pearl Gourami
    'https://images.unsplash.com/photo-1653566983921-67e73a05156c?w=400&h=400&fit=crop&q=80', // Golden Gourami
    // Mandarin Dragonet (28)
    'https://images.unsplash.com/photo-1542242846-0cc508d981b4?w=500&h=500&fit=crop&q=80', // Mandarin Dragonet
    // Oscar (29-30)
    'https://images.unsplash.com/photo-1639770365554-2c3365af752f?w=500&h=500&fit=crop&q=80', // Oscar Tiger Red
    'https://images.unsplash.com/photo-1573314268094-9df5fa2a014a?w=500&h=500&fit=crop&q=80', // Oscar Albino Red
    // Cherry Shrimp (31-32)
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&h=400&fit=crop&q=80', // Cherry Shrimp Fire Red
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=400&fit=crop&q=80', // Crystal Red Shrimp
    // Pleco (33-34)
    'https://images.unsplash.com/photo-1639770365554-2c3365af752f?w=400&h=400&fit=crop&q=80', // Pleco Bristlenose
    'https://images.unsplash.com/photo-1573314268094-9df5fa2a014a?w=400&h=400&fit=crop&q=80', // Pleco Zebra
    // Lionfish (35)
    'https://images.unsplash.com/photo-1542242846-0cc508d981b4?w=600&h=600&fit=crop&q=80', // Lionfish Volitans
    // Molly (36-37)
    'https://images.unsplash.com/photo-1649816055585-508cac702fb6?w=600&h=400&fit=crop&q=80', // Molly Silver Balloon
    'https://images.unsplash.com/photo-1573976366069-ee53f0cc76db?w=600&h=400&fit=crop&q=80', // Molly Black Lyretail
    // Red Rainbowfish (38)
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&h=600&fit=crop&q=80', // Red Rainbowfish
    // Panda Corydoras (39)
    'https://images.unsplash.com/photo-1649816055585-508cac702fb6?w=500&h=500&fit=crop&q=80', // Panda Corydoras
    // Premium products (40-49)
    'https://images.unsplash.com/photo-1573314268094-9df5fa2a014a?w=600&h=500&fit=crop&q=80', // Discus Checkerboard Turquoise
    'https://images.unsplash.com/photo-1619207525197-74c3ab4e9296?w=600&h=600&fit=crop&q=80', // Koi Platinum Ogon
    'https://images.unsplash.com/photo-1573976366069-ee53f0cc76db?w=500&h=500&fit=crop&q=80', // Betta Wild Mahachai
    'https://images.unsplash.com/photo-1540759893615-cb37a9f6027a?w=400&h=600&fit=crop&q=80', // Guppy Endler Tiger
    'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&h=400&fit=crop&q=80', // Blue Dream Shrimp
    'https://images.unsplash.com/photo-1516022109437-ad7a1f89b0d1?w=500&h=500&fit=crop&q=80', // Clownfish Maroon
    'https://images.unsplash.com/photo-1542242846-0cc508d981b4?w=400&h=600&fit=crop&q=80', // Angelfish Pinoy Blue
    'https://images.unsplash.com/photo-1612493565024-5450ec0403ac?w=600&h=400&fit=crop&q=80', // Koi Tancho
    'https://images.unsplash.com/photo-1685974314665-0cad40d42127?w=600&h=400&fit=crop&q=80', // Molly Dalmatian
    'https://images.unsplash.com/photo-1639770365554-2c3365af752f?w=600&h=500&fit=crop&q=80', // Oscar Lemon
  ];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const existing = await prisma.fishImage.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.fishImage.create({
        data: {
          productId: product.id,
          url:
            unsplashImages[i] ||
            `https://images.unsplash.com/photo-1573976366069-ee53f0cc76db?w=600&h=600&fit=crop&q=80`,
          alt: product.name,
          isPrimary: true,
        },
      });
    }
  }
  console.log('✅ Product images seeded');

  // ── Sample Reviews ────────────────────────────────
  // Create a sample delivered order first so reviews pass the check
  const sampleOrder = await prisma.order.create({
    data: {
      userId: user1.id,
      subtotal: 180000,
      shippingFee: 30000,
      total: 210000,
      status: 'DELIVERED',
      shippingAddress: '123 Main Street, District 1, HCMC',
      shippingCity: 'HCMC',
      shippingPhone: '0912345678',
      paymentMethod: 'COD',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
            name: products[0].name,
          },
          {
            productId: products[5].id,
            quantity: 1,
            price: products[5].price,
            name: products[5].name,
          },
          {
            productId: products[10].id,
            quantity: 1,
            price: products[10].price,
            name: products[10].name,
          },
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      userId: user2.id,
      subtotal: 500000,
      shippingFee: 0,
      total: 500000,
      status: 'DELIVERED',
      shippingAddress: '456 Ocean Avenue, District 3, HCMC',
      shippingCity: 'HCMC',
      shippingPhone: '0923456789',
      paymentMethod: 'BANK_TRANSFER',
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
            name: products[0].name,
          },
          {
            productId: products[2].id,
            quantity: 1,
            price: products[2].price,
            name: products[2].name,
          },
        ],
      },
    },
  });

  // ── Additional orders with varied dates & statuses for chart data ──
  const orderSeeds = [
    // Orders from the past 30 days
    {
      userId: user1.id,
      daysAgo: 28,
      status: 'DELIVERED' as const,
      productIndices: [7, 8],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 26,
      status: 'DELIVERED' as const,
      productIndices: [1, 3, 10],
      method: 'BANK_TRANSFER',
    },
    {
      userId: user1.id,
      daysAgo: 24,
      status: 'DELIVERED' as const,
      productIndices: [16],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 22,
      status: 'DELIVERED' as const,
      productIndices: [22, 23],
      method: 'E_WALLET',
    },
    {
      userId: user1.id,
      daysAgo: 20,
      status: 'DELIVERED' as const,
      productIndices: [12, 25],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 18,
      status: 'DELIVERED' as const,
      productIndices: [5, 6, 9],
      method: 'BANK_TRANSFER',
    },
    {
      userId: user1.id,
      daysAgo: 16,
      status: 'SHIPPING' as const,
      productIndices: [30, 31],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 14,
      status: 'DELIVERED' as const,
      productIndices: [18, 19],
      method: 'BANK_TRANSFER',
    },
    {
      userId: user1.id,
      daysAgo: 12,
      status: 'DELIVERED' as const,
      productIndices: [35, 36],
      method: 'E_WALLET',
    },
    {
      userId: user2.id,
      daysAgo: 10,
      status: 'PREPARING' as const,
      productIndices: [40, 41],
      method: 'COD',
    },
    {
      userId: user1.id,
      daysAgo: 8,
      status: 'DELIVERED' as const,
      productIndices: [14, 20, 21],
      method: 'BANK_TRANSFER',
    },
    {
      userId: user2.id,
      daysAgo: 7,
      status: 'SHIPPING' as const,
      productIndices: [0, 1],
      method: 'COD',
    },
    {
      userId: user1.id,
      daysAgo: 6,
      status: 'CONFIRMED' as const,
      productIndices: [28, 29],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 5,
      status: 'DELIVERED' as const,
      productIndices: [7, 13],
      method: 'E_WALLET',
    },
    {
      userId: user1.id,
      daysAgo: 4,
      status: 'CANCELLED' as const,
      productIndices: [38],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 3,
      status: 'PREPARING' as const,
      productIndices: [45, 46],
      method: 'BANK_TRANSFER',
    },
    {
      userId: user1.id,
      daysAgo: 2,
      status: 'CONFIRMED' as const,
      productIndices: [2, 4],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 1,
      status: 'PENDING' as const,
      productIndices: [33, 34, 39],
      method: 'E_WALLET',
    },
    {
      userId: user1.id,
      daysAgo: 0,
      status: 'PENDING' as const,
      productIndices: [15],
      method: 'COD',
    },
    {
      userId: user2.id,
      daysAgo: 0,
      status: 'PENDING' as const,
      productIndices: [17, 47],
      method: 'BANK_TRANSFER',
    },
  ];

  for (const os of orderSeeds) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - os.daysAgo);
    orderDate.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60));

    const orderItems = os.productIndices
      .filter((idx) => idx < products.length)
      .map((idx) => ({
        productId: products[idx].id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: products[idx].price,
        name: products[idx].name,
      }));

    if (orderItems.length === 0) continue;

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;

    await prisma.order.create({
      data: {
        userId: os.userId,
        status: os.status,
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
        shippingAddress:
          os.userId === user1.id
            ? '123 Main Street, District 1, HCMC'
            : '456 Ocean Avenue, District 3, HCMC',
        shippingCity: 'HCMC',
        shippingPhone: os.userId === user1.id ? '0912345678' : '0923456789',
        paymentMethod: os.method,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: { create: orderItems },
      },
    });
  }
  console.log('✅ Additional orders seeded for chart data');

  // Create reviews
  const reviewData = [
    {
      userId: user1.id,
      productId: products[0].id,
      rating: 5,
      comment:
        'Gorgeous fish with a perfect 180° fin spread. Carefully packaged and fast shipping. Will buy again!',
    },
    {
      userId: user1.id,
      productId: products[5].id,
      rating: 4,
      comment:
        'Beautiful Neon school, they swim together perfectly. Lost 1 during shipping but the shop sent a replacement.',
    },
    {
      userId: user2.id,
      productId: products[0].id,
      rating: 5,
      comment: 'Betta Halfmoon Red worth every penny. Swims majestically, deep red color. 10/10!',
    },
    {
      userId: user2.id,
      productId: products[2].id,
      rating: 5,
      comment:
        'Stunning Koi Nemo Betta, the orange-white pattern is crystal clear. Healthy and active fish.',
    },
  ];

  for (const r of reviewData) {
    const exists = await prisma.review.findUnique({
      where: { userId_productId: { userId: r.userId, productId: r.productId } },
    });
    if (!exists) {
      await prisma.review.create({ data: r });
    }
  }

  // Update avgRating for reviewed products
  for (const productId of [...new Set(reviewData.map((r) => r.productId))]) {
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: productId },
      data: { avgRating: agg._avg.rating || 0, reviewCount: agg._count },
    });
  }
  console.log('✅ Reviews seeded');

  console.log('\n🎉 Seeding complete!');
  console.log('──────────────────────────────────────');
  console.log('Admin: admin@aqualuxe.vn / [check SEED_ADMIN_PASSWORD env var]');
  console.log('User:  user@aqualuxe.vn  / [check SEED_USER_PASSWORD env var]');
  console.log('──────────────────────────────────────');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
