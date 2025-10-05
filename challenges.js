/**
 * Daily Challenges System for Cat Collector
 * Provides daily goals and rewards to encourage engagement
 * Version: 2.7.0
 */

// Challenge definitions
const CHALLENGE_TYPES = [
    {
        id: 'collect_cats',
        name: 'Cat Collector',
        description: 'Collect {count} cats today',
        icon: '🐱',
        difficulty: 'easy',
        variants: [
            { count: 1, reward: 20 },
            { count: 2, reward: 30 },
            { count: 3, reward: 50 }
        ]
    },
    {
        id: 'collect_rarity',
        name: 'Rarity Hunter',
        description: 'Collect a {rarity} cat today',
        icon: '⭐',
        difficulty: 'medium',
        variants: [
            { rarity: 'uncommon', reward: 30 },
            { rarity: 'rare', reward: 50 },
            { rarity: 'epic', reward: 70 }
        ]
    },
    {
        id: 'explore_count',
        name: 'Explorer',
        description: 'Explore {count} times today',
        icon: '🔍',
        difficulty: 'easy',
        variants: [
            { count: 3, reward: 20 },
            { count: 5, reward: 30 },
            { count: 10, reward: 50 }
        ]
    },
    {
        id: 'use_action',
        name: 'Strategy Master',
        description: 'Successfully use {action} {count} times today',
        icon: '🎯',
        difficulty: 'medium',
        variants: [
            { action: 'Approach', count: 2, reward: 30 },
            { action: 'Treat', count: 2, reward: 30 },
            { action: 'Observe', count: 2, reward: 30 }
        ]
    },
    {
        id: 'first_try_success',
        name: 'First Try Pro',
        description: 'Collect {count} cats on the first try today',
        icon: '🎯',
        difficulty: 'hard',
        variants: [
            { count: 1, reward: 40 },
            { count: 2, reward: 60 },
            { count: 3, reward: 80 }
        ]
    },
    {
        id: 'environment_visits',
        name: 'World Traveler',
        description: 'Explore {count} different environments today',
        icon: '🗺️',
        difficulty: 'medium',
        variants: [
            { count: 2, reward: 30 },
            { count: 3, reward: 50 },
            { count: 4, reward: 70 }
        ]
    },
    {
        id: 'play_minigames',
        name: 'Game Player',
        description: 'Play mini-games {count} times today',
        icon: '🎮',
        difficulty: 'easy',
        variants: [
            { count: 3, reward: 25 },
            { count: 5, reward: 40 },
            { count: 10, reward: 60 }
        ]
    },
    {
        id: 'perfect_streak',
        name: 'Perfect Streak',
        description: 'Collect {count} cats in a row without failing',
        icon: '🔥',
        difficulty: 'hard',
        variants: [
            { count: 2, reward: 50 },
            { count: 3, reward: 70 },
            { count: 5, reward: 100 }
        ]
    }
];

/**
 * Get today's date as a string (YYYY-MM-DD)
 * @returns {string} Date string
 */
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Initialize daily challenges in game state
 * @param {Object} state - Game state object
 */
function initializeChallenges(state) {
    if (!state.dailyChallenges) {
        state.dailyChallenges = {
            lastGeneratedDate: null,
            currentChallenges: [],
            completedToday: [],
            totalCompleted: 0,
            streak: 0,
            lastPlayedDate: null,
            // Progress tracking for today
            todayProgress: {
                catsCollected: 0,
                explorations: 0,
                firstTrySuccesses: 0,
                approachSuccesses: 0,
                treatSuccesses: 0,
                observeSuccesses: 0,
                environmentsVisited: new Set(),
                minigamesPlayed: 0,
                currentStreak: 0,
                collectedRarities: new Set()
            }
        };
    }
}

/**
 * Generate daily challenges
 * Creates 3 random challenges for the day with varying difficulty
 * @param {Object} state - Game state object
 */
function generateDailyChallenges(state) {
    const today = getTodayDateString();
    
    // Check if challenges need to be regenerated
    if (state.dailyChallenges.lastGeneratedDate === today) {
        return; // Already have today's challenges
    }
    
    console.log('🎯 Generating new daily challenges for', today);
    
    // Use date as seed for consistent daily challenges
    const seed = hashCode(today);
    const shuffled = [...CHALLENGE_TYPES].sort(() => seededRandom(seed) - 0.5);
    
    // Select 3 challenges with good variety
    const selectedTypes = shuffled.slice(0, 3);
    const challenges = selectedTypes.map((type, index) => {
        // Select a variant based on seed and index
        const variantIndex = Math.abs(seed + index) % type.variants.length;
        const variant = type.variants[variantIndex];
        
        return {
            id: `${type.id}_${today}_${index}`,
            type: type.id,
            name: type.name,
            description: formatChallengeDescription(type.description, variant),
            icon: type.icon,
            difficulty: type.difficulty,
            reward: variant.reward,
            progress: 0,
            required: getRequiredCount(variant),
            variant: variant,
            completed: false
        };
    });
    
    // Update state
    state.dailyChallenges.currentChallenges = challenges;
    state.dailyChallenges.lastGeneratedDate = today;
    state.dailyChallenges.completedToday = [];
    
    // Reset daily progress
    state.dailyChallenges.todayProgress = {
        catsCollected: 0,
        explorations: 0,
        firstTrySuccesses: 0,
        approachSuccesses: 0,
        treatSuccesses: 0,
        observeSuccesses: 0,
        environmentsVisited: new Set(),
        minigamesPlayed: 0,
        currentStreak: 0,
        collectedRarities: new Set()
    };
    
    // Update streak
    updateStreak(state);
    
    console.log('✅ Generated challenges:', challenges.map(c => c.name).join(', '));
}

/**
 * Format challenge description with variant data
 * @param {string} template - Description template
 * @param {Object} variant - Challenge variant
 * @returns {string} Formatted description
 */
function formatChallengeDescription(template, variant) {
    let description = template;
    for (const [key, value] of Object.entries(variant)) {
        description = description.replace(`{${key}}`, value);
    }
    return description;
}

/**
 * Get required count from variant
 * @param {Object} variant - Challenge variant
 * @returns {number} Required count
 */
function getRequiredCount(variant) {
    return variant.count || 1;
}

/**
 * Update challenge progress
 * @param {Object} state - Game state object
 * @param {string} eventType - Type of event that occurred
 * @param {Object} eventData - Additional event data
 */
function updateChallengeProgress(state, eventType, eventData = {}) {
    if (!state.dailyChallenges || !state.dailyChallenges.currentChallenges) {
        return;
    }
    
    const today = getTodayDateString();
    if (state.dailyChallenges.lastGeneratedDate !== today) {
        generateDailyChallenges(state);
    }
    
    const progress = state.dailyChallenges.todayProgress;
    const challenges = state.dailyChallenges.currentChallenges;
    
    // Update progress based on event type
    switch (eventType) {
        case 'cat_collected':
            progress.catsCollected++;
            if (eventData.rarity) {
                progress.collectedRarities.add(eventData.rarity);
            }
            if (eventData.firstTry) {
                progress.firstTrySuccesses++;
                progress.currentStreak++;
            } else {
                progress.currentStreak = 0;
            }
            break;
            
        case 'exploration':
            progress.explorations++;
            if (eventData.environment) {
                progress.environmentsVisited.add(eventData.environment);
            }
            break;
            
        case 'action_success':
            if (eventData.action === 'approach') {
                progress.approachSuccesses++;
            } else if (eventData.action === 'treat') {
                progress.treatSuccesses++;
            } else if (eventData.action === 'observe') {
                progress.observeSuccesses++;
            }
            break;
            
        case 'action_fail':
            progress.currentStreak = 0;
            break;
            
        case 'minigame_played':
            progress.minigamesPlayed++;
            break;
    }
    
    // Check each challenge for completion
    for (const challenge of challenges) {
        if (challenge.completed) continue;
        
        let currentProgress = 0;
        
        switch (challenge.type) {
            case 'collect_cats':
                currentProgress = progress.catsCollected;
                break;
                
            case 'collect_rarity':
                currentProgress = progress.collectedRarities.has(challenge.variant.rarity) ? 1 : 0;
                break;
                
            case 'explore_count':
                currentProgress = progress.explorations;
                break;
                
            case 'use_action':
                if (challenge.variant.action === 'Approach') {
                    currentProgress = progress.approachSuccesses;
                } else if (challenge.variant.action === 'Treat') {
                    currentProgress = progress.treatSuccesses;
                } else if (challenge.variant.action === 'Observe') {
                    currentProgress = progress.observeSuccesses;
                }
                break;
                
            case 'first_try_success':
                currentProgress = progress.firstTrySuccesses;
                break;
                
            case 'environment_visits':
                currentProgress = progress.environmentsVisited.size;
                break;
                
            case 'play_minigames':
                currentProgress = progress.minigamesPlayed;
                break;
                
            case 'perfect_streak':
                currentProgress = progress.currentStreak;
                break;
        }
        
        challenge.progress = Math.min(currentProgress, challenge.required);
        
        // Check if just completed
        if (!challenge.completed && challenge.progress >= challenge.required) {
            completeChallenge(state, challenge);
        }
    }
}

/**
 * Complete a challenge and award rewards
 * @param {Object} state - Game state object
 * @param {Object} challenge - Challenge that was completed
 */
function completeChallenge(state, challenge) {
    challenge.completed = true;
    state.dailyChallenges.completedToday.push(challenge.id);
    state.dailyChallenges.totalCompleted++;
    
    // Award energy reward
    state.playerEnergy = Math.min(100, state.playerEnergy + challenge.reward);
    
    console.log(`🎉 Challenge completed: ${challenge.name}! Awarded ${challenge.reward} energy`);
    
    // Show completion notification
    if (window.showChallengeNotification) {
        showChallengeNotification(challenge);
    }
    
    // Play celebration sound
    if (window.playSound) {
        playSound('achievement');
    }
    
    // Trigger celebration animation
    if (window.triggerCelebration) {
        triggerCelebration('challenge');
    }
}

/**
 * Update streak counter
 * @param {Object} state - Game state object
 */
function updateStreak(state) {
    const today = getTodayDateString();
    const lastPlayed = state.dailyChallenges.lastPlayedDate;
    
    if (!lastPlayed) {
        // First time playing
        state.dailyChallenges.streak = 1;
    } else if (lastPlayed === today) {
        // Already played today, no change
        return;
    } else {
        const yesterday = getYesterdayDateString();
        if (lastPlayed === yesterday) {
            // Played yesterday, increment streak
            state.dailyChallenges.streak++;
        } else {
            // Missed a day, reset streak
            state.dailyChallenges.streak = 1;
        }
    }
    
    state.dailyChallenges.lastPlayedDate = today;
    console.log('🔥 Current streak:', state.dailyChallenges.streak, 'days');
}

/**
 * Get yesterday's date as a string (YYYY-MM-DD)
 * @returns {string} Date string
 */
function getYesterdayDateString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

/**
 * Hash code generator for seeded random
 * @param {string} str - String to hash
 * @returns {number} Hash code
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Seeded random number generator
 * @param {number} seed - Seed value
 * @returns {number} Random number between 0 and 1
 */
let _seed = 0;
function seededRandom(seed) {
    _seed = (seed * 9301 + 49297) % 233280;
    return _seed / 233280;
}

/**
 * Render challenges panel
 * @param {Object} state - Game state object
 */
function renderChallengesPanel(state) {
    const panel = document.getElementById('challenges-panel');
    const content = document.getElementById('challenges-content');
    
    if (!panel || !content) {
        console.error('Challenges panel elements not found');
        return;
    }
    
    // Ensure we have challenges
    if (!state.dailyChallenges.currentChallenges.length) {
        generateDailyChallenges(state);
    }
    
    const challenges = state.dailyChallenges.currentChallenges;
    const streak = state.dailyChallenges.streak || 0;
    const totalCompleted = state.dailyChallenges.totalCompleted || 0;
    
    let html = `
        <div class="challenges-header">
            <div class="streak-display">
                <span class="streak-icon">🔥</span>
                <span class="streak-number">${streak}</span>
                <span class="streak-label">Day Streak</span>
            </div>
            <div class="total-challenges">
                <span>Total Completed: <strong>${totalCompleted}</strong></span>
            </div>
        </div>
        
        <div class="challenges-subtitle">
            <h4>📅 Today's Challenges</h4>
            <p>Complete challenges to earn energy rewards!</p>
        </div>
        
        <div class="challenges-list">
    `;
    
    for (const challenge of challenges) {
        const progressPercent = Math.round((challenge.progress / challenge.required) * 100);
        const difficultyClass = `difficulty-${challenge.difficulty}`;
        const completedClass = challenge.completed ? 'completed' : '';
        
        html += `
            <div class="challenge-card ${difficultyClass} ${completedClass}">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-info">
                    <h5 class="challenge-name">${challenge.name}</h5>
                    <p class="challenge-description">${challenge.description}</p>
                    <div class="challenge-progress-bar">
                        <div class="challenge-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="challenge-stats">
                        <span class="challenge-progress-text">${challenge.progress} / ${challenge.required}</span>
                        <span class="reward-text">⚡ +${challenge.reward} Energy</span>
                    </div>
                </div>
                ${challenge.completed ? '<div class="completed-badge">✓ Completed!</div>' : ''}
            </div>
        `;
    }
    
    html += `
        </div>
        
        <div class="challenges-info">
            <p>💡 <strong>Tip:</strong> Challenges reset every day at midnight. Come back tomorrow for new challenges!</p>
        </div>
    `;
    
    content.innerHTML = html;
}

/**
 * Show challenge completion notification
 * @param {Object} challenge - Completed challenge
 */
function showChallengeNotification(challenge) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'challenge-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${challenge.icon}</span>
            <div class="notification-text">
                <strong>Challenge Complete!</strong>
                <p>${challenge.name}</p>
                <p class="notification-reward">+${challenge.reward} Energy</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Open challenges panel
 * @param {Object} state - Game state object
 */
function openChallenges(state) {
    const panel = document.getElementById('challenges-panel');
    if (!panel) return;
    
    // Generate challenges if needed
    if (!state.dailyChallenges.currentChallenges.length) {
        generateDailyChallenges(state);
    }
    
    renderChallengesPanel(state);
    panel.classList.remove('hidden');
    
    // Animate in
    if (window.animatePanelSlideIn) {
        animatePanelSlideIn(panel);
    }
    
    // Play sound
    if (window.playSound) {
        playSound('panelOpen');
    }
}

/**
 * Close challenges panel
 */
function closeChallenges() {
    const panel = document.getElementById('challenges-panel');
    if (!panel) return;
    
    // Animate out
    if (window.animatePanelSlideOut) {
        animatePanelSlideOut(panel, () => {
            panel.classList.add('hidden');
        });
    } else {
        panel.classList.add('hidden');
    }
    
    // Play sound
    if (window.playSound) {
        playSound('panelClose');
    }
}
