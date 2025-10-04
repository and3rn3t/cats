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
        id: 'all_cats',
        name: 'Cat Master',
        description: 'Collect all 25 cats!',
        icon: '👑',
        requirement: (state) => state.collectedCats.size >= 25,
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
 * Check which achievements have been unlocked
 * @param {Object} state - Game state
 * @returns {Array} Array of unlocked achievement IDs
 */
function checkAchievements(state) {
    const unlocked = [];
    
    ACHIEVEMENTS.forEach(achievement => {
        try {
            if (achievement.requirement(state)) {
                unlocked.push(achievement.id);
            }
        } catch (error) {
            console.error(`Error checking achievement ${achievement.id}:`, error);
        }
    });
    
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
    
    const unlockedAchievements = state.unlockedAchievements || new Set();
    const totalAchievements = ACHIEVEMENTS.length;
    const unlockedCount = unlockedAchievements.size;
    
    let html = `
        <div class="achievements-header">
            <p class="achievement-progress">${unlockedCount} / ${totalAchievements} Unlocked</p>
        </div>
        <div class="achievements-grid">
    `;
    
    ACHIEVEMENTS.forEach(achievement => {
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
    content.innerHTML = html;
}

// Expose functions globally
window.checkAchievements = checkAchievements;
window.updateAchievements = updateAchievements;
window.showAchievementNotification = showAchievementNotification;
window.renderAchievementsPanel = renderAchievementsPanel;
window.ACHIEVEMENTS = ACHIEVEMENTS;
