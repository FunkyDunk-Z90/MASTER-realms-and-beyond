// ─── ByteBurger — Static Menu Data ───────────────────────────────────────────
// All menu data lives here until a backend is connected.

export type BurgerStat = { label: string; value: number }  // 0–100

export type Burger = {
    id: string
    name: string
    class: string          // e.g. "Spicy Warrior"
    emoji: string
    tagline: string
    description: string
    price: string
    tags: string[]
    stats: BurgerStat[]
    featured?: boolean
    isNew?: boolean
}

export type MenuItem = {
    id: string
    name: string
    emoji: string
    description: string
    price: string
    tags: string[]
    variants?: { name: string; price: string }[]
}

export type DrinkItem = {
    id: string
    name: string
    emoji: string
    description: string
    price: string
    tags: string[]
    sizes?: { name: string; price: string }[]
}

// ─── Burgers ─────────────────────────────────────────────────────────────────

export const BURGERS: Burger[] = [
    {
        id: 'everflame',
        name: 'The Everflame',
        class: 'Spicy Warrior',
        emoji: '🔥',
        tagline: 'Born in fire. Fresh to the last bite.',
        description:
            'Double smashed patty, ghost pepper aioli, pickled fresno chillies, crispy jalapeños, fresh tomato & shredded iceberg. The heat builds — but it never burns out.',
        price: '£12.50',
        tags: ['hot', 'gold'],
        featured: true,
        stats: [
            { label: 'Heat',    value: 95 },
            { label: 'Fresh',   value: 85 },
            { label: 'Umami',   value: 60 },
            { label: 'Crunch',  value: 70 },
        ],
    },
    {
        id: 'abyss',
        name: 'The Abyss',
        class: 'Umami Master',
        emoji: '🌑',
        tagline: 'Deep flavour. Deeper obsession.',
        description:
            'Aged beef patty, black garlic butter, caramelised onion jam, aged cheddar, roasted mushroom duxelle, dark rye bun. Once you go deep, you never go back.',
        price: '£13.00',
        tags: ['gold'],
        stats: [
            { label: 'Heat',    value: 15 },
            { label: 'Fresh',   value: 40 },
            { label: 'Umami',   value: 98 },
            { label: 'Crunch',  value: 45 },
        ],
    },
    {
        id: 'cyberwave',
        name: 'The Cyberwave',
        class: 'Miso Ronin',
        emoji: '🌊',
        tagline: 'East meets West. Miso meets meat.',
        description:
            'Wagyu blend patty, white miso glaze, pickled daikon, toasted sesame slaw, sriracha kewpie, crispy shallots, steamed bao-style bun. A fusion of worlds.',
        price: '£13.50',
        tags: ['gold', 'new'],
        isNew: true,
        stats: [
            { label: 'Heat',    value: 40 },
            { label: 'Fresh',   value: 75 },
            { label: 'Umami',   value: 90 },
            { label: 'Crunch',  value: 80 },
        ],
    },
    {
        id: 'noble-protector',
        name: 'The Noble Protector',
        class: 'Verdant Guardian',
        emoji: '🌿',
        tagline: 'Plant-based. Power-packed. Proud.',
        description:
            'House-made lentil & walnut patty, cashew smoky cheese, avocado smash, roasted beetroot, pea shoots, sun-dried tomato relish, seeded focaccia bun. Earthy and unapologetic.',
        price: '£11.50',
        tags: ['vegan'],
        stats: [
            { label: 'Heat',    value: 20 },
            { label: 'Fresh',   value: 90 },
            { label: 'Umami',   value: 65 },
            { label: 'Crunch',  value: 55 },
        ],
    },
    {
        id: 'lusty-crustacean',
        name: 'The Lusty Crustacean',
        class: 'Sea Sovereign',
        emoji: '🦞',
        tagline: 'From the deep. For the bold.',
        description:
            'Tempura prawn patty, old bay butter, shredded crab slaw, lemon aioli, pickled cucumber, dill, toasted brioche. The ocean called — we answered.',
        price: '£14.00',
        tags: ['fish', 'new'],
        isNew: true,
        stats: [
            { label: 'Heat',    value: 30 },
            { label: 'Fresh',   value: 88 },
            { label: 'Umami',   value: 82 },
            { label: 'Crunch',  value: 92 },
        ],
    },
]

// ─── Sides ───────────────────────────────────────────────────────────────────

export const SIDES: MenuItem[] = [
    {
        id: 'fries-classic',
        name: 'Classic Fries',
        emoji: '🍟',
        description: 'Double-fried Maris Pipers, sea salt, malt vinegar dust. The original. The essential.',
        price: '£3.50',
        tags: [],
        variants: [
            { name: 'Regular', price: '£3.50' },
            { name: 'Large',   price: '£4.50' },
        ],
    },
    {
        id: 'fries-curly',
        name: 'Curly Fries',
        emoji: '🌀',
        description: 'Spiced curly fries with a smoky paprika & cayenne coating. Impossible to eat just one.',
        price: '£4.00',
        tags: ['hot'],
        variants: [
            { name: 'Regular', price: '£4.00' },
            { name: 'Large',   price: '£5.00' },
        ],
    },
    {
        id: 'fries-sweet-potato',
        name: 'Sweet Potato Fries',
        emoji: '🍠',
        description: 'Skin-on sweet potato, maple & smoked salt glaze. Earthy sweet meets savoury crunch.',
        price: '£4.50',
        tags: ['vegan'],
        variants: [
            { name: 'Regular', price: '£4.50' },
            { name: 'Large',   price: '£5.50' },
        ],
    },
    {
        id: 'slaw',
        name: 'Dairy-Free Slaw',
        emoji: '🥗',
        description: 'Red cabbage, carrot, fennel & apple in a apple cider vinaigrette. Crisp, tangy, completely dairy-free.',
        price: '£3.00',
        tags: ['vegan', 'new'],
    },
    {
        id: 'bytes-chicken',
        name: 'Bytes — Chicken',
        emoji: '🍗',
        description: 'Panko-crumbed free-range chicken bites, sriracha honey dip. Crunch dialled to eleven.',
        price: '£5.50',
        tags: ['hot', 'gold'],
        variants: [
            { name: '6 Bytes',  price: '£5.50' },
            { name: '12 Bytes', price: '£9.50' },
        ],
    },
    {
        id: 'bytes-cauliflower',
        name: 'Bytes — Cauliflower',
        emoji: '🥦',
        description: 'Panko-crumbed cauliflower florets, smoky chipotle dip. All the crunch, none of the cluck.',
        price: '£5.00',
        tags: ['vegan', 'new'],
        variants: [
            { name: '6 Bytes',  price: '£5.00' },
            { name: '12 Bytes', price: '£8.50' },
        ],
    },
]

// ─── Drinks ──────────────────────────────────────────────────────────────────

export const DRINKS: DrinkItem[] = [
    {
        id: 'cola',
        name: 'Classic Cola',
        emoji: '🥤',
        description: 'Ice-cold classic cola on draft. The universal pairing.',
        price: '£2.50',
        tags: [],
        sizes: [
            { name: 'Regular', price: '£2.50' },
            { name: 'Large',   price: '£3.20' },
        ],
    },
    {
        id: 'lemonade',
        name: 'Arcade Lemonade',
        emoji: '🍋',
        description: 'Fresh-pressed lemon, cane sugar, sparkling water & a pinch of sea salt. Retro perfect.',
        price: '£3.00',
        tags: ['new'],
    },
    {
        id: 'mango-blast',
        name: 'Mango Blast',
        emoji: '🥭',
        description: 'Blended Alphonso mango, lime, ginger & sparkling water. Tropical power-up.',
        price: '£3.50',
        tags: ['new', 'vegan'],
    },
    {
        id: 'chilli-cola',
        name: 'Chilli Cola',
        emoji: '🌶️',
        description: 'Classic cola spiked with house-made chilli syrup & lime. For those who like it dangerous.',
        price: '£3.20',
        tags: ['hot'],
    },
    {
        id: 'vanilla-shake',
        name: 'Vanilla Shake',
        emoji: '🍦',
        description: 'Thick madagascan vanilla milkshake. The classic cooldown.',
        price: '£4.50',
        tags: ['gold'],
        sizes: [
            { name: 'Regular', price: '£4.50' },
            { name: 'Large',   price: '£5.50' },
        ],
    },
    {
        id: 'bb-cola',
        name: 'BB Cola Float',
        emoji: '🍨',
        description: 'Classic cola topped with a scoop of vanilla ice cream. The house signature drink.',
        price: '£5.00',
        tags: ['gold', 'new'],
    },
    {
        id: 'sparkling-water',
        name: 'Sparkling Water',
        emoji: '💧',
        description: 'Chilled sparkling mineral water. Pure reset.',
        price: '£1.50',
        tags: ['vegan'],
    },
    {
        id: 'coffee',
        name: 'Arcade Espresso',
        emoji: '☕',
        description: 'Double espresso from our house blend. Fuel for the next level.',
        price: '£2.80',
        tags: [],
    },
]

// ─── Promoted / Featured ─────────────────────────────────────────────────────

export const FEATURED_ITEMS = [
    {
        id: 'everflame-promo',
        badge: 'TODAY\'S SPECIAL',
        title: 'The Everflame',
        desc: 'Ghost pepper aioli, pickled fresno chillies, fresh tomato. The house fire in a bun.',
        price: '£12.50',
        emoji: '🔥',
        tags: ['hot'],
    },
    {
        id: 'cyberwave-promo',
        badge: 'NEW THIS WEEK',
        title: 'The Cyberwave',
        desc: 'White miso glaze, pickled daikon, toasted sesame slaw. A fusion level unlocked.',
        price: '£13.50',
        emoji: '🌊',
        tags: ['new'],
    },
    {
        id: 'bytes-deal',
        badge: 'COMBO DEAL',
        title: 'Bytes + Fries',
        desc: '12 Chicken Bytes with Large Classic Fries & a drink of your choice.',
        price: '£14.00',
        emoji: '🍗',
        tags: ['gold'],
    },
]

// ─── Ticker messages ──────────────────────────────────────────────────────────

export const TICKER_ITEMS = [
    'BYTE YOUR WAY TO VICTORY',
    'NEW: THE CYBERWAVE IS LIVE',
    'BYTES COMBO — 12 FOR THE PRICE OF 10',
    'LEVEL UP YOUR LUNCH',
    'THE LUSTY CRUSTACEAN HAS LANDED',
    'DAILY SPECIALS CHANGE AT 12:00',
    'VEGAN OPTIONS AVAILABLE',
    'ORDER AT THE COUNTER OR ONLINE',
]
