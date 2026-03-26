import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Seeding is not allowed in production environment!');
  }
  console.log('🌱 Seeding blog posts...');

  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!adminUser) throw new Error('Admin user not found — run db:seed first');

await prisma.blogPost.upsert({
  where: { slug: 'aquarium-setup-beginners-guide' },
  update: {},
  create: {
    title: 'How to Set Up Your First Aquarium: A Complete Step-by-Step Guide',
    slug: 'aquarium-setup-beginners-guide',
    excerpt:
      'Starting your first aquarium can feel overwhelming, but with the right guidance it becomes one of the most rewarding hobbies you will ever pursue. This complete step-by-step guide walks you through everything from choosing the right tank size to adding your very first fish.',
    coverImage:
      'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['beginner', 'setup', 'freshwater'],
    viewCount: 1842,
    publishedAt: new Date('2024-10-05'),
    content: `
<h2>Welcome to the World of Fishkeeping</h2>
<p>Setting up your first aquarium is an exciting milestone. Whether you were inspired by a beautiful tank at a friend's house or simply fell in love with the idea of bringing a piece of the aquatic world into your home, you are about to embark on a deeply rewarding journey. This guide will walk you through every step of the process so you can avoid common pitfalls and enjoy a thriving, healthy tank from day one.</p>

<h2>Choosing the Right Tank Size</h2>
<p>The golden rule for beginners is: <strong>bigger is better</strong>. A larger volume of water is far more stable than a small one. Fluctuations in temperature, pH, and ammonia levels happen much more slowly in a larger tank, giving you time to react before fish are harmed.</p>
<ul>
  <li><strong>Minimum recommended size:</strong> 20 liters (about 5 gallons) for a single small species such as a betta.</li>
  <li><strong>Ideal starter size:</strong> 60–100 liters for a community freshwater setup. This gives you enough room for a small school of fish without being unmanageable.</li>
  <li><strong>Avoid nano tanks under 15L</strong> unless you are an experienced keeper — they crash fast and leave little room for error.</li>
</ul>
<p>When selecting a tank, also consider its shape. Longer tanks with greater surface area provide better gas exchange, which means more oxygen for your fish. Tall, narrow tanks look dramatic but are harder to oxygenate and clean.</p>

<h2>Essential Equipment You Will Need</h2>
<p>Before adding a single drop of water, make sure you have the following equipment ready:</p>
<ul>
  <li><strong>Filter:</strong> The biological backbone of your aquarium. Choose a hang-on-back (HOB) or internal sponge filter rated for at least 5–10 times your tank volume per hour.</li>
  <li><strong>Heater:</strong> For tropical fish, maintain water between 24–28°C. A submersible heater with a built-in thermostat is ideal.</li>
  <li><strong>Thermometer:</strong> A simple stick-on or digital thermometer lets you monitor temperature daily.</li>
  <li><strong>LED lighting:</strong> A full-spectrum LED light supports plant growth and brings out fish coloration. Aim for 8–10 hours per day on a timer.</li>
  <li><strong>Water conditioner (dechlorinator):</strong> Tap water contains chlorine and chloramines that are toxic to fish. Products like Seachem Prime neutralize these instantly.</li>
  <li><strong>Test kit:</strong> A liquid test kit for ammonia, nitrite, nitrate, and pH is essential — especially during the cycling phase.</li>
</ul>

<h2>Selecting the Right Substrate</h2>
<p>The substrate is the material covering the bottom of your tank. Your choice affects both aesthetics and fish health:</p>
<ul>
  <li><strong>Gravel:</strong> The classic choice. Easy to clean with a gravel vacuum, available in many colors. Best for fish that do not burrow.</li>
  <li><strong>Fine sand:</strong> Preferred for corydoras, loaches, and other bottom-dwellers that sift through the substrate. Requires gentle cleaning to avoid compaction.</li>
  <li><strong>Aquasoil:</strong> Nutrient-rich substrate designed for planted tanks. Lowers pH slightly, ideal for most tropical plants and discus.</li>
</ul>

<h2>Cycling the Nitrogen Cycle — The Most Important Step</h2>
<p>This is where most beginners make their biggest mistake. <em>Never add fish to an uncycled tank.</em> The nitrogen cycle is the biological process by which beneficial bacteria colonize your filter media and convert toxic ammonia (from fish waste and uneaten food) into nitrite, and then into the relatively harmless nitrate.</p>
<p>Here is the process step by step:</p>
<ul>
  <li>Set up your tank fully with water, filter, and heater running.</li>
  <li>Add an ammonia source — either a few drops of pure ammonia, a pinch of fish food, or a small piece of raw shrimp.</li>
  <li>Test daily. You will see ammonia rise first, then nitrite appear, and finally nitrate climb while ammonia and nitrite drop to zero.</li>
  <li>A typical fishless cycle takes <strong>4–6 weeks</strong>. You can speed this up by adding bottled beneficial bacteria products.</li>
  <li>The cycle is complete when you can add 2–4 ppm ammonia and it converts to zero ammonia and zero nitrite within 24 hours.</li>
</ul>

<h2>Adding Water Conditioner and the First Fill</h2>
<p>Once your tank is cycled, do a large water change (about 50%) to bring nitrates below 20 ppm. Treat all new tap water with a quality dechlorinator before adding it to the tank. Always match the temperature of new water to the tank water to avoid shocking your fish.</p>

<h2>Recommended First Fish</h2>
<p>Start with hardy, forgiving species that tolerate minor parameter fluctuations:</p>
<ul>
  <li><strong>Zebra Danios</strong> — active, schooling fish that thrive in a range of conditions.</li>
  <li><strong>White Cloud Mountain Minnows</strong> — peaceful and tolerant of cooler temperatures.</li>
  <li><strong>Platies and Mollies</strong> — colorful, easy to breed, beginner-friendly livebearers.</li>
  <li><strong>Bronze Corydoras</strong> — excellent bottom cleaners that do best in groups of six or more.</li>
</ul>
<p>Introduce fish gradually — add just a few at a time and wait 1–2 weeks between additions to allow your biological filter to adjust.</p>

<h2>Common Beginner Mistakes to Avoid</h2>
<ul>
  <li><strong>Overstocking:</strong> Too many fish overwhelm your filter and exhaust oxygen. Follow the general rule of 1 cm of fish per liter, adjusting for species waste output.</li>
  <li><strong>Overfeeding:</strong> Feed only what fish can consume in 2–3 minutes, once or twice daily. Uneaten food decays and spikes ammonia.</li>
  <li><strong>Skipping water changes:</strong> Even a cycled tank needs regular water changes — typically 25–30% per week — to keep nitrates in check.</li>
  <li><strong>Mixing incompatible species:</strong> Always research a fish before buying. Aggressive or much larger fish will stress or eat smaller tank mates.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Setting up your first aquarium requires patience, especially during the cycling phase, but the reward is a living, breathing ecosystem you can enjoy every day. Take your time, test your water regularly, and do not rush the process. Your fish will thank you with vibrant colors, active behavior, and long healthy lives. Welcome to the hobby!</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'betta-fish-care-ultimate-guide' },
  update: {},
  create: {
    title: 'Betta Fish Care: The Ultimate Guide to Keeping Siamese Fighting Fish',
    slug: 'betta-fish-care-ultimate-guide',
    excerpt:
      'Betta fish are among the most beautiful and popular freshwater fish in the world, but they have very specific care requirements that are often misunderstood. This ultimate guide covers everything you need to know to keep your betta healthy, vibrant, and happy for years.',
    coverImage:
      'https://images.unsplash.com/photo-1573976366069-ee53f0cc76db?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['betta', 'care-guide', 'freshwater'],
    viewCount: 3217,
    publishedAt: new Date('2024-10-14'),
    content: `
<h2>Understanding the Betta Fish</h2>
<p>The Betta splendens, commonly known as the Siamese Fighting Fish, originates from the shallow rice paddies, ponds, and slow-moving streams of Southeast Asia — primarily Thailand, Cambodia, and Laos. In their natural habitat, bettas live in warm, slightly acidic water with abundant vegetation. Understanding this background is essential to replicating the conditions they need to thrive in captivity.</p>
<p>Bettas are labyrinth fish, meaning they possess a specialized organ called the labyrinth that allows them to breathe atmospheric air directly. This is why you will often see your betta swimming to the surface for a gulp of air — it is completely normal and healthy behavior.</p>

<h2>Tank Size Requirements</h2>
<p>One of the most persistent myths in fishkeeping is that bettas can thrive in tiny cups or bowls. This is simply not true. While bettas can survive in small volumes of water, they cannot <em>thrive</em> in them.</p>
<ul>
  <li><strong>Minimum tank size:</strong> 10 liters (approximately 2.5 gallons). This provides enough water volume to maintain stable parameters.</li>
  <li><strong>Recommended size:</strong> 20–40 liters. A larger tank stays warmer more consistently, dilutes waste better, and gives your betta room to explore and exercise.</li>
  <li><strong>Tank shape:</strong> Prefer longer tanks over tall ones. Bettas are surface breathers and need easy access to the top of the water.</li>
</ul>
<p>Always use a tank with a <strong>fitted lid</strong>. Bettas are notorious jumpers, especially when startled or searching for territory.</p>

<h2>Ideal Water Parameters</h2>
<p>Getting the water right is the single most important factor in betta health. Here are the parameters you should maintain:</p>
<ul>
  <li><strong>Temperature:</strong> 24–30°C (75–86°F). Bettas are tropical fish — cold water suppresses their immune system dramatically. Always use a heater.</li>
  <li><strong>pH:</strong> 6.0–7.5. Bettas tolerate a wide range, but aim for 6.5–7.0 for optimal health.</li>
  <li><strong>Ammonia and Nitrite:</strong> 0 ppm at all times. These are toxic even at very low levels.</li>
  <li><strong>Nitrate:</strong> Keep below 20 ppm with regular water changes.</li>
  <li><strong>Water hardness:</strong> Soft to moderately hard water (4–15 dGH) is acceptable.</li>
</ul>

<h2>Filtration — Low Flow is Key</h2>
<p>Bettas need gentle filtration. Their long, flowing fins are not designed for strong currents, and a powerful filter will stress them out, cause fin damage, and may prevent them from reaching the surface to breathe.</p>
<p>Choose a <strong>sponge filter</strong> or a hang-on-back filter with an adjustable flow rate. If your filter creates too much current, baffle it with a piece of sponge or redirect the output against the tank wall. Perform 25–30% water changes weekly to supplement filtration.</p>

<h2>Diet and Feeding</h2>
<p>Bettas are carnivores. In the wild they eat insects, insect larvae, and small crustaceans. Their diet in captivity should reflect this:</p>
<ul>
  <li><strong>High-quality betta pellets:</strong> The staple of their diet. Look for pellets with fish meal or shrimp meal as the first ingredient, not corn or wheat.</li>
  <li><strong>Frozen bloodworms:</strong> An excellent protein-rich treat, fed 2–3 times per week.</li>
  <li><strong>Brine shrimp (frozen or live):</strong> Easy to digest, great for conditioning bettas before breeding.</li>
  <li><strong>Daphnia:</strong> Acts as a natural laxative and helps prevent constipation — a common betta health issue.</li>
</ul>
<p>Feed small amounts once or twice daily — only what your betta can consume in 2–3 minutes. Include one fasting day per week to prevent bloat and constipation.</p>

<h2>Recognizing and Preventing Disease</h2>
<p>Bettas are prone to several diseases, most of which are preventable through good water quality and stress reduction:</p>
<ul>
  <li><strong>Fin Rot:</strong> Caused by bacteria (often Aeromonas or Pseudomonas), fin rot presents as ragged, receding fin edges. Caused by poor water quality. Treatment: pristine water conditions, aquarium salt, and in severe cases, antibiotics like Kanamycin.</li>
  <li><strong>Ich (White Spot):</strong> Tiny white dots across the body and fins. Raise temperature to 30°C and treat with ich medication or aquarium salt.</li>
  <li><strong>Velvet:</strong> Gold or rust-colored dust on the skin. Very contagious. Treat with copper-based medication in a hospital tank.</li>
  <li><strong>Bloat and Dropsy:</strong> A swollen abdomen with pinecone-scale appearance. Often fatal. Prevention through diet variety and water quality is crucial.</li>
</ul>

<h2>Male vs. Female Bettas</h2>
<p>Male bettas are the flamboyant ones — with their long, flowing fins and brilliant coloration. They <strong>cannot be housed together</strong> and will fight to the death. Females are shorter-finned, less colorful, and can sometimes be kept in groups of 5 or more in a well-planted tank (called a sorority), though aggression can still occur.</p>
<p>Males and females should only be together briefly for breeding. After spawning, remove the female immediately to prevent the male from attacking her.</p>

<h2>Lifespan and Final Tips</h2>
<p>With proper care, a betta fish can live <strong>3–5 years</strong>, with some individuals reaching 7 years. The key factors for longevity are stable warm water, a varied and species-appropriate diet, low stress, and a clean tank. Add live plants like Java Fern or Anubias for enrichment and natural hiding spots. A happy betta will display vibrant color, actively explore its tank, and build beautiful bubble nests at the surface — a sure sign of contentment.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'discus-fish-care-water-parameters' },
  update: {},
  create: {
    title: 'The Secret to Keeping Discus: Mastering Water Quality and Diet',
    slug: 'discus-fish-care-water-parameters',
    excerpt:
      'Discus fish are widely regarded as the Kings of the Aquarium, and for good reason — their stunning disc-shaped bodies and brilliant colors are unrivaled in freshwater fishkeeping. However, they demand near-perfect water conditions and a high-protein diet that challenges even experienced aquarists.',
    coverImage:
      'https://images.unsplash.com/photo-1573314268094-9df5fa2a014a?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['discus', 'care-guide', 'advanced'],
    viewCount: 2104,
    publishedAt: new Date('2024-10-22'),
    content: `
<h2>Why Discus Are Called the King of the Aquarium</h2>
<p>Few fish command as much admiration — and as much respect — as the Discus (Symphysodon spp.). Native to the warm, dark, acidic floodplain waters of the Amazon River basin, discus are renowned for their perfectly round, laterally compressed bodies and the breathtaking range of colors they display. From the wild green and blue strains to the selectively bred Pigeon Blood, Red Melon, and Checkerboard varieties, no two discus tanks look alike.</p>
<p>Their reputation for being difficult is well-earned. Discus are extremely sensitive to water chemistry fluctuations and stress. However, with the right setup, consistent routine, and proper nutrition, they are deeply rewarding fish that will reward patient keepers with decades of enjoyment. This guide gives you the foundation to succeed.</p>

<h2>Water Parameters — The Foundation of Discus Success</h2>
<p>Water quality is non-negotiable with discus. These fish evolved in some of the purest, warmest, and most acidic water on earth:</p>
<ul>
  <li><strong>Temperature:</strong> 28–31°C (82–88°F). This is higher than most tropical fish. High temperatures speed up their metabolism and also help suppress parasites like Hexamita.</li>
  <li><strong>pH:</strong> 5.5–7.0. Wild discus prefer pH around 5.5–6.5. Tank-raised (domestic) discus are more adaptable and do well up to pH 7.0.</li>
  <li><strong>Hardness:</strong> Soft water is ideal — below 10 dGH and low KH. Use RO (reverse osmosis) water mixed with tap water if your tap water is very hard.</li>
  <li><strong>Ammonia and Nitrite:</strong> Must be 0 at all times. Discus are far more sensitive to ammonia than most fish.</li>
  <li><strong>Nitrate:</strong> Keep below 10 ppm ideally. This requires frequent water changes — many serious discus keepers perform 30–50% daily changes.</li>
</ul>

<h2>Filtration Systems for Discus</h2>
<p>Discus require powerful biological filtration but are sensitive to flow. A combination approach works best:</p>
<ul>
  <li><strong>Canister filters:</strong> Eheim or Fluval canisters filled with biological media (ceramic rings, bio-balls) provide excellent filtration with adjustable flow.</li>
  <li><strong>Sponge filters:</strong> Ideal for bare-bottom discus tanks. Easy to clean, gentle flow, and house massive colonies of beneficial bacteria.</li>
  <li><strong>Bare-bottom tanks:</strong> Many discus breeders use bare-bottom tanks (no substrate) for easier cleaning and more efficient water changes.</li>
</ul>

<h2>Feeding Discus — High Protein is Essential</h2>
<p>Discus are primarily carnivorous in the wild. Their diet in captivity should be rich in protein:</p>
<ul>
  <li><strong>Beef heart mix:</strong> The classic discus food. Lean beef heart blended with spinach, garlic, vitamins, and shrimp. Freeze in thin sheets and break off portions to feed.</li>
  <li><strong>Frozen bloodworms:</strong> Highly palatable and protein-dense. Use as a daily staple or training food for new fish.</li>
  <li><strong>High-quality discus pellets:</strong> Brands like Tetra Discus or Sera Discus Granules are convenient for daily feeding. Look for 50%+ protein content.</li>
  <li><strong>Brine shrimp and Mysis shrimp:</strong> Excellent variety food that encourages feeding in shy or stressed discus.</li>
</ul>
<p>Feed young discus 4–5 times daily for rapid growth. Adults can be fed 2–3 times daily. Remove uneaten food within 10 minutes to prevent water quality deterioration.</p>

<h2>Compatible Tank Mates</h2>
<p>Not every fish can tolerate discus water parameters. The best companions include:</p>
<ul>
  <li><strong>Cardinal Tetras:</strong> The classic discus companion. Their deep red and neon blue colors complement discus beautifully, and they thrive in the same warm, acidic water.</li>
  <li><strong>Rummy Nose Tetras:</strong> Another excellent schooling fish for discus tanks.</li>
  <li><strong>Corydoras (Sterbai specifically):</strong> Sterbai corydoras are one of the few bottom dwellers that tolerate discus temperatures above 28°C.</li>
  <li><strong>Altum Angelfish:</strong> Can coexist with discus in very large tanks, though careful monitoring for aggression is needed.</li>
</ul>
<p><strong>Avoid:</strong> Any aggressive fish, fin nippers (serpae tetras, tiger barbs), or fish that cannot tolerate high temperatures.</p>

<h2>Quarantine Process — Never Skip This Step</h2>
<p>Discus are notorious carriers of parasites and pathogens. Always quarantine new fish for a minimum of <strong>4–6 weeks</strong> in a separate tank before introducing them to an established community. During quarantine, treat prophylactically for internal parasites (Metronidazole) and external parasites (Praziquantel). Observe feeding behavior, feces color (white stringy feces indicates internal parasites), and fin condition daily.</p>

<h2>Common Diseases in Discus</h2>
<ul>
  <li><strong>Hexamita (Hole-in-the-Head):</strong> A protozoan parasite that causes pitting around the head and lateral line. Treat with Metronidazole added to food and water.</li>
  <li><strong>Gill Flukes (Dactylogyrus):</strong> Cause rapid, labored breathing. Fish hang near the surface and stop eating. Treat with Praziquantel.</li>
  <li><strong>Capillaria (Thread Worms):</strong> Internal roundworms visible as white threads in feces. Treat with Levamisole.</li>
</ul>

<h2>Breeding Basics</h2>
<p>Discus are substrate spawners that form monogamous pairs. They lay eggs on a vertical surface (slate, PVC pipe, broad leaf) and both parents fan and guard the eggs. Upon hatching, the fry feed on the <strong>mucus secreted directly from the parents' skin</strong> — one of the most remarkable parental behaviors in the fish world. For successful breeding, maintain pristine water, feed a high-protein diet, and provide a calm, stress-free environment. Breeding temperature is typically 30–31°C.</p>

<h2>Final Thoughts</h2>
<p>Discus are not fish for the impatient or the inconsistent. They demand daily attention, frequent water changes, and a commitment to high-quality nutrition. But those who invest the time and effort are rewarded with arguably the most spectacular freshwater fish on the planet. Start with domestically bred discus from reputable breeders, get your water parameters dialed in first, and introduce fish slowly. Your patience will be richly rewarded.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'top-10-saltwater-fish-beginners' },
  update: {},
  create: {
    title: 'Top 10 Most Beautiful Saltwater Fish for Your Home Aquarium',
    slug: 'top-10-saltwater-fish-beginners',
    excerpt:
      'The ocean is home to some of the most stunning creatures on earth, and a saltwater aquarium lets you bring that beauty into your living room. Here are the top 10 most beautiful and accessible marine fish, complete with care requirements and reef compatibility notes.',
    coverImage:
      'https://images.unsplash.com/photo-1516022109437-ad7a1f89b0d1?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['saltwater', 'marine', 'species-guide'],
    viewCount: 4509,
    publishedAt: new Date('2024-11-03'),
    content: `
<h2>Introduction to Marine Fishkeeping</h2>
<p>Saltwater aquariums represent the pinnacle of the fishkeeping hobby. The sheer variety of colors, shapes, and behaviors found in marine fish is unmatched by any freshwater species. While saltwater tanks require more equipment and maintenance than freshwater setups, the visual reward is extraordinary. Here are the ten most beautiful and achievable marine fish for home aquarists.</p>

<h2>1. Ocellaris Clownfish (Amphiprion ocellaris)</h2>
<p>Made globally famous by a certain animated film, the Ocellaris Clownfish is the quintessential beginner marine fish. Its bold orange and white coloration is instantly recognizable, and it is one of the hardiest saltwater fish available.</p>
<ul>
  <li><strong>Tank size:</strong> 75+ liters</li>
  <li><strong>Care level:</strong> Easy</li>
  <li><strong>Reef safe:</strong> Yes</li>
  <li><strong>Notes:</strong> Does not require an anemone but will bond with one if provided. Keep in pairs.</li>
</ul>

<h2>2. Royal Gramma (Gramma loreto)</h2>
<p>The Royal Gramma is a jewel of the Caribbean reef — its front half is vivid purple and its back half is bright yellow, with no gradual transition. It is peaceful, hardy, and stays relatively small.</p>
<ul>
  <li><strong>Tank size:</strong> 100+ liters</li>
  <li><strong>Care level:</strong> Easy</li>
  <li><strong>Reef safe:</strong> Yes</li>
  <li><strong>Notes:</strong> Keep only one per tank unless the tank is very large. Territorial with its own species.</li>
</ul>

<h2>3. Firefish Goby (Nemateleotris magnifica)</h2>
<p>The Firefish Goby is an elegant, slender fish with a white-to-yellow body that fades into a brilliant red-orange tail. It hovers above the substrate in mid-water, darting quickly when startled.</p>
<ul>
  <li><strong>Tank size:</strong> 80+ liters</li>
  <li><strong>Care level:</strong> Easy to Moderate</li>
  <li><strong>Reef safe:</strong> Yes</li>
  <li><strong>Notes:</strong> Jumper — always use a tight-fitting lid. Best kept in pairs.</li>
</ul>

<h2>4. Banggai Cardinalfish (Pterapogon kauderni)</h2>
<p>Endemic to the Banggai Archipelago of Indonesia, this striking black-and-silver fish with intricate white spots is one of the most distinctive in the hobby. It is also a mouthbrooder — the male carries eggs in his mouth until they hatch.</p>
<ul>
  <li><strong>Tank size:</strong> 100+ liters</li>
  <li><strong>Care level:</strong> Easy to Moderate</li>
  <li><strong>Reef safe:</strong> Yes</li>
  <li><strong>Notes:</strong> Look for captive-bred specimens to support conservation efforts.</li>
</ul>

<h2>5. Mandarin Dragonet (Synchiropus splendidus)</h2>
<p>Arguably the most beautiful fish in the entire saltwater hobby, the Mandarin Dragonet displays an almost psychedelic pattern of electric blue, orange, and green. <em>However</em>, it is notoriously difficult to feed — wild specimens typically only eat live copepods.</p>
<ul>
  <li><strong>Tank size:</strong> 200+ liters with mature live rock</li>
  <li><strong>Care level:</strong> Difficult</li>
  <li><strong>Reef safe:</strong> Yes</li>
  <li><strong>Notes:</strong> Only attempt with a well-established copepod population or a trained specimen that accepts frozen food.</li>
</ul>

<h2>6. Flame Angelfish (Centropyge loricula)</h2>
<p>The Flame Angel is a brilliant red-orange dwarf angelfish with vertical black stripes and electric blue-edged fins. It is one of the most popular marine fish in the hobby and is relatively forgiving compared to larger angelfish species.</p>
<ul>
  <li><strong>Tank size:</strong> 150+ liters</li>
  <li><strong>Care level:</strong> Moderate</li>
  <li><strong>Reef safe:</strong> With caution (may nip at LPS corals and clam mantles)</li>
</ul>

<h2>7. Blue Tang (Paracanthurus hepatus)</h2>
<p>The Blue Tang's vivid cobalt blue body with black "palette" marking and yellow tail makes it one of the most recognizable marine fish. It is an active swimmer that needs a large tank to thrive and is susceptible to ich.</p>
<ul>
  <li><strong>Tank size:</strong> 300+ liters</li>
  <li><strong>Care level:</strong> Moderate</li>
  <li><strong>Reef safe:</strong> Yes</li>
</ul>

<h2>8. Watchman Goby (Cryptocentrus cinctus)</h2>
<p>The Yellow Watchman Goby is a charming fish with a bright yellow body, blue spots around the face, and large, expressive eyes. It often forms a symbiotic relationship with pistol shrimp, sharing a burrow in the substrate.</p>
<ul>
  <li><strong>Tank size:</strong> 75+ liters</li>
  <li><strong>Care level:</strong> Easy</li>
  <li><strong>Reef safe:</strong> Yes</li>
</ul>

<h2>9. Cleaner Wrasse (Labroides dimidiatus)</h2>
<p>This slender blue-and-black wrasse performs an ecological function in the wild — cleaning parasites from larger fish. In a reef tank, it provides the same service and adds elegant movement and color.</p>
<ul>
  <li><strong>Tank size:</strong> 150+ liters</li>
  <li><strong>Care level:</strong> Moderate to Difficult</li>
  <li><strong>Reef safe:</strong> Yes</li>
</ul>

<h2>10. Orchid Dottyback (Pseudochromis fridmani)</h2>
<p>The Orchid Dottyback is a stunning, solid purple fish that is surprisingly hardy for a marine species. It is bold, active, and tolerates a range of water conditions well. Captive-bred specimens are widely available.</p>
<ul>
  <li><strong>Tank size:</strong> 75+ liters</li>
  <li><strong>Care level:</strong> Easy to Moderate</li>
  <li><strong>Reef safe:</strong> Yes</li>
</ul>

<h2>Final Thoughts</h2>
<p>Saltwater fish represent some of nature's most extraordinary artwork. Start with the hardier species on this list (Clownfish, Royal Gramma, Watchman Goby) and build your confidence before attempting more demanding fish like the Mandarin Dragonet. Research each species thoroughly before purchasing, ensure your tank is fully cycled and stable, and source fish from reputable suppliers who prioritize sustainably collected or captive-bred specimens.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'koi-varieties-complete-guide' },
  update: {},
  create: {
    title: "Understanding Koi Varieties: From Kohaku to Showa — A Complete Collector's Guide",
    slug: 'koi-varieties-complete-guide',
    excerpt:
      'Koi are living jewels, and understanding their variety classifications is the key to appreciating — and collecting — these magnificent pond fish. This complete guide walks you through the history of Koi in Japan, the major variety groups, grading standards, and everything you need to build a world-class pond.',
    coverImage:
      'https://images.unsplash.com/photo-1612493565024-5450ec0403ac?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['koi', 'pond', 'species-guide'],
    viewCount: 1763,
    publishedAt: new Date('2024-11-15'),
    content: `
<h2>The History of Koi in Japan</h2>
<p>Koi, or <em>Nishikigoi</em> (literally "brocaded carp"), have been selectively bred in Japan for over 200 years. Originally developed from common carp in the Niigata Prefecture, early Japanese farmers noticed natural color mutations and began selectively breeding for specific patterns. By the early 20th century, Koi keeping had spread throughout Japan, and by the 1960s these spectacular fish had captured the hearts of hobbyists worldwide. Today, top-quality Japanese Koi can sell for hundreds of thousands of dollars at auction, making them among the most valuable ornamental fish in existence.</p>

<h2>The Gosanke — The Big Three</h2>
<p>In the world of competitive Koi, three varieties reign supreme and are collectively known as the <strong>Gosanke</strong>:</p>

<h3>1. Kohaku</h3>
<p>The Kohaku is the foundation of all Koi appreciation — a white (<em>shiroji</em>) fish with red (<em>hi</em>) markings. Despite its apparent simplicity, the Kohaku is the variety by which all Koi judges begin their education. The quality of white must be snow-pure, and the red must be consistent in depth and tone throughout. Patterns are described poetically: "Ippon Hi" (one solid red pattern), "Nidan Kohaku" (two-step pattern), "Sandan" (three-step), and so on.</p>

<h3>2. Taisho Sanke</h3>
<p>The Taisho Sanke is essentially a Kohaku with the addition of <strong>black (sumi) markings</strong> on the body — never on the head. The ideal Sanke has a brilliant white base, clear red patterns, and crisp black accents that complement rather than overpower the overall design. Sumi in Sanke is considered a "decorative element," unlike in Showa where it is structural.</p>

<h3>3. Showa Sanshoku</h3>
<p>The Showa is a black-based Koi with red and white markings — the inverse concept of Sanke. Sumi in Showa appears on the head and wraps around the body in bold, structural patterns. A key identifier is the black markings extending into the pectoral fins. Modern Showa tend to have more white and vibrant red than the heavy black of traditional Kindai Showa. Showa are considered the most "dynamic" of the Gosanke.</p>

<h2>Other Major Koi Varieties</h2>
<ul>
  <li><strong>Tancho:</strong> Any Koi with a single red circle on the head and no other red markings. Named after the Japanese Tancho crane. Considered very auspicious.</li>
  <li><strong>Utsuri:</strong> Black-based Koi with white (Shiro Utsuri), red (Hi Utsuri), or yellow (Ki Utsuri) markings. Dramatic and bold.</li>
  <li><strong>Asagi:</strong> A blue-scaled Koi with red on the sides, belly, and fins. One of the oldest recognized varieties.</li>
  <li><strong>Bekko:</strong> White, red, or yellow base with black markings. Simple but elegant.</li>
  <li><strong>Ogon:</strong> Single-colored metallic Koi — platinum, gold, or orange. Prized for their shimmering, mirror-like luster.</li>
  <li><strong>Shusui:</strong> The doitsu (scaleless) version of Asagi, with a single row of large blue scales along the dorsal line.</li>
</ul>

<h2>Understanding Gin-Rin and Doitsu</h2>
<p><strong>Gin-Rin</strong> (also written Kinginrin) refers to scales that have a sparkling, diamond-like reflective quality. A Gin-Rin Kohaku, for example, shimmers magnificently in sunlight. <strong>Doitsu</strong> Koi are partially or fully scaleless, originating from a cross with German mirror carp. They have smooth skin with only a row or two of large scales along the back and lateral line. Both Gin-Rin and Doitsu add premium value when the underlying variety quality is already high.</p>

<h2>Grading Koi Quality — Sashi and Kiwa</h2>
<p>Two Japanese terms are critical for evaluating pattern quality:</p>
<ul>
  <li><strong>Sashi:</strong> The leading edge of a red pattern where red scales overlap white scales. In high-quality Koi, this transition is gradual and soft-edged.</li>
  <li><strong>Kiwa:</strong> The trailing edge of a red pattern where white scales overlap red. Ideally this edge is sharp, clean, and clearly defined.</li>
</ul>
<p>Body conformation is equally important: a show-quality Koi should have a broad, symmetrical body, a proportionally large head, and perfectly shaped fins. Blemishes, asymmetrical patterns, and deformities disqualify a Koi from serious competition.</p>

<h2>Pond Requirements for Koi</h2>
<ul>
  <li><strong>Minimum volume:</strong> 5,000 liters for a small collection of 6–8 Koi. Koi can grow to 60–90 cm and require enormous amounts of space.</li>
  <li><strong>Depth:</strong> At least 1.5 meters to protect from predators and temperature extremes.</li>
  <li><strong>Filtration:</strong> High-capacity biological and mechanical filtration is essential. Koi are heavy waste producers.</li>
  <li><strong>UV sterilization:</strong> Controls green water algae blooms and reduces pathogen load.</li>
  <li><strong>Aeration:</strong> Multiple air stones or venturis to maintain dissolved oxygen above 7 ppm.</li>
</ul>

<h2>Feeding and Seasonal Care</h2>
<p>Feed high-quality Koi pellets (35–40% protein) 2–3 times daily in spring and summer. As water temperatures drop below 15°C in autumn, switch to a wheat germ-based food that is easier to digest at low temperatures. Below 10°C, stop feeding entirely — Koi's digestive systems essentially shut down in cold water and undigested food in their gut can cause serious health issues.</p>

<h2>Final Thoughts</h2>
<p>Collecting Koi is a lifelong pursuit. The variety of patterns, the dynamic way color changes as Koi mature, and the sheer presence of these large, intelligent fish make the hobby endlessly captivating. Start with quality over quantity — one exceptional Kohaku will bring more joy and appreciation than ten average fish. Find a reputable dealer, learn the terminology, and take your time developing an eye for quality. The journey is as rewarding as the destination.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'guppy-breeding-step-by-step' },
  update: {},
  create: {
    title: "How to Breed Guppies Successfully: A Step-by-Step Beginner's Guide",
    slug: 'guppy-breeding-step-by-step',
    excerpt:
      'Guppies are the most popular livebearing fish in the hobby, and breeding them is one of the most accessible and rewarding projects a beginner aquarist can undertake. This step-by-step guide covers everything from sexing your fish to raising fry into healthy adults.',
    coverImage:
      'https://images.unsplash.com/photo-1540759893615-cb37a9f6027a?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['guppy', 'breeding', 'freshwater'],
    viewCount: 2891,
    publishedAt: new Date('2024-11-28'),
    content: `
<h2>Why Breed Guppies?</h2>
<p>Guppies (Poecilia reticulata) are livebearers — meaning they give birth to free-swimming fry rather than laying eggs. This makes them uniquely accessible for beginning breeders. Within just a few months of starting, you can be producing dozens of fry per month, experimenting with color lines, and developing your own strain of show-quality guppies. The hobby is deeply addictive and endlessly variable.</p>

<h2>Sexing Guppies — Male vs Female</h2>
<p>Before you can breed guppies intentionally, you need to reliably tell males from females:</p>
<ul>
  <li><strong>Males:</strong> Smaller body, spectacular coloration in the tail and dorsal fin, and most importantly — a modified anal fin called the <em>gonopodium</em>. This rod-like structure is used to internally fertilize the female.</li>
  <li><strong>Females:</strong> Larger, more robust body with a rounder belly. Plain silver/grey coloring. A dark triangular spot near the anal fin called the <em>gravid spot</em> darkens progressively as a pregnancy advances.</li>
</ul>
<p>Sexing becomes easy within 4–6 weeks of birth as the gonopodium develops in males and females begin showing their gravid spot.</p>

<h2>Setting Up a Breeding Tank</h2>
<p>A dedicated breeding tank offers the best results and protects the fry from being eaten:</p>
<ul>
  <li><strong>Size:</strong> 20–40 liters is ideal. Large enough for stable parameters, small enough to find and collect fry easily.</li>
  <li><strong>Filtration:</strong> Use a <strong>sponge filter only</strong>. Powerhead and HOB filters will suck up newborn fry. A sponge filter provides gentle filtration and serves as a food source (infusoria in the sponge) for the fry.</li>
  <li><strong>Temperature:</strong> 26–28°C. Warmer temperatures slightly accelerate gestation.</li>
  <li><strong>Plants:</strong> Dense floating plants (Water Sprite, Hornwort, Java Moss) give fry hiding spots and increase survival rates dramatically.</li>
</ul>

<h2>The Right Breeding Ratio</h2>
<p>The recommended ratio is <strong>1 male to 2–3 females</strong>. This is important because males will constantly pursue and harass females — spreading their attention across multiple females reduces stress on any single individual. A stressed or harassed female is a poor breeder and more susceptible to disease.</p>
<p>For a selective breeding program to maintain specific color lines, use only the specific male and females you have chosen. Keep breeding groups separate in their own tanks to prevent line contamination.</p>

<h2>Gestation Period and Birth</h2>
<p>After successful mating, female guppies gestate for approximately <strong>21–30 days</strong>, depending on water temperature (warmer = faster). An experienced eye can estimate due date by the size of the gravid spot and the visible shape of fry eyes through the female's abdomen.</p>
<p>When birth is imminent, the female will become very large, boxy in shape, and may hide near the bottom or in plant thickets. Females can give birth to anywhere from 5 to 100+ fry per drop, depending on age, size, and health.</p>

<h2>Fry Care — The First Critical Weeks</h2>
<p>Newborn guppy fry are surprisingly robust. They are born free-swimming and immediately seek cover. Here is how to maximize survival rates:</p>
<ul>
  <li><strong>Separate the mother:</strong> Remove the female as soon as you notice fry to prevent predation. Even the most docile females will eat fry given the opportunity.</li>
  <li><strong>First foods:</strong> Crushed high-quality flake food, micro-pellets, baby brine shrimp (newly hatched), and vinegar eels are all excellent first foods. Feed small amounts 3–4 times daily.</li>
  <li><strong>Water changes:</strong> Small, frequent water changes (10–15% every 2–3 days) are crucial for rapid growth. Guppy fry are extremely sensitive to nitrate accumulation, which stunts growth.</li>
  <li><strong>Lighting:</strong> 12–14 hours of light per day encourages active feeding and faster growth.</li>
</ul>

<h2>Color Line Selection</h2>
<p>As fry mature (at around 4–6 weeks), males begin to show color. This is when the real artistry of guppy breeding begins. Select only the most vibrant, structurally sound males with the best tail shape, color saturation, and pattern to breed to the next generation. Cull (remove from the breeding program, not kill) those that don't meet your standard. Over successive generations, your line will become increasingly refined.</p>
<p>Popular guppy color lines include: Moscow Blue, Tuxedo, Yellow Cobra, Platinum, and Dumbo Ear (large pectoral fins). Each requires specific selective pressure to maintain and improve.</p>

<h2>Common Diseases During Breeding</h2>
<ul>
  <li><strong>Fin rot:</strong> Common in crowded, high-waste breeding tanks. Maintain water quality rigorously.</li>
  <li><strong>Velvet (Oodinium):</strong> Gold dust appearance. Treat with copper-based medication in a hospital tank. Fatal if untreated.</li>
  <li><strong>Wasting disease:</strong> Rapid weight loss despite eating. Often caused by internal parasites (Camallanus worms). Treat with Levamisole or Fenbendazole.</li>
  <li><strong>Bent spine (Scoliosis):</strong> Genetic defect in some lines. Remove affected fish from the breeding program.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Guppy breeding is one of the most accessible entry points into the world of selective fish breeding. With minimal equipment and a modest budget, you can produce beautiful strains and develop a genuine understanding of genetics, husbandry, and fish health. Start with quality stock from a reputable breeder, maintain excellent water quality, and keep detailed records of your breeding pairs and results. Within a year, you may well have a unique strain to call your own.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'aquarium-plants-guide-for-beginners' },
  update: {},
  create: {
    title: 'Live Aquarium Plants 101: Best Plants for Every Tank and Fish',
    slug: 'aquarium-plants-guide-for-beginners',
    excerpt:
      'Live aquarium plants transform a bare tank into a thriving underwater ecosystem, providing oxygen, natural filtration, hiding spots, and stunning visual beauty. This guide covers the best plants for every experience level, lighting requirement, and fish species.',
    coverImage:
      'https://images.unsplash.com/photo-1534054106-0c1b80bad28d?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['plants', 'aquascape', 'beginner'],
    viewCount: 2256,
    publishedAt: new Date('2024-12-05'),
    content: `
<h2>Why Use Live Plants in Your Aquarium?</h2>
<p>Live aquatic plants do far more than just look beautiful. They are active participants in the aquarium ecosystem, performing functions that benefit both the water quality and the fish that inhabit the tank:</p>
<ul>
  <li><strong>Oxygen production:</strong> Through photosynthesis, plants produce dissolved oxygen that fish need to breathe, especially important in densely stocked tanks.</li>
  <li><strong>Natural algae control:</strong> Healthy, fast-growing plants outcompete algae for nutrients, dramatically reducing algae outbreaks in well-planted tanks.</li>
  <li><strong>Ammonia and nitrate absorption:</strong> Plants absorb ammonia and nitrates directly, complementing your filter's biological activity.</li>
  <li><strong>Hiding spots and territory:</strong> Dense planting reduces aggression by providing visual barriers and shelter for shy or subordinate fish.</li>
  <li><strong>Breeding stimulus:</strong> Many fish species require plants to spawn — egg scatterers use plants to deposit eggs, while livebearers use dense vegetation to protect newborn fry.</li>
</ul>

<h2>Easy Starter Plants — No CO2 Needed</h2>
<p>These plants thrive under low to moderate lighting and do not require CO2 injection, making them perfect for beginners:</p>

<h3>Java Fern (Microsorum pteropus)</h3>
<p>Java Fern is arguably the most beginner-friendly plant in the hobby. Its leathery, dark green leaves are virtually indestructible, it tolerates a wide range of lighting and water parameters, and it grows by producing new plantlets on the edges of its leaves. <em>Important:</em> Never bury the rhizome in substrate — attach it to driftwood or rock with fishing line or super glue gel.</p>

<h3>Anubias</h3>
<p>Like Java Fern, Anubias is a slow-growing, rhizome-based plant that attaches to hardscape rather than substrate. Its thick, waxy leaves are resistant to herbivorous fish and snails. Available in many varieties — Anubias barteri, Anubias nana (dwarf), and Anubias coffeefolia (textured leaves). Excellent for shaded spots under driftwood.</p>

<h3>Java Moss (Taxiphyllum barbieri)</h3>
<p>Java Moss is one of the most versatile aquatic plants. It can be tied to any surface, left free-floating, or used as a carpet plant with low light. It is ideal habitat for breeding fish and fry, and provides endless surface area for beneficial bacteria. Grows in almost any condition.</p>

<h3>Hornwort (Ceratophyllum demersum)</h3>
<p>Hornwort is a fast-growing stem plant that floats freely or can be anchored. It is a prolific oxygen producer and nutrient absorber, making it excellent for controlling algae and buffering new tanks. A true "beginner's best friend." Its rapid growth means it needs regular trimming.</p>

<h3>Water Wisteria (Hygrophila difformis)</h3>
<p>A stunning, fast-growing stem plant with delicate, finely divided leaves under good lighting. Tolerates moderate light and no CO2, and grows quickly enough to make a visible impact within weeks. Excellent background plant.</p>

<h2>Intermediate Plants</h2>

<h3>Amazon Sword (Echinodorus bleheri)</h3>
<p>A classic centerpiece plant for medium to large tanks. Amazon Swords grow large (40–60 cm) and produce impressive rosettes of long, lance-shaped leaves. They prefer root tabs in the substrate for nutrient uptake and moderate to high lighting.</p>

<h3>Cryptocoryne Species</h3>
<p>Crypts are slow-growing rosette plants that tolerate low light remarkably well. The trade-off is "crypt melt" — when introduced to a new tank, they often drop their leaves as they adjust. Be patient: new leaves emerge within a few weeks, and the plant settles in beautifully.</p>

<h3>Vallisneria (Tape Grass)</h3>
<p>Vallisneria produces long, ribbon-like leaves that sway elegantly in the current. It spreads via runners and can fill a tank background quickly. Tolerates hard water better than most plants, making it ideal for tanks with cichlids or livebearers.</p>

<h2>CO2 vs. No-CO2 Tanks</h2>
<p>Carbon dioxide injection is optional but significantly accelerates plant growth and enables a much wider range of demanding plant species. A pressurized CO2 system maintains dissolved CO2 at 20–30 ppm during the photoperiod. Without CO2, stick to the low-light, slow-growing species listed above. Liquid carbon supplements (like Seachem Excel) provide a modest alternative for planted tanks that do not have pressurized CO2.</p>

<h2>Fertilizers and Substrate</h2>
<p>Plants need more than just light and CO2 — they require macro and micronutrients:</p>
<ul>
  <li><strong>Root tabs:</strong> Pressed clay tablets placed near the roots of heavy feeders like Amazon Swords and crypts. Replace every 2–3 months.</li>
  <li><strong>Liquid fertilizers:</strong> Dosed weekly to the water column for stem plants and epiphytes. Look for complete fertilizers containing iron, potassium, and trace elements.</li>
  <li><strong>Aquasoil:</strong> Nutrient-rich substrate like ADA Aqua Soil or Fluval Stratum provides months of root nutrition and lowers pH — ideal for most tropical plants.</li>
</ul>

<h2>Plant Compatibility with Fish</h2>
<p>Not all fish respect your plants. Be aware of these combinations:</p>
<ul>
  <li><strong>Cichlids:</strong> Many cichlids uproot plants or shred leaves. Use only robust, rhizome-attached plants (Anubias, Java Fern) or plastic alternatives.</li>
  <li><strong>Goldfish:</strong> Will eat virtually any soft-leaved plant. Stick to Anubias and Java Fern if keeping goldfish.</li>
  <li><strong>Silver dollars and Buenos Aires Tetras:</strong> Notorious plant eaters. Almost incompatible with planted tanks.</li>
  <li><strong>Tetras, rasboras, corydoras:</strong> Completely plant-safe and look magnificent in lush planted environments.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Starting with just three or four of the beginner plants in this guide will transform your aquarium from a glass box into a living ecosystem. As your confidence grows, you can experiment with more demanding species, add a CO2 system, and move toward a fully planted aquascape. The journey from bare tank to lush underwater garden is one of the most satisfying in the entire hobby.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'freshwater-vs-saltwater-aquarium' },
  update: {},
  create: {
    title: 'Freshwater vs Saltwater Aquarium: Which Setup Is Right for You?',
    slug: 'freshwater-vs-saltwater-aquarium',
    excerpt:
      "Both freshwater and saltwater aquariums offer unique beauty and challenges, but they are very different commitments in terms of cost, time, and expertise. This honest comparison will help you decide which type of aquarium fits your lifestyle, budget, and goals.",
    coverImage:
      'https://images.unsplash.com/photo-1518020382113-c24e1c9bf726?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['freshwater', 'saltwater', 'beginner'],
    viewCount: 3102,
    publishedAt: new Date('2024-12-18'),
    content: `
<h2>The Great Debate: Freshwater or Saltwater?</h2>
<p>If you are new to fishkeeping and trying to decide which direction to go, you are facing the hobby's most fundamental question. Both types of aquarium can be breathtakingly beautiful. Both will teach you about biology, water chemistry, and the patience required to keep living creatures healthy. But they are dramatically different in terms of cost, complexity, and day-to-day commitment. This guide gives you an honest comparison to help you make the right choice.</p>

<h2>Cost Comparison — Initial Setup</h2>
<p>Freshwater tanks are significantly cheaper to set up:</p>
<ul>
  <li><strong>Freshwater 100L setup:</strong> Tank + stand + filter + heater + lighting + substrate + decor = approximately $200–$400 USD.</li>
  <li><strong>Saltwater 200L reef setup:</strong> Tank + sump + protein skimmer + return pump + powerheads + lighting (LED reef lights are expensive) + live rock + RODI system + test kits + salt mix = $1,500–$4,000+ USD.</li>
</ul>
<p>The saltwater gap is driven primarily by specialized equipment: a protein skimmer to remove organic waste before it breaks down, RODI (reverse osmosis deionization) water production to create pure water for salt mixing, and high-intensity reef lighting that can drive coral photosynthesis.</p>

<h2>Ongoing Maintenance Costs</h2>
<ul>
  <li><strong>Freshwater:</strong> Electricity, fish food, water conditioner, and occasional medication. Typically $20–$50/month.</li>
  <li><strong>Saltwater:</strong> Electricity (significantly higher due to more pumps and high-wattage lighting), salt mix (~$30–$50 per 25 kg bag), RODI filter replacement membranes, coral supplements (calcium, alkalinity, magnesium dosing). Typically $80–$200+/month.</li>
</ul>

<h2>Difficulty Level</h2>
<p><strong>Freshwater:</strong> Beginner-friendly. The nitrogen cycle is the same, but freshwater fish are generally hardier and more tolerant of parameter fluctuations. Many species will breed without any special intervention. The hobby has a very gentle learning curve.</p>
<p><strong>Saltwater:</strong> Moderate to advanced. Marine fish are often wild-caught and significantly less tolerant of poor water quality. Saltwater parameters — pH, salinity (specific gravity 1.024–1.026), alkalinity, calcium — must all be monitored and maintained. Reef tanks with corals add another layer of complexity (and expense).</p>

<h2>Species Variety and Visual Impact</h2>
<p>Both offer incredible variety, just different aesthetics:</p>
<ul>
  <li><strong>Freshwater:</strong> Thousands of species across every color of the rainbow. Discus, killifish, cichlids, planted tanks, biotopes, and the growing world of rare nano fish offer endless exploration. A lush planted tank can rival any reef for visual impact.</li>
  <li><strong>Saltwater:</strong> Marine fish and corals produce colors and patterns that are genuinely otherworldly. Clownfish in anemones, the electric blue of a Regal Tang, the living kaleidoscope of a coral reef — nothing in freshwater quite matches the visual drama of a mature reef tank.</li>
</ul>

<h2>Time Commitment</h2>
<ul>
  <li><strong>Freshwater:</strong> Weekly water changes of 25–30%, regular feeding, monthly filter cleaning. Perhaps 30–60 minutes per week for a well-established tank.</li>
  <li><strong>Saltwater:</strong> Daily monitoring of parameters, topping off evaporated water (saltwater evaporates but salt does not, causing salinity spikes), weekly or bi-weekly water changes, weekly testing of calcium and alkalinity in reef tanks. Plan for 1–3 hours per week minimum.</li>
</ul>

<h2>Which Should You Choose?</h2>
<p>Here is a simple framework for your decision:</p>
<ul>
  <li><strong>Choose freshwater if:</strong> You are a complete beginner, you have a limited budget (under $500 startup), you want a lower-maintenance setup, or you are primarily interested in aquascaping and planted tanks.</li>
  <li><strong>Choose saltwater if:</strong> You have some fishkeeping experience, you have a budget of $1,500+, you are fascinated by coral and reef ecosystems, and you are prepared to invest significant time in monitoring and maintenance.</li>
</ul>

<h2>Verdict</h2>
<p>For most beginners, starting with a freshwater aquarium is the smart choice. Gain experience with the nitrogen cycle, water chemistry, and fish husbandry in a more forgiving environment. After 12–24 months of successful freshwater keeping, transitioning to saltwater feels natural and the investment is much more likely to succeed. That said, if saltwater is your dream from day one and you have the budget and time, there is no rule that says you cannot start there — just go in with your eyes open about the challenges and costs involved. Either way, the hobby will reward you richly.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'common-fish-diseases-treatment' },
  update: {},
  create: {
    title: 'Common Aquarium Fish Diseases: How to Identify and Treat Them',
    slug: 'common-fish-diseases-treatment',
    excerpt:
      'Even the most diligent aquarist will eventually encounter disease in their tank. Knowing how to quickly identify symptoms and respond with the correct treatment is the difference between saving your fish and losing them. This guide covers the eight most common aquarium diseases with full treatment protocols.',
    coverImage:
      'https://images.unsplash.com/photo-1499936945-322de9eed9eb?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['health', 'disease', 'care-guide'],
    viewCount: 5234,
    publishedAt: new Date('2025-01-06'),
    content: `
<h2>The First Rule: Early Detection Saves Lives</h2>
<p>Fish cannot communicate discomfort the way mammals can, so disease often progresses significantly before keepers notice something is wrong. The single most important habit you can develop is spending at least 5–10 minutes observing your fish every day. Watch for changes in behavior (hiding, lethargy, loss of appetite), physical appearance (spots, lesions, torn fins), and swimming patterns (listing, surface gasping, erratic movement). Early detection is the most powerful tool you have against disease.</p>

<h2>The Importance of a Quarantine Tank</h2>
<p>Before diving into specific diseases, a critical piece of infrastructure deserves mention: the <strong>quarantine tank</strong>. A basic 40–60L tank with a sponge filter, heater, and some hiding spots should be a permanent part of your fishkeeping setup. Every new fish should spend a minimum of 3–4 weeks in quarantine before joining your display tank. This prevents the introduction of pathogens that could devastate an established, healthy community. Treat sick fish in the quarantine tank to avoid medicating your display tank's beneficial bacteria.</p>

<h2>1. Ich (White Spot Disease) — Ichthyophthirius multifiliis</h2>
<p><strong>Symptoms:</strong> Fine white dots resembling salt grains across the body, fins, and gills. Fish scratch against surfaces (flashing). Respiratory distress as gills become infected.</p>
<p><strong>Causes:</strong> A protozoan parasite introduced via new fish, plants, or equipment. Stress and cold temperatures trigger outbreaks.</p>
<p><strong>Treatment:</strong></p>
<ul>
  <li>Raise temperature gradually to 30°C to speed up the parasite's life cycle (the free-swimming stage is the only vulnerable phase).</li>
  <li>Add aquarium salt (1 tablespoon per 10 liters) to reduce osmotic stress.</li>
  <li>Use commercial ich medication containing malachite green or formalin in the quarantine tank.</li>
  <li>Continue treatment for at least 10 days after the last visible spot disappears.</li>
</ul>

<h2>2. Fin Rot</h2>
<p><strong>Symptoms:</strong> Ragged, fraying, or receding fin edges. May have a white edge or red inflammation. In severe cases, fins erode to the body.</p>
<p><strong>Causes:</strong> Bacterial infection (Aeromonas, Pseudomonas) typically triggered by poor water quality, stress, or physical injury.</p>
<p><strong>Treatment:</strong></p>
<ul>
  <li>Perform large water changes immediately and correct any water quality issues.</li>
  <li>Add aquarium salt to the tank.</li>
  <li>For mild cases, pristine water quality alone may be sufficient for recovery.</li>
  <li>For severe cases, treat with antibiotics such as Kanamycin or Erythromycin in a hospital tank.</li>
</ul>

<h2>3. Velvet (Gold Dust Disease) — Oodinium</h2>
<p><strong>Symptoms:</strong> A fine gold or rust-colored dust over the body and fins, visible in raking light. Fish scratch frequently, clamp fins, and breathe rapidly.</p>
<p><strong>Causes:</strong> A parasitic dinoflagellate — even more contagious than ich. Often kills quickly if untreated.</p>
<p><strong>Treatment:</strong></p>
<ul>
  <li>Dim or eliminate lights (the parasite is photosynthetic and light-dependent).</li>
  <li>Treat with copper sulfate (for saltwater) or formalin-based medication (freshwater) in a hospital tank.</li>
  <li>Treat all fish in the system simultaneously — velvet spreads rapidly.</li>
</ul>

<h2>4. Dropsy</h2>
<p><strong>Symptoms:</strong> Severely bloated abdomen, scales standing out from the body in a "pinecone" pattern (viewed from above). Lethargy and loss of appetite.</p>
<p><strong>Causes:</strong> Not a single disease but a symptom of serious internal infection or organ failure (often kidneys). Bacterial, viral, or parasitic causes.</p>
<p><strong>Treatment:</strong> Dropsy is often fatal by the time it is visible. Isolate the fish immediately, add Epsom salt to the hospital tank (1 tablespoon per 40 liters) to reduce swelling, and treat with broad-spectrum antibiotics. Prevention through excellent water quality is the best defense.</p>

<h2>5. Swim Bladder Disease</h2>
<p><strong>Symptoms:</strong> Fish floats upside down, sinks to the bottom, or swims at an unusual angle. Otherwise may appear healthy.</p>
<p><strong>Causes:</strong> Overfeeding, constipation, bacterial infection, or physical trauma. Very common in fancy goldfish and betta fish.</p>
<p><strong>Treatment:</strong> Fast the fish for 48–72 hours. Feed a shelled, cooked pea (natural laxative) to relieve constipation. For bacterial causes, treat with antibiotics. Adjust diet to include more variety and less dried food.</p>

<h2>6. Columnaris (Cotton Wool Disease / Saddleback)</h2>
<p><strong>Symptoms:</strong> Gray-white patches or lesions on the body, fins, or mouth. May look like fungus but is bacterial. Characteristic "saddleback" lesion behind the dorsal fin in some strains.</p>
<p><strong>Causes:</strong> Flavobacterium columnare bacteria. Worse in warm water and high ammonia conditions. Spreads rapidly.</p>
<p><strong>Treatment:</strong> Antibiotics (Kanamycin, Nitrofurazone) in a hospital tank. Lower water temperature slightly to slow progression. Isolate affected fish immediately.</p>

<h2>7. Pop Eye (Exophthalmia)</h2>
<p><strong>Symptoms:</strong> One or both eyes protrude abnormally from their sockets. The eye may appear cloudy or damaged.</p>
<p><strong>Causes:</strong> Bacterial infection behind the eye, often secondary to injury or very poor water quality. Unilateral pop eye (one eye) suggests physical injury; bilateral (both eyes) suggests systemic infection.</p>
<p><strong>Treatment:</strong> Improve water quality. Treat with antibiotics such as Kanamycin. Recovery is slow (weeks) even with treatment, and severe cases may result in permanent vision loss.</p>

<h2>8. Hole-in-the-Head (HITH)</h2>
<p><strong>Symptoms:</strong> Pitting or erosion of the skin around the head and along the lateral line. Common in oscars, discus, and other cichlids.</p>
<p><strong>Causes:</strong> Associated with Hexamita protozoan infection, poor diet (vitamin deficiency), high nitrate levels, and activated carbon use. Likely multifactorial.</p>
<p><strong>Treatment:</strong> Eliminate activated carbon from the filter. Perform large water changes to reduce nitrates. Treat with Metronidazole (added to food and water). Improve diet with more variety and vitamin supplementation.</p>

<h2>Final Thoughts</h2>
<p>Disease is an inevitable part of fishkeeping, but it does not have to mean tragedy. Maintain excellent water quality, quarantine all new arrivals, observe your fish daily, and act quickly at the first sign of illness. A well-stocked medicine cabinet with ich treatment, broad-spectrum antibiotics, Metronidazole, and Praziquantel will prepare you for most emergencies. Prevention is always better than cure.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'aquascaping-nature-aquarium-art' },
  update: {},
  create: {
    title: 'The Art of Aquascaping: Creating a Nature Aquarium Like Takashi Amano',
    slug: 'aquascaping-nature-aquarium-art',
    excerpt:
      'Aquascaping is the art of arranging aquatic plants, rocks, and driftwood in an aesthetically pleasing underwater landscape. Inspired by the legendary Takashi Amano, this guide covers design philosophy, major styles, hardscape selection, and the technical requirements for creating a world-class nature aquarium.',
    coverImage:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['aquascape', 'planted-tank', 'advanced'],
    viewCount: 1987,
    publishedAt: new Date('2025-01-18'),
    content: `
<h2>The Legacy of Takashi Amano</h2>
<p>No single individual has shaped modern aquascaping more profoundly than Takashi Amano (1954–2015), a Japanese photographer, nature lover, and aquarist who founded Aqua Design Amano (ADA). Amano drew inspiration from Japanese landscape gardening, the Zen concept of wabi-sabi (finding beauty in imperfection and transience), and his stunning nature photography. In 1992, he published <em>Nature Aquarium World</em>, a trilogy that introduced the world to the concept of the planted aquarium as a genuine art form. His work elevated fishkeeping from a hobby to an aesthetic discipline.</p>

<h2>Core Design Principles</h2>
<p>Whether you are building your first scape or refining your tenth, these fundamental design principles underpin all great aquascaping:</p>
<ul>
  <li><strong>The Golden Ratio (1:1.618):</strong> The focal point of your aquascape should be placed approximately 1/3 or 2/3 of the way across the tank — never dead center. This mimics the proportional relationships found throughout nature.</li>
  <li><strong>Rule of Thirds:</strong> Divide your tank visually into a 3x3 grid. Place your primary focal point at one of the four intersection points for a naturally balanced composition.</li>
  <li><strong>Depth and perspective:</strong> Use smaller plants and rocks at the back and sides of the tank to create an illusion of depth. Paths and clearings in the foreground carpet draw the eye into the scape.</li>
  <li><strong>Odd numbers:</strong> Use odd numbers of rocks, driftwood pieces, and plant species for a more natural, asymmetrical feel.</li>
  <li><strong>Negative space:</strong> Not every inch of the tank needs to be filled. Open areas of substrate or clear water are essential for visual breathing room.</li>
</ul>

<h2>Major Aquascaping Styles</h2>

<h3>Nature Aquarium</h3>
<p>Amano's signature style mimics natural landscapes — forests, mountains, meadows — reproduced in miniature underwater. Characterized by lush plant growth, naturalistic hardscape, and a harmonious balance between hardscape and plant materials. Schools of small fish (tetras, rasboras) add movement and life.</p>

<h3>Iwagumi</h3>
<p>One of the most disciplined and challenging styles. Iwagumi ("rock formation" in Japanese) uses only stones as hardscape — no driftwood — with a simple, low-growing plant carpet. The composition is austere and meditative, with one dominant stone (<em>Oyaishi</em>), one secondary stone (<em>Fukuishi</em>), and smaller accent stones. The minimalism demands perfect execution of every element.</p>

<h3>Dutch Style</h3>
<p>Originating in the Netherlands in the 1930s, long before Amano's influence, Dutch aquascaping emphasizes lush, dense plantings with contrasting colors and textures arranged in "streets" of plants receding toward the back. Less concerned with naturalism, more focused on horticultural mastery and color theory.</p>

<h3>Jungle / Biotope</h3>
<p>The jungle style embraces controlled chaos — dense, overlapping plant growth that creates an immersive, wild feel. Biotope scapes take this further by recreating a specific natural habitat with plants and fish native to the same ecosystem (e.g., an Amazon floodplain biotope or an Asian river biotope).</p>

<h2>Hardscape Materials</h2>
<p>The stones and wood you choose are the skeleton of your scape:</p>
<ul>
  <li><strong>Dragon Stone (Ohko Stone):</strong> A porous, honeycombed reddish-brown stone with dramatic texture. Does not affect water chemistry significantly. Ideal for Nature Aquarium and Iwagumi scapes.</li>
  <li><strong>Seiryu Stone:</strong> A striking blue-grey stone with white veining. Beautiful but raises KH and pH over time — monitor water chemistry carefully. Pairs magnificently with Iwagumi layouts.</li>
  <li><strong>Spiderwood and Manzanita:</strong> Branching driftwood types that create elegant, tree-like structures. Attach mosses and ferns for a forest-floor effect.</li>
  <li><strong>Malaysian Driftwood:</strong> Heavy, dark, and waterlogged slowly. Releases tannins that lower pH — beneficial for South American biotopes, less so for other styles.</li>
</ul>

<h2>Plant Selection and Planting Techniques</h2>
<p>Plant selection follows the principle of <strong>foreground, midground, and background</strong>:</p>
<ul>
  <li><strong>Foreground (carpet plants):</strong> Dwarf Baby Tears (Hemianthus callitrichoides 'Cuba'), Monte Carlo, Glossostigma elatinoides, and Eleocharis acicularis (dwarf hairgrass). Require high light and CO2.</li>
  <li><strong>Midground:</strong> Cryptocoryne species, Staurogyne repens, Anubias nana, stem plants trimmed short.</li>
  <li><strong>Background:</strong> Rotala rotundifolia, Ludwigia species, Bacopa caroliniana, Vallisneria, tall stem plants.</li>
</ul>
<p>Use tweezers to plant individual stems into the substrate. Plant densely from the beginning to outcompete algae during the critical startup phase.</p>

<h2>CO2 Injection and Lighting</h2>
<p>For demanding aquascapes with carpet plants, <strong>pressurized CO2</strong> is essentially mandatory. Maintain 20–30 ppm of dissolved CO2 during the photoperiod (lights on). A drop checker containing 4 dKH reference solution should remain green (lime green = correct CO2 level; yellow = too much; blue = too little).</p>
<p>Lighting for planted tanks is measured in PAR (Photosynthetically Active Radiation). Carpet plants need 50–100+ PAR at the substrate. Quality LED fixtures from Chihiros, Twinstar, or ADA Solar RGB are the gold standard.</p>

<h2>Managing Algae During Startup</h2>
<p>The first 4–8 weeks of a new planted tank are the most vulnerable to algae. Your plants are not yet established, nutrients are imbalanced, and the bacterial colonies are still developing. Strategies to minimize algae:</p>
<ul>
  <li>Plant very densely from day one with fast-growing stem plants.</li>
  <li>Introduce algae-eating crew early: Amano shrimp, otocinclus catfish, nerite snails.</li>
  <li>Keep photoperiod to 6–7 hours initially, gradually increasing to 8 hours over several weeks.</li>
  <li>Perform large water changes (50%) twice weekly during the first month.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Aquascaping rewards patience, attention to detail, and a genuine love of nature. Your first scape will not be perfect — and that is entirely fine. Each tank you build will teach you something new about design, plant biology, and water chemistry. Study the work of competitive aquascapers, visit the International Aquatic Plants Layout Contest (IAPLC) website to see world-class scapes, and never stop experimenting. The aquarium is your canvas.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'feeding-fish-right-diet-guide' },
  update: {},
  create: {
    title: 'Feeding Your Fish: The Perfect Diet for Every Species',
    slug: 'feeding-fish-right-diet-guide',
    excerpt:
      "Proper nutrition is as fundamental to fish health as water quality, yet it is one of the most frequently overlooked aspects of fishkeeping. This comprehensive guide covers food types, feeding frequency, species-specific dietary requirements, and the hidden dangers of overfeeding.",
    coverImage:
      'https://images.unsplash.com/photo-1598674953515-32809625dfa2?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['feeding', 'care-guide', 'nutrition'],
    viewCount: 1654,
    publishedAt: new Date('2025-01-29'),
    content: `
<h2>Why Nutrition Matters More Than You Think</h2>
<p>Fish nutrition is a topic that receives far less attention than water quality in most beginner guides, yet it is equally fundamental to long-term fish health. A fish fed an inappropriate diet — even in perfect water — will develop nutritional deficiencies, compromised immune function, poor coloration, and reduced lifespan. Conversely, fish given the right variety of high-quality foods in appropriate quantities will display vibrant colors, strong immune response, and actively exhibit natural behaviors. Getting nutrition right is one of the most powerful things you can do for your fish.</p>

<h2>Types of Fish Food</h2>

<h3>Dry Foods — Pellets and Flakes</h3>
<p>Dry foods form the convenient daily staple for most aquarium fish. <strong>Pellets</strong> are generally superior to flakes because they hold their nutritional value longer, produce less waste, and are easier to portion accurately. Choose pellets sized appropriately for your fish's mouth. Look for high-quality brands with <em>fish meal or shrimp meal</em> as the first ingredient, not corn, wheat, or soy fillers.</p>
<p><strong>Flake food</strong> is convenient and accepted readily by most surface and mid-water feeders, but it dissolves quickly and can cloud water if overfed. Use sparingly as a complement to pellets rather than a sole diet.</p>

<h3>Frozen Foods</h3>
<p>Frozen foods are the gold standard for variety and nutritional value. They replicate what fish eat in nature and trigger natural feeding behaviors:</p>
<ul>
  <li><strong>Bloodworms (Chironomus larvae):</strong> High protein, accepted by virtually every carnivorous and omnivorous species. Do not use as the only food — too high in fat for some species.</li>
  <li><strong>Brine Shrimp (Artemia):</strong> Easy to digest, excellent for conditioning breeding fish. Nutritional value is enhanced if fed Spirulina-enriched brine shrimp.</li>
  <li><strong>Mysis Shrimp:</strong> Higher protein and nutrition than brine shrimp. Excellent for reef fish and fussy eaters.</li>
  <li><strong>Daphnia:</strong> Small crustaceans known as "water fleas." A natural laxative for fish — excellent for preventing constipation in bettas and goldfish.</li>
  <li><strong>Krill:</strong> Large, protein-rich crustaceans ideal for larger fish like cichlids, angels, and marine fish.</li>
</ul>

<h3>Live Foods</h3>
<p>Live foods provide the highest feeding response and stimulate natural predatory behavior. They are particularly valuable for finicky eaters or fish being conditioned for breeding. Common live foods include baby brine shrimp (newly hatched Artemia), white worms, blackworms, fruit flies (Drosophila — for surface feeders), and feeder fish (with caution regarding disease transmission).</p>

<h3>Freeze-Dried Foods</h3>
<p>Freeze-dried foods (bloodworms, tubifex worms, krill) offer the nutritional benefits of live food with the storage convenience of dry food. However, they must be pre-soaked in tank water before feeding to prevent digestive issues, as they expand significantly in the fish's stomach when eaten dry.</p>

<h2>Feeding by Dietary Category</h2>

<h3>Carnivores</h3>
<p>Fish like bettas, oscars, arowanas, and most predatory species require a high-protein diet (40–55% protein). Their digestive systems are not equipped to process significant amounts of plant matter. Staple diet: high-quality carnivore pellets, frozen bloodworms, brine shrimp, krill, and occasional live prey.</p>

<h3>Herbivores</h3>
<p>Fish such as silver dollars, many plecos, and African Rift Lake cichlids (mbuna) require a diet high in plant matter. Spirulina-based flakes and pellets, blanched vegetables (zucchini, spinach, cucumber), and algae wafers should form the basis of their diet. Excess protein can cause digestive issues and bloat in herbivores.</p>

<h3>Omnivores</h3>
<p>The majority of aquarium fish — tetras, corydoras, goldfish, guppies, most cichlids — are omnivores that benefit from a varied diet combining quality pellets, frozen foods, and occasional vegetable matter.</p>

<h2>Feeding Frequency</h2>
<ul>
  <li><strong>Adult fish:</strong> Once or twice daily, feeding only what is consumed in 2–3 minutes.</li>
  <li><strong>Fry and juveniles:</strong> 3–5 small feedings daily to fuel rapid growth.</li>
  <li><strong>Large predators (oscars, arowanas):</strong> Every 1–2 days. Their digestive system needs time between meals.</li>
  <li><strong>Fasting day:</strong> Include one fasting day per week for most species. This mimics natural food availability fluctuations, prevents obesity, and reduces waste accumulation.</li>
</ul>

<h2>The Dangers of Overfeeding</h2>
<p>Overfeeding is arguably the number one mistake made by beginner fishkeepers. The consequences are serious:</p>
<ul>
  <li><strong>Ammonia spikes:</strong> Uneaten food decomposes rapidly, producing toxic ammonia and spiking nitrate levels.</li>
  <li><strong>Obesity:</strong> Particularly common in bettas and goldfish. Obese fish develop fatty liver disease and reduced lifespan.</li>
  <li><strong>Constipation and bloat:</strong> Overfeeding dry food especially leads to digestive impaction.</li>
  <li><strong>Algae blooms:</strong> Excess nutrients in the water fuel explosive algae growth.</li>
</ul>

<h2>DIY Food: The Discus Beef Heart Mix Recipe</h2>
<p>Many serious discus keepers prepare their own beef heart mix. A basic recipe:</p>
<ul>
  <li>500g lean beef heart (trimmed of all fat and sinew)</li>
  <li>100g raw shrimp</li>
  <li>Large handful of fresh spinach or spirulina powder</li>
  <li>2 cloves raw garlic (natural anti-parasite properties)</li>
  <li>1 teaspoon vitamin supplement powder</li>
</ul>
<p>Blend all ingredients, spread thinly on a baking sheet lined with plastic wrap, and freeze solid. Break into daily feeding portions as needed. This high-protein, nutrient-rich mixture supports rapid growth and vibrant color in discus and other large cichlids.</p>

<h2>Seasonal Feeding Adjustments</h2>
<p>If your fish are in an outdoor pond or your indoor tank experiences temperature variation, adjust feeding as temperatures change. Below 15°C, reduce feeding frequency and switch to easily digestible wheat germ-based food. Below 10°C, stop feeding entirely for coldwater fish like goldfish and koi. Overfeeding in cold temperatures causes food to rot in the gut and can be fatal.</p>

<h2>Final Thoughts</h2>
<p>The best diet for aquarium fish is a varied one. No single food — however high quality — provides every nutrient a fish needs. Rotate between high-quality pellets, frozen foods, and occasional live food. Observe your fish's condition: vibrant color, full but not bloated body shape, active behavior, and eagerness to feed are all signs of a well-nourished fish. Feed less than you think is needed, and your tank's water quality and your fish's health will both benefit enormously.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'water-quality-testing-guide' },
  update: {},
  create: {
    title: 'Water Quality Testing: The Essential Guide Every Aquarist Needs',
    slug: 'water-quality-testing-guide',
    excerpt:
      'Understanding your aquarium water chemistry is the foundation of successful fishkeeping. This essential guide explains the nitrogen cycle, the parameters you need to test, how to interpret results, and how to fix imbalances before they harm your fish.',
    coverImage:
      'https://images.unsplash.com/photo-1564577160324-112d603e9078?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['water-quality', 'chemistry', 'beginner'],
    viewCount: 2778,
    publishedAt: new Date('2025-02-08'),
    content: `
<h2>Why Water Testing is Non-Negotiable</h2>
<p>Your aquarium water can look crystal clear and still be dangerously toxic to your fish. Ammonia, nitrite, and pH imbalances are invisible to the naked eye, yet they cause chronic stress, suppressed immune function, and death in fish. Regular water testing is not an optional extra for serious hobbyists — it is the most fundamental act of responsible fishkeeping. This guide will make water chemistry approachable, practical, and easy to act on.</p>

<h2>The Nitrogen Cycle — The Foundation of Everything</h2>
<p>Every aquarist must understand the nitrogen cycle before adding a single fish. Here is how it works in your aquarium:</p>
<ol>
  <li><strong>Ammonia (NH₃/NH₄⁺):</strong> Fish excrete ammonia directly through their gills and in their waste. Uneaten food and decaying plant matter also produce ammonia. Ammonia is <em>highly toxic</em> even at very low concentrations (0.02 ppm for sensitive species).</li>
  <li><strong>Nitrite (NO₂⁻):</strong> Beneficial bacteria of the genus <em>Nitrosomonas</em> colonize your filter media and convert ammonia into nitrite. Nitrite is also toxic — it binds to hemoglobin in fish blood and prevents oxygen uptake.</li>
  <li><strong>Nitrate (NO₃⁻):</strong> A second group of bacteria (<em>Nitrobacter</em> and <em>Nitrospira</em>) convert nitrite into nitrate. Nitrate is relatively harmless at moderate levels but harmful at high concentrations (above 40 ppm for most species).</li>
</ol>
<p>A <strong>fully cycled tank</strong> has established colonies of both bacterial groups, converting ammonia to nitrate continuously. Nitrate is then removed through regular water changes and plant uptake.</p>

<h2>Parameters to Test and Their Ideal Ranges</h2>

<h3>Ammonia (NH₃)</h3>
<ul>
  <li><strong>Ideal:</strong> 0 ppm at all times</li>
  <li><strong>Action level:</strong> Any reading above 0 ppm in a stocked tank requires immediate investigation</li>
  <li><strong>Common causes of spike:</strong> New tank (uncycled), overfeeding, dead fish, overstocking, filter crash</li>
</ul>

<h3>Nitrite (NO₂⁻)</h3>
<ul>
  <li><strong>Ideal:</strong> 0 ppm</li>
  <li><strong>Action level:</strong> Any detectable reading is dangerous</li>
  <li><strong>Note:</strong> Salt (NaCl) competes with nitrite at the gill membrane and reduces toxicity as an emergency measure</li>
</ul>

<h3>Nitrate (NO₃⁻)</h3>
<ul>
  <li><strong>Ideal:</strong> Under 20 ppm for sensitive species, under 40 ppm for hardy fish</li>
  <li><strong>Reef tanks and discus:</strong> Under 5–10 ppm</li>
  <li><strong>Fix:</strong> Water changes are the primary tool for nitrate reduction</li>
</ul>

<h3>pH</h3>
<ul>
  <li><strong>Freshwater tropical fish:</strong> 6.5–7.5 for most species</li>
  <li><strong>African Rift Lake cichlids:</strong> 7.8–8.5</li>
  <li><strong>Discus and South American species:</strong> 5.5–7.0</li>
  <li><strong>Saltwater:</strong> 8.1–8.3</li>
  <li><strong>Critical note:</strong> Stability is more important than hitting an exact number. A stable pH of 7.4 is far better than one that swings between 6.8 and 7.8.</li>
</ul>

<h3>General Hardness (GH) and Carbonate Hardness (KH)</h3>
<ul>
  <li><strong>GH</strong> measures the concentration of calcium and magnesium ions. Soft water is 0–8 dGH; hard water is 12+ dGH.</li>
  <li><strong>KH</strong> (alkalinity) measures the water's buffering capacity against pH swings. Low KH allows pH to crash rapidly. Maintain KH above 4 dKH for stable pH.</li>
</ul>

<h3>Temperature</h3>
<p>While not a chemical parameter, temperature should be checked daily. Tropical fish: 24–28°C. Discus and bettas: 26–30°C. Goldfish: 15–22°C. Temperature swings of more than 2°C in a few hours cause stress and immune suppression.</p>

<h2>Liquid Test Kits vs. Test Strips — Why Liquid Wins</h2>
<p>Test strips are convenient and inexpensive, but they are significantly less accurate than liquid test kits, especially for ammonia and nitrite. They degrade quickly once the container is opened and give only rough approximations. <strong>Invest in a quality liquid test kit</strong> (the API Freshwater Master Test Kit is the hobbyist standard) for reliable, repeatable results. Liquid tests take about 5 minutes per parameter and give clear colorimetric readings that can be compared against the included color card.</p>

<h2>Fixing Water Quality Imbalances</h2>

<h3>High Ammonia or Nitrite</h3>
<ul>
  <li>Perform a 25–50% water change immediately (treated with dechlorinator).</li>
  <li>Stop feeding for 24–48 hours.</li>
  <li>Add Seachem Prime — it detoxifies ammonia and nitrite for up to 48 hours, buying time while the cycle catches up.</li>
  <li>Investigate the cause: filter crash, dead fish, overfeeding, overstocking.</li>
</ul>

<h3>High Nitrate</h3>
<ul>
  <li>Perform regular water changes (25–30% weekly).</li>
  <li>Add live plants — they absorb nitrate directly.</li>
  <li>Reduce feeding and stocking density.</li>
</ul>

<h3>Unstable or Incorrect pH</h3>
<ul>
  <li>Use a commercial buffer (pH Up/pH Down) carefully — rapid changes are dangerous.</li>
  <li>Increase KH with crushed coral, limestone, or sodium bicarbonate (raises both KH and pH).</li>
  <li>Lower pH with peat moss in the filter, Indian almond leaves, or RO water.</li>
</ul>

<h2>Water Change Schedule</h2>
<p>As a general guideline:</p>
<ul>
  <li><strong>Lightly stocked tank:</strong> 20–25% every 1–2 weeks.</li>
  <li><strong>Moderately stocked community tank:</strong> 25–30% weekly.</li>
  <li><strong>Heavily stocked tank or discus:</strong> 30–50% every 2–3 days.</li>
</ul>
<p>Always treat new water with a quality dechlorinator and match the temperature to the tank before adding.</p>

<h2>Final Thoughts</h2>
<p>Developing the habit of regular water testing transforms you from a reactive fishkeeper into a proactive one. Test weekly during normal operation, and immediately whenever a fish shows signs of stress or disease. Your test kit is the most important diagnostic tool you own. The data it provides will guide every decision about water changes, feeding, stocking, and treatment — making you a more effective and confident aquarist with every reading you take.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'corydoras-catfish-complete-care' },
  update: {},
  create: {
    title: 'Corydoras Catfish: The Best Bottom Dwellers for Community Aquariums',
    slug: 'corydoras-catfish-complete-care',
    excerpt:
      "Corydoras catfish are among the most beloved and useful fish in the freshwater hobby. Hardy, peaceful, endlessly charming in their social behavior, and excellent at cleaning up leftover food, they make the perfect addition to almost any community aquarium. This complete guide covers all 160+ species and everything you need to keep them thriving.",
    coverImage:
      'https://images.unsplash.com/photo-1639770365554-2c3365af752f?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['corydoras', 'catfish', 'species-guide'],
    viewCount: 1423,
    publishedAt: new Date('2025-02-18'),
    content: `
<h2>Introduction to Corydoras</h2>
<p>Corydoras — universally nicknamed "corys" in the hobby — belong to the family Callichthyidae and are native to South America, where over 160 described species inhabit rivers, streams, and flooded areas across the continent. They are armored catfish, covered in two rows of bony plates called scutes rather than scales. In the wild, corydoras are highly social fish that live in large groups, often mixed species, foraging together across sandy and muddy river bottoms.</p>
<p>In the aquarium, they bring both utility and charm. They scavenge uneaten food from the substrate, preventing decay and ammonia spikes, while their playful group behavior — darting to the surface for air, wriggling through plants, digging in the sand — keeps an aquarium endlessly entertaining to watch.</p>

<h2>Most Popular Corydoras Species</h2>

<h3>Panda Corydoras (C. panda)</h3>
<p>One of the most recognizable corys, with a cream or peachy body and distinctive black patches over the eyes and dorsal fin, mirroring the giant panda's markings. Slightly more demanding than other corys (prefers cooler water, 20–24°C) but enormously popular. Stay small (4–5 cm) — perfect for smaller tanks.</p>

<h3>Sterbai Corydoras (C. sterbai)</h3>
<p>One of the most striking species, with a dark spotted body, orange pectoral fins, and a distinctive white-spotted head. Unlike most corys, Sterbai tolerate and even prefer warmer water (26–30°C), making them one of the very few corydoras suitable for discus tanks. Highly sought after and worth every bit of the premium price.</p>

<h3>Emerald Cory (Brochis splendens)</h3>
<p>Technically in the genus Brochis (though often grouped with corydoras), the Emerald Cory has a stunning iridescent green body and grows slightly larger than most corys (7–8 cm). A robust, adaptable species that does well in a wide range of water conditions.</p>

<h3>Peppered Cory (C. paleatus)</h3>
<p>A classic beginner species — spotted brown and olive body with a peaceful temperament and wide adaptability. One of the few corydoras that tolerates cooler water (18–24°C) alongside goldfish. Readily available and inexpensive.</p>

<h3>Bronze Cory (C. aeneus)</h3>
<p>The most widely kept cory in the hobby and one of the most beginner-friendly fish available. Its bronze-green metallic sheen is attractive, and it is extremely hardy and prolific. An albino form is also commonly available.</p>

<h2>Care Requirements</h2>

<h3>Social Requirements</h3>
<p>This is the most critical aspect of corydoras care that beginners overlook: <strong>corydoras must be kept in groups of six or more of the same species</strong> (or at minimum the same body type/close relatives). Solo or paired corydoras become stressed, hide constantly, and rarely live to their full potential. In groups of six or more, they exhibit their natural schooling, foraging, and surface-dashing behaviors that make them so delightful to observe.</p>

<h3>Substrate</h3>
<p>Corydoras have sensitive barbels (whiskers) around their mouths that they use to feel for food in the substrate. <strong>Sharp gravel damages these barbels</strong>, causing infection and permanent disfigurement. Always use fine sand or very smooth, rounded gravel in a cory tank. River sand is ideal — it allows natural digging behavior without risk of injury.</p>

<h3>Water Parameters</h3>
<ul>
  <li><strong>Temperature:</strong> 22–26°C for most species (exceptions: Panda 20–24°C, Sterbai 26–30°C).</li>
  <li><strong>pH:</strong> 6.0–7.5 for most species.</li>
  <li><strong>Hardness:</strong> Soft to moderately hard water (2–15 dGH).</li>
  <li><strong>Ammonia and Nitrite:</strong> Must be 0 ppm. Corydoras are sensitive to poor water quality.</li>
</ul>

<h3>Feeding</h3>
<p>Corydoras are scavengers and bottom feeders. Their primary diet should consist of:</p>
<ul>
  <li><strong>Sinking pellets and wafers:</strong> Must sink to the bottom where corys feed. Hikari Sinking Wafers and Sera Viformo are popular choices.</li>
  <li><strong>Frozen foods:</strong> Bloodworms, brine shrimp, and tubifex worms sinking to the bottom are eagerly taken.</li>
  <li><strong>Blanched vegetables:</strong> Zucchini, cucumber, and spinach provide variety and plant matter.</li>
</ul>
<p>Despite their reputation as "cleanup crew," corydoras should not rely on leftover food from other fish for nutrition. Feed them dedicated sinking foods daily.</p>

<h2>Breeding Corydoras</h2>
<p>Corydoras are egg scatterers that spawn readily in well-maintained tanks, particularly after water changes with slightly cooler water (simulating a rain event). The characteristic spawning behavior involves the female carrying a cluster of eggs between her pelvic fins while the male fertilizes them, then pressing the sticky eggs onto plant leaves, the tank glass, or filter intakes.</p>
<p>Parents do not guard eggs and will eat them if given the chance. Remove eggs carefully with a razor blade and hatch them in a separate container with an airstone for gentle circulation. Fry are large enough to eat baby brine shrimp immediately upon hatching (3–4 days).</p>

<h2>Tank Mates</h2>
<p>Corydoras are peaceful and compatible with virtually any non-aggressive fish. Ideal tank mates include tetras of all types, rasboras, danios, guppies, mollies, livebearers, angels, and smaller gouramis. Avoid any fish large enough to eat them or aggressive enough to nip their fins. Their armor provides some protection, but they are still vulnerable to sustained aggression.</p>
<p><strong>Otocinclus catfish</strong> make particularly harmonious tank mates — smaller algae-eating catfish that occupy a similar niche without competing directly for the same food or territory.</p>

<h2>Final Thoughts</h2>
<p>There is a reason corydoras catfish appear in almost every experienced aquarist's tank — they are that good. Hardy, peaceful, social, naturally interesting to observe, and genuinely useful in keeping the substrate clean, they represent some of the best value in the freshwater hobby. Whether you are keeping a simple community tank or a highly specialized biotope, a group of well-chosen corydoras will enrich both the ecosystem and your viewing enjoyment for years to come.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'arowana-care-guide-dragon-fish' },
  update: {},
  create: {
    title: 'Arowana Care Guide: Everything About the Legendary Dragon Fish',
    slug: 'arowana-care-guide-dragon-fish',
    excerpt:
      'The Arowana is perhaps the most culturally significant ornamental fish in Asia, revered for centuries as a symbol of luck, prosperity, and power. This comprehensive guide covers all major species, legal requirements, tank setup, feeding, health management, and the extraordinary world of show-quality Arowana collection.',
    coverImage:
      'https://images.unsplash.com/photo-1659242549433-d7c825aa9fe2?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['arowana', 'advanced', 'care-guide'],
    viewCount: 3891,
    publishedAt: new Date('2025-02-25'),
    content: `
<h2>Cultural Significance of the Arowana</h2>
<p>Few fish carry the cultural weight of the Arowana. Known in Chinese as 龙鱼 (<em>lóng yú</em>) — "Dragon Fish" — the Arowana has been prized in Chinese, Vietnamese, Malaysian, and Indonesian culture for centuries. Its large overlapping scales resemble the scales of a mythical dragon, its graceful gliding movement evokes power and fluidity, and in feng shui tradition, keeping an Arowana is believed to attract wealth and ward off evil. In the 1980s, when Asian economies boomed and decorative fish became status symbols, Arowana prices skyrocketed — some exceptional specimens have sold for over $300,000 USD.</p>

<h2>Species Overview</h2>

<h3>Silver Arowana (Osteoglossum bicirrhosum)</h3>
<p>Native to the Amazon basin, the Silver Arowana is the most widely available and least expensive species in the hobby. It grows to 90+ cm and is highly athletic — known for leaping out of water to catch insects and birds in the wild. Silver Arowanas are not regulated under CITES and are the most suitable species for most hobbyists.</p>

<h3>Asian Arowana (Scleropages formosus) — Multiple Color Varieties</h3>
<p>The Asian Arowana is the jewel of the species and the source of most of the hobby's excitement and controversy. It is listed as <strong>Endangered on the IUCN Red List</strong> and regulated under CITES Appendix I. Commercial trade in captive-bred specimens is legal with proper documentation, but wild-caught fish are completely banned from international trade. Color varieties include:</p>
<ul>
  <li><strong>Red Arowana:</strong> The most prized variety, with brilliant red scales and fins. Subdivided into Super Red (darkest, most valuable), Chili Red, and Blood Red.</li>
  <li><strong>Golden Crossback:</strong> Gold scales extend across the entire back. Native to Malaysia. Extraordinarily valuable — top specimens can sell for tens of thousands of dollars.</li>
  <li><strong>Green Arowana:</strong> Less flamboyant but still striking, with olive-green iridescent scales. The most common and affordable Asian variety.</li>
  <li><strong>Banjar Red and Red Tail Golden:</strong> Intermediate varieties with gold scales on the lower flanks and reddish tails.</li>
</ul>

<h3>Australian Arowana (Scleropages jardinii and S. leichardti)</h3>
<p>The Jardini and Spotted Arowanas from Australia and New Guinea are less colorful than Asian varieties but are powerful, robust fish. They are significantly more aggressive than Silver Arowanas.</p>

<h3>Black Arowana (Osteoglossum ferreirai)</h3>
<p>A South American species that starts life as a striking black-and-yellow juvenile before transitioning to a blue-tinted silver adult. Somewhat more peaceful than the Silver Arowana.</p>

<h2>Legal Requirements and CITES Certification</h2>
<p>If you are purchasing an Asian Arowana, proper documentation is non-negotiable:</p>
<ul>
  <li>All legally sold Asian Arowanas must come with a <strong>CITES certificate</strong> and a unique <strong>microchip implant</strong> that links the fish to its documentation.</li>
  <li>Reputable farms issue a holographic identity card with the fish's chip number, variety, and farm of origin.</li>
  <li>In Vietnam, the import and ownership of Asian Arowanas requires compliance with CITES regulations — always purchase from licensed importers and verify documentation carefully.</li>
  <li>Purchasing undocumented Asian Arowanas is illegal and unethical — it supports poaching and threatens wild populations.</li>
</ul>

<h2>Tank Requirements</h2>
<p>Arowanas are large, active fish that need substantial space:</p>
<ul>
  <li><strong>Minimum tank size for juveniles:</strong> 200 liters initially.</li>
  <li><strong>Adult tank:</strong> A minimum of 400 liters for Silver Arowanas. Asian Arowanas growing to 60–80 cm require 500–800 liters for a quality life.</li>
  <li><strong>Tank dimensions:</strong> Long, shallow tanks are preferable to tall ones. Arowanas are surface swimmers. Aim for at least 150 cm in length.</li>
  <li><strong>Sealed lid with strong clips:</strong> Arowanas are powerful, athletic jumpers. A heavy, secure lid is mandatory — they will launch themselves out of uncovered tanks.</li>
  <li><strong>Minimal décor:</strong> Large, open swimming space. Large pieces of smooth driftwood or artificial rock can provide some visual interest, but overcrowding the tank impedes swimming.</li>
</ul>

<h2>Water Parameters</h2>
<ul>
  <li><strong>Temperature:</strong> 26–30°C</li>
  <li><strong>pH:</strong> 6.0–7.5 (soft, slightly acidic is preferred for Asian varieties)</li>
  <li><strong>Hardness:</strong> Soft to moderate</li>
  <li><strong>Ammonia/Nitrite:</strong> 0 ppm always</li>
  <li><strong>Nitrate:</strong> Under 20 ppm. Regular 20–30% weekly water changes are essential.</li>
</ul>

<h2>Feeding</h2>
<p>Arowanas are apex predators and surface feeders. In the wild they eat insects, small birds, bats, and small mammals that fall into the water. In captivity:</p>
<ul>
  <li><strong>Feeder insects:</strong> Crickets, locusts, and cockroaches are eagerly accepted and nutritionally valuable.</li>
  <li><strong>Live feeder shrimp and fish:</strong> Use with caution — feeder fish carry significant disease risk. Quarantine all live food.</li>
  <li><strong>Whole prawns and shrimp:</strong> Excellent protein source, widely accepted.</li>
  <li><strong>High-quality Arowana pellets:</strong> Train your fish onto pellets as the dietary staple, supplemented with live or frozen foods 2–3 times weekly.</li>
  <li><strong>Frequency:</strong> Once daily for juveniles; every 1–2 days for adults.</li>
</ul>

<h2>Common Diseases and Health Issues</h2>
<ul>
  <li><strong>Droopy Eye (Exophthalmia):</strong> One of the most common issues in Arowanas, where one or both eyes droop downward. Thought to be caused by looking at food below the tank or high-fat diets. Prevention: avoid feeding from the bottom, consider a tank background to prevent the fish from staring down at reflections.</li>
  <li><strong>Scale Protrusion:</strong> Scales standing out from the body, similar to dropsy. Caused by bacterial infection or poor water quality. Treat with antibiotics and pristine water conditions.</li>
  <li><strong>Cloudy Eyes:</strong> Usually water quality related. Perform large water changes and ensure parameters are optimal.</li>
</ul>

<h2>Price Ranges and Collecting</h2>
<p>Arowana prices vary enormously by species and quality:</p>
<ul>
  <li><strong>Silver Arowana:</strong> $15–$50 for juveniles.</li>
  <li><strong>Green/Banjar Asian Arowana:</strong> $200–$500.</li>
  <li><strong>Red Tail Golden:</strong> $500–$2,000.</li>
  <li><strong>Super Red Arowana:</strong> $2,000–$20,000+ for top specimens.</li>
  <li><strong>Golden Crossback:</strong> $5,000–$50,000+ for championship-quality adults.</li>
</ul>

<h2>Final Thoughts</h2>
<p>Keeping an Arowana is a serious, long-term commitment. These fish can live 20+ years in captivity and require tank upgrades as they grow. But for those who make the commitment, an Arowana becomes far more than a pet — it becomes a centerpiece, a status symbol, a daily meditation, and for many keepers, a member of the family. Research thoroughly, buy from reputable sources with proper documentation, and prepare your infrastructure carefully before your Dragon Fish arrives.</p>
`,
  },
});

await prisma.blogPost.upsert({
  where: { slug: 'community-tank-peaceful-fish-guide' },
  update: {},
  create: {
    title: 'Building the Perfect Community Tank: Fish That Live Together Harmoniously',
    slug: 'community-tank-peaceful-fish-guide',
    excerpt:
      'A community aquarium filled with compatible, peaceful fish from multiple species is one of the most beautiful and rewarding setups in the freshwater hobby. This guide covers compatibility principles, the best fish for every tank level, species combinations to avoid, and complete stocking plans for 100L community setups.',
    coverImage:
      'https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=1200&h=630&fit=crop&q=80',
    status: 'PUBLISHED',
    authorId: adminUser.id,
    tags: ['community-tank', 'beginner', 'freshwater'],
    viewCount: 3341,
    publishedAt: new Date('2025-03-01'),
    content: `
<h2>What Makes a Successful Community Tank?</h2>
<p>A community aquarium is a tank housing multiple different species of fish that coexist peacefully. When planned well, the result is a dynamic, layered, visually rich ecosystem that showcases the incredible diversity of freshwater fish. When planned poorly, it can result in constant aggression, stressed fish, disease outbreaks, and tragedy. The difference lies almost entirely in research and compatibility planning before you buy a single fish.</p>
<p>Three factors determine compatibility: <strong>temperament, water parameter requirements, and size at adulthood</strong>. Get all three right, and your community tank will thrive for years.</p>

<h2>Core Compatibility Principles</h2>
<ul>
  <li><strong>Match water parameters:</strong> Do not mix fish from dramatically different water parameter requirements. Cardinal tetras (soft, acidic, warm water) and African cichlids (hard, alkaline water) simply cannot share a tank successfully.</li>
  <li><strong>Match temperament:</strong> Aggressive species will terrorize peaceful ones. Always research the adult behavior of every species you plan to keep.</li>
  <li><strong>Consider adult size:</strong> Any fish large enough to fit another fish in its mouth will eventually eat it. The rule "if it fits in the mouth, it's food" is very real in the aquarium.</li>
  <li><strong>Avoid known fin nippers:</strong> Some species, like Tiger Barbs and Serpae Tetras, are chronic fin nippers that will shred the flowing fins of bettas, angels, and gouramis.</li>
</ul>

<h2>The Layered Community — Fish by Tank Level</h2>
<p>A beautifully balanced community tank has fish occupying all levels of the water column. This reduces competition and creates a more natural, visually interesting display:</p>

<h3>Surface Dwellers</h3>
<ul>
  <li><strong>Marble Hatchetfish (Carnegiella strigata):</strong> Elegant, wing-shaped fish that hover at the surface feeding on floating insects. Keep in groups of 6+. Jump — lid required.</li>
  <li><strong>Zebra Danios:</strong> Active surface swimmers, extremely hardy, ideal for beginners. Beautiful in schools of 8–10.</li>
  <li><strong>Guppies and Endlers:</strong> Colorful livebearers that congregate near the surface. Males are spectacular in variety and color.</li>
</ul>

<h3>Mid-Water Fish</h3>
<p>This is typically the most populated zone in community tanks:</p>
<ul>
  <li><strong>Neon Tetras:</strong> The classic community fish. Electric blue-and-red coloration in schools of 8–12 is stunning. Peaceful, small (4 cm), and widely available.</li>
  <li><strong>Cardinal Tetras:</strong> Similar to Neons but larger with more vivid coloration extending the full body length. More demanding water parameters.</li>
  <li><strong>Rummy Nose Tetras:</strong> Brilliant red nose and black-and-white tail. School very tightly — their synchronized movement is mesmerizing.</li>
  <li><strong>Harlequin Rasboras:</strong> Orange body with a distinctive black wedge. One of the most reliably peaceful and hardy mid-water fish.</li>
  <li><strong>Dwarf Gouramis:</strong> Striking labyrinth fish available in many color varieties. Peaceful and excellent as a "centerpiece" species.</li>
  <li><strong>Angelfish:</strong> The classic community centerpiece. Beautiful triangular profile and long fins. Keep with fish too large to eat (avoid very small neon tetras with large angels).</li>
</ul>

<h3>Bottom Dwellers</h3>
<ul>
  <li><strong>Corydoras Catfish (various species):</strong> The quintessential community bottom feeder. Keep in groups of 6+. Peaceful, entertaining, and useful scavengers.</li>
  <li><strong>Kuhli Loaches:</strong> Serpentine, eel-like loaches that hide during the day and forage actively at night. Completely peaceful — fascinating to observe.</li>
  <li><strong>Bristlenose Plecos (Ancistrus sp.):</strong> Compact algae-eating catfish that stays manageable in size (12–15 cm). Unlike common plecos, does not outgrow most community tanks.</li>
  <li><strong>Otocinclus Catfish:</strong> Tiny, efficient algae eaters that graze on soft algae on plant leaves and glass. Keep in groups of 4–6.</li>
</ul>

<h2>Fish to Avoid in Community Tanks</h2>
<ul>
  <li><strong>Tiger Barbs:</strong> Chronic fin nippers, especially toward long-finned species like bettas, angels, and gouramis.</li>
  <li><strong>Betta Fish (male):</strong> Will fight any fish that resembles or challenges it, including other bettas. Best kept alone or in carefully planned species tanks.</li>
  <li><strong>Jack Dempseys and most large cichlids:</strong> Aggressive and predatory — incompatible with peaceful community fish.</li>
  <li><strong>Common Plecos:</strong> Grow to 45+ cm. Completely unsuitable for standard community tanks despite being widely sold.</li>
  <li><strong>Red-Tailed Sharks:</strong> Territorial and aggressive, especially toward other bottom-dwelling fish. Only one per tank and in larger setups only.</li>
</ul>

<h2>The Stocking Formula — Guidelines, Not Rules</h2>
<p>The traditional guideline of <strong>1 cm of adult fish per 1 liter of water</strong> is a useful starting point but has significant limitations. It does not account for waste production, territorial needs, or swimming space requirements. A more nuanced approach:</p>
<ul>
  <li>Start conservatively and add fish in small batches over several months.</li>
  <li>Let your water test results guide you — rising nitrate indicates your biological filtration is at capacity.</li>
  <li>Filtration capacity, water change frequency, and tank dimensions matter as much as volume.</li>
</ul>

<h2>Quarantine Protocol — The Safety Step Most Skip</h2>
<p>Every new fish, regardless of how healthy it appears, should spend a minimum of <strong>2–4 weeks in quarantine</strong> before entering your community tank. This protects your established fish from potential pathogens, parasites, and diseases that the new fish may carry without visible symptoms. A simple 40L quarantine tank with a cycled sponge filter and heater is all that is needed.</p>
<p>Introduce fish to the display tank in a logical sequence: add docile, less territorial species first. Add centerpiece fish and potentially more assertive species later, once the tank community is established. This prevents early-establishing fish from becoming excessively territorial.</p>

<h2>Example 100L Community Setups</h2>

<h3>Setup A — Classic South American Community</h3>
<ul>
  <li>10x Cardinal Tetras</li>
  <li>8x Rummy Nose Tetras</li>
  <li>6x Corydoras Sterbai</li>
  <li>2x Dwarf Gouramis (1 male, 1 female)</li>
  <li>1x Bristlenose Pleco</li>
</ul>

<h3>Setup B — Colorful Livebearer Community</h3>
<ul>
  <li>6x Guppies (mixed sex)</li>
  <li>8x Platies (mixed)</li>
  <li>6x Neon Tetras</li>
  <li>6x Peppered Corydoras</li>
  <li>4x Otocinclus</li>
</ul>

<h3>Setup C — Angel-Centered Community</h3>
<ul>
  <li>2x Angelfish (pair)</li>
  <li>10x Harlequin Rasboras</li>
  <li>6x Bronze Corydoras</li>
  <li>1x Bristlenose Pleco</li>
  <li>5x Kuhli Loaches</li>
</ul>

<h2>Final Thoughts</h2>
<p>Building a community tank is both an art and a science. Research every species before purchase, plan your stocking list on paper before visiting any fish store, and be patient — add fish gradually over weeks and months rather than all at once. The result of careful planning is a living, breathing underwater world that brings beauty, movement, and daily discovery to your home. There is simply nothing quite like a well-balanced community aquarium firing on all cylinders.</p>
`,
  },
});

  console.log('✅ 15 blog posts seeded');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
