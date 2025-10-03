// Game State
let gameState = {
    collectedCats: new Set(),
    playerEnergy: 100,
    currentEncounter: null,
    lastEncounterTime: 0,
    catHappiness: {}, // Track happiness for each cat (0-100)
    lastCareTime: {} // Track when each cat was last cared for
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
        playerEnergy: gameState.playerEnergy,
        catHappiness: gameState.catHappiness,
        lastCareTime: gameState.lastCareTime
    }));
}

function loadGameState() {
    const saved = localStorage.getItem('catCollectorGame');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.collectedCats = new Set(data.collectedCats);
        gameState.playerEnergy = data.playerEnergy;
        gameState.catHappiness = data.catHappiness || {};
        gameState.lastCareTime = data.lastCareTime || {};
        
        // Initialize happiness for collected cats if not set
        gameState.collectedCats.forEach(catId => {
            if (gameState.catHappiness[catId] === undefined) {
                gameState.catHappiness[catId] = 70; // Start at 70%
            }
        });
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
    
    // Care activities
    document.getElementById('care-btn').addEventListener('click', showCarePanel);
    document.getElementById('close-care').addEventListener('click', closeCarePanel);
    document.getElementById('feed-btn').addEventListener('click', () => handleCareActivity('feed'));
    document.getElementById('play-btn').addEventListener('click', () => handleCareActivity('play'));
    document.getElementById('groom-btn').addEventListener('click', () => handleCareActivity('groom'));
    document.getElementById('train-btn').addEventListener('click', startTrainingGame);
    document.getElementById('close-training').addEventListener('click', closeTrainingGame);
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
        // Initialize happiness for new cat
        gameState.catHappiness[cat.id] = 70;
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
    
    // Show happiness level
    const happiness = gameState.catHappiness[catId] || 70;
    const happinessDiv = document.getElementById('cat-happiness');
    let happinessEmoji = '😺';
    if (happiness >= 80) happinessEmoji = '😻';
    else if (happiness < 50) happinessEmoji = '😿';
    happinessDiv.innerHTML = `${happinessEmoji} Happiness: ${Math.round(happiness)}%`;
    
    // Store current cat ID for care activities
    modal.dataset.catId = catId;
    
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

// Cat Care Activities
let currentCareCatId = null;

function showCarePanel() {
    const detailsModal = document.getElementById('cat-details');
    const catId = parseInt(detailsModal.dataset.catId);
    
    if (!catId) return;
    
    currentCareCatId = catId;
    const cat = CAT_BREEDS.find(c => c.id === catId);
    
    if (!cat) return;
    
    // Populate care panel
    document.getElementById('care-cat-icon').textContent = cat.icon;
    document.getElementById('care-cat-name').textContent = cat.name;
    
    // Show happiness bar
    const happiness = gameState.catHappiness[catId] || 70;
    const happinessBarDiv = document.getElementById('care-happiness-bar');
    happinessBarDiv.innerHTML = `
        <label>Happiness</label>
        <div class="happiness-bar-bg">
            <div class="happiness-bar-fill" style="width: ${happiness}%"></div>
        </div>
    `;
    
    // Hide details modal and show care panel
    detailsModal.classList.add('hidden');
    document.getElementById('care-panel').classList.remove('hidden');
}

function closeCarePanel() {
    document.getElementById('care-panel').classList.add('hidden');
    // Show details modal again if we have a cat ID
    if (currentCareCatId) {
        showCatDetails(currentCareCatId);
    }
}

function handleCareActivity(activity) {
    if (!currentCareCatId) return;
    
    const cat = CAT_BREEDS.find(c => c.id === currentCareCatId);
    if (!cat) return;
    
    let happiness = gameState.catHappiness[currentCareCatId] || 70;
    let message = '';
    let happinessGain = 0;
    
    switch (activity) {
        case 'feed':
            // More effective for cats with lower energy stat
            happinessGain = 5 + Math.floor((100 - cat.stats.energy) / 10);
            message = `${cat.name} enjoyed the meal! 🍽️`;
            if (cat.stats.energy < 50) {
                message += '\nLazy cats love being fed!';
            }
            break;
            
        case 'play':
            // More effective for high energy cats
            happinessGain = 5 + Math.floor(cat.stats.energy / 10);
            message = `${cat.name} had a great time playing! 🎾`;
            if (cat.stats.energy > 80) {
                message += '\nEnergetic cats love to play!';
            }
            break;
            
        case 'groom':
            // More effective for high cuteness cats
            happinessGain = 5 + Math.floor(cat.stats.cuteness / 10);
            message = `${cat.name} looks beautiful and feels pampered! ✨`;
            if (cat.stats.cuteness > 90) {
                message += '\nBeautiful cats love grooming!';
            }
            break;
    }
    
    // Apply happiness gain
    happiness = Math.min(100, happiness + happinessGain);
    gameState.catHappiness[currentCareCatId] = happiness;
    gameState.lastCareTime[currentCareCatId] = Date.now();
    saveGameState();
    
    // Show result
    alert(`💕 ${message}\n\nHappiness +${happinessGain}%!`);
    
    // Update happiness display
    const happinessBarFill = document.querySelector('#care-happiness-bar .happiness-bar-fill');
    if (happinessBarFill) {
        happinessBarFill.style.width = `${happiness}%`;
    }
}

// Training Minigame
let trainingGameState = {
    score: 0,
    timeLeft: 10,
    isPlaying: false,
    timer: null,
    treatTimeout: null
};

function startTrainingGame() {
    if (!currentCareCatId) return;
    
    const cat = CAT_BREEDS.find(c => c.id === currentCareCatId);
    if (!cat) return;
    
    // Hide care panel
    document.getElementById('care-panel').classList.add('hidden');
    
    // Reset game state
    trainingGameState.score = 0;
    trainingGameState.timeLeft = 10;
    trainingGameState.isPlaying = true;
    
    // Show training panel
    document.getElementById('training-game').classList.remove('hidden');
    
    // Update displays
    document.getElementById('score-value').textContent = '0';
    document.getElementById('time-value').textContent = '10';
    
    // Position cat
    const trainingCat = document.getElementById('training-cat');
    trainingCat.textContent = cat.icon;
    trainingCat.style.left = '50%';
    trainingCat.style.top = '50%';
    trainingCat.style.transform = 'translate(-50%, -50%)';
    
    // Start timer
    trainingGameState.timer = setInterval(() => {
        trainingGameState.timeLeft--;
        document.getElementById('time-value').textContent = trainingGameState.timeLeft;
        
        if (trainingGameState.timeLeft <= 0) {
            endTrainingGame();
        }
    }, 1000);
    
    // Show first treat
    setTimeout(() => showTrainingTreat(), 500);
}

function showTrainingTreat() {
    if (!trainingGameState.isPlaying) return;
    
    const arena = document.getElementById('training-arena');
    const treat = document.getElementById('training-treat');
    const trainingCat = document.getElementById('training-cat');
    
    // Random position for treat
    const x = Math.random() * (arena.offsetWidth - 80) + 40;
    const y = Math.random() * (arena.offsetHeight - 80) + 40;
    
    treat.style.left = x + 'px';
    treat.style.top = y + 'px';
    treat.classList.remove('hidden');
    
    // Make cat look at treat
    const catX = parseFloat(trainingCat.style.left) || arena.offsetWidth / 2;
    if (x < catX) {
        trainingCat.style.transform = 'translate(-50%, -50%) scaleX(-1)';
    } else {
        trainingCat.style.transform = 'translate(-50%, -50%) scaleX(1)';
    }
    
    // Add click handler
    treat.onclick = catchTreat;
    
    // Hide treat after 2 seconds if not clicked
    trainingGameState.treatTimeout = setTimeout(() => {
        treat.classList.add('hidden');
        if (trainingGameState.isPlaying && trainingGameState.timeLeft > 0) {
            setTimeout(() => showTrainingTreat(), 500);
        }
    }, 2000);
}

function catchTreat() {
    if (!trainingGameState.isPlaying) return;
    
    // Clear timeout
    clearTimeout(trainingGameState.treatTimeout);
    
    // Hide treat
    const treat = document.getElementById('training-treat');
    treat.classList.add('hidden');
    
    // Increase score
    trainingGameState.score++;
    document.getElementById('score-value').textContent = trainingGameState.score;
    
    // Check if won
    if (trainingGameState.score >= 5) {
        endTrainingGame();
    } else {
        // Show next treat
        setTimeout(() => showTrainingTreat(), 500);
    }
}

function endTrainingGame() {
    trainingGameState.isPlaying = false;
    
    // Clear timer
    if (trainingGameState.timer) {
        clearInterval(trainingGameState.timer);
    }
    
    // Clear treat timeout
    if (trainingGameState.treatTimeout) {
        clearTimeout(trainingGameState.treatTimeout);
    }
    
    const cat = CAT_BREEDS.find(c => c.id === currentCareCatId);
    let happiness = gameState.catHappiness[currentCareCatId] || 70;
    
    // Calculate happiness gain based on score and intelligence
    const baseGain = trainingGameState.score * 3;
    const intelligenceBonus = Math.floor(cat.stats.intelligence / 20);
    const happinessGain = baseGain + intelligenceBonus;
    
    happiness = Math.min(100, happiness + happinessGain);
    gameState.catHappiness[currentCareCatId] = happiness;
    saveGameState();
    
    let message = '';
    if (trainingGameState.score >= 5) {
        message = `🎉 Perfect! ${cat.name} learned the trick!\n\nHappiness +${happinessGain}%!`;
    } else if (trainingGameState.score >= 3) {
        message = `Good job! ${cat.name} is learning!\n\nHappiness +${happinessGain}%!`;
    } else {
        message = `${cat.name} needs more practice, but had fun!\n\nHappiness +${happinessGain}%!`;
    }
    
    alert(message);
    
    // Close training game
    closeTrainingGame();
}

function closeTrainingGame() {
    trainingGameState.isPlaying = false;
    
    // Clear timers
    if (trainingGameState.timer) {
        clearInterval(trainingGameState.timer);
    }
    if (trainingGameState.treatTimeout) {
        clearTimeout(trainingGameState.treatTimeout);
    }
    
    // Hide training panel
    document.getElementById('training-game').classList.add('hidden');
    document.getElementById('training-treat').classList.add('hidden');
    
    // Show care panel again
    if (currentCareCatId) {
        showCarePanel();
    }
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
