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
    analytics: null
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
    // Verify required DOM elements exist
    if (!canvas || !ctx) {
        console.error('Canvas element not found. Game cannot initialize.');
        return;
    }
    
    // Verify CAT_BREEDS is loaded
    if (!window.CAT_BREEDS || !Array.isArray(window.CAT_BREEDS)) {
        initRetryCount++;
        if (initRetryCount >= MAX_INIT_RETRIES) {
            console.error('❌ Failed to load CAT_BREEDS after', MAX_INIT_RETRIES, 'retries');
            alert('Failed to load cat data. Please refresh the page.');
            return;
        }
        console.log('⏳ Waiting for cat data... (attempt', initRetryCount, 'of', MAX_INIT_RETRIES + ')');
        setTimeout(initGame, 50); // Retry after 50ms
        return;
    }
    
    console.log('✅ Game initializing with', window.CAT_BREEDS.length, 'cat breeds');

    loadGameState();
    
    // Check if this is the first time playing
    const isFirstTime = gameState.collectedCats.size === 0 && gameState.explorationCount === 0;
    
    renderCollection();
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
    
    // Show welcome message for first-time players
    if (isFirstTime) {
        setTimeout(showWelcomeMessage, 500);
    }
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
        
        localStorage.setItem('catCollectorGame', JSON.stringify({
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
            tenthCatTime: gameState.tenthCatTime
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
    document.getElementById('collection-btn')?.addEventListener('click', scrollToCollection);
    document.getElementById('achievements-btn')?.addEventListener('click', showAchievements);
    document.getElementById('analytics-btn')?.addEventListener('click', showAnalytics);
    document.getElementById('help-btn')?.addEventListener('click', showHelp);
    document.getElementById('reset-btn')?.addEventListener('click', resetGame);
    document.getElementById('close-details')?.addEventListener('click', closeCatDetails);
    
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
    document.getElementById('approach-btn')?.addEventListener('click', () => handleEncounterAction('approach'));
    document.getElementById('offer-treat-btn')?.addEventListener('click', () => handleEncounterAction('treat'));
    document.getElementById('observe-btn')?.addEventListener('click', () => handleEncounterAction('observe'));
    
    // Modal background click to close
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target.id === 'help-modal') {
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
    
    cachedGradients = {
        sky: ctx.createLinearGradient(0, 0, 0, canvas.height)
    };
    
    cachedGradients.sky.addColorStop(0, '#87ceeb');
    cachedGradients.sky.addColorStop(1, '#98d8c8');
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
    // Ground
    ctx.fillStyle = '#90ee90';
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
    
    // Instruction text - make it more visible
    ctx.font = 'bold 18px "Comic Sans MS"';
    ctx.fillStyle = '#f5576c';
    ctx.fillText('👇 Click "Explore for Cats" below! 👇', canvas.width / 2, canvas.height - 25);
    
    // Show stats hint
    if (gameState.collectedCats.size === 0) {
        ctx.font = 'italic 16px "Comic Sans MS"';
        ctx.fillStyle = '#666';
        ctx.fillText('Start your adventure to discover 25 unique cat breeds!', canvas.width / 2, canvas.height / 2 + 20);
    } else {
        // Show collection progress
        ctx.font = 'bold 16px "Comic Sans MS"';
        ctx.fillStyle = '#4caf50';
        ctx.fillText(`${gameState.collectedCats.size} / 25 cats collected!`, canvas.width / 2, canvas.height / 2 + 20);
    }
}

/**
 * Main exploration function - costs 10 energy
 * Triggers a random cat encounter based on rarity
 */
function exploreForCats() {
    if (gameState.playerEnergy < 10) {
        alert('You need more energy! Wait for it to regenerate or refresh the page.');
        return;
    }
    
    // Reduce energy
    gameState.playerEnergy = Math.max(0, gameState.playerEnergy - 10);
    gameState.explorationCount = (gameState.explorationCount || 0) + 1;
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
 * @returns {Object|null} Cat object or null if all collected
 */
function selectRandomCat() {
    // Verify CAT_BREEDS is available
    if (!window.CAT_BREEDS || !Array.isArray(window.CAT_BREEDS)) {
        console.error('CAT_BREEDS data not loaded');
        return null;
    }
    
    // Filter cats by rarity and availability
    const availableCats = window.CAT_BREEDS.filter(cat => !gameState.collectedCats.has(cat.id));
    
    if (availableCats.length === 0) {
        alert('🎉 Congratulations! You\'ve collected all the cats! 🎉');
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
    
    const panel = document.getElementById('encounter-panel');
    const catDiv = document.getElementById('encounter-cat');
    const text = document.getElementById('encounter-text');
    
    if (!panel || !catDiv || !text) {
        console.error('Encounter panel elements not found');
        return;
    }
    
    catDiv.textContent = cat.icon;
    
    const randomFact = CAT_FACTS?.[Math.floor(Math.random() * CAT_FACTS.length)] || 'A wild cat appears!';
    text.innerHTML = `<strong>${cat.name}</strong><br>${randomFact}<br><em>Rarity: ${cat.stats.rarity}</em>`;
    
    panel.classList.remove('hidden');
}

/**
 * Handle player's action choice during cat encounter
 * @param {string} action - The action type ('approach', 'treat', or 'observe')
 */
function handleEncounterAction(action) {
    const cat = gameState.currentEncounter;
    if (!cat) return;
    
    const isFirstAttempt = !gameState.currentEncounterAttempted;
    gameState.currentEncounterAttempted = true;
    
    let success = false;
    let message = '';
    
    // Track action counts
    if (action === 'observe') gameState.observeCount = (gameState.observeCount || 0) + 1;
    if (action === 'approach') gameState.approachCount = (gameState.approachCount || 0) + 1;
    
    // Calculate success based on cat stats and action
    const baseChance = 0.5;
    let successChance = baseChance;
    
    switch (action) {
        case 'approach':
            // Works better with friendly cats
            successChance = baseChance + (cat.stats.friendliness / 200);
            message = cat.stats.friendliness > 80 ? 
                `${cat.name} happily comes to you! 💕` :
                `${cat.name} is a bit shy but warms up to you! 😊`;
            break;
            
        case 'treat':
            // Always good chance, but higher with less energetic cats
            successChance = 0.7 + ((100 - cat.stats.energy) / 200);
            message = `${cat.name} can't resist the treat! 🐟`;
            break;
            
        case 'observe':
            // Works better with shy/intelligent cats
            successChance = baseChance + (cat.stats.intelligence / 200);
            message = `${cat.name} appreciates your patience and trusts you! 🌟`;
            break;
    }
    
    success = Math.random() < successChance;
    
    // Track for analytics
    if (window.recordExploration) {
        recordExploration(gameState, cat, action, success);
    }
    
    if (success) {
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
        
        alert(`✨ Success! ✨\n\n${message}\n\n${cat.name} joins your collection!`);
        
        // Close encounter and update display
        document.getElementById('encounter-panel').classList.add('hidden');
        renderCollection();
        updatePlayerStats();
        
        // Show the new cat details with enhanced portrait
        setTimeout(() => showCatDetails(cat.id), 500);
    } else {
        alert(`${cat.name} runs away! Try a different approach next time. 🏃‍♂️`);
        document.getElementById('encounter-panel').classList.add('hidden');
    }
    
    gameState.currentEncounter = null;
    gameState.currentEncounterAttempted = false;
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
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Verify CAT_BREEDS is available
    if (!window.CAT_BREEDS || !Array.isArray(window.CAT_BREEDS)) {
        console.error('CAT_BREEDS data not loaded');
        grid.innerHTML = '<p style="padding: 20px; text-align: center;">Loading cat data...</p>';
        return;
    }
    
    window.CAT_BREEDS.forEach(cat => {
        const card = document.createElement('div');
        const isCollected = gameState.collectedCats.has(cat.id);
        
        card.className = `cat-card ${isCollected ? '' : 'locked'}`;
        
        if (isCollected) {
            card.innerHTML = `
                <div class="cat-icon">${cat.icon}</div>
                <h3>${cat.name}</h3>
                <span class="rarity rarity-${cat.stats.rarity}">${cat.stats.rarity}</span>
            `;
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
    
    modal.classList.remove('hidden');
    // Focus on close button for accessibility
    document.getElementById('close-details')?.focus();
}

/**
 * Close the cat details modal
 */
function closeCatDetails() {
    const modal = document.getElementById('cat-details');
    if (modal) {
        modal.classList.add('hidden');
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
    
    if (!collectionPanel) return;
    
    // Toggle visibility
    if (collectionPanel.classList.contains('visible')) {
        collectionPanel.classList.remove('visible');
        if (collectionBtn) collectionBtn.textContent = '📚 View Collection';
    } else {
        collectionPanel.classList.add('visible');
        if (collectionBtn) collectionBtn.textContent = '📚 Hide Collection';
        // Scroll to it smoothly
        setTimeout(() => {
            collectionPanel.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

/**
 * Show the help modal
 */
function showHelp() {
    const modal = document.getElementById('help-modal');
    if (modal) {
        modal.classList.remove('hidden');
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
        modal.classList.add('hidden');
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
            updatePlayerStats();
            saveGameState();
            
            // Visual feedback for energy gain
            if (window.createEnergyPulse) {
                createEnergyPulse();
            }
        } else {
            // Stop regeneration when at max to save resources
            clearInterval(energyRegenInterval);
            energyRegenInterval = null;
        }
    }, 30000); // Regenerate 1 energy every 30 seconds
}

/**
 * Handle keyboard input for accessibility
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyboardInput(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closeCatDetails();
        closeHelp();
        closeAchievements();
        closeAnalytics();
        
        const encounterPanel = document.getElementById('encounter-panel');
        if (encounterPanel && !encounterPanel.classList.contains('hidden')) {
            encounterPanel.classList.add('hidden');
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
        panel.classList.remove('hidden');
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
        panel.classList.add('hidden');
    }
}

/**
 * Show analytics dashboard
 */
function showAnalytics() {
    const panel = document.getElementById('analytics-panel');
    if (panel) {
        panel.classList.remove('hidden');
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
        panel.classList.add('hidden');
    }
}

/**
 * Show welcome message for first-time players
 */
function showWelcomeMessage() {
    const message = `
🐱 Welcome to Cat Collector! 🐱

You're about to embark on an adventure to discover 25 unique cat breeds from around the world!

🔍 Click "Explore for Cats" to start finding cats
⚡ Each exploration costs 10 energy
💚 Energy regenerates over time (1 point every 30 seconds)
🏆 Unlock achievements as you play
📊 Track your progress in Analytics

Ready to meet your first cat?
    `;
    
    if (confirm(message + '\n\nClick OK to get started!')) {
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
