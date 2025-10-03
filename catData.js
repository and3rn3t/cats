// Cat Breed Database - 25+ Unique Breeds
const CAT_BREEDS = [
    {
        id: 1,
        name: "Persian",
        icon: "😺",
        description: "A fluffy, laid-back cat with a luxurious coat. Persians are known for their calm demeanor and love of lounging.",
        origin: "Persia (Iran)",
        stats: {
            cuteness: 95,
            friendliness: 75,
            energy: 40,
            intelligence: 70,
            rarity: "common"
        },
        behavior: "Lazy and affectionate, loves being pampered",
        favoriteActivity: "Napping in sunny spots"
    },
    {
        id: 2,
        name: "Siamese",
        icon: "😸",
        description: "An elegant, vocal cat with striking blue eyes. Siamese cats are incredibly social and chatty!",
        origin: "Thailand",
        stats: {
            cuteness: 85,
            friendliness: 90,
            energy: 80,
            intelligence: 95,
            rarity: "uncommon"
        },
        behavior: "Very talkative and demands attention",
        favoriteActivity: "Following you around and 'talking'"
    },
    {
        id: 3,
        name: "Maine Coon",
        icon: "😻",
        description: "A gentle giant with a fluffy tail and tufted ears. Maine Coons are one of the largest domestic cat breeds!",
        origin: "Maine, USA",
        stats: {
            cuteness: 90,
            friendliness: 85,
            energy: 70,
            intelligence: 85,
            rarity: "uncommon"
        },
        behavior: "Friendly and dog-like, loves to play fetch",
        favoriteActivity: "Playing in water"
    },
    {
        id: 4,
        name: "Bengal",
        icon: "🐅",
        description: "A wild-looking cat with leopard spots! Bengals are super active and love to climb and explore.",
        origin: "USA (hybrid)",
        stats: {
            cuteness: 88,
            friendliness: 70,
            energy: 95,
            intelligence: 90,
            rarity: "rare"
        },
        behavior: "Athletic and playful, always on the move",
        favoriteActivity: "Climbing to high places"
    },
    {
        id: 5,
        name: "Scottish Fold",
        icon: "😽",
        description: "Adorable cats with folded ears that make them look like owls! They're sweet and gentle companions.",
        origin: "Scotland",
        stats: {
            cuteness: 100,
            friendliness: 80,
            energy: 60,
            intelligence: 75,
            rarity: "rare"
        },
        behavior: "Sweet and owl-like with folded ears",
        favoriteActivity: "Sitting in funny positions"
    },
    {
        id: 6,
        name: "Sphynx",
        icon: "🙀",
        description: "A hairless wonder! Sphynx cats are warm to touch and incredibly affectionate. They love attention!",
        origin: "Canada",
        stats: {
            cuteness: 70,
            friendliness: 95,
            energy: 85,
            intelligence: 80,
            rarity: "epic"
        },
        behavior: "Extroverted and craves warmth and attention",
        favoriteActivity: "Cuddling for warmth"
    },
    {
        id: 7,
        name: "Ragdoll",
        icon: "😺",
        description: "These cats go limp when you pick them up, like a ragdoll! They're incredibly gentle and relaxed.",
        origin: "California, USA",
        stats: {
            cuteness: 92,
            friendliness: 95,
            energy: 45,
            intelligence: 70,
            rarity: "uncommon"
        },
        behavior: "Extremely docile, goes limp when held",
        favoriteActivity: "Being carried around"
    },
    {
        id: 8,
        name: "British Shorthair",
        icon: "😺",
        description: "Round and plush with a teddy bear face! These cats are calm and easygoing companions.",
        origin: "United Kingdom",
        stats: {
            cuteness: 90,
            friendliness: 70,
            energy: 50,
            intelligence: 75,
            rarity: "common"
        },
        behavior: "Dignified and independent, but affectionate",
        favoriteActivity: "Observing from a cozy spot"
    },
    {
        id: 9,
        name: "Abyssinian",
        icon: "😸",
        description: "An ancient breed with a wild appearance. Abyssinians are curious, active, and love to be involved in everything!",
        origin: "Ethiopia",
        stats: {
            cuteness: 80,
            friendliness: 85,
            energy: 90,
            intelligence: 90,
            rarity: "uncommon"
        },
        behavior: "Extremely curious and athletic",
        favoriteActivity: "Exploring every corner"
    },
    {
        id: 10,
        name: "Russian Blue",
        icon: "😺",
        description: "Elegant grey cats with emerald eyes. Russian Blues are shy at first but loyal once they trust you!",
        origin: "Russia",
        stats: {
            cuteness: 85,
            friendliness: 65,
            energy: 70,
            intelligence: 85,
            rarity: "rare"
        },
        behavior: "Reserved but loyal to family",
        favoriteActivity: "Quiet observation"
    },
    {
        id: 11,
        name: "Norwegian Forest Cat",
        icon: "😻",
        description: "A majestic forest dweller with a thick, waterproof coat. These cats are excellent climbers!",
        origin: "Norway",
        stats: {
            cuteness: 88,
            friendliness: 75,
            energy: 75,
            intelligence: 80,
            rarity: "uncommon"
        },
        behavior: "Independent and skilled hunter",
        favoriteActivity: "Climbing trees"
    },
    {
        id: 12,
        name: "Birman",
        icon: "😻",
        description: "Sacred cats of Burma with white paws like gloves! They're gentle and loving.",
        origin: "Myanmar (Burma)",
        stats: {
            cuteness: 93,
            friendliness: 88,
            energy: 60,
            intelligence: 75,
            rarity: "rare"
        },
        behavior: "Gentle and social, loves company",
        favoriteActivity: "Being near their humans"
    },
    {
        id: 13,
        name: "Turkish Angora",
        icon: "😸",
        description: "An ancient breed with silky white fur. Turkish Angoras are playful and love being the center of attention!",
        origin: "Turkey",
        stats: {
            cuteness: 87,
            friendliness: 80,
            energy: 85,
            intelligence: 90,
            rarity: "rare"
        },
        behavior: "Graceful and loves to perform",
        favoriteActivity: "Dancing and showing off"
    },
    {
        id: 14,
        name: "Manx",
        icon: "😺",
        description: "The tailless wonder! Manx cats hop like rabbits and are great hunters.",
        origin: "Isle of Man",
        stats: {
            cuteness: 82,
            friendliness: 80,
            energy: 75,
            intelligence: 80,
            rarity: "epic"
        },
        behavior: "Playful and rabbit-like, no tail!",
        favoriteActivity: "Hopping and hunting"
    },
    {
        id: 15,
        name: "Egyptian Mau",
        icon: "😸",
        description: "The fastest domestic cat with natural spots! Egyptian Maus are as fast as they are beautiful.",
        origin: "Egypt",
        stats: {
            cuteness: 85,
            friendliness: 75,
            energy: 95,
            intelligence: 88,
            rarity: "epic"
        },
        behavior: "Lightning fast and loyal",
        favoriteActivity: "Running at top speed"
    },
    {
        id: 16,
        name: "Burmese",
        icon: "😺",
        description: "A social butterfly! Burmese cats are playful well into old age and love people.",
        origin: "Myanmar (Burma)",
        stats: {
            cuteness: 88,
            friendliness: 92,
            energy: 80,
            intelligence: 85,
            rarity: "uncommon"
        },
        behavior: "People-oriented and playful",
        favoriteActivity: "Interactive play with humans"
    },
    {
        id: 17,
        name: "Savannah",
        icon: "🐆",
        description: "A tall, spotted cat with a wild heritage! Savannahs are the result of crossing domestic cats with servals.",
        origin: "USA (hybrid)",
        stats: {
            cuteness: 85,
            friendliness: 70,
            energy: 98,
            intelligence: 95,
            rarity: "legendary"
        },
        behavior: "Dog-like, can be leash trained",
        favoriteActivity: "Playing fetch and jumping high"
    },
    {
        id: 18,
        name: "Chartreux",
        icon: "😺",
        description: "The smiling cat of France! Chartreux are known for their quiet nature and gentle personality.",
        origin: "France",
        stats: {
            cuteness: 83,
            friendliness: 78,
            energy: 65,
            intelligence: 82,
            rarity: "rare"
        },
        behavior: "Quiet and observant, rarely meows",
        favoriteActivity: "Silent companionship"
    },
    {
        id: 19,
        name: "Tonkinese",
        icon: "😸",
        description: "A perfect blend of Siamese and Burmese! Tonkinese are affectionate and moderately active.",
        origin: "Canada",
        stats: {
            cuteness: 87,
            friendliness: 90,
            energy: 78,
            intelligence: 88,
            rarity: "uncommon"
        },
        behavior: "Affectionate and social",
        favoriteActivity: "Interactive games"
    },
    {
        id: 20,
        name: "Devon Rex",
        icon: "😺",
        description: "The pixie of cats with large ears and curly fur! Devon Rex cats are mischievous and love to perch on shoulders.",
        origin: "England",
        stats: {
            cuteness: 90,
            friendliness: 92,
            energy: 88,
            intelligence: 90,
            rarity: "rare"
        },
        behavior: "Mischievous and loves shoulders",
        favoriteActivity: "Perching on high shoulders"
    },
    {
        id: 21,
        name: "Ocicat",
        icon: "😸",
        description: "Wild looking but completely domestic! Ocicats have spotted coats and outgoing personalities.",
        origin: "USA",
        stats: {
            cuteness: 84,
            friendliness: 85,
            energy: 85,
            intelligence: 87,
            rarity: "rare"
        },
        behavior: "Outgoing and dog-like",
        favoriteActivity: "Learning tricks"
    },
    {
        id: 22,
        name: "Japanese Bobtail",
        icon: "😺",
        description: "Lucky cats with pom-pom tails! Japanese Bobtails are playful and bring good fortune!",
        origin: "Japan",
        stats: {
            cuteness: 88,
            friendliness: 85,
            energy: 82,
            intelligence: 83,
            rarity: "epic"
        },
        behavior: "Talkative with a pom-pom tail",
        favoriteActivity: "Playing fetch"
    },
    {
        id: 23,
        name: "Himalayan",
        icon: "😺",
        description: "A Persian with Siamese coloring! Himalayans have the best of both breeds - beauty and personality.",
        origin: "USA/UK",
        stats: {
            cuteness: 94,
            friendliness: 80,
            energy: 50,
            intelligence: 72,
            rarity: "uncommon"
        },
        behavior: "Gentle and sweet-natured",
        favoriteActivity: "Being groomed"
    },
    {
        id: 24,
        name: "Singapura",
        icon: "😸",
        description: "The smallest cat breed! Don't let their size fool you - Singapuras are full of energy and mischief!",
        origin: "Singapore",
        stats: {
            cuteness: 95,
            friendliness: 88,
            energy: 80,
            intelligence: 85,
            rarity: "epic"
        },
        behavior: "Tiny but mighty, very curious",
        favoriteActivity: "Investigating everything"
    },
    {
        id: 25,
        name: "Exotic Shorthair",
        icon: "😺",
        description: "A Persian in pajamas! Exotic Shorthairs have the Persian face but with short, easy-care fur.",
        origin: "USA",
        stats: {
            cuteness: 96,
            friendliness: 82,
            energy: 55,
            intelligence: 70,
            rarity: "uncommon"
        },
        behavior: "Calm and cuddly companion",
        favoriteActivity: "Lounging nearby"
    }
];

// Game Constants
const RARITY_COLORS = {
    common: "#b0bec5",
    uncommon: "#66bb6a",
    rare: "#42a5f5",
    epic: "#ab47bc",
    legendary: "#ffa726"
};

const RARITY_CHANCE = {
    common: 0.40,      // 40%
    uncommon: 0.30,    // 30%
    rare: 0.20,        // 20%
    epic: 0.08,        // 8%
    legendary: 0.02    // 2%
};

// Fun facts about cats for encounter text
const CAT_FACTS = [
    "This cat seems curious about you!",
    "The cat is watching you carefully...",
    "You spot movement in the bushes!",
    "A cat appears, looking for a friend!",
    "This cat seems interested in treats!",
    "The cat is sunbathing peacefully.",
    "You hear a gentle meow nearby...",
    "A beautiful cat emerges from the shadows!",
    "This cat looks like it wants to play!",
    "The cat approaches slowly, cautiously..."
];

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CAT_BREEDS, RARITY_COLORS, RARITY_CHANCE, CAT_FACTS };
}
