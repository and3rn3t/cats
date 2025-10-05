/**
 * Rarity Milestone Rewards System
 * Rewards players for completing full rarity tiers
 * @module milestones
 */

// Milestone definitions
const RARITY_MILESTONES = [
    {
        id: 'all_common',
        name: 'Common Cat Collector',
        description: 'Collect all Common cats',
        icon: '🥉',
        rarity: 'common',
        reward: {
            type: 'energy',
            amount: 50,
            message: '+50 Energy Bonus!'
        },
        requirement: (state) => checkAllCatsOfRarity(state, 'common')
    },
    {
        id: 'all_uncommon',
        name: 'Uncommon Cat Master',
        description: 'Collect all Uncommon cats',
        icon: '🥈',
        rarity: 'uncommon',
        reward: {
            type: 'energy',
            amount: 75,
            message: '+75 Energy Bonus!'
        },
        requirement: (state) => checkAllCatsOfRarity(state, 'uncommon')
    },
    {
        id: 'all_rare',
        name: 'Rare Cat Expert',
        description: 'Collect all Rare cats',
        icon: '🥇',
        rarity: 'rare',
        reward: {
            type: 'energy',
            amount: 100,
            message: '+100 Energy Bonus & New Achievement!'
        },
        requirement: (state) => checkAllCatsOfRarity(state, 'rare')
    },
    {
        id: 'all_epic',
        name: 'Epic Cat Champion',
        description: 'Collect all Epic cats',
        icon: '💎',
        rarity: 'epic',
        reward: {
            type: 'energy',
            amount: 150,
            message: '+150 Energy Bonus!'
        },
        requirement: (state) => checkAllCatsOfRarity(state, 'epic')
    },
    {
        id: 'all_legendary',
        name: 'Legendary Cat Guardian',
        description: 'Collect all Legendary cats',
        icon: '👑',
        rarity: 'legendary',
        reward: {
            type: 'special',
            amount: 200,
            message: '+200 Energy & Ultimate Title Unlocked!'
        },
        requirement: (state) => checkAllCatsOfRarity(state, 'legendary')
    }
];

/**
 * Check if player has collected all cats of a specific rarity
 * @param {Object} state - Game state
 * @param {string} rarity - Rarity tier to check
 * @returns {boolean} True if all cats of rarity are collected
 */
function checkAllCatsOfRarity(state, rarity) {
    if (!window.CAT_BREEDS) return false;
    
    const catsOfRarity = window.CAT_BREEDS.filter(cat => cat.stats.rarity === rarity);
    const collectedOfRarity = catsOfRarity.filter(cat => state.collectedCats.has(cat.id));
    
    return catsOfRarity.length > 0 && collectedOfRarity.length === catsOfRarity.length;
}

/**
 * Get count of collected cats for a rarity tier
 * @param {Object} state - Game state
 * @param {string} rarity - Rarity tier
 * @returns {Object} Object with total and collected counts
 */
function getRarityProgress(state, rarity) {
    if (!window.CAT_BREEDS) return { total: 0, collected: 0 };
    
    const catsOfRarity = window.CAT_BREEDS.filter(cat => cat.stats.rarity === rarity);
    const collectedOfRarity = catsOfRarity.filter(cat => state.collectedCats.has(cat.id));
    
    return {
        total: catsOfRarity.length,
        collected: collectedOfRarity.length,
        percentage: catsOfRarity.length > 0 ? Math.round((collectedOfRarity.length / catsOfRarity.length) * 100) : 0
    };
}

/**
 * Check for newly completed milestones and award rewards
 * @param {Object} state - Game state
 * @returns {Array} Array of newly completed milestones
 */
function checkMilestones(state) {
    if (!state.completedMilestones) {
        state.completedMilestones = new Set();
    }
    
    const newlyCompleted = [];
    
    RARITY_MILESTONES.forEach(milestone => {
        // Skip if already completed
        if (state.completedMilestones.has(milestone.id)) {
            return;
        }
        
        // Check if requirement is met
        if (milestone.requirement(state)) {
            // Mark as completed
            state.completedMilestones.add(milestone.id);
            
            // Award reward
            awardMilestoneReward(state, milestone);
            
            // Track for notification
            newlyCompleted.push(milestone);
            
            console.log('🎉 Milestone completed:', milestone.name);
        }
    });
    
    // Save state if milestones were completed
    if (newlyCompleted.length > 0 && typeof saveGameState === 'function') {
        saveGameState();
    }
    
    return newlyCompleted;
}

/**
 * Award milestone reward to player
 * @param {Object} state - Game state
 * @param {Object} milestone - Milestone object
 */
function awardMilestoneReward(state, milestone) {
    const reward = milestone.reward;
    
    switch (reward.type) {
        case 'energy':
        case 'special':
            // Add energy (cap at 100)
            const oldEnergy = state.playerEnergy;
            state.playerEnergy = Math.min(100, state.playerEnergy + reward.amount);
            const actualBonus = state.playerEnergy - oldEnergy;
            
            console.log(`⚡ Awarded ${actualBonus} energy (capped at 100)`);
            
            // Update UI if function exists
            if (typeof updatePlayerStats === 'function') {
                updatePlayerStats();
            }
            break;
            
        default:
            console.warn('Unknown reward type:', reward.type);
    }
}

/**
 * Show milestone completion notification
 * @param {Object} milestone - Completed milestone
 */
function showMilestoneNotification(milestone) {
    const notification = document.createElement('div');
    notification.className = 'milestone-notification';
    notification.innerHTML = `
        <div class="milestone-content">
            <div class="milestone-icon">${milestone.icon}</div>
            <div class="milestone-text">
                <h3>🎊 Milestone Complete!</h3>
                <h4>${milestone.name}</h4>
                <p>${milestone.description}</p>
                <p class="milestone-reward">${milestone.reward.message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Play animation if available
    if (typeof triggerConfetti === 'function') {
        triggerConfetti();
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 500);
    });
}

/**
 * Render milestones panel UI
 * @param {Object} state - Game state
 * @returns {string} HTML string for milestones panel
 */
function renderMilestonesPanel(state) {
    if (!state.completedMilestones) {
        state.completedMilestones = new Set();
    }
    
    let html = '<div class="milestones-panel">';
    html += '<h3>🏆 Rarity Milestones</h3>';
    html += '<p class="milestones-description">Complete full rarity tiers for special rewards!</p>';
    html += '<div class="milestones-grid">';
    
    RARITY_MILESTONES.forEach(milestone => {
        const isCompleted = state.completedMilestones.has(milestone.id);
        const progress = getRarityProgress(state, milestone.rarity);
        const rarityClass = `rarity-${milestone.rarity}`;
        
        html += `
            <div class="milestone-card ${rarityClass} ${isCompleted ? 'milestone-completed' : ''}">
                <div class="milestone-header">
                    <span class="milestone-icon-large">${milestone.icon}</span>
                    <h4>${milestone.name}</h4>
                </div>
                <p class="milestone-desc">${milestone.description}</p>
                <div class="milestone-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <div class="progress-text">
                        ${progress.collected} / ${progress.total} cats (${progress.percentage}%)
                    </div>
                </div>
                <div class="milestone-reward-display">
                    ${isCompleted ? 
                        '<span class="milestone-claimed">✅ Claimed!</span>' : 
                        '<span class="milestone-pending">🎁 ' + milestone.reward.message + '</span>'
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>'; // milestones-grid
    html += '</div>'; // milestones-panel
    
    return html;
}

/**
 * Add milestones section to achievements panel
 * @param {Object} state - Game state
 */
function addMilestonesToAchievements(state) {
    const achievementsPanel = document.getElementById('achievements-panel');
    if (!achievementsPanel) return;
    
    const achievementsContent = document.getElementById('achievements-content');
    if (!achievementsContent) return;
    
    // Check if milestones section already exists
    if (document.getElementById('milestones-section')) {
        // Update existing section
        const section = document.getElementById('milestones-section');
        section.innerHTML = renderMilestonesPanel(state);
        return;
    }
    
    // Create new milestones section
    const milestonesSection = document.createElement('div');
    milestonesSection.id = 'milestones-section';
    milestonesSection.className = 'milestones-section';
    milestonesSection.innerHTML = renderMilestonesPanel(state);
    
    // Insert at the top of achievements content
    achievementsContent.insertBefore(milestonesSection, achievementsContent.firstChild);
}

/**
 * Get total milestone completion percentage
 * @param {Object} state - Game state
 * @returns {number} Percentage of milestones completed (0-100)
 */
function getMilestoneCompletionPercentage(state) {
    if (!state.completedMilestones) {
        state.completedMilestones = new Set();
    }
    
    const total = RARITY_MILESTONES.length;
    const completed = state.completedMilestones.size;
    
    return Math.round((completed / total) * 100);
}

/**
 * Get summary of milestone progress
 * @param {Object} state - Game state
 * @returns {Object} Summary object
 */
function getMilestoneSummary(state) {
    if (!state.completedMilestones) {
        state.completedMilestones = new Set();
    }
    
    return {
        total: RARITY_MILESTONES.length,
        completed: state.completedMilestones.size,
        percentage: getMilestoneCompletionPercentage(state),
        rarityProgress: {
            common: getRarityProgress(state, 'common'),
            uncommon: getRarityProgress(state, 'uncommon'),
            rare: getRarityProgress(state, 'rare'),
            epic: getRarityProgress(state, 'epic'),
            legendary: getRarityProgress(state, 'legendary')
        }
    };
}

/**
 * Initialize milestone system
 * @param {Object} state - Game state
 */
function initMilestones(state) {
    // Ensure completedMilestones set exists
    if (!state.completedMilestones) {
        state.completedMilestones = new Set();
    }
    
    // Convert array to Set if needed (for save compatibility)
    if (Array.isArray(state.completedMilestones)) {
        state.completedMilestones = new Set(state.completedMilestones);
    }
    
    console.log('✅ Milestone system initialized');
}

// Export functions
if (typeof window !== 'undefined') {
    window.checkMilestones = checkMilestones;
    window.showMilestoneNotification = showMilestoneNotification;
    window.renderMilestonesPanel = renderMilestonesPanel;
    window.addMilestonesToAchievements = addMilestonesToAchievements;
    window.getMilestoneSummary = getMilestoneSummary;
    window.getMilestoneCompletionPercentage = getMilestoneCompletionPercentage;
    window.initMilestones = initMilestones;
    window.getRarityProgress = getRarityProgress;
    window.RARITY_MILESTONES = RARITY_MILESTONES;
}
