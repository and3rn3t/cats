# Step 2 Completion Guide - Cat Breed Updates

## Quick Implementation Script

Run this Python script to complete Step 2A (add environment to existing cats):

```python
import re

# Environment mapping for existing 25 cats
ENV_MAP = {
    1: 'forest',   # Persian
    2: 'desert',   # Siamese  
    3: 'forest',   # Maine Coon
    4: 'city',     # Bengal
    5: 'city',     # Scottish Fold
    6: 'beach',    # Sphynx
    7: 'forest',   # Ragdoll
    8: 'city',     # British Shorthair
    9: 'desert',   # Abyssinian
    10: 'mountain', # Russian Blue
    11: 'forest',  # Norwegian Forest Cat
    12: 'forest',  # Birman
    13: 'mountain', # Turkish Angora
    14: 'city',    # Manx
    15: 'desert',  # Egyptian Mau
    16: 'desert',  # Burmese
    17: 'beach',   # Savannah
    18: 'forest',  # Chartreux
    19: 'beach',   # Tonkinese
    20: 'city',    # Devon Rex
    21: 'beach',   # Ocicat
    22: 'forest',  # Japanese Bobtail
    23: 'mountain', # Himalayan
    24: 'beach',   # Singapura
    25: 'beach'    # Exotic Shorthair
}

with open('catData.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
current_id = None

for i, line in enumerate(lines):
    new_lines.append(line)
    
    # Detect cat ID
    id_match = re.match(r'\s+id:\s+(\d+),', line)
    if id_match:
        current_id = int(id_match.group(1))
    
    # Add environment after origin line
    if current_id and re.match(r'\s+origin:', line):
        env = ENV_MAP.get(current_id, 'forest')
        indent = ' ' * 8
        new_lines.append(f'{indent}environment: "{env}",\n')
        current_id = None  # Reset

# Update header
new_content = ''.join(new_lines)
new_content = new_content.replace('25+ Unique Breeds', '40 Unique Breeds across 5 Environments')

with open('catData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Added environment property to all 25 cats")
```

## Step 2B: Add 15 New Cat Breeds

Append these to the end of CAT_BREEDS array (before the closing `];`):

```javascript
    {
        id: 26,
        name: "European Wildcat",
        icon: "🐈",
        description: "A wild ancestor of domestic cats with a bushy tail and fierce independence.",
        origin: "Europe (Forests)",
        environment: "forest",
        stats: {
            cuteness: 70,
            friendliness: 50,
            energy: 85,
            intelligence: 80,
            rarity: "rare"
        },
        behavior: "Extremely cautious and territorial",
        favoriteActivity: "Hunting small prey"
    },
    {
        id: 27,
        name: "Siberian",
        icon: "😺",
        description: "A powerful cat from Russia with a thick, water-resistant coat perfect for cold climates.",
        origin: "Russia (Siberia)",
        environment: "mountain",
        stats: {
            cuteness: 88,
            friendliness: 80,
            energy: 75,
            intelligence: 85,
            rarity: "uncommon"
        },
        behavior: "Playful and affectionate, loves cold weather",
        favoriteActivity: "Playing in snow"
    },
    {
        id: 28,
        name: "Turkish Van",
        icon: "😺",
        description: "A rare swimming cat from Turkey with distinctive color markings and a love of water!",
        origin: "Turkey (Lake Van)",
        environment: "mountain",
        stats: {
            cuteness: 85,
            friendliness: 75,
            energy: 80,
            intelligence: 82,
            rarity: "common"
        },
        behavior: "Loves water and swimming",
        favoriteActivity: "Swimming and splashing"
    },
    {
        id: 29,
        name: "Nebelung",
        icon: "😺",
        description: "A rare long-haired version of the Russian Blue with a shimmering silver-blue coat.",
        origin: "United States",
        environment: "mountain",
        stats: {
            cuteness: 87,
            friendliness: 70,
            energy: 65,
            intelligence: 83,
            rarity: "common"
        },
        behavior: "Gentle and reserved, bonds strongly with family",
        favoriteActivity: "Quiet companionship"
    },
    {
        id: 30,
        name: "American Curl",
        icon: "😺",
        description: "A unique cat with curled-back ears and a friendly personality.",
        origin: "California, USA",
        environment: "mountain",
        stats: {
            cuteness: 90,
            friendliness: 88,
            energy: 70,
            intelligence: 76,
            rarity: "common"
        },
        behavior: "Playful and people-oriented",
        favoriteActivity: "Interactive play"
    },
    {
        id: 31,
        name: "Mountain Lynx",
        icon: "🐈‍⬛",
        description: "A rare wild cat hybrid with tufted ears and powerful build, adapted to high altitudes.",
        origin: "Mountain Regions",
        environment: "mountain",
        stats: {
            cuteness: 75,
            friendliness: 55,
            energy: 90,
            intelligence: 88,
            rarity: "epic"
        },
        behavior: "Independent and athletic",
        favoriteActivity: "Climbing and hunting"
    },
    {
        id: 32,
        name: "Arabian Mau",
        icon: "😺",
        description: "A desert cat from the Arabian Peninsula, naturally adapted to extreme heat.",
        origin: "Arabian Peninsula",
        environment: "desert",
        stats: {
            cuteness: 78,
            friendliness: 72,
            energy: 80,
            intelligence: 79,
            rarity: "common"
        },
        behavior: "Active and curious",
        favoriteActivity: "Exploring in heat"
    },
    {
        id: 33,
        name: "Somali",
        icon: "😸",
        description: "A long-haired version of the Abyssinian with a bushy tail and fox-like appearance.",
        origin: "Somalia/Ethiopia",
        environment: "desert",
        stats: {
            cuteness: 89,
            friendliness: 82,
            energy: 88,
            intelligence: 90,
            rarity: "uncommon"
        },
        behavior: "Extremely playful and mischievous",
        favoriteActivity: "Climbing and jumping"
    },
    {
        id: 34,
        name: "Chausie",
        icon: "🐆",
        description: "A wild hybrid cat breed combining jungle cats with domestic breeds for an exotic look.",
        origin: "Ancient Egypt/Modern USA",
        environment: "desert",
        stats: {
            cuteness: 82,
            friendliness: 68,
            energy: 95,
            intelligence: 92,
            rarity: "rare"
        },
        behavior: "Highly active and athletic",
        favoriteActivity: "Running and leaping"
    },
    {
        id: 35,
        name: "Sand Cat",
        icon: "🐈",
        description: "A small wild cat perfectly adapted to desert life, with furry paws to walk on hot sand!",
        origin: "Sahara Desert",
        environment: "desert",
        stats: {
            cuteness: 95,
            friendliness: 45,
            energy: 75,
            intelligence: 85,
            rarity: "epic"
        },
        behavior: "Nocturnal and elusive",
        favoriteActivity: "Hunting at night"
    },
    {
        id: 36,
        name: "American Shorthair",
        icon: "😺",
        description: "A classic American cat breed known for being an excellent mouser and family companion.",
        origin: "United States",
        environment: "city",
        stats: {
            cuteness: 83,
            friendliness: 85,
            energy: 70,
            intelligence: 76,
            rarity: "common"
        },
        behavior: "Easygoing and adaptable",
        favoriteActivity: "Hunting toys"
    },
    {
        id: 37,
        name: "Bombay",
        icon: "🐈‍⬛",
        description: "A sleek black cat bred to resemble a miniature panther with copper eyes.",
        origin: "United States",
        environment: "city",
        stats: {
            cuteness: 87,
            friendliness: 90,
            energy: 75,
            intelligence: 82,
            rarity: "uncommon"
        },
        behavior: "Affectionate and social",
        favoriteActivity: "Following owners around"
    },
    {
        id: 38,
        name: "Korat",
        icon: "😺",
        description: "An ancient silver-blue cat from Thailand, considered a symbol of good luck.",
        origin: "Thailand (Korat Plateau)",
        environment: "city",
        stats: {
            cuteness: 86,
            friendliness: 78,
            energy: 72,
            intelligence: 87,
            rarity: "rare"
        },
        behavior: "Intelligent and observant",
        favoriteActivity: "Watching and learning"
    },
    {
        id: 39,
        name: "Balinese",
        icon: "😸",
        description: "A long-haired Siamese with an elegant, flowing coat and graceful movements.",
        origin: "Indonesia (Bali)",
        environment: "beach",
        stats: {
            cuteness: 91,
            friendliness: 88,
            energy: 80,
            intelligence: 93,
            rarity: "common"
        },
        behavior: "Vocal and affectionate",
        favoriteActivity: "Talking to owners"
    },
    {
        id: 40,
        name: "Havana Brown",
        icon: "🐈",
        description: "An extremely rare chocolate-brown cat with mesmerizing green eyes.",
        origin: "England/Cuba",
        environment: "beach",
        stats: {
            cuteness: 92,
            friendliness: 85,
            energy: 70,
            intelligence: 89,
            rarity: "legendary"
        },
        behavior: "Playful and people-oriented",
        favoriteActivity: "Interactive games with owners"
    }
```

## Step 2C: Update environments.js Cat ID Arrays

Update the `catIds` arrays in environments.js to match the final distribution:

```javascript
forest: {
    // ... other properties
    catIds: [1, 3, 7, 11, 12, 18, 22, 26]
},
mountain: {
    // ... other properties  
    catIds: [10, 13, 23, 27, 28, 29, 30, 31]
},
desert: {
    // ... other properties
    catIds: [2, 9, 15, 16, 32, 33, 34, 35]
},
city: {
    // ... other properties
    catIds: [4, 5, 8, 14, 20, 36, 37, 38]
},
beach: {
    // ... other properties
    catIds: [6, 17, 19, 21, 24, 25, 39, 40]
}
```

## Verification Checklist

After completing the above:

- [ ] 40 total cats in CAT_BREEDS array
- [ ] All cats have `environment` property
- [ ] IDs 1-40 are sequential
- [ ] Rarity distribution: 16 common, 12 uncommon, 8 rare, 3 epic, 1 legendary
- [ ] Each environment has exactly 8 cats
- [ ] environments.js catIds arrays match cat environments
- [ ] No syntax errors in catData.js

## Testing Commands

```bash
# Check cat count
Select-String -Path catData.js -Pattern "^\s+id:" | Measure-Object | Select-Object Count

# Check environment properties
Select-String -Path catData.js -Pattern "environment:" | Measure-Object | Select-Object Count

# Check for syntax errors
node -c catData.js
```

---

**Next**: Once Step 2 is complete, proceed to Step 3 (Game Logic Integration)
