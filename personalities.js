/**
 * Cat Personality Traits System
 * Adds unique personalities to cats and affects encounter success rates
 * @module personalities
 */

// Personality trait definitions
const PERSONALITY_TRAITS = {
    shy: {
        name: 'Shy',
        icon: '😟',
        description: 'Nervous around strangers. Observe works best.',
        modifiers: {
            approach: -15,  // Less effective
            treat: 0,       // Neutral
            observe: +20    // More effective
        },
        color: '#9575cd'
    },
    playful: {
        name: 'Playful',
        icon: '🎾',
        description: 'Loves games and treats! Treats work best.',
        modifiers: {
            approach: +5,
            treat: +20,     // More effective
            observe: -10
        },
        color: '#42a5f5'
    },
    curious: {
        name: 'Curious',
        icon: '🔍',
        description: 'Investigates everything. All approaches work well.',
        modifiers: {
            approach: +10,
            treat: +10,
            observe: +10    // Balanced
        },
        color: '#66bb6a'
    },
    lazy: {
        name: 'Lazy',
        icon: '😴',
        description: 'Low energy, easy to approach. Treats work well.',
        modifiers: {
            approach: +15,  // More effective
            treat: +10,
            observe: 0
        },
        color: '#ffa726'
    },
    energetic: {
        name: 'Energetic',
        icon: '⚡',
        description: 'Full of energy! Needs patience to approach.',
        modifiers: {
            approach: -10,
            treat: +15,
            observe: +5
        },
        color: '#ef5350'
    },
    friendly: {
        name: 'Friendly',
        icon: '🤗',
        description: 'Loves everyone! Approach works best.',
        modifiers: {
            approach: +20,  // More effective
            treat: +10,
            observe: 0
        },
        color: '#26a69a'
    },
    independent: {
        name: 'Independent',
        icon: '🦁',
        description: 'Likes their space. Observe from distance.',
        modifiers: {
            approach: -10,
            treat: 0,
            observe: +15    // More effective
        },
        color: '#8d6e63'
    },
    affectionate: {
        name: 'Affectionate',
        icon: '💕',
        description: 'Seeks love and cuddles. Approach works great!',
        modifiers: {
            approach: +18,
            treat: +8,
            observe: -5
        },
        color: '#ec407a'
    }
};

// Assign personality traits to each cat breed
const CAT_PERSONALITIES = {
    // FOREST
    1: 'lazy',           // Persian - lazy and laid-back
    3: 'friendly',       // Maine Coon - dog-like and friendly
    7: 'affectionate',   // Ragdoll - extremely docile
    11: 'independent',   // Norwegian Forest Cat - independent hunter
    12: 'affectionate',  // Birman - gentle and social
    18: 'shy',           // Chartreux - quiet and observant
    22: 'playful',       // Japanese Bobtail - talkative and playful
    26: 'independent',   // European Wildcat - wild and independent
    
    // MOUNTAIN
    10: 'shy',           // Russian Blue - reserved
    13: 'energetic',     // Turkish Angora - loves to perform
    23: 'lazy',          // Himalayan - gentle and low energy
    27: 'independent',   // Siberian - powerful and independent
    28: 'friendly',      // Scottish Fold - sweet disposition
    31: 'playful',       // Manx - dog-like playfulness
    35: 'curious',       // Pallas's Cat - observant
    40: 'shy',           // Snow Leopard - elusive
    
    // DESERT
    2: 'curious',        // Siamese - intelligent and talkative
    5: 'lazy',           // British Shorthair - calm and easygoing
    14: 'energetic',     // Abyssinian - active and playful
    19: 'playful',       // Devon Rex - mischievous and playful
    20: 'independent',   // Egyptian Mau - alert and active
    24: 'friendly',      // Burmese - people-oriented
    29: 'energetic',     // Singapura - active despite size
    33: 'independent',   // Sand Cat - wild desert hunter
    
    // CITY
    4: 'affectionate',   // Sphynx - extroverted and loving
    6: 'curious',        // Bengal - active and inquisitive
    8: 'shy',            // Scottish Fold variant - gentle
    15: 'energetic',     // Cornish Rex - athletic and acrobatic
    21: 'playful',       // Tonkinese - dog-like and playful
    25: 'friendly',      // Exotic Shorthair - calm and friendly
    30: 'curious',       // Ocicat - smart and dog-like
    37: 'playful',       // Feral City Cat - street smart
    
    // BEACH
    9: 'friendly',       // American Shorthair - good-natured
    16: 'energetic',     // Somali - lively and active
    17: 'curious',       // Oriental Shorthair - intelligent
    32: 'playful',       // LaPerm - clownish and affectionate
    34: 'friendly',      // Fishing Cat - semi-aquatic
    36: 'lazy',          // Selkirk Rex - patient and laid-back
    38: 'independent',   // Margay - wild and arboreal
    39: 'curious'        // Jaguarundi - unusual cat
};

/**
 * Get personality trait for a cat
 * @param {number} catId - Cat ID
 * @returns {Object} Personality trait object
 */
function getCatPersonality(catId) {
    const personalityKey = CAT_PERSONALITIES[catId] || 'curious'; // Default to curious
    return {
        key: personalityKey,
        ...PERSONALITY_TRAITS[personalityKey]
    };
}

/**
 * Get personality modifier for an action
 * @param {number} catId - Cat ID
 * @param {string} action - Action type (approach, treat, observe)
 * @returns {number} Modifier value (-20 to +20)
 */
function getPersonalityModifier(catId, action) {
    const personality = getCatPersonality(catId);
    return personality.modifiers[action] || 0;
}

/**
 * Apply personality modifier to success rate
 * @param {number} baseSuccessRate - Base success rate (0-100)
 * @param {number} catId - Cat ID
 * @param {string} action - Action type
 * @returns {number} Modified success rate (0-100)
 */
function applyPersonalityModifier(baseSuccessRate, catId, action) {
    const modifier = getPersonalityModifier(catId, action);
    const modifiedRate = baseSuccessRate + modifier;
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, modifiedRate));
}

/**
 * Get personality description for display in cat details
 * @param {number} catId - Cat ID
 * @returns {string} HTML string with personality info
 */
function getPersonalityDisplay(catId) {
    const personality = getCatPersonality(catId);
    
    return `
        <div class="personality-trait" style="border-color: ${personality.color}">
            <span class="personality-icon">${personality.icon}</span>
            <div class="personality-info">
                <strong>${personality.name}</strong>
                <p>${personality.description}</p>
            </div>
        </div>
    `;
}

/**
 * Get all cats with a specific personality
 * @param {string} personalityKey - Personality key (shy, playful, etc.)
 * @returns {Array} Array of cat IDs
 */
function getCatsWithPersonality(personalityKey) {
    return Object.entries(CAT_PERSONALITIES)
        .filter(([id, personality]) => personality === personalityKey)
        .map(([id]) => parseInt(id));
}

/**
 * Count collected cats with a specific personality
 * @param {Object} state - Game state
 * @param {string} personalityKey - Personality key
 * @returns {number} Count of collected cats
 */
function countCollectedWithPersonality(state, personalityKey) {
    const catsWithPersonality = getCatsWithPersonality(personalityKey);
    return catsWithPersonality.filter(catId => state.collectedCats.has(catId)).length;
}

/**
 * Get personality statistics for the player
 * @param {Object} state - Game state
 * @returns {Object} Statistics object
 */
function getPersonalityStats(state) {
    const stats = {};
    
    Object.keys(PERSONALITY_TRAITS).forEach(key => {
        const total = getCatsWithPersonality(key).length;
        const collected = countCollectedWithPersonality(state, key);
        
        stats[key] = {
            name: PERSONALITY_TRAITS[key].name,
            icon: PERSONALITY_TRAITS[key].icon,
            total,
            collected,
            percentage: total > 0 ? Math.round((collected / total) * 100) : 0
        };
    });
    
    return stats;
}

/**
 * Render personality filter UI
 * @returns {string} HTML string for personality filter
 */
function renderPersonalityFilter() {
    let html = '<div class="personality-filter">';
    html += '<h4>🎭 Filter by Personality</h4>';
    html += '<div class="personality-buttons">';
    
    html += '<button class="filter-btn active" onclick="filterByPersonality(\'all\')" data-personality="all">All Cats</button>';
    
    Object.entries(PERSONALITY_TRAITS).forEach(([key, trait]) => {
        const count = getCatsWithPersonality(key).length;
        html += `
            <button class="filter-btn" 
                    onclick="filterByPersonality('${key}')" 
                    data-personality="${key}"
                    style="border-color: ${trait.color}">
                ${trait.icon} ${trait.name} (${count})
            </button>
        `;
    });
    
    html += '</div>';
    html += '</div>';
    
    return html;
}

/**
 * Filter collection view by personality
 * @param {string} personalityKey - Personality to filter by ('all' for no filter)
 */
function filterByPersonality(personalityKey) {
    const catCards = document.querySelectorAll('.cat-card');
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-personality') === personalityKey) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide cards
    catCards.forEach(card => {
        const catId = parseInt(card.getAttribute('data-cat-id'));
        const catPersonality = CAT_PERSONALITIES[catId];
        
        if (personalityKey === 'all' || catPersonality === personalityKey) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Render personality statistics panel
 * @param {Object} state - Game state
 * @returns {string} HTML string for statistics panel
 */
function renderPersonalityStats(state) {
    const stats = getPersonalityStats(state);
    
    let html = '<div class="personality-stats-panel">';
    html += '<h3>🎭 Personality Collection</h3>';
    html += '<p class="panel-description">Collect cats with different personalities!</p>';
    html += '<div class="personality-stats-grid">';
    
    Object.entries(stats).forEach(([key, data]) => {
        const trait = PERSONALITY_TRAITS[key];
        html += `
            <div class="personality-stat-card" style="border-left: 4px solid ${trait.color}">
                <div class="personality-stat-header">
                    <span class="personality-icon-large">${data.icon}</span>
                    <h4>${data.name}</h4>
                </div>
                <div class="personality-stat-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${data.percentage}%; background: ${trait.color}"></div>
                    </div>
                    <div class="progress-text">${data.collected} / ${data.total} (${data.percentage}%)</div>
                </div>
                <p class="personality-hint">${trait.description}</p>
            </div>
        `;
    });
    
    html += '</div>';
    html += '</div>';
    
    return html;
}

/**
 * Add personality achievements
 * @returns {Array} Array of personality-based achievements
 */
function getPersonalityAchievements() {
    return [
        {
            id: 'personality_shy_master',
            name: 'Shy Cat Whisperer',
            description: 'Collect all Shy cats',
            icon: '😟',
            requirement: (state) => {
                const total = getCatsWithPersonality('shy').length;
                const collected = countCollectedWithPersonality(state, 'shy');
                return total > 0 && collected === total;
            },
            rarity: 'uncommon'
        },
        {
            id: 'personality_playful_master',
            name: 'Play Master',
            description: 'Collect all Playful cats',
            icon: '🎾',
            requirement: (state) => {
                const total = getCatsWithPersonality('playful').length;
                const collected = countCollectedWithPersonality(state, 'playful');
                return total > 0 && collected === total;
            },
            rarity: 'uncommon'
        },
        {
            id: 'personality_energetic_master',
            name: 'Energy Champion',
            description: 'Collect all Energetic cats',
            icon: '⚡',
            requirement: (state) => {
                const total = getCatsWithPersonality('energetic').length;
                const collected = countCollectedWithPersonality(state, 'energetic');
                return total > 0 && collected === total;
            },
            rarity: 'uncommon'
        },
        {
            id: 'personality_variety',
            name: 'Personality Expert',
            description: 'Collect at least one cat of each personality type',
            icon: '🎭',
            requirement: (state) => {
                return Object.keys(PERSONALITY_TRAITS).every(key => 
                    countCollectedWithPersonality(state, key) > 0
                );
            },
            rarity: 'rare'
        },
        {
            id: 'personality_collector',
            name: 'Psychology Master',
            description: 'Collect all cats of 3 complete personality types',
            icon: '🧠',
            requirement: (state) => {
                let completeCount = 0;
                Object.keys(PERSONALITY_TRAITS).forEach(key => {
                    const total = getCatsWithPersonality(key).length;
                    const collected = countCollectedWithPersonality(state, key);
                    if (total > 0 && collected === total) {
                        completeCount++;
                    }
                });
                return completeCount >= 3;
            },
            rarity: 'epic'
        }
    ];
}

/**
 * Initialize personality system
 */
function initPersonalities() {
    console.log('✅ Personality system initialized');
    console.log('📊 Personality traits:', Object.keys(PERSONALITY_TRAITS).length);
    console.log('🐱 Cats with personalities:', Object.keys(CAT_PERSONALITIES).length);
}

// Export functions
if (typeof window !== 'undefined') {
    window.getCatPersonality = getCatPersonality;
    window.getPersonalityModifier = getPersonalityModifier;
    window.applyPersonalityModifier = applyPersonalityModifier;
    window.getPersonalityDisplay = getPersonalityDisplay;
    window.getCatsWithPersonality = getCatsWithPersonality;
    window.getPersonalityStats = getPersonalityStats;
    window.renderPersonalityFilter = renderPersonalityFilter;
    window.filterByPersonality = filterByPersonality;
    window.renderPersonalityStats = renderPersonalityStats;
    window.getPersonalityAchievements = getPersonalityAchievements;
    window.initPersonalities = initPersonalities;
    window.PERSONALITY_TRAITS = PERSONALITY_TRAITS;
    window.CAT_PERSONALITIES = CAT_PERSONALITIES;
}
