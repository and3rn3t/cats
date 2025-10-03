// Game State
let gameState = {
    collectedCats: new Set(),
    playerEnergy: 100,
    currentEncounter: null,
    lastEncounterTime: 0
};

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas?.getContext('2d');

// Cached gradients for better performance
let cachedGradients = null;

// Energy regeneration interval ID
let energyRegenInterval = null;

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

    loadGameState();
    renderCollection();
    updatePlayerStats();
    initializeGradients();
    drawScene();
    setupEventListeners();
    startEnergyRegeneration();
}

/**
 * Save game state to localStorage
 * Persists collected cats and energy level
 */
function saveGameState() {
    try {
        localStorage.setItem('catCollectorGame', JSON.stringify({
            collectedCats: Array.from(gameState.collectedCats),
            playerEnergy: gameState.playerEnergy
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
    document.getElementById('help-btn')?.addEventListener('click', showHelp);
    document.getElementById('close-details')?.addEventListener('click', closeCatDetails);
    
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
    
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText('🌳 The Wild Cat Sanctuary 🌳', canvas.width / 2, 30);
    
    ctx.font = '16px "Comic Sans MS"';
    ctx.fillText('Click "Explore for Cats" to find new friends!', canvas.width / 2, canvas.height - 20);
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
    updatePlayerStats();
    saveGameState();
    
    // Restart energy regeneration if it was stopped
    if (!energyRegenInterval && gameState.playerEnergy < 100) {
        startEnergyRegeneration();
    }
    
    // Select a cat based on rarity
    const cat = selectRandomCat();
    
    if (!cat) {
        alert('The forest is quiet... try again!');
        return;
    }
    
    // Show encounter
    showEncounter(cat);
}

/**
 * Select a random cat using weighted rarity system
 * @returns {Object|null} Cat object or null if all collected
 */
function selectRandomCat() {
    // Verify CAT_BREEDS is available
    if (!window.CAT_BREEDS || !Array.isArray(CAT_BREEDS)) {
        console.error('CAT_BREEDS data not loaded');
        return null;
    }
    
    // Filter cats by rarity and availability
    const availableCats = CAT_BREEDS.filter(cat => !gameState.collectedCats.has(cat.id));
    
    if (availableCats.length === 0) {
        alert('🎉 Congratulations! You\'ve collected all the cats! 🎉');
        return null;
    }
    
    // Weighted random selection based on rarity
    const rand = Math.random();
    let cumulativeProbability = 0;
    let targetRarity = '';
    
    for (const [rarity, chance] of Object.entries(RARITY_CHANCE)) {
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
    
    let success = false;
    let message = '';
    
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
    
    if (success) {
        // Add to collection
        gameState.collectedCats.add(cat.id);
        saveGameState();
        
        alert(`✨ Success! ✨\n\n${message}\n\n${cat.name} joins your collection!`);
        
        // Close encounter and update display
        document.getElementById('encounter-panel').classList.add('hidden');
        renderCollection();
        updatePlayerStats();
        
        // Show the new cat details
        setTimeout(() => showCatDetails(cat.id), 500);
    } else {
        alert(`${cat.name} runs away! Try a different approach next time. 🏃‍♂️`);
        document.getElementById('encounter-panel').classList.add('hidden');
    }
    
    gameState.currentEncounter = null;
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
    if (!window.CAT_BREEDS || !Array.isArray(CAT_BREEDS)) {
        console.error('CAT_BREEDS data not loaded');
        grid.innerHTML = '<p>Error loading cat data. Please refresh the page.</p>';
        return;
    }
    
    CAT_BREEDS.forEach(cat => {
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
    const cat = CAT_BREEDS?.find(c => c.id === catId);
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
    
    portrait.textContent = cat.icon;
    name.textContent = cat.name;
    description.textContent = cat.description;
    origin.innerHTML = `<strong>Origin:</strong> ${cat.origin}<br><strong>Behavior:</strong> ${cat.behavior}<br><strong>Favorite Activity:</strong> ${cat.favoriteActivity}`;
    
    // Render stats
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
    if (totalCats && CAT_BREEDS) totalCats.textContent = CAT_BREEDS.length;
    if (playerEnergy) playerEnergy.textContent = gameState.playerEnergy;
}

/**
 * Smooth scroll to the collection section
 */
function scrollToCollection() {
    const collectionPanel = document.getElementById('collection-panel');
    if (collectionPanel) {
        collectionPanel.scrollIntoView({ behavior: 'smooth' });
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
        
        const encounterPanel = document.getElementById('encounter-panel');
        if (encounterPanel && !encounterPanel.classList.contains('hidden')) {
            encounterPanel.classList.add('hidden');
            gameState.currentEncounter = null;
        }
    }
}

// Initialize game on page load
window.addEventListener('DOMContentLoaded', initGame);

// Expose functions to global scope for inline handlers
window.closeHelp = closeHelp;

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (energyRegenInterval) {
        clearInterval(energyRegenInterval);
    }
});
