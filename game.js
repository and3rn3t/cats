// Game State
let gameState = {
    collectedCats: new Set(),
    playerEnergy: 100,
    currentEncounter: null,
    lastEncounterTime: 0
};

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Initialize game
function initGame() {
    loadGameState();
    renderCollection();
    updatePlayerStats();
    drawScene();
    setupEventListeners();
}

// Save/Load game state
function saveGameState() {
    localStorage.setItem('catCollectorGame', JSON.stringify({
        collectedCats: Array.from(gameState.collectedCats),
        playerEnergy: gameState.playerEnergy
    }));
}

function loadGameState() {
    const saved = localStorage.getItem('catCollectorGame');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.collectedCats = new Set(data.collectedCats);
        gameState.playerEnergy = data.playerEnergy;
    }
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('explore-btn').addEventListener('click', exploreForCats);
    document.getElementById('collection-btn').addEventListener('click', scrollToCollection);
    document.getElementById('help-btn').addEventListener('click', showHelp);
    document.getElementById('close-details').addEventListener('click', closeCatDetails);
    
    document.getElementById('approach-btn').addEventListener('click', () => handleEncounterAction('approach'));
    document.getElementById('offer-treat-btn').addEventListener('click', () => handleEncounterAction('treat'));
    document.getElementById('observe-btn').addEventListener('click', () => handleEncounterAction('observe'));
}

// Draw the game scene
function drawScene() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Draw environment
    drawEnvironment();
    
    // Draw UI text
    drawSceneText();
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#98d8c8');
    ctx.fillStyle = gradient;
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

function drawSceneText() {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText('🌳 The Wild Cat Sanctuary 🌳', canvas.width / 2, 30);
    
    ctx.font = '16px "Comic Sans MS"';
    ctx.fillText('Click "Explore for Cats" to find new friends!', canvas.width / 2, canvas.height - 20);
}

// Explore for cats
function exploreForCats() {
    if (gameState.playerEnergy < 10) {
        alert('You need more energy! Rest a bit (refresh the page) before exploring again.');
        return;
    }
    
    // Reduce energy
    gameState.playerEnergy = Math.max(0, gameState.playerEnergy - 10);
    updatePlayerStats();
    saveGameState();
    
    // Select a cat based on rarity
    const cat = selectRandomCat();
    
    if (!cat) {
        alert('The forest is quiet... try again!');
        return;
    }
    
    // Show encounter
    showEncounter(cat);
}

function selectRandomCat() {
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

function showEncounter(cat) {
    gameState.currentEncounter = cat;
    
    const panel = document.getElementById('encounter-panel');
    const catDiv = document.getElementById('encounter-cat');
    const text = document.getElementById('encounter-text');
    
    catDiv.textContent = cat.icon;
    
    const randomFact = CAT_FACTS[Math.floor(Math.random() * CAT_FACTS.length)];
    text.innerHTML = `<strong>${cat.name}</strong><br>${randomFact}<br><em>Rarity: ${cat.stats.rarity}</em>`;
    
    panel.classList.remove('hidden');
}

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

// Render collection grid
function renderCollection() {
    const grid = document.getElementById('cat-grid');
    grid.innerHTML = '';
    
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
            card.addEventListener('click', () => showCatDetails(cat.id));
        } else {
            card.innerHTML = `
                <div class="cat-icon">❓</div>
                <h3>???</h3>
                <span class="rarity rarity-${cat.stats.rarity}">${cat.stats.rarity}</span>
            `;
        }
        
        grid.appendChild(card);
    });
}

// Show cat details modal
function showCatDetails(catId) {
    const cat = CAT_BREEDS.find(c => c.id === catId);
    if (!cat || !gameState.collectedCats.has(catId)) return;
    
    const modal = document.getElementById('cat-details');
    document.getElementById('cat-portrait').textContent = cat.icon;
    document.getElementById('detail-name').textContent = cat.name;
    document.getElementById('detail-description').textContent = cat.description;
    document.getElementById('detail-origin').innerHTML = `<strong>Origin:</strong> ${cat.origin}<br><strong>Behavior:</strong> ${cat.behavior}<br><strong>Favorite Activity:</strong> ${cat.favoriteActivity}`;
    
    // Render stats
    const statsDiv = document.getElementById('detail-stats');
    statsDiv.innerHTML = '<h3>Stats</h3>';
    
    Object.entries(cat.stats).forEach(([stat, value]) => {
        if (stat === 'rarity') return;
        
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        statBar.innerHTML = `
            <label>${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${value}%"></div>
            </div>
        `;
        statsDiv.appendChild(statBar);
    });
    
    modal.classList.remove('hidden');
}

function closeCatDetails() {
    document.getElementById('cat-details').classList.add('hidden');
}

// Update player stats display
function updatePlayerStats() {
    document.getElementById('cats-collected').textContent = gameState.collectedCats.size;
    document.getElementById('total-cats').textContent = CAT_BREEDS.length;
    document.getElementById('player-energy').textContent = gameState.playerEnergy;
}

// Scroll to collection
function scrollToCollection() {
    document.getElementById('collection-panel').scrollIntoView({ behavior: 'smooth' });
}

// Show help modal
function showHelp() {
    document.getElementById('help-modal').classList.remove('hidden');
}

function closeHelp() {
    document.getElementById('help-modal').classList.add('hidden');
}

// Energy regeneration
setInterval(() => {
    if (gameState.playerEnergy < 100) {
        gameState.playerEnergy = Math.min(100, gameState.playerEnergy + 1);
        updatePlayerStats();
        saveGameState();
    }
}, 30000); // Regenerate 1 energy every 30 seconds

// Initialize game on load
window.addEventListener('DOMContentLoaded', initGame);

// Close modals on background click
document.getElementById('help-modal').addEventListener('click', (e) => {
    if (e.target.id === 'help-modal') {
        closeHelp();
    }
});

// Expose closeHelp to global scope for onclick handler
window.closeHelp = closeHelp;
