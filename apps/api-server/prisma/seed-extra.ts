import { createRequire } from 'module';
import bcrypt from 'bcryptjs';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Seeding is not allowed in production environment!');
  }
  console.log('🌱 Extended seed starting...');

  // ── SECTION 1: Extra Users ─────────────────────────
  const rawUserPwd = process.env.SEED_USER_PASSWORD || 'user123';
  const userPassword = await bcrypt.hash(rawUserPwd, 12);

  await prisma.user.upsert({
    where: { email: 'user3@aqualuxe.vn' },
    update: {},
    create: {
      name: 'Nguyen Van An',
      email: 'user3@aqualuxe.vn',
      password: userPassword,
      phone: '0934567890',
      address: '78 Le Loi, District 1, HCMC',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user4@aqualuxe.vn' },
    update: {},
    create: {
      name: 'Tran Thi Bich',
      email: 'user4@aqualuxe.vn',
      password: userPassword,
      phone: '0945678901',
      address: '15 Nguyen Hue, District 1, HCMC',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user5@aqualuxe.vn' },
    update: {},
    create: {
      name: 'Le Hoang Nam',
      email: 'user5@aqualuxe.vn',
      password: userPassword,
      phone: '0956789012',
      address: '32 Pham Ngu Lao, District 1, HCMC',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user6@aqualuxe.vn' },
    update: {},
    create: {
      name: 'Pham Thi Mai',
      email: 'user6@aqualuxe.vn',
      password: userPassword,
      phone: '0967890123',
      address: '99 Bui Vien, District 1, HCMC',
    },
  });

  console.log('✅ Extra users seeded');

  // ── SECTION 2: New Fish Species ────────────────────
  const newSpecies = await Promise.all([
    prisma.fishSpecies.upsert({
      where: { scientificName: 'Danio rerio' },
      update: {},
      create: {
        name: 'Zebra Danio',
        scientificName: 'Danio rerio',
        description:
          'Zebra Danios are energetic schooling fish that thrive in groups of six or more, displaying their iconic horizontal blue-and-silver stripes in a mesmerizing synchronized swim. Renowned for their exceptional hardiness, they tolerate a wide range of water conditions, making them one of the best choices for beginner aquarists and aquascaping biotopes alike.',
        careLevel: 'EASY',
        temperament: 'PEACEFUL',
        waterType: 'FRESHWATER',
        minTankSize: 40,
        minTemp: 18,
        maxTemp: 24,
        minPh: 6.5,
        maxPh: 7.5,
        maxSize: 5,
        lifespan: '3-5 years',
        diet: 'Omnivore',
        origin: 'South Asia',
      },
    }),

    prisma.fishSpecies.upsert({
      where: { scientificName: 'Mikrogeophagus ramirezi' },
      update: {},
      create: {
        name: 'German Blue Ram',
        scientificName: 'Mikrogeophagus ramirezi',
        description:
          'The German Blue Ram is a jewel of the dwarf cichlid world, boasting a breathtaking palette of electric blue spangles over a golden-yellow body accented with vivid red and black markings. Despite its cichlid lineage, it displays a relatively peaceful temperament in a well-planted community tank, forming devoted monogamous pairs that engage in fascinating courtship and brood-care behaviors.',
        careLevel: 'MODERATE',
        temperament: 'PEACEFUL',
        waterType: 'FRESHWATER',
        minTankSize: 60,
        minTemp: 26,
        maxTemp: 30,
        minPh: 5.5,
        maxPh: 7.0,
        maxSize: 7,
        lifespan: '2-4 years',
        diet: 'Omnivore',
        origin: 'South America (Venezuela, Colombia)',
      },
    }),

    prisma.fishSpecies.upsert({
      where: { scientificName: 'Melanotaenia boesemani' },
      update: {},
      create: {
        name: "Boeseman's Rainbowfish",
        scientificName: 'Melanotaenia boesemani',
        description:
          "Boeseman's Rainbowfish is celebrated for its extraordinary two-tone coloration — a rich blue-purple anterior that transitions sharply into a vibrant orange-yellow posterior — creating a living gradient that shimmers brilliantly under aquarium lighting. A lively schooling species, it is most impressive when kept in groups of eight or more, where males compete in dazzling display rituals that intensify their already spectacular colors.",
        careLevel: 'EASY',
        temperament: 'PEACEFUL',
        waterType: 'FRESHWATER',
        minTankSize: 100,
        minTemp: 22,
        maxTemp: 28,
        minPh: 7.0,
        maxPh: 8.0,
        maxSize: 10,
        lifespan: '4-6 years',
        diet: 'Omnivore',
        origin: 'West Papua, Indonesia',
      },
    }),

    prisma.fishSpecies.upsert({
      where: { scientificName: 'Aulonocara nyassae' },
      update: {},
      create: {
        name: 'Peacock Cichlid',
        scientificName: 'Aulonocara nyassae',
        description:
          'Peacock Cichlids are among the most visually spectacular of all African cichlids, with dominant males displaying an iridescent metallic blue body that shifts hue with every angle of light — a coloration rivaling even marine fish in brilliance. Endemic to Lake Malawi, they thrive in a hard, alkaline biotope setup with rocky caves and sandy substrate, where they forage for invertebrates using their highly sensitive lateral-line system.',
        careLevel: 'MODERATE',
        temperament: 'SEMI_AGGRESSIVE',
        waterType: 'FRESHWATER',
        minTankSize: 150,
        minTemp: 24,
        maxTemp: 28,
        minPh: 7.5,
        maxPh: 8.5,
        maxSize: 15,
        lifespan: '6-10 years',
        diet: 'Carnivore',
        origin: 'Lake Malawi, Africa',
      },
    }),

    prisma.fishSpecies.upsert({
      where: { scientificName: 'Centropyge loriculus' },
      update: {},
      create: {
        name: 'Flame Angelfish',
        scientificName: 'Centropyge loriculus',
        description:
          'The Flame Angelfish is widely regarded as one of the most stunning dwarf angels in the marine hobby, showcasing a vivid flame-red body adorned with bold black vertical bars and iridescent blue-purple edging on the dorsal and anal fins. While generally considered reef-safe, individuals may nip at large-polyp stony corals and clam mantles, so careful monitoring is recommended in a mixed-reef environment.',
        careLevel: 'HARD',
        temperament: 'SEMI_AGGRESSIVE',
        waterType: 'SALTWATER',
        minTankSize: 100,
        minTemp: 24,
        maxTemp: 27,
        minPh: 8.1,
        maxPh: 8.4,
        maxSize: 10,
        lifespan: '5-7 years',
        diet: 'Herbivore',
        origin: 'Pacific Ocean (Hawaii, Marshall Islands)',
      },
    }),
  ]);

  console.log('✅ 5 new species seeded');

  // ── SECTION 3: New Products ────────────────────────
  const bettaSpecies = await prisma.fishSpecies.findFirst({ where: { scientificName: 'Betta splendens' } });
  const koiSpecies = await prisma.fishSpecies.findFirst({ where: { scientificName: 'Cyprinus rubrofuscus' } });
  const shrimpSpecies = await prisma.fishSpecies.findFirst({ where: { scientificName: 'Neocaridina davidi' } });

  const extraProducts = await Promise.all([
    // Zebra Danio (newSpecies[0])
    prisma.product.upsert({
      where: { slug: 'ca-soc-nga-dan-10' },
      update: {},
      create: {
        speciesId: newSpecies[0].id,
        name: 'Zebra Danio (School of 10)',
        slug: 'ca-soc-nga-dan-10',
        description:
          'Zebra Danios are instantly recognizable by their vivid horizontal blue-silver stripes running from nose to tail — a pattern that shimmers beautifully under aquarium lighting. One of the hardiest freshwater fish available, they tolerate a wide range of water parameters and are ideal for beginner aquarists. They are active, fast-moving schooling fish that thrive in groups of 6 or more, creating a dazzling synchronized display in mid-water.',
        price: 45000,
        size: 'XS',
        available: 60,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'glofish-danio-electric-green-dan-6' },
      update: {},
      create: {
        speciesId: newSpecies[0].id,
        name: 'GloFish Danio Electric Green (School of 6)',
        slug: 'glofish-danio-electric-green-dan-6',
        description:
          'GloFish Danios are genetically enhanced Zebra Danios that express a vivid fluorescent green protein, creating a mesmerizing neon glow under blue LED or UV aquarium lighting. These fish are FDA-approved for the aquarium hobby and produced through ethical breeding — no dyes or injections involved. They are just as hardy and sociable as their wild-type counterparts, perfect for modern LED aquarium setups seeking a dramatic visual impact.',
        price: 120000,
        comparePrice: 150000,
        size: 'XS',
        available: 30,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'zebra-danio-longfin-dan-6' },
      update: {},
      create: {
        speciesId: newSpecies[0].id,
        name: 'Longfin Zebra Danio (School of 6)',
        slug: 'zebra-danio-longfin-dan-6',
        description:
          "The Longfin Zebra Danio is a selectively bred variant featuring dramatically extended, flowing fins that add elegance to the species' naturally energetic personality. Their elongated dorsal, anal, and caudal fins billow gracefully as they dart through the water column, creating a striking visual contrast. Despite the fancy fins, they retain the same legendary hardiness and ease of care that makes Zebra Danios a staple of the freshwater hobby.",
        price: 80000,
        size: 'XS',
        available: 25,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // German Blue Ram (newSpecies[1])
    prisma.product.upsert({
      where: { slug: 'ca-ram-xanh-duc-cap' },
      update: {},
      create: {
        speciesId: newSpecies[1].id,
        name: 'German Blue Ram (Pair)',
        slug: 'ca-ram-xanh-duc-cap',
        description:
          'This matched pair of German Blue Rams showcases the species at its finest — vivid iridescent blue scales covering the flanks, rich yellow-gold accents on the face and belly, and a bold black spot on the mid-body surrounded by a ring of electric blue dots. Perfect for a South American biotope planted tank with soft, slightly acidic water (pH 5.5–7.0), dense vegetation, and driftwood. A bonded pair will readily spawn in well-established aquariums.',
        price: 380000,
        comparePrice: 450000,
        size: 'S',
        available: 8,
        age: '4 months',
        gender: 'Pair',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'electric-blue-ram-duc' },
      update: {},
      create: {
        speciesId: newSpecies[1].id,
        name: 'Electric Blue Ram (Male)',
        slug: 'electric-blue-ram-duc',
        description:
          'The Electric Blue Ram is a selectively bred variety with an intensified blue coloration covering virtually the entire body — far exceeding the blue patches seen on wild-type specimens. Each scale catches the light with an electrifying metallic shimmer, making this one of the most visually stunning dwarf cichlids available. Best kept in soft, warm water (26–30°C) with live plants and peaceful tankmates.',
        price: 320000,
        size: 'S',
        available: 10,
        age: '3 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'gold-ram-cap' },
      update: {},
      create: {
        speciesId: newSpecies[1].id,
        name: 'Gold Ram (Pair)',
        slug: 'gold-ram-cap',
        description:
          'The Gold Ram features a luminous golden-yellow body with a distinctive red eye spot and the characteristic black spike on the first rays of the dorsal fin. While the blue iridescence is reduced compared to wild-type Rams, the golden sheen is equally eye-catching and pairs beautifully with green-leaved aquatic plants. Suitable for community tanks of 60L+ with soft, slightly acidic water conditions.',
        price: 280000,
        size: 'S',
        available: 12,
        age: '3 months',
        gender: 'Pair',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // Boeseman's Rainbowfish (newSpecies[2])
    prisma.product.upsert({
      where: { slug: 'ca-cau-vong-boesemani-dan-6' },
      update: {},
      create: {
        speciesId: newSpecies[2].id,
        name: "Boeseman's Rainbowfish (Group of 6)",
        slug: 'ca-cau-vong-boesemani-dan-6',
        description:
          "The Boeseman's Rainbowfish is one of the most iconic freshwater fish in the hobby, renowned for its extraordinary dual-tone coloration — the front half displays a rich blue-purple hue while the rear half blazes with vivid orange-yellow. Males develop this brilliant coloring most intensely at 6 months and older. Best kept in groups of 6 or more in spacious tanks (120L+) to encourage natural schooling behavior and full color expression.",
        price: 240000,
        size: 'M',
        available: 15,
        age: '5 months',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'ca-cau-vong-praecox-dan-6' },
      update: {},
      create: {
        speciesId: newSpecies[2].id,
        name: 'Praecox Rainbowfish (Group of 6)',
        slug: 'ca-cau-vong-praecox-dan-6',
        description:
          'The Dwarf Neon Rainbowfish (Melanotaenia praecox) is one of the smallest and most vibrant rainbowfish, reaching just 5cm at maturity. Its iridescent blue-silver body is complemented by brilliant red-orange fins in males. Unlike larger rainbowfish, the Praecox is perfectly suited to mid-sized community tanks from 80L upward. A group of 6 provides the best behavioral dynamics and color display.',
        price: 180000,
        size: 'S',
        available: 20,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'ca-cau-vong-turquoise-dan-4' },
      update: {},
      create: {
        speciesId: newSpecies[2].id,
        name: 'Turquoise Rainbowfish (Group of 4)',
        slug: 'ca-cau-vong-turquoise-dan-4',
        description:
          'Melanotaenia lacustris, the Turquoise Rainbowfish, features deep turquoise-green flanks bisected by a striking electric blue lateral line. Mature males develop a vibrant, deep-bodied profile that is truly impressive. Growing to 12cm, this active schooling fish requires a spacious aquarium of at least 120L with open swimming areas. A group of 4 or more displays spectacular fin-flaring courtship behaviors.',
        price: 200000,
        size: 'M',
        available: 12,
        age: '4 months',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // Peacock Cichlid (newSpecies[3])
    prisma.product.upsert({
      where: { slug: 'ca-peacock-ob-duc' },
      update: {},
      create: {
        speciesId: newSpecies[3].id,
        name: 'OB Peacock Cichlid (Male)',
        slug: 'ca-peacock-ob-duc',
        description:
          'The OB (Orange Blotch) Peacock Cichlid combines Aulonocara genetics with OB coloring, resulting in a breathtaking irregular blotched pattern of orange and blue unique to each individual — no two are ever alike. This dominant male specimen is in prime breeding coloration. Best housed in a Lake Malawi biotope with alkaline water (pH 7.8–8.5), crushed coral substrate, and rocky caves for territory definition.',
        price: 450000,
        size: 'M',
        available: 8,
        age: '6 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'peacock-stuartgranti-usisya-duc' },
      update: {},
      create: {
        speciesId: newSpecies[3].id,
        name: "Aulonocara Stuartgranti 'Usisya' (Male)",
        slug: 'peacock-stuartgranti-usisya-duc',
        description:
          "Aulonocara stuartgranti 'Usisya', the Sunshine Peacock, is collected from the rocky shores of Usisya on the northern coast of Lake Malawi. It develops characteristic brilliant yellow-gold upper body and intensely iridescent blue lower body and face. This wild-type locale-specific form is prized by cichlid enthusiasts for its authentic coloration. Thrives in a 150L+ Malawi biotope with hard alkaline water.",
        price: 380000,
        size: 'M',
        available: 6,
        age: '5 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'peacock-dragon-blood-duc' },
      update: {},
      create: {
        speciesId: newSpecies[3].id,
        name: 'Dragon Blood Peacock Cichlid (Male)',
        slug: 'peacock-dragon-blood-duc',
        description:
          'The Dragon Blood Peacock is one of the most popular selectively bred cichlids in the Malawi hobby. This dominant male features an intense fiery orange-red base coloration overlaid with metallic blue highlights on the face, fins, and flanks. Best kept in a harem setup (1 male : 3–4 females) in a 150L+ aquarium with alkaline water and plenty of rocky structure.',
        price: 420000,
        size: 'M',
        available: 5,
        age: '6 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // Flame Angelfish (newSpecies[4])
    prisma.product.upsert({
      where: { slug: 'ca-than-lua-flame-angel' },
      update: {},
      create: {
        speciesId: newSpecies[4].id,
        name: 'Flame Angelfish (Centropyge loriculus)',
        slug: 'ca-than-lua-flame-angel',
        description:
          'Centropyge loriculus, the Flame Angelfish, is widely regarded as one of the most breathtaking dwarf marine angelfish. Its vivid scarlet-red body is intersected by 4–5 bold vertical black bars, with the dorsal and anal fins edged in electric blue and black. Flame Angels are relatively hardy for marine angelfish and can be kept in FOWLR and mature reef tanks. Caution is advised around SPS corals. Minimum tank size 150L.',
        price: 2800000,
        comparePrice: 3200000,
        size: 'S',
        available: 3,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'ca-than-lua-coral-beauty' },
      update: {},
      create: {
        speciesId: newSpecies[4].id,
        name: 'Coral Beauty Angelfish',
        slug: 'ca-than-lua-coral-beauty',
        description:
          'Centropyge bispinosa, the Coral Beauty Angelfish, features a rich deep purple body adorned with horizontal orange-yellow striping along the flanks. One of the most reliably hardy dwarf marine angelfish. An active grazer of microalgae and detritus, valuable for biological maintenance in marine aquariums 100L+. Adapts well to captivity and accepts high-quality prepared foods, frozen mysis, and spirulina-based flakes.',
        price: 2200000,
        size: 'S',
        available: 4,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // More Betta varieties
    prisma.product.upsert({
      where: { slug: 'betta-dumbo-ear-super-red' },
      update: {},
      create: {
        speciesId: bettaSpecies!.id,
        name: 'Betta Dumbo Ear Super Red',
        slug: 'betta-dumbo-ear-super-red',
        description:
          'The Dumbo Ear (Elephant Ear) Betta is distinguished by its dramatically oversized pectoral fins that fan out like elephant ears on either side of the body — a mutation producing one of the most theatrical silhouettes in the Betta world. This Super Red specimen features deep, saturated crimson coloring across the entire body and fins with no fading at the tips. One of the most sought-after Betta varieties among collectors worldwide.',
        price: 350000,
        comparePrice: 420000,
        size: 'S',
        available: 6,
        age: '4 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'betta-rosetail-platinum-white' },
      update: {},
      create: {
        speciesId: bettaSpecies!.id,
        name: 'Betta Rosetail Platinum White',
        slug: 'betta-rosetail-platinum-white',
        description:
          "The Rosetail Betta represents the pinnacle of Betta caudal fin development — the tail fin spreads beyond 180° and its rays branch so extensively that the edges ruffle and fold like the petals of a rose in full bloom. This Platinum White specimen displays pristine pure-white coloration carrying a subtle pearlescent shimmer reminiscent of satin fabric when light catches the scales. A show-quality specimen from champion bloodlines.",
        price: 480000,
        size: 'S',
        available: 4,
        age: '5 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'betta-halfmoon-blue-butterfly' },
      update: {},
      create: {
        speciesId: bettaSpecies!.id,
        name: 'Betta Halfmoon Blue Butterfly',
        slug: 'betta-halfmoon-blue-butterfly',
        description:
          'This Halfmoon Betta exhibits the classic Butterfly pattern in a crisp blue-and-white colorway — the body and inner portions of the fins are covered in rich royal blue, transitioning cleanly to clear or white at the outer edges, creating a distinct two-tone butterfly effect. The caudal fin achieves a precise 180° spread characteristic of well-selected Halfmoon bloodlines.',
        price: 280000,
        size: 'S',
        available: 8,
        age: '3 months',
        gender: 'Male',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'betta-copper-gold-female' },
      update: {},
      create: {
        speciesId: bettaSpecies!.id,
        name: 'Betta Copper Gold (Female)',
        slug: 'betta-copper-gold-female',
        description:
          'This female Betta displays a rich metallic copper-to-gold iridescence that shifts dynamically depending on the angle of light — appearing warm copper in subdued lighting and blazing gold under bright LEDs. Female Bettas can be housed together in a "sorority" of 5+ in a well-planted 80L+ aquarium with ample hiding spots. An excellent choice for community planted tanks.',
        price: 180000,
        size: 'S',
        available: 12,
        age: '3 months',
        gender: 'Female',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // More Koi varieties
    prisma.product.upsert({
      where: { slug: 'koi-doitsu-hariwake' },
      update: {},
      create: {
        speciesId: koiSpecies!.id,
        name: 'Koi Doitsu Hariwake',
        slug: 'koi-doitsu-hariwake',
        description:
          'The Doitsu Hariwake combines the striking bi-color Hariwake pattern — vivid lemon-yellow (Ki) over a brilliant platinum-white (Shiro) base — with the Doitsu (German-scale) body type featuring either no scales or a single row of enlarged mirror scales. The absence of regular scaling allows color boundaries to appear exceptionally clean and bold. Imported from renowned Niigata Prefecture breeders in Japan.',
        price: 1800000,
        comparePrice: 2000000,
        size: 'L',
        available: 4,
        age: '12 months',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'koi-gin-rin-kohaku' },
      update: {},
      create: {
        speciesId: koiSpecies!.id,
        name: 'Koi Gin Rin Kohaku',
        slug: 'koi-gin-rin-kohaku',
        description:
          'This high-grade Gin Rin Kohaku combines the classic Kohaku pattern (vibrant red Hi on a pure white Shiroji base) with Gin Rin scaling — each scale carries a brilliant diamond-like reflective quality that ignites with spectacular sparkle under direct light. The body conformation shows excellent depth, width, and taper befitting a show-quality championship specimen.',
        price: 2500000,
        size: 'L',
        available: 3,
        age: '14 months',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'koi-butterfly-longfin' },
      update: {},
      create: {
        speciesId: koiSpecies!.id,
        name: 'Koi Butterfly Longfin',
        slug: 'koi-butterfly-longfin',
        description:
          'Butterfly Koi (Dragon Carp) are distinguished by gracefully extended fins — the pectoral, dorsal, anal, and caudal fins grow two to three times the length of standard Koi fins, flowing like silk ribbons behind the fish. This specimen displays a tri-color red-white-black pattern on a robust, well-proportioned body. Given proper pond conditions with clean, well-oxygenated water, Butterfly Koi grow to 60cm or more.',
        price: 950000,
        size: 'M',
        available: 6,
        age: '8 months',
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    // More Shrimp varieties
    prisma.product.upsert({
      where: { slug: 'tep-yellow-neocaridina-dan-15' },
      update: {},
      create: {
        speciesId: shrimpSpecies!.id,
        name: 'Yellow Neocaridina (Banana Shrimp) Group of 15',
        slug: 'tep-yellow-neocaridina-dan-15',
        description:
          'Yellow Neocaridina shrimp — often called Banana Shrimp — display a vivid, consistent lemon-yellow coloration across the entire body, making them one of the most eye-catching Neocaridina color variants. Bred from the same ancestral stock as Red Cherry Shrimp, they share legendary hardiness, ease of breeding, and tolerance for a wide range of water parameters (pH 6.8–7.8). Prolific breeders ideal for nano planted tanks.',
        price: 135000,
        size: 'XS',
        available: 30,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'tep-orange-rili-dan-10' },
      update: {},
      create: {
        speciesId: shrimpSpecies!.id,
        name: 'Orange Rili Shrimp (Group of 10)',
        slug: 'tep-orange-rili-dan-10',
        description:
          "Orange Rili Neocaridina display one of the most visually fascinating patterns in freshwater shrimp — alternating segments of solid vivid orange and completely transparent sections along the body. The transparent segments allow you to observe the shrimp's internal organs directly through the body wall, creating an almost surreal viewing experience. This Rili pattern breeds true in established colonies. Easy to keep at neutral pH (7.0–7.5).",
        price: 110000,
        size: 'XS',
        available: 25,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'tep-black-rose-dan-10' },
      update: {},
      create: {
        speciesId: shrimpSpecies!.id,
        name: 'Black Rose Shrimp (Group of 10)',
        slug: 'tep-black-rose-dan-10',
        description:
          'Black Rose Shrimp are a selectively bred Neocaridina variety developed for deep, uniform jet-black coloration — a dramatically dark shrimp that creates stunning visual contrast against bright green aquatic plants and light-colored substrates. The intensity of black coloring is highest in females, which are larger and darker than males. As hardy and easy to breed as standard Red Cherry Shrimp.',
        price: 120000,
        comparePrice: 150000,
        size: 'XS',
        available: 20,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),

    prisma.product.upsert({
      where: { slug: 'tep-snowball-dan-10' },
      update: {},
      create: {
        speciesId: shrimpSpecies!.id,
        name: 'Snowball Shrimp (Group of 10)',
        slug: 'tep-snowball-dan-10',
        description:
          "Snowball Shrimp (Neocaridina sp. 'White Pearl') are a pure white variety named for the female's distinctive clutch of bright white eggs — when berried, the mass of eggs under her abdomen resembles a perfect snowball, clearly visible through her semi-translucent white body. Peaceful algae eaters that coexist with most community fish. Ideal for white-themed aquascapes or as a contrasting complement to darker shrimp.",
        price: 130000,
        size: 'XS',
        available: 18,
        isActive: true,
        reserved: 0,
        sold: 0,
      },
    }),
  ]);

  // Product images
  const imagePhotoMap: Record<string, string[]> = {
    'ca-soc-nga-dan-10':                   ['1524704654690-b56c05c78a00', '1639770365554-2c3365af752f'],
    'glofish-danio-electric-green-dan-6':  ['1639770365554-2c3365af752f', '1524704654690-b56c05c78a00'],
    'zebra-danio-longfin-dan-6':           ['1524704654690-b56c05c78a00', '1639770365554-2c3365af752f'],
    'ca-ram-xanh-duc-cap':                 ['1573314268094-9df5fa2a014a', '1542242846-0cc508d981b4'],
    'electric-blue-ram-duc':               ['1542242846-0cc508d981b4', '1573314268094-9df5fa2a014a'],
    'gold-ram-cap':                        ['1573314268094-9df5fa2a014a', '1542242846-0cc508d981b4'],
    'ca-cau-vong-boesemani-dan-6':         ['1659242549433-d7c825aa9fe2', '1684127946837-9bca0bcf138e'],
    'ca-cau-vong-praecox-dan-6':           ['1684127946837-9bca0bcf138e', '1659242549433-d7c825aa9fe2'],
    'ca-cau-vong-turquoise-dan-4':         ['1659242549433-d7c825aa9fe2', '1684127946837-9bca0bcf138e'],
    'ca-peacock-ob-duc':                   ['1612493565024-5450ec0403ac', '1685974314665-0cad40d42127'],
    'peacock-stuartgranti-usisya-duc':     ['1685974314665-0cad40d42127', '1612493565024-5450ec0403ac'],
    'peacock-dragon-blood-duc':            ['1612493565024-5450ec0403ac', '1685974314665-0cad40d42127'],
    'ca-than-lua-flame-angel':             ['1516022109437-ad7a1f89b0d1', '1573976366069-ee53f0cc76db'],
    'ca-than-lua-coral-beauty':            ['1573976366069-ee53f0cc76db', '1516022109437-ad7a1f89b0d1'],
    'betta-dumbo-ear-super-red':           ['1573976366069-ee53f0cc76db', '1540759893615-cb37a9f6027a'],
    'betta-rosetail-platinum-white':       ['1598674953515-32809625dfa2', '1540759893615-cb37a9f6027a'],
    'betta-halfmoon-blue-butterfly':       ['1540759893615-cb37a9f6027a', '1542242846-0cc508d981b4'],
    'betta-copper-gold-female':            ['1598674953515-32809625dfa2', '1573976366069-ee53f0cc76db'],
    'koi-doitsu-hariwake':                 ['1762036997158-50fa6e41ecbd', '1619207525197-74c3ab4e9296'],
    'koi-gin-rin-kohaku':                  ['1612493565024-5450ec0403ac', '1762036997158-50fa6e41ecbd'],
    'koi-butterfly-longfin':               ['1619207525197-74c3ab4e9296', '1612493565024-5450ec0403ac'],
    'tep-yellow-neocaridina-dan-15':       ['1524704654690-b56c05c78a00', '1649816055585-508cac702fb6'],
    'tep-orange-rili-dan-10':              ['1649816055585-508cac702fb6', '1524704654690-b56c05c78a00'],
    'tep-black-rose-dan-10':               ['1649816055585-508cac702fb6', '1524704654690-b56c05c78a00'],
    'tep-snowball-dan-10':                 ['1524704654690-b56c05c78a00', '1649816055585-508cac702fb6'],
  };

  for (const product of extraProducts) {
    const photoIds = imagePhotoMap[product.slug] ?? [];
    for (let i = 0; i < photoIds.length; i++) {
      const url = `https://images.unsplash.com/photo-${photoIds[i]}?w=600&h=600&fit=crop&q=80`;
      const existing = await prisma.fishImage.findFirst({ where: { productId: product.id, url } });
      if (!existing) {
        await prisma.fishImage.create({
          data: { productId: product.id, url, alt: product.name, isPrimary: i === 0, sortOrder: i },
        });
      }
    }
  }

  console.log('✅ 25 extra products seeded');

  // ── SECTION 5: Reviews ─────────────────────────────
  const user1 = await prisma.user.findFirst({ where: { email: 'user@aqualuxe.vn' } });
  const user2 = await prisma.user.findFirst({ where: { email: 'fishfan@gmail.com' } });
  const user3 = await prisma.user.findFirst({ where: { email: 'user3@aqualuxe.vn' } });
  const user4 = await prisma.user.findFirst({ where: { email: 'user4@aqualuxe.vn' } });
  const user5 = await prisma.user.findFirst({ where: { email: 'user5@aqualuxe.vn' } });
  const user6 = await prisma.user.findFirst({ where: { email: 'user6@aqualuxe.vn' } });

  const [
    p_betta_hm, p_betta_ct, p_discus_pb, p_discus_bd,
    p_goldfish_ranchu, p_clown, p_arowana_red, p_koi_kohaku,
    p_angel_altum, p_guppy_fr, p_oscar, p_cherry,
    p_ram_pair, p_rainbowfish, p_peacock, p_betta_dumbo,
    p_betta_rosetail, p_koi_doitsu, p_koi_ginrin, p_shrimp_yellow,
  ] = await Promise.all([
    prisma.product.findUnique({ where: { slug: 'betta-halfmoon-royal-red' } }),
    prisma.product.findUnique({ where: { slug: 'betta-crowntail-galaxy-blue' } }),
    prisma.product.findUnique({ where: { slug: 'dia-pigeon-blood-red' } }),
    prisma.product.findUnique({ where: { slug: 'dia-blue-diamond' } }),
    prisma.product.findUnique({ where: { slug: 'ca-vang-ranchu-nhat' } }),
    prisma.product.findUnique({ where: { slug: 'ca-he-nemo-tank-bred' } }),
    prisma.product.findUnique({ where: { slug: 'ca-rong-hong-vi' } }),
    prisma.product.findUnique({ where: { slug: 'koi-kohaku-f1-nhat' } }),
    prisma.product.findUnique({ where: { slug: 'angel-altum-wild' } }),
    prisma.product.findUnique({ where: { slug: 'guppy-full-red-albino-cap' } }),
    prisma.product.findUnique({ where: { slug: 'oscar-tiger-red' } }),
    prisma.product.findUnique({ where: { slug: 'tep-cherry-fire-red-dan-10' } }),
    prisma.product.findUnique({ where: { slug: 'ca-ram-xanh-duc-cap' } }),
    prisma.product.findUnique({ where: { slug: 'ca-cau-vong-boesemani-dan-6' } }),
    prisma.product.findUnique({ where: { slug: 'ca-peacock-ob-duc' } }),
    prisma.product.findUnique({ where: { slug: 'betta-dumbo-ear-super-red' } }),
    prisma.product.findUnique({ where: { slug: 'betta-rosetail-platinum-white' } }),
    prisma.product.findUnique({ where: { slug: 'koi-doitsu-hariwake' } }),
    prisma.product.findUnique({ where: { slug: 'koi-gin-rin-kohaku' } }),
    prisma.product.findUnique({ where: { slug: 'tep-yellow-neocaridina-dan-15' } }),
  ]);

  const reviewsToCreate = [
    // Betta Halfmoon Royal Red
    { userId: user3?.id, productId: p_betta_hm?.id, rating: 5, comment: "Absolutely stunning fish! The red color is even more vibrant than the photos. Arrived in perfect condition after a 3-hour flight. Already flaring at his reflection and eating pellets. 10/10 would buy again!" },
    { userId: user4?.id, productId: p_betta_hm?.id, rating: 5, comment: "This is my 5th Betta from AquaLuxe and the quality never disappoints. Halfmoon spread is a perfect 180°. The packaging with heat pack kept him warm and stress-free during delivery." },
    { userId: user5?.id, productId: p_betta_hm?.id, rating: 4, comment: "Beautiful fish, healthy and active. Fin edges are crisp with no fin rot. Docked one star only because the color photo on the listing was slightly more saturated than the actual fish — still gorgeous though." },
    // Betta Crowntail Galaxy Blue
    { userId: user4?.id, productId: p_betta_ct?.id, rating: 5, comment: "The galaxy speckles on the blue fins are absolutely mesmerizing under my LED light. Crown tail extensions are long and symmetrical. This fish is a showstopper in my 20L dedicated tank." },
    { userId: user6?.id, productId: p_betta_ct?.id, rating: 5, comment: "First time buying a Crowntail Betta and I'm blown away. The blue-purple iridescence shifts under different lighting angles. Very active and already building a bubble nest!" },
    // Discus Pigeon Blood Red
    { userId: user1?.id, productId: p_discus_pb?.id, rating: 5, comment: "Premium quality Discus. The orange-red coloring is intense and consistent across the body. Adapted to my tank parameters (30°C, pH 6.5) within 2 days and eating beef heart mix. Worth every penny." },
    { userId: user3?.id, productId: p_discus_pb?.id, rating: 5, comment: "I've been keeping Discus for 8 years and this is one of the finest Pigeon Blood specimens I've ever purchased. Pattern clarity is exceptional, no peppered marks. Body roundness is perfect." },
    { userId: user5?.id, productId: p_discus_pb?.id, rating: 4, comment: "Great fish, healthy and eating well. Had a brief acclimation period (3 days being shy) but now fully settled and dominant in my 300L Discus tank. Color continues to develop beautifully." },
    // Discus Blue Diamond
    { userId: user2?.id, productId: p_discus_bd?.id, rating: 5, comment: "Solid turquoise blue with zero breaks in color — exactly what a Blue Diamond should look like. The German F1 bloodline shows in the body depth and roundness. My centerpiece fish!" },
    { userId: user6?.id, productId: p_discus_bd?.id, rating: 5, comment: "Purchased together with a Pigeon Blood. Both arrived healthy and are now paired up. Blue Diamond color deepens after each water change. Highly recommend this seller!" },
    // Goldfish Ranchu
    { userId: user3?.id, productId: p_goldfish_ranchu?.id, rating: 5, comment: "The lion head growth on this Ranchu is impressive for a 5-month-old fish. Perfectly round body with no back arch — true Japanese standard. Swimming in a funny wobbly way that is absolutely adorable." },
    { userId: user4?.id, productId: p_goldfish_ranchu?.id, rating: 4, comment: "Very healthy fish, active and eating well. Head growth is starting to develop nicely. Water temperature of 20-22°C seems to suit him perfectly. My kids are in love with this little guy." },
    // Clownfish Nemo
    { userId: user1?.id, productId: p_clown?.id, rating: 5, comment: "Tank-bred Clownfish are so much easier to acclimate than wild-caught. This little Nemo was eating frozen mysis shrimp on day 2! Already hosting in my Hammer coral. Perfect health, bright orange colors." },
    { userId: user5?.id, productId: p_clown?.id, rating: 5, comment: "Bought a pair and they've already started pairing behaviors. The white bands are crisp and well-defined. Tank-bred fish from AquaLuxe clearly come from quality broodstock." },
    { userId: user6?.id, productId: p_clown?.id, rating: 4, comment: "Beautiful healthy Clownfish. One white band is slightly uneven which is normal variation. Otherwise perfect — eating well and very active in the display tank." },
    // Arowana Banjar Red
    { userId: user2?.id, productId: p_arowana_red?.id, rating: 5, comment: "My first Arowana and what an experience! Banjar Red fins are showing deep orange-red tipping already at 12 months. Came with proper CITES documentation and microchip registration card. The shop's customer service guided me through setup perfectly." },
    { userId: user3?.id, productId: p_arowana_red?.id, rating: 5, comment: "Premium specimen — scales are perfectly aligned with beautiful red edging. Already eating live shrimp and graduated to stick food within a week. Long-term customer here, AquaLuxe never disappoints on Arowanas." },
    // Koi Kohaku
    { userId: user4?.id, productId: p_koi_kohaku?.id, rating: 5, comment: "F1 Japanese bloodline shows clearly — body is thick, torpedo-shaped, and the Kohaku pattern (Hi definition) is sharp. Sashi and Kiwa edges are clean. Exactly what I look for in show-quality Kohaku." },
    { userId: user1?.id, productId: p_koi_kohaku?.id, rating: 4, comment: "Beautiful Kohaku with good body conformation. Pattern is 3-step Hi — classic and elegant. Color is still developing but the base quality is clearly there. Happy with this purchase for my 5,000L pond." },
    { userId: user6?.id, productId: p_koi_kohaku?.id, rating: 5, comment: "Healthy fish, arrived after 6-hour transport in perfect condition. Already eating Hikari Wheat Germ pellets on day one. The Hi (red) pigment is rich and consistent. Excellent value for F1 Japanese bloodline." },
    // Angelfish Altum Wild
    { userId: user5?.id, productId: p_angel_altum?.id, rating: 5, comment: "Wild Altum Angelfish are in a different league from tank-bred ones. The vertical height is extraordinary — nearly 20cm tall when fins extended. Black stripes are jet black against silver body. A true showpiece." },
    { userId: user2?.id, productId: p_angel_altum?.id, rating: 4, comment: "Beautiful fish but requires proper wild-caught acclimation care. Took about a week to settle and start eating frozen bloodworms. Now fully settled and looks absolutely regal in my 200L planted tank." },
    // Guppy Full Red Albino
    { userId: user3?.id, productId: p_guppy_fr?.id, rating: 5, comment: "The red color on these Full Red Albinos is incredible — no orange wash, pure deep red from head to tail. Albino red eyes add to the uniqueness. Already breeding in my 40L guppy tank!" },
    { userId: user4?.id, productId: p_guppy_fr?.id, rating: 5, comment: "Perfect pair with matching coloration. Female already showing gravid spot. These are clearly from a select breeding program — color consistency between the two is excellent." },
    { userId: user6?.id, productId: p_guppy_fr?.id, rating: 4, comment: "Good quality guppies with strong red color. Male's dorsal and caudal fins are full and flowing. Arrived healthy in double-bagged shipping with oxygen. Minor: female has a small nick in tail fin, likely from shipping." },
    // Oscar Tiger Red
    { userId: user1?.id, productId: p_oscar?.id, rating: 5, comment: "My Oscar was smaller than expected (3 months) but grew 3cm in the first month of proper feeding! Tiger pattern is distinctive with good red-orange bands. Personality is incredible — follows my hand along the glass." },
    { userId: user5?.id, productId: p_oscar?.id, rating: 5, comment: "Oscars are the dogs of the fish world and this one proves it. Already recognizes me and begs for food at feeding time. Tiger Red pattern is bold and brightens as he grows. Healthy and voracious eater." },
    // Cherry Shrimp
    { userId: user2?.id, productId: p_cherry?.id, rating: 5, comment: "Received 11 Fire Red Cherry Shrimp (1 extra!). All survived acclimation and are actively grazing on biofilm and algae. Color is true Fire Red — much deeper red than regular Cherries. Already see berried females after 2 weeks!" },
    { userId: user3?.id, productId: p_cherry?.id, rating: 5, comment: "Top-grade Fire Red Cherry Shrimp with solid opaque red coloring. No translucent patches. Population has tripled in 2 months in my 30L planted nano tank. These breed like crazy in established tanks!" },
    { userId: user6?.id, productId: p_cherry?.id, rating: 4, comment: "Very good quality shrimp with rich red color. Lost 2 during acclimation (drip method recommended for shrimp). The remaining 8 are thriving and growing. Tank has green algae they love." },
    // German Blue Ram Pair (new)
    { userId: user1?.id, productId: p_ram_pair?.id, rating: 5, comment: "The matched pair is stunning — male shows full finnage with extended dorsal ray, female has a beautiful rosy-pink belly patch indicating readiness to breed. Already spawning on a flat stone after 3 days!" },
    { userId: user4?.id, productId: p_ram_pair?.id, rating: 5, comment: "German Blue Rams are my favorite dwarf cichlid and this pair is exceptional quality. Blue iridescence covers more than 70% of each scale — show-grade specimens. Settled quickly in my 80L South American biotope." },
    // Rainbowfish Boesemani (new)
    { userId: user2?.id, productId: p_rainbowfish?.id, rating: 5, comment: "Boesemani Rainbowfish in a group of 6 is absolutely spectacular. The school moves in perfect synchrony with the blue fronts and orange rears creating a living gradient of color. Males are in full breeding color displaying to each other." },
    { userId: user5?.id, productId: p_rainbowfish?.id, rating: 4, comment: "Beautiful fish but note they need 3+ months to develop full male coloring. The males arrived a bit pale but after 6 weeks of good feeding and lighting, they're developing stunning dual-tone color. Worth the wait!" },
    // Peacock Cichlid OB (new)
    { userId: user3?.id, productId: p_peacock?.id, rating: 5, comment: "OB Peacock is a head-turner in my 200L Malawi biotope. The orange-blue blotching is unique to each fish — like a fingerprint. Mine has particularly vivid electric blue highlights. Added stability to the tank hierarchy." },
    { userId: user1?.id, productId: p_peacock?.id, rating: 5, comment: "First Malawi cichlid I've ever kept and this OB Peacock won me over completely. Adapts surprisingly well to hard alkaline water (pH 8.2, KH 12). Dominant male colors deepen every week. Absolutely stunning display fish." },
    // Betta Dumbo Ear (new)
    { userId: user6?.id, productId: p_betta_dumbo?.id, rating: 5, comment: "The oversized pectoral fins on this Dumbo Ear Betta are truly something special — they're nearly as wide as his body! Super Red color is deep crimson with no fading. He fans his elephant ears constantly while patrolling his tank." },
    { userId: user2?.id, productId: p_betta_dumbo?.id, rating: 5, comment: "Bought as a gift for my daughter and she named him 'Dumbo' immediately. The pectoral fins move like wings when he swims — enchanting to watch. Healthy, eating pellets, building a bubble nest already." },
    // Betta Rosetail Platinum White (new)
    { userId: user4?.id, productId: p_betta_rosetail?.id, rating: 5, comment: "Rosetail Bettas are controversial for health reasons (excess finnage) but this specimen was clearly bred responsibly — fins are not overly ruffled and he swims comfortably. The platinum white color is like looking at a living pearl." },
    { userId: user3?.id, productId: p_betta_rosetail?.id, rating: 4, comment: "Exquisite show-quality Betta. The rose petal fin texture is breathtaking when he displays. Keeps in low-flow 15L tank as recommended for long-fin Bettas. Docked 1 star as fins had very slight clamping under 26°C — adjusted heater and resolved." },
    // Koi Doitsu Hariwake (new)
    { userId: user5?.id, productId: p_koi_doitsu?.id, rating: 5, comment: "Doitsu Hariwake is visually striking — the scaleless back highlights the yellow-gold pattern against clean white without any scale texture interference. Body conformation is excellent: broad shoulders, strong tail wrist. A real pond showstopper." },
    { userId: user2?.id, productId: p_koi_doitsu?.id, rating: 5, comment: "The mirror scales along the lateral line and dorsal ridge catch the light beautifully. Hariwake pattern has well-defined edges with vivid lemon-gold pigment. Settled into my koi pond within 24 hours and already eating from my hand." },
    // Koi Gin Rin Kohaku (new)
    { userId: user5?.id, productId: p_koi_ginrin?.id, rating: 5, comment: "Gin Rin Kohaku is my dream fish — I've been hunting one for 2 years. The diamond scales sparkle like a disco ball under LED pond lights at night. Pattern quality (2-step Hi) is clean with well-defined edges. Championship-level fish." },
    { userId: user1?.id, productId: p_koi_ginrin?.id, rating: 5, comment: "The photography doesn't do this fish justice. In person, the Gin Rin scales create an aurora-like shimmer as the fish moves. Arriving healthy and adapting to my pond's 8.0 pH without any issues. AquaLuxe's premium Koi sourcing is unmatched." },
    // Yellow Shrimp (new)
    { userId: user6?.id, productId: p_shrimp_yellow?.id, rating: 5, comment: "Banana Shrimp are adorable little creatures! Vivid lemon yellow color pops against my green Monte Carlo carpet. Group of 15 all survived (drip acclimated for 2 hours). Already grazing on biofilm 24/7. Love them!" },
    { userId: user2?.id, productId: p_shrimp_yellow?.id, rating: 4, comment: "Good quality Yellow Neocaridina. Color varies slightly individual to individual (some more golden, some more lemon) which is normal for the variety. All healthy and active. Would prefer Grade A++ consistent color but Grade A is still beautiful." },
  ];

  const validReviews = reviewsToCreate.filter((r) => r.userId && r.productId);
  for (const review of validReviews) {
    const exists = await prisma.review.findUnique({
      where: { userId_productId: { userId: review.userId!, productId: review.productId! } },
    });
    if (!exists) {
      await prisma.review.create({
        data: {
          userId: review.userId!,
          productId: review.productId!,
          rating: review.rating,
          comment: review.comment,
        },
      });
    }
  }
  console.log(`✅ ${validReviews.length} reviews seeded`);

  // ── SECTION 6: Update avgRating ────────────────────
  const allReviewedProducts = await prisma.review.findMany({
    select: { productId: true },
    distinct: ['productId'],
  });

  for (const { productId } of allReviewedProducts) {
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: Math.round((agg._avg.rating || 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });
  }
  console.log('✅ Product ratings updated');

  console.log('\n🎉 Extended seeding complete!');
  console.log('─────────────────────────────────────────────');
  console.log('New users:    user3–user6 @aqualuxe.vn');
  console.log('New species:  5 (Zebra Danio, German Blue Ram, Boesemans Rainbowfish, Peacock Cichlid, Flame Angelfish)');
  console.log('New products: 25');
  console.log('Reviews:      45+');
  console.log('─────────────────────────────────────────────');
  console.log('Run pnpm db:seed-blogs for 15 blog posts.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
