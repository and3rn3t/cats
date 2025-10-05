/**
 * Achievements System for Cat Collector
 * Tracks player milestones and rewards exploration
 */

// Achievement definitions
const ACHIEVEMENTS = [
    {
        id: 'first_cat',
        name: 'First Friend',
        description: 'Collect your first cat',
        icon: '🐱',
        requirement: (state) => state.collectedCats.size >= 1,
        rarity: 'common'
    },
    {
        id: 'five_cats',
        name: 'Growing Collection',
        description: 'Collect 5 different cats',
        icon: '🎉',
        requirement: (state) => state.collectedCats.size >= 5,
        rarity: 'common'
    },
    {
        id: 'ten_cats',
        name: 'Cat Enthusiast',
        description: 'Collect 10 different cats',
        icon: '⭐',
        requirement: (state) => state.collectedCats.size >= 10,
        rarity: 'uncommon'
    },
    {
        id: 'fifteen_cats',
        name: 'Dedicated Collector',
        description: 'Collect 15 different cats',
        icon: '🌟',
        requirement: (state) => state.collectedCats.size >= 15,
        rarity: 'rare'
    },
    {
        id: 'twenty_cats',
        name: 'Master Collector',
        description: 'Collect 20 different cats',
        icon: '💫',
        requirement: (state) => state.collectedCats.size >= 20,
        rarity: 'epic'
    },
    {
        id: 'twentyfive_cats',
        name: 'Elite Collector',
        description: 'Collect 25 different cats',
        icon: '🌠',
        requirement: (state) => state.collectedCats.size >= 25,
        rarity: 'epic'
    },
    {
        id: 'thirty_cats',
        name: 'Grand Master',
        description: 'Collect 30 different cats',
        icon: '✨',
        requirement: (state) => state.collectedCats.size >= 30,
        rarity: 'legendary'
    },
    {
        id: 'all_cats',
        name: 'Cat Master Supreme',
        description: 'Collect all 40 cats!',
        icon: '👑',
        requirement: (state) => state.collectedCats.size >= 40,
        rarity: 'legendary'
    },
    {
        id: 'first_common',
        name: 'Common Starter',
        description: 'Collect your first common cat',
        icon: '🥉',
        requirement: (state) => hasCatOfRarity(state, 'common'),
        rarity: 'common'
    },
    {
        id: 'first_uncommon',
        name: 'Uncommon Find',
        description: 'Collect your first uncommon cat',
        icon: '🥈',
        requirement: (state) => hasCatOfRarity(state, 'uncommon'),
        rarity: 'uncommon'
    },
    {
        id: 'first_rare',
        name: 'Rare Discovery',
        description: 'Collect your first rare cat',
        icon: '🥇',
        requirement: (state) => hasCatOfRarity(state, 'rare'),
        rarity: 'rare'
    },
    {
        id: 'first_epic',
        name: 'Epic Hunter',
        description: 'Collect your first epic cat',
        icon: '💎',
        requirement: (state) => hasCatOfRarity(state, 'epic'),
        rarity: 'epic'
    },
    {
        id: 'first_legendary',
        name: 'Legendary Finder',
        description: 'Collect your first legendary cat',
        icon: '🔱',
        requirement: (state) => hasCatOfRarity(state, 'legendary'),
        rarity: 'legendary'
    },
    {
        id: 'explorer_10',
        name: 'Casual Explorer',
        description: 'Complete 10 explorations',
        icon: '🗺️',
        requirement: (state) => (state.explorationCount || 0) >= 10,
        rarity: 'common'
    },
    {
        id: 'explorer_50',
        name: 'Seasoned Explorer',
        description: 'Complete 50 explorations',
        icon: '🧭',
        requirement: (state) => (state.explorationCount || 0) >= 50,
        rarity: 'uncommon'
    },
    {
        id: 'explorer_100',
        name: 'Expert Explorer',
        description: 'Complete 100 explorations',
        icon: '🏔️',
        requirement: (state) => (state.explorationCount || 0) >= 100,
        rarity: 'rare'
    },
    {
        id: 'first_success',
        name: 'Natural Charm',
        description: 'Successfully befriend a cat on your first try',
        icon: '💚',
        requirement: (state) => (state.firstTrySuccesses || 0) >= 1,
        rarity: 'uncommon'
    },
    {
        id: 'patient_observer',
        name: 'Patient Observer',
        description: 'Use observe action 20 times',
        icon: '👁️',
        requirement: (state) => (state.observeCount || 0) >= 20,
        rarity: 'uncommon'
    },
    {
        id: 'treat_master',
        name: 'Treat Master',
        description: 'Successfully offer treats 15 times',
        icon: '🍖',
        requirement: (state) => (state.treatSuccesses || 0) >= 15,
        rarity: 'uncommon'
    },
    {
        id: 'gentle_soul',
        name: 'Gentle Soul',
        description: 'Use gentle approach 25 times',
        icon: '🤝',
        requirement: (state) => (state.approachCount || 0) >= 25,
        rarity: 'uncommon'
    },
    {
        id: 'full_energy',
        name: 'Well Rested',
        description: 'Reach maximum energy (100)',
        icon: '⚡',
        requirement: (state) => state.playerEnergy >= 100,
        rarity: 'common'
    },
    {
        id: 'speedrun',
        name: 'Speed Collector',
        description: 'Collect 10 cats in under 10 minutes',
        icon: '⏱️',
        requirement: (state) => checkSpeedrun(state),
        rarity: 'epic'
    },
    {
        id: 'continent_collector',
        name: 'World Traveler',
        description: 'Collect cats from 5 different continents',
        icon: '🌍',
        requirement: (state) => checkContinents(state) >= 5,
        rarity: 'rare'
    },
    // Environment Unlock Achievements
    {
        id: 'unlock_mountain',
        name: 'Peak Explorer',
        description: 'Unlock the Snowy Peaks environment',
        icon: '⛰️',
        requirement: (state) => state.unlockedEnvironments?.has('mountain') || false,
        rarity: 'uncommon'
    },
    {
        id: 'unlock_desert',
        name: 'Desert Wanderer',
        description: 'Unlock the Golden Sands environment',
        icon: '🏜️',
        requirement: (state) => state.unlockedEnvironments?.has('desert') || false,
        rarity: 'rare'
    },
    {
        id: 'unlock_city',
        name: 'Urban Explorer',
        description: 'Unlock the Urban Jungle environment',
        icon: '🏙️',
        requirement: (state) => state.unlockedEnvironments?.has('city') || false,
        rarity: 'rare'
    },
    {
        id: 'unlock_beach',
        name: 'Beach Comber',
        description: 'Unlock the Tropical Paradise environment',
        icon: '🏖️',
        requirement: (state) => state.unlockedEnvironments?.has('beach') || false,
        rarity: 'epic'
    },
    // Environment Collection Achievements
    {
        id: 'forest_complete',
        name: 'Forest Guardian',
        description: 'Collect all cats from the Mystic Forest',
        icon: '🌲',
        requirement: (state) => checkEnvironmentComplete(state, 'forest'),
        rarity: 'rare'
    },
    {
        id: 'mountain_complete',
        name: 'Mountain Master',
        description: 'Collect all cats from the Snowy Peaks',
        icon: '🏔️',
        requirement: (state) => checkEnvironmentComplete(state, 'mountain'),
        rarity: 'rare'
    },
    {
        id: 'desert_complete',
        name: 'Desert Sultan',
        description: 'Collect all cats from the Golden Sands',
        icon: '🏜️',
        requirement: (state) => checkEnvironmentComplete(state, 'desert'),
        rarity: 'epic'
    },
    {
        id: 'city_complete',
        name: 'City Legend',
        description: 'Collect all cats from the Urban Jungle',
        icon: '🏙️',
        requirement: (state) => checkEnvironmentComplete(state, 'city'),
        rarity: 'epic'
    },
    {
        id: 'beach_complete',
        name: 'Beach Boss',
        description: 'Collect all cats from the Tropical Paradise',
        icon: '🏖️',
        requirement: (state) => checkEnvironmentComplete(state, 'beach'),
        rarity: 'epic'
    },
    // Mini-Game Achievements
    {
        id: 'minigame_novice',
        name: 'Game Enthusiast',
        description: 'Play 10 mini-games',
        icon: '🎮',
        requirement: (state) => (state.minigamesPlayed || 0) >= 10,
        rarity: 'common'
    },
    {
        id: 'minigame_expert',
        name: 'Mini-Game Master',
        description: 'Play 50 mini-games',
        icon: '🕹️',
        requirement: (state) => (state.minigamesPlayed || 0) >= 50,
        rarity: 'uncommon'
    },
    {
        id: 'high_scorer',
        name: 'High Scorer',
        description: 'Get a high score of 10+ in any mini-game',
        icon: '🏅',
        requirement: (state) => checkAnyHighScore(state, 10),
        rarity: 'rare'
    },
    {
        id: 'perfect_memory',
        name: 'Perfect Memory',
        description: 'Reach level 10 in Follow the Treat',
        icon: '🧠',
        requirement: (state) => checkMinigameHighScore(state, 'followTheTreat', 10),
        rarity: 'epic'
    },
    {
        id: 'toy_master',
        name: 'Lightning Reflexes',
        description: 'Score 30+ in Cat Toy Chase',
        icon: '⚡',
        requirement: (state) => checkMinigameHighScore(state, 'catToyChase', 30),
        rarity: 'rare'
    },
    {
        id: 'seeker_pro',
        name: 'Hide & Seek Pro',
        description: 'Score 100+ in Hide and Seek',
        icon: '🔍',
        requirement: (state) => checkMinigameHighScore(state, 'hideAndSeek', 100),
        rarity: 'epic'
    }
];

/**
 * Check if player has collected a cat of specific rarity
 * @param {Object} state - Game state
 * @param {string} rarity - Rarity to check
 * @returns {boolean}
 */
function hasCatOfRarity(state, rarity) {
    if (!window.CAT_BREEDS) return false;
    
    const collectedCatObjects = CAT_BREEDS.filter(cat => 
        state.collectedCats.has(cat.id)
    );
    
    return collectedCatObjects.some(cat => 
        cat.stats && cat.stats.rarity === rarity
    );
}

/**
 * Check speedrun achievement
 * @param {Object} state - Game state
 * @returns {boolean}
 */
function checkSpeedrun(state) {
    if (!state.gameStartTime || !state.tenthCatTime) return false;
    const timeDiff = state.tenthCatTime - state.gameStartTime;
    return timeDiff < 10 * 60 * 1000; // 10 minutes in milliseconds
}

/**
 * Check number of unique continents
 * @param {Object} state - Game state
 * @returns {number}
 */
function checkContinents(state) {
    if (!window.CAT_BREEDS) return 0;
    
    const collectedCatObjects = CAT_BREEDS.filter(cat => 
        state.collectedCats.has(cat.id)
    );
    
    const continents = new Set();
    const continentMap = {
        'Egypt': 'Africa',
        'Thailand': 'Asia',
        'Turkey': 'Asia',
        'Russia': 'Asia',
        'United States': 'North America',
        'United Kingdom': 'Europe',
        'Norway': 'Europe',
        'Scotland': 'Europe',
        'Isle of Man': 'Europe',
        'Canada': 'North America',
        'Somalia': 'Africa',
        'Burma': 'Asia',
        'Japan': 'Asia',
        'Persia': 'Asia',
        'Mediterranean': 'Europe',
        'Southeast Asia': 'Asia',
        'Cyprus': 'Asia'
    };
    
    collectedCatObjects.forEach(cat => {
        if (cat.origin && continentMap[cat.origin]) {
            continents.add(continentMap[cat.origin]);
        }
    });
    
    return continents.size;
}

/**
 * Check if all cats from a specific environment are collected
 * @param {Object} state - Game state
 * @param {string} environmentId - Environment ID to check
 * @returns {boolean}
 */
function checkEnvironmentComplete(state, environmentId) {
    if (!window.CAT_BREEDS || !window.ENVIRONMENTS) return false;
    
    const env = window.ENVIRONMENTS[environmentId];
    if (!env?.catIds) return false;
    
    // Check if all cats from this environment are collected
    return env.catIds.every(catId => state.collectedCats.has(catId));
}

/**
 * Check if any mini-game high score meets or exceeds threshold
 * @param {Object} state - Game state
 * @param {number} threshold - Minimum score required
 * @returns {boolean}
 */
function checkAnyHighScore(state, threshold) {
    if (!state.minigameHighScores) return false;
    
    const scores = state.minigameHighScores;
    return (scores.followTheTreat >= threshold) ||
           (scores.catToyChase >= threshold) ||
           (scores.hideAndSeek >= threshold);
}

/**
 * Check specific mini-game high score
 * @param {Object} state - Game state
 * @param {string} gameName - Name of the mini-game
 * @param {number} threshold - Minimum score required
 * @returns {boolean}
 */
function checkMinigameHighScore(state, gameName, threshold) {
    if (!state.minigameHighScores) return false;
    return (state.minigameHighScores[gameName] || 0) >= threshold;
}

/**
 * Check which achievements have been unlocked
 * @param {Object} state - Game state
 * @returns {Array} Array of unlocked achievement IDs
 */
function checkAchievements(state) {
    const unlocked = [];
    
    // Check standard achievements
    ACHIEVEMENTS.forEach(achievement => {
        try {
            if (achievement.requirement(state)) {
                unlocked.push(achievement.id);
            }
        } catch (error) {
            console.error(`Error checking achievement ${achievement.id}:`, error);
        }
    });
    
    // Check personality achievements (v2.9.0)
    if (window.getPersonalityAchievements) {
        const personalityAchievements = getPersonalityAchievements();
        personalityAchievements.forEach(achievement => {
            try {
                if (achievement.requirement(state)) {
                    unlocked.push(achievement.id);
                }
            } catch (error) {
                console.error(`Error checking personality achievement ${achievement.id}:`, error);
            }
        });
    }
    
    return unlocked;
}

/**
 * Show achievement notification
 * @param {Object} achievement - Achievement object
 */
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = `achievement-notification ${achievement.rarity}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
            <div class="achievement-title">Achievement Unlocked!</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Add celebration effects (Phase 4.1)
    if (window.createParticlesOnElement) {
        createParticlesOnElement(notification, '⭐', 5);
    }
    
    // Special effects for rare achievements
    if (achievement.rarity === 'legendary') {
        if (window.createConfetti) {
            createConfetti(3000);
        }
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

/**
 * Update achievements and show new ones
 * @param {Object} state - Game state
 */
function updateAchievements(state) {
    // Initialize unlockedAchievements if not exists
    if (!state.unlockedAchievements) {
        state.unlockedAchievements = new Set();
    }
    
    const currentUnlocked = checkAchievements(state);
    
    // Check for newly unlocked achievements
    currentUnlocked.forEach(achievementId => {
        if (!state.unlockedAchievements.has(achievementId)) {
            state.unlockedAchievements.add(achievementId);
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (achievement) {
                showAchievementNotification(achievement);
            }
        }
    });
    
    // Render achievements panel
    renderAchievementsPanel(state);
}

/**
 * Render achievements panel in the UI
 * @param {Object} state - Game state
 */
function renderAchievementsPanel(state) {
    const content = document.getElementById('achievements-content');
    if (!content) return;
    
    // Add milestones section at the top (v2.9.0)
    if (window.addMilestonesToAchievements) {
        addMilestonesToAchievements(state);
    }
    
    // Add personality stats section (v2.9.0)
    if (window.renderPersonalityStats) {
        const personalitySection = document.createElement('div');
        personalitySection.id = 'personality-stats-section';
        personalitySection.innerHTML = renderPersonalityStats(state);
        
        // Check if section already exists
        const existing = document.getElementById('personality-stats-section');
        if (existing) {
            existing.innerHTML = personalitySection.innerHTML;
        } else {
            content.insertBefore(personalitySection, content.firstChild);
        }
    }
    
    const unlockedAchievements = state.unlockedAchievements || new Set();
    
    // Merge personality achievements (v2.9.0)
    let allAchievements = [...ACHIEVEMENTS];
    if (window.getPersonalityAchievements) {
        allAchievements = [...allAchievements, ...getPersonalityAchievements()];
    }
    
    const totalAchievements = allAchievements.length;
    const unlockedCount = unlockedAchievements.size;
    
    // Find or create achievements container
    let achievementsContainer = document.getElementById('standard-achievements');
    if (!achievementsContainer) {
        achievementsContainer = document.createElement('div');
        achievementsContainer.id = 'standard-achievements';
        content.appendChild(achievementsContainer);
    }
    
    let html = `
        <h3 style="margin-top: 2em;">🏆 Achievements</h3>
        <div class="achievements-header">
            <p class="achievement-progress">${unlockedCount} / ${totalAchievements} Unlocked</p>
        </div>
        <div class="achievements-grid">
    `;
    
    allAchievements.forEach(achievement => {
        const isUnlocked = unlockedAchievements.has(achievement.id);
        const lockedClass = isUnlocked ? '' : 'locked';
        const icon = isUnlocked ? achievement.icon : '🔒';
        
        html += `
            <div class="achievement-card ${lockedClass} ${achievement.rarity}" 
                 title="${achievement.description}"
                 aria-label="${isUnlocked ? 'Unlocked: ' : 'Locked: '} ${achievement.name}">
                <div class="achievement-card-icon">${icon}</div>
                <div class="achievement-card-name">${achievement.name}</div>
            </div>
        `;
    });
    
    html += '</div>';
    achievementsContainer.innerHTML = html;
}

// Expose functions globally
window.checkAchievements = checkAchievements;
window.updateAchievements = updateAchievements;
window.showAchievementNotification = showAchievementNotification;
window.renderAchievementsPanel = renderAchievementsPanel;
window.ACHIEVEMENTS = ACHIEVEMENTS;
