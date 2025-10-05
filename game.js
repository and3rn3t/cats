// Game State
let gameState = {
    collectedCats: new Set(),
    playerEnergy: 100,
    currentEncounter: null,
    lastEncounterTime: 0,
    gameStartTime: Date.now(),
    explorationCount: 0,
    firstTrySuccesses: 0,
    observeCount: 0,
    treatSuccesses: 0,
    approachCount: 0,
    unlockedAchievements: new Set(),
    analytics: null,
    // Environment system (v2.5.0)
    currentEnvironment: 'forest',
    environmentProgress: {
        forest: { discovered: new Set(), visits: 0 },
        mountain: { discovered: new Set(), visits: 0 },
        desert: { discovered: new Set(), visits: 0 },
        city: { discovered: new Set(), visits: 0 },
        beach: { discovered: new Set(), visits: 0 }
    },
    environmentsUnlocked: ['forest'],
    // Milestone system (v2.9.0)
    completedMilestones: new Set()
};

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas?.getContext('2d');

// Cached gradients for better performance
let cachedGradients = null;

// Energy regeneration interval ID
let energyRegenInterval = null;

// Initialization retry counter
let initRetryCount = 0;
const MAX_INIT_RETRIES = 20; // Max 1 second of retries (20 * 50ms)

/**
 * Initialize game on page load
 * Sets up initial state, loads saved data, and renders the UI
 */
function initGame() {
    console.log('🎮 initGame called');
    
    // Ensure loading overlay is visible
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
        console.log('✅ Loading overlay should be visible');
    }
    
    // Verify required DOM elements exist
    if (!canvas || !ctx) {
        console.error('Canvas element not found. Game cannot initialize.');
        hideLoadingOverlay();
        return;
    }
    
    // Ensure all dialogs are closed on init
    document.querySelectorAll('dialog').forEach(dialog => {
        if (dialog.hasAttribute('open')) {
            dialog.close();
        }
    });
    
    // Verify CAT_BREEDS is loaded
    if (!window.CAT_BREEDS || !Array.isArray(window.CAT_BREEDS)) {
        initRetryCount++;
        if (initRetryCount >= MAX_INIT_RETRIES) {
            console.error('❌ Failed to load CAT_BREEDS after', MAX_INIT_RETRIES, 'retries');
            hideLoadingOverlay();
            alert('Failed to load cat data. Please refresh the page.');
            return;
        }
        console.log('⏳ Waiting for cat data... (attempt', initRetryCount, 'of', MAX_INIT_RETRIES + ')');
        updateLoadingText(`Loading cat data... (${initRetryCount}/${MAX_INIT_RETRIES})`);
        setTimeout(initGame, 50); // Retry after 50ms
        return;
    }
    
    console.log('✅ Game initializing with', window.CAT_BREEDS.length, 'cat breeds');

    updateLoadingText('Loading your save data...');
    loadGameState();
    
    // Check if this is the first time playing
    const isFirstTime = gameState.collectedCats.size === 0 && gameState.explorationCount === 0;
    
    updateLoadingText('Rendering collection...');
    renderCollection();
    
    updateLoadingText('Initializing game systems...');
    updatePlayerStats();
    initializeGradients();
    drawScene();
    setupEventListeners();
    startEnergyRegeneration();
    
    // Initialize new systems
    if (window.initAnalytics) {
        initAnalytics(gameState);
    }
    if (window.updateAchievements) {
        updateAchievements(gameState);
    }
    if (window.initMinigames) {
        initMinigames();
    }
    
    // Initialize daily challenges system (Phase 5.1)
    if (window.initializeChallenges) {
        initializeChallenges(gameState);
        generateDailyChallenges(gameState);
    }
    
    // Initialize encyclopedia system (Phase 6.5)
    if (window.initEncyclopedia) {
        initEncyclopedia();
    }
    
    // Initialize environment system (v2.5.0)
    if (window.ENVIRONMENTS && window.renderEnvironmentSelector) {
        renderEnvironmentSelector(gameState);
    }
    
    // Initialize animation system (Phase 4.1)
    if (window.initAnimations) {
        initAnimations();
    }
    
    // Initialize tutorial system (Phase v2.9.0)
    if (window.initTutorial) {
        updateLoadingText('Setting up tutorial...');
        initTutorial();
    }
    
    // Initialize milestone system (v2.9.0)
    if (window.initMilestones) {
        initMilestones(gameState);
    }
    
    // Initialize personality system (v2.9.0)
    if (window.initPersonalities) {
        initPersonalities();
    }
    
    // Calculate minimum display time for loading overlay
    const initStartTime = Date.now();
    const MIN_LOADING_DISPLAY = 1500; // Minimum 1.5 seconds
    
    // Hide loading overlay (Phase 4.2)
    updateLoadingText('Ready!');
    
    // Ensure loading overlay displays for minimum time
    const elapsed = Date.now() - initStartTime;
    const remainingTime = Math.max(MIN_LOADING_DISPLAY - elapsed, 800);
    
    console.log(`⏱️ Init took ${elapsed}ms, waiting ${remainingTime}ms before hiding overlay`);
    
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Show welcome message for first-time players after overlay is fully hidden
        if (isFirstTime) {
            setTimeout(showWelcomeMessage, 300);
        }
    }, remainingTime);
}

/**
 * Save game state to localStorage
 * Persists collected cats and energy level
 */
function saveGameState() {
    try {
        // Update play time before saving
        if (window.updatePlayTime) {
            updatePlayTime(gameState);
        }
        
        // Convert environment progress Sets to Arrays for JSON serialization
        const environmentProgressSerialized = {};
        for (const [env, progress] of Object.entries(gameState.environmentProgress || {})) {
            environmentProgressSerialized[env] = {
                discovered: Array.from(progress.discovered || []),
                visits: progress.visits || 0
            };
        }
        
        // Serialize daily challenges (Phase 5.1)
        let dailyChallengesSerialized = null;
        if (gameState.dailyChallenges) {
            dailyChallengesSerialized = {
                ...gameState.dailyChallenges,
                todayProgress: {
                    ...gameState.dailyChallenges.todayProgress,
                    environmentsVisited: Array.from(gameState.dailyChallenges.todayProgress.environmentsVisited || []),
                    collectedRarities: Array.from(gameState.dailyChallenges.todayProgress.collectedRarities || [])
                }
            };
        }
        
        localStorage.setItem('catCollectorGame', JSON.stringify({
            version: '2.9.0',
            collectedCats: Array.from(gameState.collectedCats),
            playerEnergy: gameState.playerEnergy,
            gameStartTime: gameState.gameStartTime,
            explorationCount: gameState.explorationCount,
            firstTrySuccesses: gameState.firstTrySuccesses,
            observeCount: gameState.observeCount,
            treatSuccesses: gameState.treatSuccesses,
            approachCount: gameState.approachCount,
            unlockedAchievements: Array.from(gameState.unlockedAchievements || []),
            analytics: gameState.analytics,
            tenthCatTime: gameState.tenthCatTime,
            // Environment system (v2.5.0)
            currentEnvironment: gameState.currentEnvironment || 'forest',
            environmentProgress: environmentProgressSerialized,
            environmentsUnlocked: gameState.environmentsUnlocked || ['forest'],
            // Daily challenges (Phase 5.1)
            dailyChallenges: dailyChallengesSerialized,
            // Milestones (v2.9.0)
            completedMilestones: Array.from(gameState.completedMilestones || [])
        }));
    } catch (error) {
        console.error('Failed to save game state:', error);
        alert('Warning: Your progress could not be saved. Please check your browser settings.');
    }
}

/**
 * Load game state from localStorage
 * Restores previously saved progress if available
 */
function loadGameState() {
    try {
        const saved = localStorage.getItem('catCollectorGame');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Load basic game state
            gameState.collectedCats = new Set(data.collectedCats || []);
            gameState.playerEnergy = data.playerEnergy ?? 100;
            gameState.gameStartTime = data.gameStartTime || Date.now();
            gameState.explorationCount = data.explorationCount || 0;
            gameState.firstTrySuccesses = data.firstTrySuccesses || 0;
            gameState.observeCount = data.observeCount || 0;
            gameState.treatSuccesses = data.treatSuccesses || 0;
            gameState.approachCount = data.approachCount || 0;
            gameState.unlockedAchievements = new Set(data.unlockedAchievements || []);
            gameState.analytics = data.analytics || null;
            gameState.tenthCatTime = data.tenthCatTime || null;
            
            // Load environment state (v2.5.0)
            gameState.currentEnvironment = data.currentEnvironment || 'forest';
            gameState.environmentsUnlocked = data.environmentsUnlocked || ['forest'];
            
            // Load environment progress (convert Arrays back to Sets)
            if (data.environmentProgress) {
                gameState.environmentProgress = {};
                for (const [env, progress] of Object.entries(data.environmentProgress)) {
                    gameState.environmentProgress[env] = {
                        discovered: new Set(progress.discovered || []),
                        visits: progress.visits || 0
                    };
                }
            } else {
                // Initialize default environment progress
                gameState.environmentProgress = {
                    forest: { discovered: new Set(), visits: 0 },
                    mountain: { discovered: new Set(), visits: 0 },
                    desert: { discovered: new Set(), visits: 0 },
                    city: { discovered: new Set(), visits: 0 },
                    beach: { discovered: new Set(), visits: 0 }
                };
            }
            
            // Load daily challenges (Phase 5.1)
            if (data.dailyChallenges) {
                gameState.dailyChallenges = {
                    ...data.dailyChallenges,
                    todayProgress: {
                        ...data.dailyChallenges.todayProgress,
                        environmentsVisited: new Set(data.dailyChallenges.todayProgress.environmentsVisited || []),
                        collectedRarities: new Set(data.dailyChallenges.todayProgress.collectedRarities || [])
                    }
                };
            }
            
            // Load completed milestones (v2.9.0)
            gameState.completedMilestones = new Set(data.completedMilestones || []);
            
            console.log('✅ Game state loaded. Current environment:', gameState.currentEnvironment);
        }
    } catch (error) {
        console.error('Failed to load game state:', error);
        // Continue with default state if loading fails
    }
}

/**
 * Set up all event listeners for the game
 * Uses optional chaining to prevent errors if elements don't exist
 */
function setupEventListeners() {
    // Main control buttons
    document.getElementById('explore-btn')?.addEventListener('click', exploreForCats);
    document.getElementById('collection-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        scrollToCollection();
    });
    
    // Close button for collection panel
    document.getElementById('close-collection-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        scrollToCollection(); // Toggle it off
    });
    
    document.getElementById('achievements-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        showAchievements();
    });
    document.getElementById('challenges-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        if (window.openChallenges) {
            openChallenges(gameState);
        }
    });
    document.getElementById('encyclopedia-btn')?.addEventListener('click', () => {
        console.log('📚 Encyclopedia button clicked!');
        if (window.playButtonClick) playButtonClick();
        if (window.openEncyclopedia) {
            console.log('📚 Calling openEncyclopedia()');
            openEncyclopedia();
        } else {
            console.error('❌ openEncyclopedia function not found!');
        }
    });
    document.getElementById('analytics-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        showAnalytics();
    });
    document.getElementById('help-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        showHelp();
    });
    document.getElementById('reset-btn')?.addEventListener('click', resetGame);
    document.getElementById('close-details')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        closeCatDetails();
    });
    
    // Close panel buttons
    document.querySelectorAll('.close-panel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.side-panel');
            if (panel) {
                panel.classList.add('hidden');
            }
        });
    });
    
    // Encounter action buttons
    document.getElementById('approach-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        handleEncounterAction('approach');
    });
    document.getElementById('offer-treat-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        handleEncounterAction('treat');
    });
    document.getElementById('observe-btn')?.addEventListener('click', () => {
        if (window.playButtonClick) playButtonClick();
        handleEncounterAction('observe');
    });
    
    // Dialog backdrop click to close (for help modal)
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.addEventListener('click', (e) => {
            // Close if clicking on the dialog backdrop (not the content)
            const rect = helpModal.getBoundingClientRect();
            if (
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom
            ) {
                closeHelp();
            }
        });
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', handleKeyboardInput);
}

/**
 * Initialize gradients once for better performance
 * Cached gradients avoid recreation on every draw call
 */
function initializeGradients() {
    if (!ctx) return;
    
    // Get current environment colors (v2.5.0)
    let skyColors = ['#87ceeb', '#98d8c8']; // Default forest
    let groundColors = ['#90ee90', '#7cb87c']; // Default forest
    
    if (window.ENVIRONMENTS && gameState.currentEnvironment) {
        const env = window.ENVIRONMENTS[gameState.currentEnvironment];
        if (env?.background) {
            skyColors = env.background.skyGradient || skyColors;
            groundColors = env.background.groundGradient || groundColors;
        }
    }
    
    // Create sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, skyColors[0]);
    skyGradient.addColorStop(1, skyColors[1]);
    
    // Create ground gradient
    const groundGradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
    groundGradient.addColorStop(0, groundColors[0]);
    groundGradient.addColorStop(1, groundColors[1]);
    
    cachedGradients = {
        sky: skyGradient,
        ground: groundGradient
    };
}

/**
 * Main scene rendering function
 * Draws all visual elements on the canvas
 */
function drawScene() {
    if (!ctx || !canvas) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Draw environment
    drawEnvironment();
    
    // Draw UI text
    drawSceneText();
}

/**
 * Draw the sky background using cached gradient
 */
function drawBackground() {
    if (!cachedGradients?.sky) return;
    
    ctx.fillStyle = cachedGradients.sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawEnvironment() {
    // Ground with environment-specific gradient
    ctx.fillStyle = cachedGradients?.ground || '#90ee90';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Grass details
    ctx.fillStyle = '#7cb87c';
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i, canvas.height - 100, 10, 5);
    }
    
    // Trees
    drawTree(100, canvas.height - 100);
    drawTree(400, canvas.height - 100);
    drawTree(650, canvas.height - 100);
    
    // Clouds
    drawCloud(150, 80);
    drawCloud(500, 120);
    drawCloud(650, 60);
    
    // Bushes
    drawBush(250, canvas.height - 120);
    drawBush(550, canvas.height - 115);
}

function drawTree(x, y) {
    // Trunk
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 10, y - 80, 20, 80);
    
    // Foliage
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.arc(x, y - 80, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - 25, y - 70, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 25, y - 70, 30, 0, Math.PI * 2);
    ctx.fill();
}

function drawCloud(x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 20, y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 45, y, 25, 0, Math.PI * 2);
    ctx.fill();
}

function drawBush(x, y) {
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 25, y, 25, 0, Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - 25, y, 25, 0, Math.PI);
    ctx.fill();
}

/**
 * Draw text overlays on the game scene
 */
function drawSceneText() {
    if (!ctx) return;
    
    // Main title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText('🌳 The Wild Cat Sanctuary 🌳', canvas.width / 2, 35);
    
    // Instruction text - positioned higher to avoid being covered
    ctx.font = 'bold 16px "Comic Sans MS"';
    ctx.fillStyle = '#f5576c';
    ctx.fillText('👇 Press "Explore for Cats" below to start! 👇', canvas.width / 2, canvas.height - 15);
    
    // Show stats hint
    if (gameState.collectedCats.size === 0) {
        ctx.font = 'italic 16px "Comic Sans MS"';
        ctx.fillStyle = '#666';
        ctx.fillText('Start your adventure to discover 40 unique cat breeds!', canvas.width / 2, canvas.height / 2 + 20);
    } else {
        // Show collection progress
        ctx.font = 'bold 18px "Comic Sans MS"';
        ctx.fillStyle = '#4caf50';
        ctx.fillText(`${gameState.collectedCats.size} / 40 cats collected!`, canvas.width / 2, canvas.height / 2 + 20);
    }
}

/**
 * Main exploration function - costs 10 energy
 * Triggers a random cat encounter based on rarity
 */
function exploreForCats() {
    const exploreBtn = document.getElementById('explore-btn');
    
    if (gameState.playerEnergy < 10) {
        // Shake button to indicate insufficient energy (Phase 4.1)
        if (window.shakeElement && exploreBtn) {
            shakeElement(exploreBtn);
        }
        alert('You need more energy! Wait for it to regenerate or refresh the page.');
        return;
    }
    
    // Add loading state (Phase 4.2)
    if (exploreBtn) {
        addButtonLoading(exploreBtn);
    }
    
    // Simulate brief loading for exploration
    setTimeout(() => {
        performExploration(exploreBtn);
    }, 400);
}

/**
 * Perform the actual exploration after loading state
 * @param {HTMLElement} exploreBtn - Explore button element
 */
function performExploration(exploreBtn) {
    // Play exploration sound
    if (window.playExplore) {
        playExplore();
    }
    
    // Reduce energy
    gameState.playerEnergy = Math.max(0, gameState.playerEnergy - 10);
    gameState.explorationCount = (gameState.explorationCount || 0) + 1;
    
    // Track environment visits (v2.5.0)
    const currentEnv = gameState.currentEnvironment || 'forest';
    if (gameState.environmentProgress?.[currentEnv]) {
        gameState.environmentProgress[currentEnv].visits += 1;
    }
    
    // Update challenge progress (Phase 5.1)
    if (window.updateChallengeProgress) {
        updateChallengeProgress(gameState, 'exploration', { environment: currentEnv });
    }
    
    updatePlayerStats();
    saveGameState();
    
    // Restart energy regeneration if it was stopped
    if (!energyRegenInterval && gameState.playerEnergy < 100) {
        startEnergyRegeneration();
    }
    
    // Update achievements
    if (window.updateAchievements) {
        updateAchievements(gameState);
    }
    
    // Select a cat based on rarity
    const cat = selectRandomCat();
    
    // Remove loading state (Phase 4.2)
    if (exploreBtn) {
        removeButtonLoading(exploreBtn);
    }
    
    if (!cat) {
        alert('The forest is quiet... try again!');
        return;
    }
    
    // Show encounter with visual effects
    showEncounter(cat);
    
    // Create sparkle effect on canvas
    if (window.createSparkles && canvas) {
        const rect = canvas.getBoundingClientRect();
        createSparkles(rect.left + canvas.width / 2, rect.top + canvas.height / 2, '#ffd700', 10);
    }
}

/**
 * Select a random cat using weighted rarity system
 * Now filters by current environment (v2.5.0)
 * @returns {Object|null} Cat object or null if all collected
 */
function selectRandomCat() {
    // Verify CAT_BREEDS is available
    if (!window.CAT_BREEDS || !Array.isArray(window.CAT_BREEDS)) {
        console.error('CAT_BREEDS data not loaded');
        return null;
    }
    
    // Get current environment
    const currentEnv = gameState.currentEnvironment || 'forest';
    
    // Filter cats by environment and availability (not yet collected)
    const availableCats = window.CAT_BREEDS.filter(cat => 
        cat.environment === currentEnv && !gameState.collectedCats.has(cat.id)
    );
    
    if (availableCats.length === 0) {
        // Check if all cats in this environment are collected
        const allCatsInEnv = window.CAT_BREEDS.filter(cat => cat.environment === currentEnv);
        const collectedInEnv = allCatsInEnv.filter(cat => gameState.collectedCats.has(cat.id));
        
        if (collectedInEnv.length === allCatsInEnv.length) {
            alert(`🎉 You've collected all cats in ${ENVIRONMENTS[currentEnv]?.name || 'this environment'}! Try exploring another environment!`);
        } else {
            alert('The area is quiet... try again!');
        }
        return null;
    }
    
    // Weighted random selection based on rarity
    const rand = Math.random();
    let cumulativeProbability = 0;
    let targetRarity = '';
    
    for (const [rarity, chance] of Object.entries(window.RARITY_CHANCE || {})) {
        cumulativeProbability += chance;
        if (rand <= cumulativeProbability) {
            targetRarity = rarity;
            break;
        }
    }
    
    // Find cats of target rarity
    const catsOfRarity = availableCats.filter(cat => cat.stats.rarity === targetRarity);
    
    if (catsOfRarity.length === 0) {
        // Fallback to any available cat
        return availableCats[Math.floor(Math.random() * availableCats.length)];
    }
    
    return catsOfRarity[Math.floor(Math.random() * catsOfRarity.length)];
}

/**
 * Display cat encounter panel with cat information
 * @param {Object} cat - The cat breed object to display
 */
function showEncounter(cat) {
    if (!cat) return;
    
    gameState.currentEncounter = cat;
    gameState.currentEncounterAttempts = 0; // Reset attempt counter
    
    // Play encounter sound
    if (window.playEncounter) {
        playEncounter();
    }
    
    const panel = document.getElementById('encounter-panel');
    const catDiv = document.getElementById('encounter-cat');
    const text = document.getElementById('encounter-text');
    
    if (!panel || !catDiv || !text) {
        console.error('Encounter panel elements not found');
        return;
    }
    
    catDiv.textContent = cat.icon;
    
    const randomFact = CAT_FACTS?.[Math.floor(Math.random() * CAT_FACTS.length)] || 'A wild cat appears!';
    
    // IMPROVED: Show cat stats to help player make strategic decision
    const statsHTML = `
        <div style="background: #f0f0f0; border: 2px solid #333; border-radius: 8px; padding: 10px; margin: 10px 0;">
            <strong>📊 Cat Stats - Choose Wisely!</strong><br>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 5px; font-size: 0.9em;">
                <span>😊 Friendliness: <strong>${cat.stats.friendliness}</strong></span>
                <span>⚡ Energy: <strong>${cat.stats.energy}</strong></span>
                <span>🧠 Intelligence: <strong>${cat.stats.intelligence}</strong></span>
                <span>✨ Rarity: <strong>${cat.stats.rarity}</strong></span>
            </div>
            <div style="margin-top: 8px; font-size: 0.85em; color: #666; font-style: italic;">
                💡 Tip: High friendliness → Approach | Low energy → Treat | High intelligence → Observe
            </div>
        </div>
    `;
    
    text.innerHTML = `<strong>${cat.name}</strong><br>${randomFact}<br>${statsHTML}`;
    
    panel.showModal();
    
    // Add entrance animation (Phase 4.1)
    if (window.animateDialogOpen) {
        animateDialogOpen(panel);
    }
}

/**
 * Handle player's action choice during cat encounter
 * @param {string} action - The action type ('approach', 'treat', or 'observe')
 */
/**
 * Calculate success chance for an encounter action
 * @param {Object} cat - The cat being encountered
 * @param {string} action - The action being performed ('approach', 'treat', 'observe')
 * @param {number} attemptNumber - Which attempt this is (1 or 2)
 * @returns {Object} Object with successChance, strategyBonus, and message
 */
function calculateEncounterSuccess(cat, action, attemptNumber) {
    const baseChance = 0.30;
    let successChance = baseChance;
    let strategyBonus = 0;
    let message = '';
    
    switch (action) {
        case 'approach':
            // Works best with VERY friendly cats (>80)
            if (cat.stats.friendliness > 80) {
                strategyBonus = (cat.stats.friendliness - 80) / 100; // Up to +0.2
                successChance = baseChance + strategyBonus;
                message = `${cat.name} happily comes to you! You chose wisely! 💕`;
            } else if (cat.stats.friendliness > 50) {
                strategyBonus = (cat.stats.friendliness - 50) / 200; // Up to +0.15
                successChance = baseChance + strategyBonus;
                message = `${cat.name} cautiously approaches... 😊`;
            } else {
                // Penalty for shy cats
                successChance = baseChance * 0.5; // Only 15% chance!
                message = `${cat.name} seems too shy for direct approach! 😿`;
            }
            break;
            
        case 'treat':
            // Works best with LOW energy cats (<40)
            if (cat.stats.energy < 40) {
                strategyBonus = (40 - cat.stats.energy) / 100; // Up to +0.4
                successChance = 0.5 + strategyBonus; // Up to 90%!
                message = `${cat.name} is too tired to resist the treat! Perfect choice! 🐟`;
            } else if (cat.stats.energy < 70) {
                strategyBonus = (70 - cat.stats.energy) / 150;
                successChance = 0.4 + strategyBonus;
                message = `${cat.name} takes the treat! 🐟`;
            } else {
                // High energy cats are hard to tempt
                successChance = baseChance * 0.6; // Only 18%!
                message = `${cat.name} is too energetic to care about treats! 🏃`;
            }
            break;
            
        case 'observe':
            // Works best with VERY intelligent cats (>75)
            if (cat.stats.intelligence > 75) {
                strategyBonus = (cat.stats.intelligence - 75) / 100; // Up to +0.25
                successChance = 0.45 + strategyBonus; // Up to 70%
                message = `${cat.name} appreciates your patience and wisdom! 🌟`;
            } else if (cat.stats.intelligence > 50) {
                strategyBonus = (cat.stats.intelligence - 50) / 150;
                successChance = 0.35 + strategyBonus;
                message = `${cat.name} slowly trusts you... 👀`;
            } else {
                // Low intelligence cats don't understand patience
                successChance = baseChance * 0.7; // Only 21%!
                message = `${cat.name} seems confused by your waiting... 🤔`;
            }
            break;
    }
    
    // Apply personality modifier (v2.9.0)
    if (window.applyPersonalityModifier) {
        const baseRate = successChance * 100;
        const modifiedRate = applyPersonalityModifier(baseRate, cat.id, action);
        successChance = modifiedRate / 100;
        
        // Get personality for hint in message
        if (window.getCatPersonality) {
            const personality = getCatPersonality(cat.id);
            const modifier = personality.modifiers[action];
            if (modifier > 10) {
                message += ` (${personality.name} personality helps!)`;
            } else if (modifier < -10) {
                message += ` (${personality.name} cat is harder to ${action}!)`;
            }
        }
    }
    
    // Rarity affects difficulty - Legendary cats are much harder!
    const rarityPenalty = {
        'common': 1.0,
        'uncommon': 0.95,
        'rare': 0.85,
        'epic': 0.70,
        'legendary': 0.50
    };
    successChance *= (rarityPenalty[cat.stats.rarity] || 1.0);
    
    // Small bonus for repeat attempts
    if (attemptNumber > 1) {
        successChance += 0.05; // +5% on second attempt
    }
    
    return { successChance, strategyBonus, message };
}

/**
 * Generate strategy feedback based on how well the player chose
 * @param {number} strategyBonus - The bonus from using the right strategy
 * @returns {string} Feedback message
 */
function generateStrategyFeedback(strategyBonus) {
    if (strategyBonus > 0.2) {
        return '\n\n🎯 EXCELLENT STRATEGY! You chose the perfect approach!';
    } else if (strategyBonus > 0.1) {
        return '\n\n👍 Good choice! Your strategy worked!';
    } else if (strategyBonus > 0) {
        return '\n\n✓ That worked, but there might be a better approach next time.';
    } else {
        return '\n\n🍀 Lucky! But consider the cat\'s stats next time.';
    }
}

/**
 * Generate helpful advice for failed encounter attempts
 * @param {Object} cat - The cat being encountered
 * @returns {string} Advice message
 */
function generateFailureAdvice(cat) {
    let advice = '\n\n💡 ';
    if (cat.stats.friendliness > 80) {
        advice += 'This cat is very friendly - try approaching directly!';
    } else if (cat.stats.energy < 40) {
        advice += 'This cat looks tired - maybe offer a treat?';
    } else if (cat.stats.intelligence > 75) {
        advice += 'This cat is intelligent - try observing first!';
    } else if (cat.stats.energy > 70) {
        advice += 'This cat is too energetic - treats probably won\'t work!';
    } else {
        advice += 'Study the cat\'s stats carefully!';
    }
    return advice;
}

/**
 * Process successful cat encounter
 * @param {Object} cat - The cat that was successfully befriended
 * @param {string} action - The action that succeeded
 * @param {boolean} isFirstAttempt - Whether this was the first attempt
 * @param {string} message - Success message to display
 * @param {number} strategyBonus - Bonus from strategy
 */
function processSuccessfulEncounter(cat, action, isFirstAttempt, message, strategyBonus) {
    // Track treat successes
    if (action === 'treat') {
        gameState.treatSuccesses = (gameState.treatSuccesses || 0) + 1;
    }
    
    // Track first try success
    if (isFirstAttempt) {
        gameState.firstTrySuccesses = (gameState.firstTrySuccesses || 0) + 1;
    }
    
    // Track 10th cat time for speedrun achievement
    if (gameState.collectedCats.size === 9) {
        gameState.tenthCatTime = Date.now();
    }
    
    // Add to collection
    gameState.collectedCats.add(cat.id);
    
    // Track environment discovery (v2.5.0)
    const currentEnv = gameState.currentEnvironment || 'forest';
    if (gameState.environmentProgress?.[currentEnv]) {
        gameState.environmentProgress[currentEnv].discovered.add(cat.id);
    }
    
    // Check for environment unlocks (v2.5.0)
    checkEnvironmentUnlocks();
    
    saveGameState();
    
    // Create visual effects
    if (window.createConfetti && canvas) {
        const rect = canvas.getBoundingClientRect();
        createConfetti(rect.left + canvas.width / 2, rect.top + canvas.height / 2);
    }
    
    if (window.createHearts && canvas) {
        const rect = canvas.getBoundingClientRect();
        createHearts(rect.left + canvas.width / 2, rect.top + canvas.height / 2);
    }
    
    // Update achievements
    if (window.updateAchievements) {
        updateAchievements(gameState);
    }
    
    // Check milestones (v2.9.0)
    if (window.checkMilestones) {
        const newMilestones = checkMilestones(gameState);
        newMilestones.forEach(milestone => {
            if (window.showMilestoneNotification) {
                setTimeout(() => showMilestoneNotification(milestone), 1500);
            }
        });
    }
    
    // Update challenge progress (Phase 5.1)
    if (window.updateChallengeProgress) {
        updateChallengeProgress(gameState, 'cat_collected', {
            rarity: cat.stats.rarity,
            firstTry: isFirstAttempt
        });
    }
    
    // Show strategy feedback
    const strategyFeedback = generateStrategyFeedback(strategyBonus);
    
    // Add success animation (Phase 4.1)
    const encounterPanel = document.getElementById('encounter-panel');
    if (window.animateEncounterSuccess && encounterPanel) {
        animateEncounterSuccess(encounterPanel);
    }
    
    // Create particle effect
    if (window.createParticlesOnElement && encounterPanel) {
        createParticlesOnElement(encounterPanel, '✨', 10);
    }
    
    alert(`✨ Success! ✨\n\n${message}\n\n${cat.name} joins your collection!${strategyFeedback}`);
    
    // Play success sound and cat meow
    if (window.playSuccess) {
        playSuccess();
    }
    setTimeout(() => {
        if (window.playCatMeow) {
            playCatMeow(cat.stats.rarity);
        }
    }, 400);
    
    // Close encounter and update display
    document.getElementById('encounter-panel')?.close();
    renderCollection();
    updatePlayerStats();
    
    // Celebrate milestones
    if (window.celebrateMilestone) {
        celebrateMilestone(gameState.collectedCats.size);
    }
    
    // Animate stats update
    const statsElement = document.getElementById('cats-collected');
    if (window.animateStatsUpdate && statsElement) {
        animateStatsUpdate(statsElement);
    }
    
    // Show the new cat details with enhanced portrait
    setTimeout(() => showCatDetails(cat.id), 500);
    
    // Reset encounter state
    gameState.currentEncounter = null;
    gameState.currentEncounterAttempts = 0;
}

/**
 * Process failed cat encounter
 * @param {Object} cat - The cat that got away
 * @param {number} attemptNumber - Which attempt this was (1 or 2)
 */
function processFailedEncounter(cat, attemptNumber) {
    // Add failure animation (Phase 4.1)
    const encounterPanel = document.getElementById('encounter-panel');
    if (window.animateEncounterFailure && encounterPanel) {
        animateEncounterFailure(encounterPanel);
    }
    
    // Play failure sound
    if (window.playFailure) {
        playFailure();
    }
    
    const failureAdvice = generateFailureAdvice(cat);
    
    if (attemptNumber === 1) {
        alert(`${cat.name} isn't convinced... but you can try ONE more time!${failureAdvice}\n\n⚠️ Warning: If you fail again, the cat will run away!`);
    } else {
        alert(`${cat.name} runs away! 🏃‍♂️\n\nYou'll need to explore again to find another cat.${failureAdvice}`);
        document.getElementById('encounter-panel')?.close();
        gameState.currentEncounter = null;
        gameState.currentEncounterAttempts = 0;
    }
}

/**
 * Handle encounter action (approach, treat, or observe)
 * Main entry point for player actions during cat encounters
 * @param {string} action - The action to perform ('approach', 'treat', 'observe')
 */
function handleEncounterAction(action) {
    const cat = gameState.currentEncounter;
    if (!cat) return;
    
    // Track attempt count for this specific encounter
    if (!gameState.currentEncounterAttempts) {
        gameState.currentEncounterAttempts = 0;
    }
    gameState.currentEncounterAttempts++;
    
    const attemptNumber = gameState.currentEncounterAttempts;
    const isFirstAttempt = attemptNumber === 1;
    
    // Track action counts
    if (action === 'observe') gameState.observeCount = (gameState.observeCount || 0) + 1;
    if (action === 'approach') gameState.approachCount = (gameState.approachCount || 0) + 1;
    
    // After 2 failed attempts, cat runs away permanently
    if (attemptNumber > 2) {
        alert(`😿 ${cat.name} got too nervous and ran away!\n\nYou'll need to explore again to find another cat.\n\n💡 Tip: Choose wisely - you only get 2 attempts per cat!`);
        document.getElementById('encounter-panel')?.close();
        gameState.currentEncounter = null;
        gameState.currentEncounterAttempts = 0;
        return;
    }
    
    // Calculate success chance based on strategy
    const { successChance, strategyBonus, message } = calculateEncounterSuccess(cat, action, attemptNumber);
    
    // Determine if attempt succeeds
    const success = Math.random() < successChance;
    
    // Track for analytics
    if (window.recordExploration) {
        recordExploration(gameState, cat, action, success);
    }
    
    // Update challenge progress (Phase 5.1)
    if (window.updateChallengeProgress) {
        if (success) {
            updateChallengeProgress(gameState, 'action_success', { action });
        } else {
            updateChallengeProgress(gameState, 'action_fail', { action });
        }
    }
    
    if (success) {
        processSuccessfulEncounter(cat, action, isFirstAttempt, message, strategyBonus);
    } else {
        processFailedEncounter(cat, attemptNumber);
    }
}

/**
 * Render the cat collection grid
 * Shows collected cats in color, uncollected in grayscale
 */
function renderCollection() {
    const grid = document.getElementById('cat-grid');
    if (!grid) {
        console.error('Cat grid element not found');
        return;
    }
    
    console.log('🎨 Rendering collection...');
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Verify CAT_BREEDS is available
    if (!window.CAT_BREEDS || !Array.isArray(window.CAT_BREEDS)) {
        console.error('CAT_BREEDS data not loaded');
        grid.innerHTML = '<p style="padding: 20px; text-align: center;">Loading cat data...</p>';
        return;
    }
    
    console.log(`   Found ${window.CAT_BREEDS.length} breeds, ${gameState.collectedCats.size} collected`);
    
    window.CAT_BREEDS.forEach((cat, index) => {
        const card = document.createElement('div');
        const isCollected = gameState.collectedCats.has(cat.id);
        
        card.className = `cat-card ${isCollected ? '' : 'locked'}`;
        card.setAttribute('data-rarity', cat.stats.rarity); // For legendary sparkles
        
        // Get environment icon (v2.5.0)
        const envIcon = window.ENVIRONMENTS?.[cat.environment]?.icon || '🌍';
        
        if (isCollected) {
            card.innerHTML = `
                <div class="cat-icon">${cat.icon}</div>
                <h3>${cat.name}</h3>
                <span class="rarity rarity-${cat.stats.rarity}">${cat.stats.rarity}</span>
                <span class="environment-badge" title="${cat.environment}">${envIcon}</span>
            `;
            
            // Add reveal animation with staggered delay (Phase 4.1)
            if (window.animateCatCardReveal) {
                animateCatCardReveal(card, index * 30);
            }
            
            // Use arrow function to avoid creating new function each time
            card.addEventListener('click', () => showCatDetails(cat.id));
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View details for ${cat.name}`);
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showCatDetails(cat.id);
                }
            });
        } else {
            card.innerHTML = `
                <div class="cat-icon">❓</div>
                <h3>???</h3>
                <span class="rarity rarity-${cat.stats.rarity}">${cat.stats.rarity}</span>
                <span class="environment-badge" title="Unknown environment">${envIcon}</span>
            `;
            card.setAttribute('aria-label', `Unknown ${cat.stats.rarity} cat - not yet collected`);
        }
        
        grid.appendChild(card);
    });
}

/**
 * Show detailed cat information modal
 * @param {number} catId - ID of the cat to display
 */
function showCatDetails(catId) {
    const cat = window.CAT_BREEDS?.find(c => c.id === catId);
    if (!cat || !gameState.collectedCats.has(catId)) return;
    
    const modal = document.getElementById('cat-details');
    const portrait = document.getElementById('cat-portrait');
    const name = document.getElementById('detail-name');
    const description = document.getElementById('detail-description');
    const origin = document.getElementById('detail-origin');
    const statsDiv = document.getElementById('detail-stats');
    
    if (!modal || !portrait || !name || !description || !origin || !statsDiv) {
        console.error('Cat details modal elements not found');
        return;
    }
    
    // Use enhanced cat portrait if available
    if (window.drawEnhancedCatPortrait) {
        drawEnhancedCatPortrait(portrait, cat);
    } else {
        portrait.textContent = cat.icon;
    }
    
    name.textContent = cat.name;
    description.textContent = cat.description;
    origin.innerHTML = `<strong>Origin:</strong> ${cat.origin}<br><strong>Behavior:</strong> ${cat.behavior}<br><strong>Favorite Activity:</strong> ${cat.favoriteActivity}`;
    
    // Add personality trait display (v2.9.0)
    if (window.getPersonalityDisplay) {
        const personalityHTML = getPersonalityDisplay(cat.id);
        origin.innerHTML += personalityHTML;
    }
    
    // Use animated stat bars if available
    if (window.animateStatBars) {
        statsDiv.innerHTML = '<h3>Stats</h3>';
        animateStatBars('detail-stats', cat.stats);
    } else {
        // Fallback to simple stat bars
        statsDiv.innerHTML = '<h3>Stats</h3>';
        
        Object.entries(cat.stats).forEach(([stat, value]) => {
            if (stat === 'rarity') return;
            
            const statBar = document.createElement('div');
            statBar.className = 'stat-bar';
            statBar.innerHTML = `
                <label>${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${value}%" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            statsDiv.appendChild(statBar);
        });
    }
    
    // Add play mini-games button
    const playButton = document.createElement('button');
    playButton.className = 'action-btn';
    playButton.style.marginTop = '16px';
    playButton.innerHTML = '🎮 Play Mini-Games';
    playButton.setAttribute('aria-label', `Play mini-games with ${cat.name}`);
    playButton.onclick = () => {
        if (window.playButtonClick) playButtonClick();
        modal.close();
        if (window.showMinigameSelection) {
            showMinigameSelection(cat);
        }
    };
    statsDiv.appendChild(playButton);
    
    modal.showModal();
    
    // Add entrance animation (Phase 4.1)
    if (window.animateDialogOpen) {
        animateDialogOpen(modal);
    }
    
    // Focus on close button for accessibility
    document.getElementById('close-details')?.focus();
}

/**
 * Close the cat details modal
 */
function closeCatDetails() {
    const modal = document.getElementById('cat-details');
    if (modal) {
        // Add close animation (Phase 4.1)
        if (window.animateDialogClose) {
            animateDialogClose(modal).then(() => {
                modal.close();
            });
        } else {
            modal.close();
        }
    }
}

/**
 * Update player stats display in the UI
 * Shows collected cats count and energy level
 */
function updatePlayerStats() {
    const catsCollected = document.getElementById('cats-collected');
    const totalCats = document.getElementById('total-cats');
    const playerEnergy = document.getElementById('player-energy');
    
    if (catsCollected) catsCollected.textContent = gameState.collectedCats.size;
    if (totalCats && window.CAT_BREEDS) totalCats.textContent = window.CAT_BREEDS.length;
    if (playerEnergy) playerEnergy.textContent = gameState.playerEnergy;
}

/**
 * Smooth scroll to the collection section
 */
function scrollToCollection() {
    const collectionPanel = document.getElementById('collection-panel');
    const collectionBtn = document.getElementById('collection-btn');
    
    console.log('📚 scrollToCollection called');
    console.log('   Collection panel:', collectionPanel);
    console.log('   Has visible class:', collectionPanel?.classList.contains('visible'));
    
    if (!collectionPanel) {
        console.error('❌ Collection panel not found!');
        return;
    }
    
    // Toggle visibility
    if (collectionPanel.classList.contains('visible')) {
        collectionPanel.classList.remove('visible');
        if (collectionBtn) collectionBtn.textContent = '📚 View Collection';
        console.log('✅ Collection hidden');
    } else {
        collectionPanel.classList.add('visible');
        if (collectionBtn) collectionBtn.textContent = '📚 Hide Collection';
        console.log('✅ Collection should be visible now');
        console.log('   Display style:', window.getComputedStyle(collectionPanel).display);
        console.log('   Z-index:', window.getComputedStyle(collectionPanel).zIndex);
        console.log('   Position:', window.getComputedStyle(collectionPanel).position);
        console.log('   Bounding rect:', collectionPanel.getBoundingClientRect());
        console.log('   Children count:', collectionPanel.children.length);
        
        const catGrid = document.getElementById('cat-grid');
        if (catGrid) {
            console.log('   Grid children:', catGrid.children.length);
            console.log('   Grid display:', window.getComputedStyle(catGrid).display);
            console.log('   Grid height:', window.getComputedStyle(catGrid).height);
            console.log('   Grid bounding rect:', catGrid.getBoundingClientRect());
            if (catGrid.children.length > 0) {
                const firstCard = catGrid.children[0];
                console.log('   First card display:', window.getComputedStyle(firstCard).display);
                console.log('   First card height:', window.getComputedStyle(firstCard).height);
                console.log('   First card rect:', firstCard.getBoundingClientRect());
            }
        }
        
        // Scroll to it smoothly - bring to top of viewport
        setTimeout(() => {
            collectionPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

/**
 * Show the help modal
 */
function showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.showModal();
        
        // Add entrance animation (Phase 4.1)
        if (window.animateDialogOpen) {
            animateDialogOpen(modal);
        }
        
        // Focus on close button for accessibility
        modal.querySelector('.close-btn')?.focus();
    }
}

/**
 * Close the help modal
 */
function closeHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        // Add close animation (Phase 4.1)
        if (window.animateDialogClose) {
            animateDialogClose(modal).then(() => {
                modal.close();
            });
        } else {
            modal.close();
        }
    }
}

/**
 * Start energy regeneration system
 * Regenerates 1 energy every 30 seconds up to maximum of 100
 */
function startEnergyRegeneration() {
    // Clear any existing interval
    if (energyRegenInterval) {
        clearInterval(energyRegenInterval);
    }
    
    energyRegenInterval = setInterval(() => {
        if (gameState.playerEnergy < 100) {
            gameState.playerEnergy = Math.min(100, gameState.playerEnergy + 1);
            
            // Add regeneration animation (Phase 4.1)
            const energyElement = document.getElementById('player-energy');
            if (window.animateEnergyRegen && energyElement) {
                animateEnergyRegen(energyElement, true);
                
                // Remove animation after a moment
                setTimeout(() => {
                    animateEnergyRegen(energyElement, false);
                }, 2000);
            }
            
            updatePlayerStats();
            saveGameState();
            
            // Play energy gain sound
            if (window.playEnergyGain) {
                playEnergyGain();
            }
            
            // Visual feedback for energy gain
            if (window.createEnergyPulse) {
                createEnergyPulse();
            }
        } else {
            // Stop regeneration when at max to save resources
            clearInterval(energyRegenInterval);
            energyRegenInterval = null;
        }
    }, 45000); // HARDER: Regenerate 1 energy every 45 seconds (was 30)
}

/**
 * Check and unlock new environments based on collection progress (v2.5.0)
 */
function checkEnvironmentUnlocks() {
    if (!window.ENVIRONMENTS || !window.isEnvironmentUnlocked) {
        return; // Environment system not loaded
    }
    
    const environmentsToCheck = ['mountain', 'desert', 'city', 'beach'];
    
    for (const envId of environmentsToCheck) {
        // Skip if already unlocked
        if (gameState.environmentsUnlocked.includes(envId)) {
            continue;
        }
        
        const env = window.ENVIRONMENTS[envId];
        if (env?.unlockRequirement?.(gameState)) {
            // Unlock the environment
            gameState.environmentsUnlocked.push(envId);
            
            // Show notification
            setTimeout(() => {
                alert(`🎉 NEW ENVIRONMENT UNLOCKED! 🎉\n\n${env.icon} ${env.name}\n\n${env.description}\n\nYou can now explore this new area!`);
                
                // Re-render environment selector to show the new environment
                if (window.renderEnvironmentSelector) {
                    renderEnvironmentSelector(gameState);
                }
            }, 1000);
        }
    }
}

/**
 * Switch to a different environment (v2.5.0)
 * @param {string} environmentId - ID of environment to switch to
 */
function switchEnvironment(environmentId) {
    if (!window.ENVIRONMENTS?.[environmentId]) {
        console.error('Environment not found:', environmentId);
        return;
    }
    
    // Check if unlocked
    if (!gameState.environmentsUnlocked.includes(environmentId)) {
        const env = window.ENVIRONMENTS[environmentId];
        alert(`🔒 ${env.name} is locked!\n\n${env.unlockMessage || 'Keep collecting to unlock!'}`);
        return;
    }
    
    // Switch environment
    gameState.currentEnvironment = environmentId;
    saveGameState();
    
    // Update UI
    const env = window.ENVIRONMENTS[environmentId];
    console.log(`🌍 Switched to ${env.name}`);
    
    // Redraw scene with new environment
    if (cachedGradients) {
        cachedGradients = null; // Clear cached gradients
        initializeGradients();
    }
    drawScene();
    
    // Update environment selector
    if (window.renderEnvironmentSelector) {
        renderEnvironmentSelector(gameState);
    }
    
    // Play sound
    if (window.playButtonClick) {
        playButtonClick();
    }
}

// Expose switchEnvironment globally for environment selector buttons
window.switchEnvironment = switchEnvironment;

/**
 * Handle keyboard input for accessibility
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyboardInput(e) {
    // Escape key closes modals (dialog elements handle Escape natively, but we also close side panels)
    if (e.key === 'Escape') {
        // Native <dialog> elements close automatically on Escape, 
        // but we keep these calls for side panels and consistency
        closeAchievements();
        closeAnalytics();
        
        // For encounter panel, check if it's open using the dialog API
        const encounterPanel = document.getElementById('encounter-panel');
        if (encounterPanel?.open) {
            encounterPanel.close();
            gameState.currentEncounter = null;
        }
    }
}

/**
 * Show achievements panel
 */
function showAchievements() {
    const panel = document.getElementById('achievements-panel');
    if (panel) {
        // Add slide animation (Phase 4.1)
        if (window.animatePanelOpen) {
            animatePanelOpen(panel);
        } else {
            panel.classList.remove('hidden');
        }
        
        if (window.renderAchievementsPanel) {
            renderAchievementsPanel(gameState);
        }
    }
}

/**
 * Close achievements panel
 */
function closeAchievements() {
    const panel = document.getElementById('achievements-panel');
    if (panel) {
        // Add slide animation (Phase 4.1)
        if (window.animatePanelClose) {
            animatePanelClose(panel);
        } else {
            panel.classList.add('hidden');
        }
    }
}

/**
 * Show analytics dashboard
 */
function showAnalytics() {
    const panel = document.getElementById('analytics-panel');
    if (panel) {
        // Add slide animation (Phase 4.1)
        if (window.animatePanelOpen) {
            animatePanelOpen(panel);
        } else {
            panel.classList.remove('hidden');
        }
        
        if (window.renderAnalyticsDashboard) {
            renderAnalyticsDashboard(gameState);
        }
    }
}

/**
 * Close analytics dashboard
 */
function closeAnalytics() {
    const panel = document.getElementById('analytics-panel');
    if (panel) {
        // Add slide animation (Phase 4.1)
        if (window.animatePanelClose) {
            animatePanelClose(panel);
        } else {
            panel.classList.add('hidden');
        }
    }
}

/**
 * Show welcome message for first-time players
 */
function showWelcomeMessage() {
    const message = `
🐱 Welcome to Cat Collector! 🐱

You're about to embark on an adventure to discover 40 unique cat breeds from around the world!

HOW TO PLAY:
🔍 Press "Explore for Cats" to search for cats
⚡ Each exploration costs 10 energy
💚 Energy regenerates over time (1 point every 30 seconds)
🌍 Discover different environments as you collect cats
🏆 Unlock achievements as you play
📊 Track your progress in Analytics

Ready to meet your first cat?
    `;
    
    if (confirm(message + '\n\nPress OK to start your adventure!')) {
        // Give player a boost by showing them their first cat immediately
        exploreForCats();
    }
}

/**
 * Reset game progress - clears all saved data
 */
function resetGame() {
    const confirmReset = confirm('⚠️ Are you sure you want to reset all progress?\n\nThis will:\n• Delete all collected cats\n• Reset achievements\n• Clear analytics data\n• Reset energy to 100\n\nThis action cannot be undone!');
    
    if (!confirmReset) return;
    
    const doubleConfirm = confirm('🚨 FINAL WARNING 🚨\n\nAre you absolutely sure? All progress will be permanently deleted!');
    
    if (!doubleConfirm) return;
    
    try {
        // Clear localStorage
        localStorage.removeItem('catCollectorGame');
        localStorage.removeItem('catCollectorAchievements');
        localStorage.removeItem('catCollectorAnalytics');
        
        // Show success message
        alert('✅ Game reset successfully!\n\nThe page will now reload.');
        
        // Reload the page to reinitialize everything
        window.location.reload();
    } catch (error) {
        console.error('Failed to reset game:', error);
        alert('❌ Failed to reset game. Please try clearing your browser cache manually.');
    }
}

/**
 * Update loading overlay text (Phase 4.2)
 * @param {string} text - Loading text to display
 */
function updateLoadingText(text) {
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        loadingText.textContent = text;
    }
}

/**
 * Hide loading overlay (Phase 4.2)
 */
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-busy', 'false');
        
        // Remove from DOM after transition (increased to match --anim-duration-slow)
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 600); // Match CSS transition duration
    }
}

/**
 * Show loading overlay (Phase 4.2)
 */
function showLoadingOverlay(text = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-busy', 'true');
        updateLoadingText(text);
    }
}

/**
 * Create skeleton loading cards for collection (Phase 4.2)
 * @param {number} count - Number of skeleton cards to create
 */
function renderSkeletonCards(count = 12) {
    const grid = document.getElementById('cat-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    grid.classList.add('skeleton-grid');
    
    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'skeleton-card';
        card.innerHTML = `
            <div class="skeleton-icon"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
        `;
        grid.appendChild(card);
    }
}

/**
 * Add loading state to button (Phase 4.2)
 * @param {HTMLElement} button - Button element
 */
function addButtonLoading(button) {
    if (button && !button.classList.contains('loading')) {
        button.classList.add('loading');
        button.setAttribute('aria-busy', 'true');
        button.disabled = true;
    }
}

/**
 * Remove loading state from button (Phase 4.2)
 * @param {HTMLElement} button - Button element
 */
function removeButtonLoading(button) {
    if (button) {
        button.classList.remove('loading');
        button.setAttribute('aria-busy', 'false');
        button.disabled = false;
    }
}

// Initialize game on page load
window.addEventListener('DOMContentLoaded', initGame);

// Expose functions to global scope for inline handlers
window.closeHelp = closeHelp;
window.closeAchievements = closeAchievements;
window.closeAnalytics = closeAnalytics;

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (energyRegenInterval) {
        clearInterval(energyRegenInterval);
    }
    
    // Clean up particles
    if (window.particleManager) {
        particleManager.clear();
    }
});
