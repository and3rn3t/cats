/**
 * Mini-Games System for Cat Collector
 * Version: 2.4.0
 * 
 * Three mini-games players can enjoy with collected cats:
 * 1. Follow the Treat - Memory/sequence game
 * 2. Cat Toy Chase - Timing/reaction game
 * 3. Hide and Seek - Observation/click game
 */

// Mini-game state
const minigameState = {
    currentGame: null,
    currentCat: null,
    score: 0,
    highScores: {
        followTheTreat: 0,
        catToyChase: 0,
        hideAndSeek: 0
    },
    isPlaying: false,
    gamesPlayed: 0
};

/**
 * Initialize mini-games system
 * Load high scores from localStorage
 */
function initMinigames() {
    loadMinigameScores();
    console.log('🎮 Mini-games system initialized');
}

/**
 * Load high scores from localStorage
 */
function loadMinigameScores() {
    try {
        const saved = localStorage.getItem('catCollectorMinigames');
        if (saved) {
            const data = JSON.parse(saved);
            minigameState.highScores = data.highScores || minigameState.highScores;
            minigameState.gamesPlayed = data.gamesPlayed || 0;
        }
    } catch (error) {
        console.error('Failed to load minigame scores:', error);
    }
}

/**
 * Save high scores to localStorage
 */
function saveMinigameScores() {
    try {
        localStorage.setItem('catCollectorMinigames', JSON.stringify({
            highScores: minigameState.highScores,
            gamesPlayed: minigameState.gamesPlayed
        }));
        
        // Also sync to main gameState for achievements
        if (window.gameState) {
            window.gameState.minigameHighScores = minigameState.highScores;
            window.gameState.minigamesPlayed = minigameState.gamesPlayed;
            if (window.saveGame) {
                window.saveGame();
            }
            // Check for new achievements
            if (window.updateAchievements) {
                window.updateAchievements(window.gameState);
            }
        }
    } catch (error) {
        console.error('Failed to save minigame scores:', error);
    }
}

/**
 * Show mini-game selection modal for a specific cat
 * @param {Object} cat - The cat to play with
 */
function showMinigameSelection(cat) {
    if (!cat) return;
    
    minigameState.currentCat = cat;
    
    const modal = document.getElementById('minigame-modal');
    if (!modal) {
        console.error('Minigame modal not found');
        return;
    }
    
    // Update modal content
    const catName = document.getElementById('minigame-cat-name');
    const catIcon = document.getElementById('minigame-cat-icon');
    
    if (catName) catName.textContent = cat.name;
    if (catIcon) catIcon.textContent = cat.icon;
    
    // Update high scores display
    updateHighScoresDisplay();
    
    // Show game selection screen
    showGameSelection();
    
    modal.showModal();
    
    if (window.playButtonClick) playButtonClick();
}

/**
 * Close mini-game modal
 */
function closeMinigameModal() {
    const modal = document.getElementById('minigame-modal');
    if (modal) {
        modal.close();
        minigameState.currentGame = null;
        minigameState.isPlaying = false;
    }
    
    if (window.playButtonClick) playButtonClick();
}

/**
 * Show game selection screen
 */
function showGameSelection() {
    const selectionScreen = document.getElementById('game-selection');
    const gameScreen = document.getElementById('game-screen');
    
    if (selectionScreen) selectionScreen.style.display = 'block';
    if (gameScreen) gameScreen.style.display = 'none';
}

/**
 * Update high scores display
 */
function updateHighScoresDisplay() {
    const scores = minigameState.highScores;
    
    const elements = {
        'high-score-treat': scores.followTheTreat,
        'high-score-chase': scores.catToyChase,
        'high-score-seek': scores.hideAndSeek
    };
    
    for (const [id, score] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = score;
    }
}

/**
 * Start a specific mini-game
 * @param {string} gameName - Name of the game to start
 */
function startMinigame(gameName) {
    minigameState.currentGame = gameName;
    minigameState.score = 0;
    minigameState.isPlaying = true;
    
    // Track minigame play for challenges (Phase 5.1)
    if (window.gameState && window.updateChallengeProgress) {
        updateChallengeProgress(window.gameState, 'minigame_played');
    }
    
    // Hide selection, show game screen
    const selectionScreen = document.getElementById('game-selection');
    const gameScreen = document.getElementById('minigame-screen');
    
    if (!selectionScreen || !gameScreen) {
        console.error('Game screen elements not found!');
        alert('Error: Game screen elements not found. Please refresh the page.');
        return;
    }
    
    selectionScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // Start the appropriate game
    switch (gameName) {
        case 'followTheTreat':
            startFollowTheTreat();
            break;
        case 'catToyChase':
            startCatToyChase();
            break;
        case 'hideAndSeek':
            startHideAndSeek();
            break;
        default:
            console.error('Unknown game:', gameName);
    }
    
    if (window.playButtonClick) playButtonClick();
}

// ============================================================================
// GAME 1: Follow the Treat (Memory/Sequence Game)
// ============================================================================

let treatSequence = [];
let playerSequence = [];
let treatLevel = 1;
let showingSequence = false;

/**
 * Start "Follow the Treat" memory game
 */
function startFollowTheTreat() {
    treatSequence = [];
    playerSequence = [];
    treatLevel = 1;
    
    const gameArea = document.getElementById('minigame-area');
    if (!gameArea) {
        console.error('Game area not found!');
        return;
    }
    
    gameArea.innerHTML = `
        <div class="minigame-header">
            <h3>🍖 Follow the Treat</h3>
            <p>Watch the sequence, then repeat it!</p>
            <p class="minigame-score">Level: <span id="treat-level">1</span></p>
        </div>
        <div class="treat-grid">
            <button class="treat-button" data-position="0" aria-label="Treat position 1">🍖</button>
            <button class="treat-button" data-position="1" aria-label="Treat position 2">🍖</button>
            <button class="treat-button" data-position="2" aria-label="Treat position 3">🍖</button>
            <button class="treat-button" data-position="3" aria-label="Treat position 4">🍖</button>
        </div>
        <div class="minigame-status">
            <p id="treat-message">Watch carefully...</p>
        </div>
        <button id="back-to-selection" class="action-btn">← Back to Games</button>
    `;
    
    // Add event listeners
    document.querySelectorAll('.treat-button').forEach(btn => {
        btn.addEventListener('click', handleTreatClick);
    });
    
    document.getElementById('back-to-selection')?.addEventListener('click', () => {
        showGameSelection();
        minigameState.isPlaying = false;
    });
    
    // Start first round
    setTimeout(() => nextTreatRound(), 1000);
}

/**
 * Generate and show next sequence in Follow the Treat
 */
function nextTreatRound() {
    playerSequence = [];
    showingSequence = true;
    
    // Add random position to sequence
    treatSequence.push(Math.floor(Math.random() * 4));
    
    const message = document.getElementById('treat-message');
    if (message) message.textContent = `Level ${treatLevel} - Watch!`;
    
    // Show sequence
    showTreatSequence(0);
}

/**
 * Show treat sequence animation
 * @param {number} index - Current index in sequence
 */
function showTreatSequence(index) {
    if (index >= treatSequence.length) {
        showingSequence = false;
        const message = document.getElementById('treat-message');
        if (message) message.textContent = 'Your turn! Repeat the sequence.';
        return;
    }
    
    const position = treatSequence[index];
    const button = document.querySelector(`.treat-button[data-position="${position}"]`);
    
    if (button) {
        button.classList.add('treat-active');
        if (window.playButtonClick) playButtonClick();
        
        setTimeout(() => {
            button.classList.remove('treat-active');
            setTimeout(() => showTreatSequence(index + 1), 300);
        }, 500);
    }
}

/**
 * Handle player clicking a treat button
 * @param {Event} e - Click event
 */
function handleTreatClick(e) {
    if (showingSequence || !minigameState.isPlaying) return;
    
    const position = parseInt(e.target.dataset.position);
    playerSequence.push(position);
    
    // Visual feedback
    e.target.classList.add('treat-active');
    setTimeout(() => e.target.classList.remove('treat-active'), 200);
    
    if (window.playButtonClick) playButtonClick();
    
    // Check if correct
    const currentIndex = playerSequence.length - 1;
    
    if (playerSequence[currentIndex] !== treatSequence[currentIndex]) {
        // Wrong! Game over
        treatGameOver(false);
        return;
    }
    
    // Check if sequence complete
    if (playerSequence.length === treatSequence.length) {
        // Correct! Next level
        treatLevel++;
        minigameState.score = treatLevel - 1;
        
        const levelDisplay = document.getElementById('treat-level');
        if (levelDisplay) levelDisplay.textContent = treatLevel;
        
        const message = document.getElementById('treat-message');
        if (message) message.textContent = '✅ Correct! Get ready...';
        
        if (window.playSuccess) playSuccess();
        
        setTimeout(() => nextTreatRound(), 1500);
    }
}

/**
 * End Follow the Treat game
 * @param {boolean} won - Whether player won
 */
function treatGameOver(won) {
    minigameState.isPlaying = false;
    minigameState.gamesPlayed++;
    
    const message = document.getElementById('treat-message');
    const finalScore = treatLevel - 1;
    
    if (message) {
        message.textContent = `Game Over! Final Level: ${finalScore}`;
    }
    
    if (window.playFailure) playFailure();
    
    // Update high score
    if (finalScore > minigameState.highScores.followTheTreat) {
        minigameState.highScores.followTheTreat = finalScore;
        saveMinigameScores();
        
        if (message) {
            message.textContent = `🎉 New High Score! Level ${finalScore}`;
        }
        if (window.playSuccess) playSuccess();
    } else {
        // Save games played count even if no high score
        saveMinigameScores();
    }
    
    // Show back button
    setTimeout(() => {
        const gameArea = document.getElementById('game-area');
        if (gameArea) {
            gameArea.innerHTML += `
                <button id="play-again" class="action-btn">🔄 Play Again</button>
            `;
            document.getElementById('play-again')?.addEventListener('click', startFollowTheTreat);
        }
    }, 2000);
}

// ============================================================================
// GAME 2: Cat Toy Chase (Timing/Reaction Game)
// ============================================================================

let toyPosition = { x: 50, y: 50 };
let toyInterval = null;
let chaseScore = 0;
let chaseTimeLeft = 30;
let chaseTimer = null;

/**
 * Start "Cat Toy Chase" timing game
 */
function startCatToyChase() {
    chaseScore = 0;
    chaseTimeLeft = 30;
    
    const gameArea = document.getElementById('minigame-area');
    if (!gameArea) {
        console.error('Game area not found!');
        return;
    }
    
    gameArea.innerHTML = `
        <div class="minigame-header">
            <h3>🎾 Cat Toy Chase</h3>
            <p>Click the moving toy!</p>
            <p class="minigame-score">
                Score: <span id="chase-score">0</span> | 
                Time: <span id="chase-time">30</span>s
            </p>
        </div>
        <div class="chase-area" id="chase-area">
            <button class="toy-target" id="toy-target" aria-label="Catch the toy">🎾</button>
        </div>
        <button id="back-to-selection" class="action-btn">← Back to Games</button>
    `;
    
    const toy = document.getElementById('toy-target');
    if (toy) {
        toy.addEventListener('click', handleToyClick);
    }
    
    document.getElementById('back-to-selection')?.addEventListener('click', () => {
        stopCatToyChase();
        showGameSelection();
    });
    
    // Start game
    moveToyRandom();
    toyInterval = setInterval(moveToyRandom, 1500);
    chaseTimer = setInterval(updateChaseTimer, 1000);
}

/**
 * Move toy to random position
 */
function moveToyRandom() {
    const area = document.getElementById('chase-area');
    const toy = document.getElementById('toy-target');
    if (!area || !toy) return;
    
    const areaRect = area.getBoundingClientRect();
    const toySize = 50;
    
    const maxX = areaRect.width - toySize;
    const maxY = areaRect.height - toySize;
    
    toyPosition.x = Math.random() * maxX;
    toyPosition.y = Math.random() * maxY;
    
    toy.style.left = `${toyPosition.x}px`;
    toy.style.top = `${toyPosition.y}px`;
}

/**
 * Handle toy click
 */
function handleToyClick() {
    if (!minigameState.isPlaying) return;
    
    chaseScore++;
    const scoreDisplay = document.getElementById('chase-score');
    if (scoreDisplay) scoreDisplay.textContent = chaseScore;
    
    if (window.playButtonClick) playButtonClick();
    
    // Move toy immediately
    moveToyRandom();
}

/**
 * Update chase timer
 */
function updateChaseTimer() {
    chaseTimeLeft--;
    
    const timeDisplay = document.getElementById('chase-time');
    if (timeDisplay) timeDisplay.textContent = chaseTimeLeft;
    
    if (chaseTimeLeft <= 0) {
        chaseGameOver();
    }
}

/**
 * Stop Cat Toy Chase game
 */
function stopCatToyChase() {
    if (toyInterval) {
        clearInterval(toyInterval);
        toyInterval = null;
    }
    if (chaseTimer) {
        clearInterval(chaseTimer);
        chaseTimer = null;
    }
    minigameState.isPlaying = false;
}

/**
 * End Cat Toy Chase game
 */
function chaseGameOver() {
    stopCatToyChase();
    
    minigameState.score = chaseScore;
    minigameState.gamesPlayed++;
    
    const gameArea = document.getElementById('minigame-area');
    if (!gameArea) return;
    
    let message = `Game Over! You caught ${chaseScore} toys!`;
    
    // Update high score
    if (chaseScore > minigameState.highScores.catToyChase) {
        minigameState.highScores.catToyChase = chaseScore;
        saveMinigameScores();
        message = `🎉 New High Score! ${chaseScore} toys caught!`;
        if (window.playSuccess) playSuccess();
    } else {
        if (window.playFailure) playFailure();
        // Save games played count even if no high score
        saveMinigameScores();
    }
    
    gameArea.innerHTML = `
        <div class="minigame-header">
            <h3>🎾 Cat Toy Chase</h3>
            <p class="minigame-result">${message}</p>
        </div>
        <button id="play-again" class="action-btn">🔄 Play Again</button>
        <button id="back-to-selection" class="action-btn">← Back to Games</button>
    `;
    
    document.getElementById('play-again')?.addEventListener('click', startCatToyChase);
    document.getElementById('back-to-selection')?.addEventListener('click', showGameSelection);
}

// ============================================================================
// GAME 3: Hide and Seek (Observation/Click Game)
// ============================================================================

let hiddenCatPosition = 0;
let seekRound = 1;
let seekScore = 0;

/**
 * Start "Hide and Seek" observation game
 */
function startHideAndSeek() {
    seekRound = 1;
    seekScore = 0;
    
    const gameArea = document.getElementById('minigame-area');
    if (!gameArea) return;
    
    gameArea.innerHTML = `
        <div class="minigame-header">
            <h3>🙈 Hide and Seek</h3>
            <p>Find the hiding cat!</p>
            <p class="minigame-score">Round: <span id="seek-round">1</span> | Score: <span id="seek-score">0</span></p>
        </div>
        <div class="seek-grid" id="seek-grid">
            <!-- Boxes will be added by JavaScript -->
        </div>
        <div class="minigame-status">
            <p id="seek-message">Find ${minigameState.currentCat?.icon || '😺'}!</p>
        </div>
        <button id="back-to-selection" class="action-btn">← Back to Games</button>
    `;
    
    document.getElementById('back-to-selection')?.addEventListener('click', () => {
        showGameSelection();
        minigameState.isPlaying = false;
    });
    
    nextSeekRound();
}

/**
 * Start next round of Hide and Seek
 */
function nextSeekRound() {
    const grid = document.getElementById('seek-grid');
    if (!grid) return;
    
    // Increase difficulty: more boxes each round
    const boxCount = Math.min(4 + seekRound, 12);
    hiddenCatPosition = Math.floor(Math.random() * boxCount);
    
    grid.innerHTML = '';
    
    // Create boxes
    for (let i = 0; i < boxCount; i++) {
        const box = document.createElement('button');
        box.className = 'seek-box';
        box.dataset.position = i;
        box.textContent = '📦';
        box.setAttribute('aria-label', `Box ${i + 1}`);
        box.addEventListener('click', handleSeekClick);
        grid.appendChild(box);
    }
    
    const message = document.getElementById('seek-message');
    if (message) {
        message.textContent = `Find ${minigameState.currentCat?.icon || '😺'}!`;
    }
}

/**
 * Handle box click in Hide and Seek
 * @param {Event} e - Click event
 */
/**
 * Handle correct box selection in Hide and Seek
 * @param {HTMLElement} targetBox - The clicked box element
 */
function handleCorrectSeekBox(targetBox) {
    targetBox.textContent = minigameState.currentCat?.icon || '😺';
    targetBox.classList.add('seek-found');
    
    seekScore += 10;
    seekRound++;
    
    const roundDisplay = document.getElementById('seek-round');
    const scoreDisplay = document.getElementById('seek-score');
    const message = document.getElementById('seek-message');
    
    if (roundDisplay) roundDisplay.textContent = seekRound;
    if (scoreDisplay) scoreDisplay.textContent = seekScore;
    if (message) message.textContent = '✅ Found it!';
    
    if (window.playSuccess) playSuccess();
    
    setTimeout(() => nextSeekRound(), 1500);
}

/**
 * Handle wrong box selection in Hide and Seek
 * @param {HTMLElement} targetBox - The clicked box element
 * @param {number} correctPosition - The correct hidden position
 */
function handleWrongSeekBox(targetBox, correctPosition) {
    targetBox.textContent = '❌';
    targetBox.classList.add('seek-wrong');
    
    // Reveal correct position
    const correctBox = document.querySelector(`.seek-box[data-position="${correctPosition}"]`);
    if (correctBox) {
        correctBox.textContent = minigameState.currentCat?.icon || '😺';
        correctBox.classList.add('seek-found');
    }
    
    const message = document.getElementById('seek-message');
    if (message) message.textContent = 'Wrong box! Game Over!';
    
    seekGameOver();
}

/**
 * Handle box click in Hide and Seek game
 * @param {Event} e - Click event
 */
function handleSeekClick(e) {
    if (!minigameState.isPlaying) return;
    
    const position = parseInt(e.target.dataset.position);
    
    if (position === hiddenCatPosition) {
        handleCorrectSeekBox(e.target);
    } else {
        handleWrongSeekBox(e.target, hiddenCatPosition);
    }
    
    if (window.playButtonClick) playButtonClick();
}

/**
 * End Hide and Seek game
 */
function seekGameOver() {
    minigameState.isPlaying = false;
    minigameState.score = seekScore;
    minigameState.gamesPlayed++;
    
    if (window.playFailure) playFailure();
    
    let resultMessage = `Game Over! Final Score: ${seekScore}`;
    
    // Update high score
    if (seekScore > minigameState.highScores.hideAndSeek) {
        minigameState.highScores.hideAndSeek = seekScore;
        saveMinigameScores();
        resultMessage = `🎉 New High Score! ${seekScore} points!`;
        if (window.playSuccess) playSuccess();
    } else {
        // Save games played count even if no high score
        saveMinigameScores();
    }
    
    const message = document.getElementById('seek-message');
    if (message) message.textContent = resultMessage;
    
    // Add play again button
    setTimeout(() => {
        const gameArea = document.getElementById('minigame-area');
        if (gameArea) {
            const playAgainBtn = document.createElement('button');
            playAgainBtn.id = 'play-again';
            playAgainBtn.className = 'action-btn';
            playAgainBtn.textContent = '🔄 Play Again';
            playAgainBtn.addEventListener('click', startHideAndSeek);
            gameArea.appendChild(playAgainBtn);
        }
    }, 2000);
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.initMinigames = initMinigames;
    window.showMinigameSelection = showMinigameSelection;
    window.closeMinigameModal = closeMinigameModal;
    window.startMinigame = startMinigame;
}
