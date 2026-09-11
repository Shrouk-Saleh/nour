// 50 Collectible Flowers for the Garden System
// Each flower has: id, name, arabicName, emoji, rarity, color, description

const RARITIES = {
  COMMON: { id: 'common', label: 'Common', labelAr: 'شائعة', weight: 50, color: '#6DB56D', bgColor: '#F0FFF0' },
  UNCOMMON: { id: 'uncommon', label: 'Uncommon', labelAr: 'غير شائعة', weight: 30, color: '#5B8DD9', bgColor: '#F0F4FF' },
  RARE: { id: 'rare', label: 'Rare', labelAr: 'نادرة', weight: 15, color: '#9B59B6', bgColor: '#F9F0FF' },
  ULTRA_RARE: { id: 'ultra_rare', label: 'Ultra Rare', labelAr: 'نادرة جداً', weight: 5, color: '#F39C12', bgColor: '#FFFBF0' },
};

const FLOWERS = [
  // ===================== COMMON (20 flowers) =====================
  { id: 'daisy',       name: 'Daisy',         arabicName: 'أقحوان',         emoji: '🌼', rarity: 'common',     color: '#FFD700', description: 'A cheerful white and yellow wildflower.' },
  { id: 'sunflower',   name: 'Sunflower',      arabicName: 'عباد الشمس',    emoji: '🌻', rarity: 'common',     color: '#FFC107', description: 'Always faces the sun with joy.' },
  { id: 'red_rose',    name: 'Red Rose',       arabicName: 'وردة حمرا',     emoji: '🌹', rarity: 'common',     color: '#E53935', description: 'The classic symbol of love.' },
  { id: 'pink_tulip',  name: 'Pink Tulip',     arabicName: 'توليب وردي',    emoji: '🌷', rarity: 'common',     color: '#F48FB1', description: 'A delicate springtime bloom.' },
  { id: 'white_flower',name: 'White Blossom',  arabicName: 'وردة بيضا',     emoji: '🤍', rarity: 'common',     color: '#EEEEEE', description: 'Pure and elegant in its simplicity.' },
  { id: 'marigold',    name: 'Marigold',       arabicName: 'قطيفة',          emoji: '🏵️', rarity: 'common',     color: '#FF8F00', description: 'Bright orange petals that ward off pests.' },
  { id: 'pansy',       name: 'Pansy',          arabicName: 'بنفسجية',        emoji: '💜', rarity: 'common',     color: '#7E57C2', description: 'Velvety petals with a gentle fragrance.' },
  { id: 'poppy',       name: 'Poppy',          arabicName: 'خشخاش',          emoji: '🌺', rarity: 'common',     color: '#EF5350', description: 'Bold red petals dancing in the breeze.' },
  { id: 'chamomile',   name: 'Chamomile',      arabicName: 'بابونج',          emoji: '✿',  rarity: 'common',     color: '#FFF9C4', description: 'Tiny flowers used for calming tea.' },
  { id: 'lavender',    name: 'Lavender',       arabicName: 'لافندر',          emoji: '💐', rarity: 'common',     color: '#CE93D8', description: 'Fragrant purple spikes loved by bees.' },
  { id: 'carnation',   name: 'Carnation',      arabicName: 'قرنفل',           emoji: '🩷', rarity: 'common',     color: '#F06292', description: 'Frilly petals with a spicy scent.' },
  { id: 'clover',      name: 'Clover',         arabicName: 'برسيم',           emoji: '🍀', rarity: 'common',     color: '#43A047', description: 'Find a four-leaf one for luck!' },
  { id: 'jasmine',     name: 'Jasmine',        arabicName: 'فل',              emoji: '🌸', rarity: 'common',     color: '#FFF8E1', description: 'Sweet-smelling white star flowers.' },
  { id: 'buttercup',   name: 'Buttercup',      arabicName: 'حوذان',           emoji: '🌕', rarity: 'common',     color: '#FFEE58', description: 'Glossy golden cups that shine in meadows.' },
  { id: 'violet',      name: 'Violet',         arabicName: 'بنفسج',           emoji: '💙', rarity: 'common',     color: '#5C6BC0', description: 'Shy little flowers hiding in the shade.' },
  { id: 'aster',       name: 'Aster',          arabicName: 'أستر',            emoji: '⭐', rarity: 'common',     color: '#AB47BC', description: 'Star-shaped petals in shades of purple.' },
  { id: 'foxglove',    name: 'Foxglove',       arabicName: 'قفاز الثعلب',    emoji: '🟣', rarity: 'common',     color: '#9C27B0', description: 'Tall spikes of bell-shaped flowers.' },
  { id: 'hibiscus',    name: 'Hibiscus',       arabicName: 'كركديه',          emoji: '🌺', rarity: 'common',     color: '#E91E63', description: 'Tropical beauty used to make drinks.' },
  { id: 'bluebell',    name: 'Bluebell',       arabicName: 'جرس أزرق',       emoji: '🔵', rarity: 'common',     color: '#1E88E5', description: 'Nodding blue bells fill the woodlands.' },
  { id: 'geranium',    name: 'Geranium',       arabicName: 'جرانيوم',         emoji: '🩷', rarity: 'common',     color: '#EC407A', description: 'Cheerful clusters on sunny windowsills.' },

  // ===================== UNCOMMON (15 flowers) =====================
  { id: 'cherry_blossom', name: 'Cherry Blossom', arabicName: 'بلوسوم',      emoji: '🌸', rarity: 'uncommon',   color: '#F8BBD0', description: 'Fleeting spring beauty from Japan.' },
  { id: 'iris',        name: 'Iris',           arabicName: 'أيريس',           emoji: '🪻', rarity: 'uncommon',   color: '#673AB7', description: 'Named after the Greek goddess of the rainbow.' },
  { id: 'gardenia',    name: 'Gardenia',       arabicName: 'جاردينيا',        emoji: '🤍', rarity: 'uncommon',   color: '#F5F5F5', description: 'Creamy white with an intoxicating perfume.' },
  { id: 'peony',       name: 'Peony',          arabicName: 'فاوانيا',          emoji: '🌸', rarity: 'uncommon',   color: '#FF80AB', description: 'Lush, full blooms that last for decades.' },
  { id: 'lotus',       name: 'Lotus',          arabicName: 'لوتس',            emoji: '🪷', rarity: 'uncommon',   color: '#F48FB1', description: 'Sacred flower that rises from muddy water.' },
  { id: 'magnolia',    name: 'Magnolia',       arabicName: 'ماجنوليا',        emoji: '🌳', rarity: 'uncommon',   color: '#FCE4EC', description: 'Ancient tree flowers, survivors of time.' },
  { id: 'snapdragon',    name: 'Snapdragon',       arabicName: 'فم الأسد',         emoji: '🐉', rarity: 'uncommon',   color: '#FF7043', description: "Squeeze the sides to open the dragon's mouth!" },
  { id: 'sweet_pea',   name: 'Sweet Pea',      arabicName: 'بازلاء حلوة',    emoji: '🩵', rarity: 'uncommon',   color: '#80DEEA', description: 'Delicate tendrils and heavenly scent.' },
  { id: 'primrose',    name: 'Primrose',       arabicName: 'ربيعية',           emoji: '🌼', rarity: 'uncommon',   color: '#FFF176', description: 'First flower to bloom after winter.' },
  { id: 'zinnia',      name: 'Zinnia',         arabicName: 'زينيا',           emoji: '🌻', rarity: 'uncommon',   color: '#EF9A9A', description: 'Bright pompoms that butterflies adore.' },
  { id: 'cosmos',      name: 'Cosmos',         arabicName: 'كوزموس',          emoji: '🌌', rarity: 'uncommon',   color: '#CE93D8', description: 'Feathery petals like starbursts.' },
  { id: 'wisteria',    name: 'Wisteria',       arabicName: 'ويستريا',         emoji: '💜', rarity: 'uncommon',   color: '#9575CD', description: 'Cascading purple waterfalls of flowers.' },
  { id: 'freesia',     name: 'Freesia',        arabicName: 'فريزيا',          emoji: '🌿', rarity: 'uncommon',   color: '#A5D6A7', description: 'Funnel-shaped blooms with a sweet scent.' },
  { id: 'lilac',       name: 'Lilac',          arabicName: 'لايلك',           emoji: '🟣', rarity: 'uncommon',   color: '#CE93D8', description: 'Clusters of tiny purple flowers in spring.' },
  { id: 'daffodil',    name: 'Daffodil',       arabicName: 'نرجس',            emoji: '🌼', rarity: 'uncommon',   color: '#FFF59D', description: 'Golden trumpets that announce spring.' },

  // ===================== RARE (10 flowers) =====================
  { id: 'black_rose',  name: 'Black Rose',     arabicName: 'وردة سوداء',     emoji: '🥀', rarity: 'rare',       color: '#37474F', description: 'Mysterious and deeply rare dark beauty.' },
  { id: 'blue_rose',   name: 'Blue Rose',      arabicName: 'وردة زرقا',      emoji: '💙', rarity: 'rare',       color: '#1565C0', description: 'Impossible in nature, magical in dreams.' },
  { id: 'rainbow_dahlia', name: 'Rainbow Dahlia', arabicName: 'داليا قوس قزح', emoji: '🌈', rarity: 'rare',    color: '#FF6F00', description: 'Petals that shift through every color.' },
  { id: 'night_bloom', name: 'Night Bloom',    arabicName: 'وردة الليل',     emoji: '🌙', rarity: 'rare',       color: '#1A237E', description: 'Only opens when the moon is full.' },
  { id: 'ice_flower',  name: 'Ice Flower',     arabicName: 'وردة الجليد',    emoji: '❄️', rarity: 'rare',       color: '#B2EBF2', description: 'Crystalline petals that never melt.' },
  { id: 'fire_lily',   name: 'Fire Lily',      arabicName: 'زنبق النار',     emoji: '🔥', rarity: 'rare',       color: '#FF3D00', description: 'Blazing orange flames shaped like petals.' },
  { id: 'silver_fern', name: 'Silver Fern',    arabicName: 'سرخس فضي',       emoji: '🌿', rarity: 'rare',       color: '#B0BEC5', description: 'Ancient fern with silver-dusted fronds.' },
  { id: 'moonflower',  name: 'Moonflower',     arabicName: 'وردة القمر',     emoji: '🌕', rarity: 'rare',       color: '#F5F5F5', description: 'Glows white in the moonlight.' },
  { id: 'titan_arum',  name: 'Titan Arum',     arabicName: 'عملاق الزهور',   emoji: '🌿', rarity: 'rare',       color: '#1B5E20', description: 'The largest flower in the world. Smells awful!' },
  { id: 'dragon_flower', name: 'Dragon Flower', arabicName: 'وردة التنين',   emoji: '🐲', rarity: 'rare',       color: '#BF360C', description: 'Ancient flower said to hold dragon magic.' },

  // ===================== ULTRA RARE (5 flowers) =====================
  { id: 'golden_rose',    name: 'Golden Rose',       arabicName: 'وردة ذهبية',         emoji: '🌟', rarity: 'ultra_rare', color: '#FFD700', description: 'A rose dipped in pure gold. Priceless!' },
  { id: 'crystal_blossom',name: 'Crystal Blossom',   arabicName: 'بلوسوم كريستال',     emoji: '💎', rarity: 'ultra_rare', color: '#80D8FF', description: 'Clear as glass, harder than diamond.' },
  { id: 'rainbow_rose',   name: 'Rainbow Rose',      arabicName: 'وردة قوس قزح',       emoji: '🌈', rarity: 'ultra_rare', color: '#FF4081', description: 'Every petal a different color of the rainbow.' },
  { id: 'star_flower',    name: 'Star Flower',       arabicName: 'زهرة النجوم',        emoji: '💫', rarity: 'ultra_rare', color: '#FFFF00', description: 'Falls from the sky on shooting star nights.' },
  { id: 'legendary_bloom',name: 'Legendary Bloom',   arabicName: 'وردة الأسطورة',     emoji: '👑', rarity: 'ultra_rare', color: '#FF6D00', description: 'The rarest flower in all of Sprout World. A true legend!' },
];

/**
 * Pick a random flower based on rarity weights.
 * Returns a flower object.
 */
function pickRandomFlower() {
  const totalWeight = Object.values(RARITIES).reduce((sum, r) => sum + r.weight, 0);
  let rand = Math.random() * totalWeight;

  let selectedRarity = 'common';
  for (const [key, rarity] of Object.entries(RARITIES)) {
    rand -= rarity.weight;
    if (rand <= 0) {
      selectedRarity = rarity.id;
      break;
    }
  }

  const pool = FLOWERS.filter((f) => f.rarity === selectedRarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

module.exports = { FLOWERS, RARITIES, pickRandomFlower };
