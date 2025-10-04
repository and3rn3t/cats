// Cat Breed Database - 40 Unique Breeds Across 5 Environments
const CAT_BREEDS = [
    // FOREST ENVIRONMENT (8 cats)
    {
        id: 1,
        name: "Persian",
        icon: "😺",
        description: "A fluffy, laid-back cat with a luxurious coat. Persians are known for their calm demeanor and love of lounging.",
        origin: "Persia (Iran)",
        environment: "forest",
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
        id: 3,
        name: "Maine Coon",
        icon: "😻",
        description: "A gentle giant with a fluffy tail and tufted ears. Maine Coons are one of the largest domestic cat breeds!",
        origin: "Maine, USA",
        environment: "forest",
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
        id: 7,
        name: "Ragdoll",
        icon: "😺",
        description: "These cats go limp when you pick them up, like a ragdoll! They're incredibly gentle and relaxed.",
        origin: "California, USA",
        environment: "forest",
        stats: {
            cuteness: 92,
            friendliness: 95,
            energy: 45,
            intelligence: 70,
            rarity: "common"
        },
        behavior: "Extremely docile, goes limp when held",
        favoriteActivity: "Being carried around"
    },
    {
        id: 11,
        name: "Norwegian Forest Cat",
        icon: "😻",
        description: "A majestic forest dweller with a thick, waterproof coat. These cats are excellent climbers!",
        origin: "Norway",
        environment: "forest",
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
        environment: "forest",
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
        id: 18,
        name: "Chartreux",
        icon: "😺",
        description: "The smiling cat of France! Chartreux are known for their quiet nature and gentle personality.",
        origin: "France",
        environment: "forest",
        stats: {
            cuteness: 83,
            friendliness: 78,
            energy: 65,
            intelligence: 82,
            rarity: "uncommon"
        },
        behavior: "Quiet and observant, rarely meows",
        favoriteActivity: "Silent companionship"
    },
    {
        id: 22,
        name: "Japanese Bobtail",
        icon: "😺",
        description: "Lucky cats with pom-pom tails! Japanese Bobtails are playful and bring good fortune!",
        origin: "Japan",
        environment: "forest",
        stats: {
            cuteness: 88,
            friendliness: 85,
            energy: 82,
            intelligence: 83,
            rarity: "common"
        },
        behavior: "Talkative with a pom-pom tail",
        favoriteActivity: "Playing fetch"
    },
    {
        id: 26,
        name: "European Wildcat",
        icon: "🐈",
        description: "A true wildcat from European forests! These elusive cats are fierce hunters with beautiful tabby markings.",
        origin: "Europe",
        environment: "forest",
        stats: {
            cuteness: 78,
            friendliness: 50,
            energy: 92,
            intelligence: 88,
            rarity: "uncommon"
        },
        behavior: "Wild and independent, skilled hunter",
        favoriteActivity: "Stalking prey in the forest"
    },

    // MOUNTAIN ENVIRONMENT (8 cats)
    {
        id: 10,
        name: "Russian Blue",
        icon: "😺",
        description: "Elegant grey cats with emerald eyes. Russian Blues are shy at first but loyal once they trust you!",
        origin: "Russia",
        environment: "mountain",
        stats: {
            cuteness: 85,
            friendliness: 65,
            energy: 70,
            intelligence: 85,
            rarity: "uncommon"
        },
        behavior: "Reserved but loyal to family",
        favoriteActivity: "Quiet observation"
    },
    {
        id: 13,
        name: "Turkish Angora",
        icon: "😸",
        description: "An ancient breed with silky white fur. Turkish Angoras are playful and love being the center of attention!",
        origin: "Turkey",
        environment: "mountain",
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
        id: 23,
        name: "Himalayan",
        icon: "😺",
        description: "A Persian with Siamese coloring! Himalayans have the best of both breeds - beauty and personality.",
        origin: "USA/UK",
        environment: "mountain",
        stats: {
            cuteness: 94,
            friendliness: 80,
            energy: 50,
            intelligence: 72,
            rarity: "rare"
        },
        behavior: "Gentle and sweet-natured",
        favoriteActivity: "Being groomed"
    },
    {
        id: 27,
        name: "Siberian",
        icon: "😺",
        description: "A powerful cat from the cold forests of Russia! Siberians have thick, water-repellent coats.",
        origin: "Russia",
        environment: "mountain",
        stats: {
            cuteness: 89,
            friendliness: 82,
            energy: 75,
            intelligence: 83,
            rarity: "uncommon"
        },
        behavior: "Gentle giant with dog-like loyalty",
        favoriteActivity: "Playing in snow"
    },
    {
        id: 28,
        name: "Turkish Van",
        icon: "😸",
        description: "The swimming cat! Turkish Vans love water and have a unique color pattern with a white body.",
        origin: "Turkey",
        environment: "mountain",
        stats: {
            cuteness: 86,
            friendliness: 78,
            energy: 88,
            intelligence: 85,
            rarity: "common"
        },
        behavior: "Loves swimming and playing in water",
        favoriteActivity: "Swimming in mountain lakes"
    },
    {
        id: 29,
        name: "Nebelung",
        icon: "😺",
        description: "A rare blue-grey cat with a shimmering coat! Nebelungs are gentle and reserved.",
        origin: "USA",
        environment: "mountain",
        stats: {
            cuteness: 87,
            friendliness: 70,
            energy: 65,
            intelligence: 82,
            rarity: "common"
        },
        behavior: "Shy but devoted to family",
        favoriteActivity: "Quiet observation from heights"
    },
    {
        id: 30,
        name: "American Curl",
        icon: "😺",
        description: "Unique cats with ears that curl backwards! American Curls are playful and friendly.",
        origin: "USA",
        environment: "mountain",
        stats: {
            cuteness: 91,
            friendliness: 85,
            energy: 78,
            intelligence: 80,
            rarity: "common"
        },
        behavior: "Playful with distinctive curled ears",
        favoriteActivity: "Interactive play"
    },
    {
        id: 31,
        name: "Mountain Lynx",
        icon: "🐱",
        description: "A rare hybrid with wild lynx heritage! Mountain Lynx cats are athletic and exotic.",
        origin: "USA",
        environment: "mountain",
        stats: {
            cuteness: 82,
            friendliness: 65,
            energy: 95,
            intelligence: 92,
            rarity: "epic"
        },
        behavior: "Wild-looking with high energy",
        favoriteActivity: "Climbing to high peaks"
    },

    // DESERT ENVIRONMENT (8 cats)
    {
        id: 2,
        name: "Siamese",
        icon: "😸",
        description: "An elegant, vocal cat with striking blue eyes. Siamese cats are incredibly social and chatty!",
        origin: "Thailand",
        environment: "desert",
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
        id: 9,
        name: "Abyssinian",
        icon: "😸",
        description: "An ancient breed with a wild appearance. Abyssinians are curious, active, and love to be involved in everything!",
        origin: "Ethiopia",
        environment: "desert",
        stats: {
            cuteness: 80,
            friendliness: 85,
            energy: 90,
            intelligence: 90,
            rarity: "common"
        },
        behavior: "Extremely curious and athletic",
        favoriteActivity: "Exploring every corner"
    },
    {
        id: 15,
        name: "Egyptian Mau",
        icon: "😸",
        description: "The fastest domestic cat with natural spots! Egyptian Maus are as fast as they are beautiful.",
        origin: "Egypt",
        environment: "desert",
        stats: {
            cuteness: 85,
            friendliness: 75,
            energy: 95,
            intelligence: 88,
            rarity: "rare"
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
        environment: "desert",
        stats: {
            cuteness: 88,
            friendliness: 92,
            energy: 80,
            intelligence: 85,
            rarity: "common"
        },
        behavior: "People-oriented and playful",
        favoriteActivity: "Interactive play with humans"
    },
    {
        id: 32,
        name: "Arabian Mau",
        icon: "😸",
        description: "A desert cat adapted to extreme heat! Arabian Maus are natural desert dwellers.",
        origin: "Arabian Peninsula",
        environment: "desert",
        stats: {
            cuteness: 80,
            friendliness: 75,
            energy: 85,
            intelligence: 83,
            rarity: "common"
        },
        behavior: "Heat-adapted and independent",
        favoriteActivity: "Hunting in the desert heat"
    },
    {
        id: 33,
        name: "Somali",
        icon: "😸",
        description: "A long-haired Abyssinian with a fox-like tail! Somalis are active and playful.",
        origin: "Somalia",
        environment: "desert",
        stats: {
            cuteness: 88,
            friendliness: 82,
            energy: 90,
            intelligence: 87,
            rarity: "uncommon"
        },
        behavior: "Bushy-tailed and mischievous",
        favoriteActivity: "Acrobatic jumps and play"
    },
    {
        id: 34,
        name: "Chausie",
        icon: "😺",
        description: "A hybrid of domestic and jungle cats! Chausies are tall, athletic, and adventurous.",
        origin: "USA",
        environment: "desert",
        stats: {
            cuteness: 83,
            friendliness: 72,
            energy: 96,
            intelligence: 90,
            rarity: "rare"
        },
        behavior: "Athletic jungle cat hybrid",
        favoriteActivity: "Jumping and exploring"
    },
    {
        id: 35,
        name: "Sand Cat",
        icon: "🐈",
        description: "The ultimate desert survivor! Sand cats can live without water and hunt at night.",
        origin: "Sahara Desert",
        environment: "desert",
        stats: {
            cuteness: 92,
            friendliness: 55,
            energy: 88,
            intelligence: 85,
            rarity: "epic"
        },
        behavior: "Nocturnal desert specialist",
        favoriteActivity: "Hunting in desert nights"
    },

    // CITY ENVIRONMENT (8 cats)
    {
        id: 4,
        name: "Bengal",
        icon: "🐅",
        description: "A wild-looking cat with leopard spots! Bengals are super active and love to climb and explore.",
        origin: "USA (hybrid)",
        environment: "city",
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
        environment: "city",
        stats: {
            cuteness: 100,
            friendliness: 80,
            energy: 60,
            intelligence: 75,
            rarity: "common"
        },
        behavior: "Sweet and owl-like with folded ears",
        favoriteActivity: "Sitting in funny positions"
    },
    {
        id: 8,
        name: "British Shorthair",
        icon: "😺",
        description: "Round and plush with a teddy bear face! These cats are calm and easygoing companions.",
        origin: "United Kingdom",
        environment: "city",
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
        id: 14,
        name: "Manx",
        icon: "😺",
        description: "The tailless wonder! Manx cats hop like rabbits and are great hunters.",
        origin: "Isle of Man",
        environment: "city",
        stats: {
            cuteness: 82,
            friendliness: 80,
            energy: 75,
            intelligence: 80,
            rarity: "uncommon"
        },
        behavior: "Playful and rabbit-like, no tail!",
        favoriteActivity: "Hopping and hunting"
    },
    {
        id: 20,
        name: "Devon Rex",
        icon: "😺",
        description: "The pixie of cats with large ears and curly fur! Devon Rex cats are mischievous and love to perch on shoulders.",
        origin: "England",
        environment: "city",
        stats: {
            cuteness: 90,
            friendliness: 92,
            energy: 88,
            intelligence: 90,
            rarity: "uncommon"
        },
        behavior: "Mischievous and loves shoulders",
        favoriteActivity: "Perching on high shoulders"
    },
    {
        id: 36,
        name: "American Shorthair",
        icon: "😺",
        description: "The all-American cat! These adaptable cats are great hunters and friendly companions.",
        origin: "USA",
        environment: "city",
        stats: {
            cuteness: 84,
            friendliness: 88,
            energy: 72,
            intelligence: 78,
            rarity: "common"
        },
        behavior: "Easygoing and adaptable",
        favoriteActivity: "Mouse hunting"
    },
    {
        id: 37,
        name: "Bombay",
        icon: "😺",
        description: "A mini black panther! Bombays have sleek black coats and copper eyes.",
        origin: "USA",
        environment: "city",
        stats: {
            cuteness: 89,
            friendliness: 92,
            energy: 80,
            intelligence: 86,
            rarity: "uncommon"
        },
        behavior: "Sleek panther-like appearance",
        favoriteActivity: "Being the center of attention"
    },
    {
        id: 38,
        name: "Korat",
        icon: "😺",
        description: "Ancient Thai cats that bring good luck! Korats have heart-shaped faces and silver-blue coats.",
        origin: "Thailand",
        environment: "city",
        stats: {
            cuteness: 88,
            friendliness: 80,
            energy: 75,
            intelligence: 89,
            rarity: "rare"
        },
        behavior: "Good luck charm with silver coat",
        favoriteActivity: "Bringing fortune to owners"
    },

    // BEACH ENVIRONMENT (8 cats)
    {
        id: 6,
        name: "Sphynx",
        icon: "🙀",
        description: "A hairless wonder! Sphynx cats are warm to touch and incredibly affectionate. They love attention!",
        origin: "Canada",
        environment: "beach",
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
        id: 17,
        name: "Savannah",
        icon: "🐆",
        description: "A tall, spotted cat with a wild heritage! Savannahs are the result of crossing domestic cats with servals.",
        origin: "USA (hybrid)",
        environment: "beach",
        stats: {
            cuteness: 85,
            friendliness: 70,
            energy: 98,
            intelligence: 95,
            rarity: "rare"
        },
        behavior: "Dog-like, can be leash trained",
        favoriteActivity: "Playing fetch and jumping high"
    },
    {
        id: 19,
        name: "Tonkinese",
        icon: "😸",
        description: "A perfect blend of Siamese and Burmese! Tonkinese are affectionate and moderately active.",
        origin: "Canada",
        environment: "beach",
        stats: {
            cuteness: 87,
            friendliness: 90,
            energy: 78,
            intelligence: 88,
            rarity: "common"
        },
        behavior: "Affectionate and social",
        favoriteActivity: "Interactive games"
    },
    {
        id: 21,
        name: "Ocicat",
        icon: "😸",
        description: "Wild looking but completely domestic! Ocicats have spotted coats and outgoing personalities.",
        origin: "USA",
        environment: "beach",
        stats: {
            cuteness: 84,
            friendliness: 85,
            energy: 85,
            intelligence: 87,
            rarity: "uncommon"
        },
        behavior: "Outgoing and dog-like",
        favoriteActivity: "Learning tricks"
    },
    {
        id: 24,
        name: "Singapura",
        icon: "😸",
        description: "The smallest cat breed! Don't let their size fool you - Singapuras are full of energy and mischief!",
        origin: "Singapore",
        environment: "beach",
        stats: {
            cuteness: 95,
            friendliness: 88,
            energy: 80,
            intelligence: 85,
            rarity: "common"
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
        environment: "beach",
        stats: {
            cuteness: 96,
            friendliness: 82,
            energy: 55,
            intelligence: 70,
            rarity: "common"
        },
        behavior: "Calm and cuddly companion",
        favoriteActivity: "Lounging nearby"
    },
    {
        id: 39,
        name: "Balinese",
        icon: "😸",
        description: "A long-haired Siamese with a plumed tail! Balinese are elegant and vocal.",
        origin: "USA",
        environment: "beach",
        stats: {
            cuteness: 90,
            friendliness: 87,
            energy: 82,
            intelligence: 88,
            rarity: "common"
        },
        behavior: "Graceful and communicative",
        favoriteActivity: "Chatting with owners"
    },
    {
        id: 40,
        name: "Havana Brown",
        icon: "😺",
        description: "Extremely rare chocolate-brown cats! Havana Browns are playful and people-oriented.",
        origin: "England/USA",
        environment: "beach",
        stats: {
            cuteness: 93,
            friendliness: 95,
            energy: 85,
            intelligence: 92,
            rarity: "legendary"
        },
        behavior: "Rare chocolate beauty",
        favoriteActivity: "Interactive play with humans"
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

// Export for use in game.js - both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = { CAT_BREEDS, RARITY_COLORS, RARITY_CHANCE, CAT_FACTS };
} else if (typeof window !== 'undefined') {
    // Browser export - attach to window object
    window.CAT_BREEDS = CAT_BREEDS;
    window.RARITY_COLORS = RARITY_COLORS;
    window.RARITY_CHANCE = RARITY_CHANCE;
    window.CAT_FACTS = CAT_FACTS;
    console.log('✅ Cat data loaded:', CAT_BREEDS.length, 'breeds available');
}
