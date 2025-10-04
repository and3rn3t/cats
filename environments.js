/**
 * Environments System for Cat Collector
 * Manages different biomes/locations for cat exploration
 */

// Environment definitions
const ENVIRONMENTS = {
    forest: {
        id: 'forest',
        name: 'Mystic Forest',
        icon: '🌲',
        description: 'A lush, mysterious forest teeming with wildlife',
        unlocked: true, // Default environment
        unlockRequirement: null,
        background: {
            skyGradient: ['#87CEEB', '#98D8E8'], // Light blue sky
            groundGradient: ['#228B22', '#2E8B57'], // Green forest floor
            accentColor: '#654321' // Brown for trees
        },
        catIds: [1, 2, 3, 4, 5, 6, 7, 8] // 8 cats - will be updated with actual distribution
    },
    mountain: {
        id: 'mountain',
        name: 'Snowy Peaks',
        icon: '🏔️',
        description: 'High mountain ranges with breathtaking views',
        unlocked: false,
        unlockRequirement: (state) => state.collectedCats.size >= 5,
        unlockMessage: 'Collect 5 cats to unlock!',
        background: {
            skyGradient: ['#4682B4', '#87CEEB'], // Blue mountain sky
            groundGradient: ['#D3D3D3', '#FFFFFF'], // Gray rocks to white snow
            accentColor: '#708090' // Slate gray for rocks
        },
        catIds: [9, 10, 11, 12, 13, 14, 15, 16]
    },
    desert: {
        id: 'desert',
        name: 'Golden Sands',
        icon: '🏜️',
        description: 'Vast desert with hidden oases',
        unlocked: false,
        unlockRequirement: (state) => state.collectedCats.size >= 10,
        unlockMessage: 'Collect 10 cats to unlock!',
        background: {
            skyGradient: ['#FFD700', '#FFA500'], // Golden to orange sky
            groundGradient: ['#F4A460', '#DEB887'], // Sandy brown
            accentColor: '#8B4513' // Brown for rocks/cacti
        },
        catIds: [17, 18, 19, 20, 21, 22, 23, 24]
    },
    city: {
        id: 'city',
        name: 'Urban Jungle',
        icon: '🏙️',
        description: 'Bustling city streets and hidden alleys',
        unlocked: false,
        unlockRequirement: (state) => state.collectedCats.size >= 15,
        unlockMessage: 'Collect 15 cats to unlock!',
        background: {
            skyGradient: ['#4682B4', '#5F9EA0'], // Steel blue sky
            groundGradient: ['#808080', '#A9A9A9'], // Gray pavement
            accentColor: '#2F4F4F' // Dark slate for buildings
        },
        catIds: [25, 26, 27, 28, 29, 30, 31, 32]
    },
    beach: {
        id: 'beach',
        name: 'Tropical Paradise',
        icon: '🏖️',
        description: 'Sunny beaches and coastal beauty',
        unlocked: false,
        unlockRequirement: (state) => state.collectedCats.size >= 20,
        unlockMessage: 'Collect 20 cats to unlock!',
        background: {
            skyGradient: ['#87CEEB', '#00CED1'], // Sky blue to turquoise
            groundGradient: ['#F0E68C', '#FFE4B5'], // Sandy beach
            accentColor: '#20B2AA' // Light sea green for water
        },
        catIds: [33, 34, 35, 36, 37, 38, 39, 40]
    }
};

/**
 * Get all available (unlocked) environments for the player
 * @param {Object} state - Game state
 * @returns {Array} Array of unlocked environment objects
 */
function getAvailableEnvironments(state) {
    const available = [];
    
    for (const envId in ENVIRONMENTS) {
        const env = ENVIRONMENTS[envId];
        
        // Check if unlocked
        if (env.unlocked || env.unlockRequirement?.(state)) {
            available.push(env);
        }
    }
    
    return available;
}

/**
 * Check if an environment is unlocked
 * @param {string} environmentId - Environment ID
 * @param {Object} state - Game state
 * @returns {boolean} True if unlocked
 */
function isEnvironmentUnlocked(environmentId, state) {
    const env = ENVIRONMENTS[environmentId];
    if (!env) return false;
    
    return env.unlocked || env.unlockRequirement?.(state) || false;
}

/**
 * Get the current environment object
 * @param {Object} state - Game state
 * @returns {Object} Current environment object
 */
function getCurrentEnvironment(state) {
    const currentEnvId = state.currentEnvironment || 'forest';
    return ENVIRONMENTS[currentEnvId] || ENVIRONMENTS.forest;
}

/**
 * Get cats available in current environment
 * @param {Object} state - Game state
 * @returns {Array} Array of cat IDs in current environment
 */
function getCurrentEnvironmentCats(state) {
    const env = getCurrentEnvironment(state);
    return env.catIds || [];
}

/**
 * Switch to a different environment
 * @param {string} environmentId - Environment ID to switch to
 * @param {Object} state - Game state
 * @returns {boolean} True if successful
 */
function selectEnvironment(environmentId, state) {
    // Check if environment exists and is unlocked
    if (!ENVIRONMENTS[environmentId]) {
        console.error(`Environment ${environmentId} does not exist`);
        return false;
    }
    
    if (!isEnvironmentUnlocked(environmentId, state)) {
        console.error(`Environment ${environmentId} is not unlocked yet`);
        return false;
    }
    
    // Update state
    state.currentEnvironment = environmentId;
    
    // Save state
    if (window.saveGame) {
        saveGame();
    }
    
    return true;
}

/**
 * Check if new environments should be unlocked
 * @param {Object} state - Game state
 * @returns {Array} Array of newly unlocked environment IDs
 */
function checkEnvironmentUnlocks(state) {
    const newlyUnlocked = [];
    
    // Initialize unlockedEnvironments set if not exists
    if (!state.unlockedEnvironments) {
        state.unlockedEnvironments = new Set(['forest']); // Forest is always unlocked
    }
    
    for (const envId in ENVIRONMENTS) {
        const env = ENVIRONMENTS[envId];
        
        // Skip if already unlocked
        if (state.unlockedEnvironments.has(envId)) {
            continue;
        }
        
        // Check unlock requirement
        if (env.unlockRequirement?.(state)) {
            state.unlockedEnvironments.add(envId);
            newlyUnlocked.push(envId);
        }
    }
    
    return newlyUnlocked;
}

/**
 * Show environment unlock notification
 * @param {string} environmentId - Unlocked environment ID
 */
function showEnvironmentUnlockNotification(environmentId) {
    const env = ENVIRONMENTS[environmentId];
    if (!env) return;
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification epic'; // Reuse achievement styling
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    notification.innerHTML = `
        <div class="achievement-icon">${env.icon}</div>
        <div class="achievement-text">
            <div class="achievement-title">New Environment Unlocked!</div>
            <div class="achievement-name">${env.name}</div>
            <div class="achievement-desc">${env.description}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Play success sound
    if (window.playSuccess) {
        playSuccess();
    }
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

/**
 * Render environment selector UI
 * @param {Object} state - Game state
 */
/**
 * Generate HTML for a single environment card
 * @param {Object} env - Environment object
 * @param {string} envId - Environment ID
 * @param {Object} state - Game state
 * @param {string} currentEnvId - Currently selected environment ID
 * @returns {string} HTML string for the card
 */
function generateEnvironmentCard(env, envId, state, currentEnvId) {
    const unlocked = isEnvironmentUnlocked(envId, state);
    const active = envId === currentEnvId;
    
    const classes = [];
    if (!unlocked) classes.push('locked');
    if (active) classes.push('active');
    
    const catCount = env.catIds.length;
    const collectedCount = env.catIds.filter(id => state.collectedCats.has(id)).length;
    
    const progressHTML = unlocked ? `
        <div class="environment-progress">
            <div class="progress-text">${collectedCount} / ${catCount}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(collectedCount / catCount) * 100}%"></div>
            </div>
        </div>
    ` : `
        <div class="environment-locked-text">${env.unlockMessage}</div>
    `;
    
    return `
        <button class="environment-card ${classes.join(' ')}"
                data-environment="${envId}"
                onclick="handleEnvironmentSelect('${envId}')"
                ${!unlocked ? 'disabled' : ''}
                aria-label="${env.name} - ${unlocked ? `${collectedCount} of ${catCount} cats collected` : 'Locked'}"
                title="${unlocked ? env.description : env.unlockMessage}">
            <div class="environment-icon">${unlocked ? env.icon : '🔒'}</div>
            <div class="environment-name">${env.name}</div>
            ${progressHTML}
        </button>
    `;
}

/**
 * Render environment selector UI
 * @param {Object} state - Game state
 */
function renderEnvironmentSelector(state) {
    const selector = document.getElementById('environment-selector');
    if (!selector) return;
    
    const currentEnvId = state.currentEnvironment || 'forest';
    
    let html = '<div class="environment-grid">';
    
    for (const envId in ENVIRONMENTS) {
        const env = ENVIRONMENTS[envId];
        html += generateEnvironmentCard(env, envId, state, currentEnvId);
    }
    
    html += '</div>';
    selector.innerHTML = html;
}

/**
 * Handle environment selection (called from UI)
 * @param {string} environmentId - Selected environment ID
 */
function handleEnvironmentSelect(environmentId) {
    if (!window.gameState) return;
    
    // Check if already selected
    if (gameState.currentEnvironment === environmentId) {
        return;
    }
    
    // Try to select environment
    if (selectEnvironment(environmentId, gameState)) {
        // Play button sound
        if (window.playButtonClick) {
            playButtonClick();
        }
        
        // Re-render selector
        renderEnvironmentSelector(gameState);
        
        // Redraw game scene with new environment
        if (window.drawGame) {
            drawGame();
        }
        
        // Update UI message
        showEnvironmentChangeMessage(environmentId);
    }
}

/**
 * Show message when environment changes
 * @param {string} environmentId - New environment ID
 */
function showEnvironmentChangeMessage(environmentId) {
    const env = ENVIRONMENTS[environmentId];
    if (!env) return;
    
    const messageEl = document.getElementById('game-message');
    if (messageEl) {
        messageEl.textContent = `🗺️ Now exploring: ${env.name}`;
        messageEl.style.opacity = '1';
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
        }, 3000);
    }
}

/**
 * Get environment completion percentage
 * @param {string} environmentId - Environment ID
 * @param {Object} state - Game state
 * @returns {number} Percentage (0-100)
 */
function getEnvironmentCompletion(environmentId, state) {
    const env = ENVIRONMENTS[environmentId];
    if (!env) return 0;
    
    const total = env.catIds.length;
    const collected = env.catIds.filter(id => state.collectedCats.has(id)).length;
    
    return Math.round((collected / total) * 100);
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.ENVIRONMENTS = ENVIRONMENTS;
    window.getAvailableEnvironments = getAvailableEnvironments;
    window.isEnvironmentUnlocked = isEnvironmentUnlocked;
    window.getCurrentEnvironment = getCurrentEnvironment;
    window.getCurrentEnvironmentCats = getCurrentEnvironmentCats;
    window.selectEnvironment = selectEnvironment;
    window.checkEnvironmentUnlocks = checkEnvironmentUnlocks;
    window.showEnvironmentUnlockNotification = showEnvironmentUnlockNotification;
    window.renderEnvironmentSelector = renderEnvironmentSelector;
    window.handleEnvironmentSelect = handleEnvironmentSelect;
    window.getEnvironmentCompletion = getEnvironmentCompletion;
}
