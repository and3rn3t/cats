/**
 * Cat Encyclopedia System for Cat Collector
 * Educational content about cat breeds, geography, and fun facts
 * Version: 2.8.0g
 */

// Educational facts database
const ENCYCLOPEDIA_FACTS = {
    // General cat facts
    general: [
        "Cats spend 70% of their lives sleeping - that's about 13-16 hours a day!",
        "A group of cats is called a 'clowder' and a group of kittens is called a 'kindle'.",
        "Cats can rotate their ears 180 degrees and have 32 muscles in each ear!",
        "A cat's purr vibrates at a frequency of 25-150 Hertz, which can help heal bones.",
        "Cats have over 20 different vocalizations, including the meow, purr, chirp, and hiss.",
        "A cat's nose print is unique, just like a human fingerprint!",
        "Cats can jump up to 6 times their length in a single bound.",
        "The world's oldest cat lived to be 38 years old!",
        "Cats have a third eyelid called a 'haw' that helps protect their eyes.",
        "A cat's heart beats twice as fast as a human heart, at 110-140 beats per minute."
    ],
    
    // Region-specific facts
    regions: {
        "Persia (Iran)": {
            fact: "Persian cats have been treasured for thousands of years and were brought to Europe in the 1600s.",
            geography: "Iran is located in Western Asia and is known for its rich history and Persian culture."
        },
        "Maine, USA": {
            fact: "Maine Coons are the official state cat of Maine and can weigh up to 25 pounds!",
            geography: "Maine is the northeasternmost US state, known for its rocky coastline and forests."
        },
        "Norway": {
            fact: "Norwegian Forest Cats are featured in Norse mythology and may have traveled with Vikings!",
            geography: "Norway is a Scandinavian country known for its fjords, mountains, and northern lights."
        },
        "Japan": {
            fact: "In Japan, the 'maneki-neko' (beckoning cat) statue is believed to bring good luck.",
            geography: "Japan is an island nation in East Asia, known for its blend of traditional and modern culture."
        },
        "Egypt": {
            fact: "Ancient Egyptians worshipped cats and even mummified them! Harming a cat was punishable by death.",
            geography: "Egypt is home to the ancient pyramids and is located in northeastern Africa."
        },
        "Thailand": {
            fact: "Siamese cats were once royal cats in Thailand, guarding temples and palaces.",
            geography: "Thailand is in Southeast Asia, known for its tropical beaches and Buddhist temples."
        },
        "Russia": {
            fact: "Russian Blue cats were once the preferred pets of Russian czars and royalty.",
            geography: "Russia is the world's largest country, spanning Eastern Europe and Northern Asia."
        },
        "Turkey": {
            fact: "Turkish Angora cats are one of the oldest natural cat breeds in the world.",
            geography: "Turkey bridges Europe and Asia and is known for its rich historical heritage."
        },
        "Scotland": {
            fact: "Scottish Fold cats have a genetic mutation that makes their ears fold forward.",
            geography: "Scotland is part of the United Kingdom, known for its highlands and historic castles."
        },
        "Myanmar (Burma)": {
            fact: "Burmese cats were considered sacred in Burmese temples and brought good fortune.",
            geography: "Myanmar is in Southeast Asia, known for its golden temples and diverse cultures."
        },
        "France": {
            fact: "Chartreux cats are known as the 'smiling cats' of France due to their facial structure.",
            geography: "France is in Western Europe, famous for its art, culture, and cuisine."
        },
        "Ethiopia": {
            fact: "Abyssinian cats resemble the sacred cats depicted in ancient Egyptian art.",
            geography: "Ethiopia is in East Africa and is one of the oldest nations in the world."
        },
        "USA": {
            fact: "The United States has developed many modern cat breeds through selective breeding.",
            geography: "The USA is a large country in North America with diverse climates and landscapes."
        },
        "UK": {
            fact: "British Shorthair cats were brought to Britain by the Romans nearly 2,000 years ago.",
            geography: "The United Kingdom includes England, Scotland, Wales, and Northern Ireland."
        },
        "Canada": {
            fact: "The Sphynx cat, despite appearing hairless, actually has a fine layer of fuzz.",
            geography: "Canada is the second-largest country in the world by area, known for its natural beauty."
        },
        "Singapore": {
            fact: "The Singapura is one of the smallest cat breeds, weighing only 4-8 pounds.",
            geography: "Singapore is a small island city-state in Southeast Asia, known for its modern skyline."
        },
        "Somalia": {
            fact: "Somali cats are closely related to Abyssinians but have longer, flowing coats.",
            geography: "Somalia is in the Horn of Africa, along the coast of the Indian Ocean."
        }
    }
};

// Quiz questions database
const QUIZ_QUESTIONS = [
    {
        question: "Which country do Persian cats originally come from?",
        answers: ["Iran", "Turkey", "Egypt", "India"],
        correct: 0,
        difficulty: "easy",
        category: "geography"
    },
    {
        question: "What is the largest domestic cat breed?",
        answers: ["Persian", "Maine Coon", "Siamese", "Ragdoll"],
        correct: 1,
        difficulty: "easy",
        category: "breeds"
    },
    {
        question: "How many hours do cats typically sleep per day?",
        answers: ["8-10 hours", "10-12 hours", "13-16 hours", "18-20 hours"],
        correct: 2,
        difficulty: "easy",
        category: "facts"
    },
    {
        question: "Which cat breed is known for going limp when picked up?",
        answers: ["Ragdoll", "Persian", "Maine Coon", "Siamese"],
        correct: 0,
        difficulty: "medium",
        category: "breeds"
    },
    {
        question: "What is a group of cats called?",
        answers: ["A pack", "A pride", "A clowder", "A gaggle"],
        correct: 2,
        difficulty: "medium",
        category: "facts"
    },
    {
        question: "Which ancient civilization worshipped cats?",
        answers: ["Romans", "Greeks", "Egyptians", "Vikings"],
        correct: 2,
        difficulty: "easy",
        category: "history"
    },
    {
        question: "How many muscles does a cat have in each ear?",
        answers: ["10", "20", "32", "50"],
        correct: 2,
        difficulty: "hard",
        category: "facts"
    },
    {
        question: "Which cat breed is the official state cat of Maine?",
        answers: ["American Shorthair", "Maine Coon", "Ragdoll", "Persian"],
        correct: 1,
        difficulty: "medium",
        category: "geography"
    },
    {
        question: "What is unique about a cat's nose?",
        answers: ["It changes color", "It's always wet", "It has a unique print", "It can smell underwater"],
        correct: 2,
        difficulty: "medium",
        category: "facts"
    },
    {
        question: "Which country are Siamese cats originally from?",
        answers: ["China", "Japan", "Thailand", "Vietnam"],
        correct: 2,
        difficulty: "easy",
        category: "geography"
    },
    {
        question: "How far can a cat jump in a single bound?",
        answers: ["3 times their length", "6 times their length", "10 times their length", "12 times their length"],
        correct: 1,
        difficulty: "hard",
        category: "facts"
    },
    {
        question: "What is a cat's third eyelid called?",
        answers: ["Haw", "Nictitate", "Membrane", "Shield"],
        correct: 0,
        difficulty: "hard",
        category: "facts"
    },
    {
        question: "Which cat breed traveled with Vikings?",
        answers: ["British Shorthair", "Norwegian Forest Cat", "Maine Coon", "Siberian"],
        correct: 1,
        difficulty: "medium",
        category: "history"
    },
    {
        question: "How fast does a cat's heart beat per minute?",
        answers: ["60-80 beats", "110-140 beats", "150-180 beats", "200-240 beats"],
        correct: 1,
        difficulty: "hard",
        category: "facts"
    },
    {
        question: "What is the smallest cat breed?",
        answers: ["Munchkin", "Singapura", "Devon Rex", "Cornish Rex"],
        correct: 1,
        difficulty: "medium",
        category: "breeds"
    },
    {
        question: "Which cat breed is known as the 'smiling cat'?",
        answers: ["British Shorthair", "Chartreux", "Russian Blue", "Scottish Fold"],
        correct: 1,
        difficulty: "hard",
        category: "breeds"
    },
    {
        question: "In which country is the 'maneki-neko' lucky cat statue from?",
        answers: ["China", "Japan", "Korea", "Thailand"],
        correct: 1,
        difficulty: "easy",
        category: "culture"
    },
    {
        question: "What frequency does a cat's purr vibrate at?",
        answers: ["10-50 Hertz", "25-150 Hertz", "200-300 Hertz", "500-1000 Hertz"],
        correct: 1,
        difficulty: "hard",
        category: "facts"
    },
    {
        question: "How old was the world's oldest cat?",
        answers: ["25 years", "30 years", "38 years", "45 years"],
        correct: 2,
        difficulty: "hard",
        category: "facts"
    },
    {
        question: "Which cat breed has folded ears?",
        answers: ["American Curl", "Scottish Fold", "Devon Rex", "Cornish Rex"],
        correct: 1,
        difficulty: "easy",
        category: "breeds"
    }
];

// Encyclopedia state
const encyclopediaState = {
    currentView: 'index', // 'index', 'breed', 'geography', 'quiz'
    currentBreed: null,
    quizScore: 0,
    quizQuestions: [],
    currentQuestionIndex: 0,
    quizAnswers: [],
    bestScore: 0
};

// ============================================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================================

/**
 * Initialize encyclopedia system
 * Load saved quiz scores
 */
function initEncyclopedia() {
    loadEncyclopediaData();
    console.log('📚 Encyclopedia system initialized');
}

/**
 * Load encyclopedia data from localStorage
 */
function loadEncyclopediaData() {
    try {
        const saved = localStorage.getItem('catCollectorEncyclopedia');
        if (saved) {
            const data = JSON.parse(saved);
            encyclopediaState.bestScore = data.bestScore || 0;
        }
    } catch (error) {
        console.error('Failed to load encyclopedia data:', error);
    }
}

/**
 * Save encyclopedia data to localStorage
 */
function saveEncyclopediaData() {
    try {
        localStorage.setItem('catCollectorEncyclopedia', JSON.stringify({
            bestScore: encyclopediaState.bestScore
        }));
    } catch (error) {
        console.error('Failed to save encyclopedia data:', error);
    }
}

/**
 * Open encyclopedia panel
 */
function openEncyclopedia() {
    console.log('📚 openEncyclopedia() called');
    const panel = document.getElementById('encyclopedia-panel');
    if (!panel) {
        console.error('❌ Encyclopedia panel not found');
        return;
    }
    
    console.log('📚 Panel found, rendering index...');
    renderEncyclopediaIndex();
    panel.classList.remove('hidden');
    console.log('📚 Panel visible');
    
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
 * Close encyclopedia panel
 */
function closeEncyclopedia() {
    const panel = document.getElementById('encyclopedia-panel');
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

/**
 * Render encyclopedia index/home page
 */
function renderEncyclopediaIndex() {
    console.log('📚 renderEncyclopediaIndex() called');
    const content = document.getElementById('encyclopedia-content');
    if (!content) {
        console.error('❌ encyclopedia-content element not found');
        return;
    }
    
    console.log('📚 Content element found, rendering...');
    encyclopediaState.currentView = 'index';
    
    const collectedCount = window.gameState ? window.gameState.collectedCats.size : 0;
    const totalCats = window.CAT_BREEDS ? window.CAT_BREEDS.length : 40;
    const completionPercent = Math.round((collectedCount / totalCats) * 100);
    
    console.log(`📚 Collected: ${collectedCount}/${totalCats} (${completionPercent}%)`);
    
    content.innerHTML = `
        <div class="encyclopedia-home">
            <div class="encyclopedia-welcome">
                <h3>📚 Welcome to the Cat Encyclopedia!</h3>
                <p>Learn about cat breeds, geography, and fun facts!</p>
            </div>
            
            <div class="encyclopedia-progress">
                <h4>Your Progress</h4>
                <div class="progress-stats">
                    <span class="stat-item">
                        <span class="encyclopedia-stat-icon">🐱</span>
                        <span>${collectedCount} / ${totalCats} Cats Discovered</span>
                    </span>
                    <div class="encyclopedia-progress-bar-container">
                        <div class="encyclopedia-progress-fill" style="width: ${completionPercent}%"></div>
                    </div>
                    <span class="stat-percentage">${completionPercent}% Complete</span>
                </div>
            </div>
            
            <div class="encyclopedia-menu">
                <button class="encyclopedia-menu-btn" onclick="showBreedGuide()" aria-label="View breed guide">
                    <span class="menu-icon">😺</span>
                    <h4>Breed Guide</h4>
                    <p>Learn about all ${totalCats} cat breeds</p>
                </button>
                
                <button class="encyclopedia-menu-btn" onclick="showGeographyMap()" aria-label="View geography map">
                    <span class="menu-icon">🗺️</span>
                    <h4>World Map</h4>
                    <p>Discover where cats come from</p>
                </button>
                
                <button class="encyclopedia-menu-btn" onclick="showFunFacts()" aria-label="View fun facts">
                    <span class="menu-icon">💡</span>
                    <h4>Fun Facts</h4>
                    <p>Amazing cat trivia & science</p>
                </button>
                
                <button class="encyclopedia-menu-btn quiz-btn" onclick="startQuiz()" aria-label="Start quiz">
                    <span class="menu-icon">🎓</span>
                    <h4>Knowledge Quiz</h4>
                    <p>Test what you've learned!</p>
                    ${encyclopediaState.bestScore > 0 ? `<span class="best-score">Best: ${encyclopediaState.bestScore}/10</span>` : ''}
                </button>
            </div>
            
            <div class="encyclopedia-tip">
                <p>💡 <strong>Tip:</strong> Collect more cats to unlock detailed information about their breeds and origins!</p>
            </div>
        </div>
    `;
}

/**
 * Show breed guide with all cats
 */
function showBreedGuide() {
    const content = document.getElementById('encyclopedia-content');
    if (!content || !window.CAT_BREEDS) return;
    
    encyclopediaState.currentView = 'breeds';
    
    const collected = window.gameState ? window.gameState.collectedCats : new Set();
    
    // Group cats by environment
    const environments = {
        forest: [], mountain: [], desert: [], city: [], beach: []
    };
    
    window.CAT_BREEDS.forEach(cat => {
        if (environments[cat.environment]) {
            environments[cat.environment].push(cat);
        }
    });
    
    let html = `
        <div class="encyclopedia-header">
            <button class="back-btn" onclick="renderEncyclopediaIndex()" aria-label="Back to index">← Back</button>
            <h3>😺 Breed Guide</h3>
        </div>
        <div class="breed-guide">
    `;
    
    const envNames = {
        forest: '🌲 Forest Cats',
        mountain: '⛰️ Mountain Cats',
        desert: '🏜️ Desert Cats',
        city: '🏙️ City Cats',
        beach: '🏖️ Beach Cats'
    };
    
    for (const [env, cats] of Object.entries(environments)) {
        if (cats.length === 0) continue;
        
        html += `<div class="breed-section">
            <h4 class="environment-header">${envNames[env]}</h4>
            <div class="breed-grid">`;
        
        cats.forEach(cat => {
            const isCollected = collected.has(cat.id);
            const rarityClass = cat.stats.rarity;
            
            html += `
                <div class="breed-card ${isCollected ? '' : 'locked'}" 
                     onclick="showBreedDetails(${cat.id})"
                     tabindex="0"
                     role="button"
                     aria-label="View ${cat.name} details">
                    <div class="breed-icon ${rarityClass}">${cat.icon}</div>
                    <div class="breed-name">${cat.name}</div>
                    <div class="breed-origin">${cat.origin}</div>
                    ${!isCollected ? '<div class="locked-badge">🔒 Not Discovered</div>' : ''}
                </div>
            `;
        });
        
        html += `</div></div>`;
    }
    
    html += `</div>`;
    
    content.innerHTML = html;
}

/**
 * Show detailed information about a specific breed
 * @param {number} catId - ID of the cat to show
 */
function showBreedDetails(catId) {
    const content = document.getElementById('encyclopedia-content');
    if (!content || !window.CAT_BREEDS) return;
    
    const cat = window.CAT_BREEDS.find(c => c.id === catId);
    if (!cat) return;
    
    const collected = window.gameState ? window.gameState.collectedCats : new Set();
    const isCollected = collected.has(cat.id);
    
    if (!isCollected) {
        alert('🔒 You haven\'t discovered this cat yet! Explore to find it first.');
        return;
    }
    
    encyclopediaState.currentView = 'breed';
    encyclopediaState.currentBreed = cat;
    
    // Get regional facts
    const regionFacts = ENCYCLOPEDIA_FACTS.regions[cat.origin] || {
        fact: "An interesting cat breed with unique characteristics.",
        geography: "This cat comes from a fascinating region."
    };
    
    const rarityColors = {
        common: '#b0bec5',
        uncommon: '#66bb6a',
        rare: '#42a5f5',
        epic: '#ab47bc',
        legendary: '#ffa726'
    };
    
    content.innerHTML = `
        <div class="encyclopedia-header">
            <button class="back-btn" onclick="showBreedGuide()" aria-label="Back to breed guide">← Back</button>
            <h3>${cat.icon} ${cat.name}</h3>
        </div>
        
        <div class="breed-details">
            <div class="breed-main-info">
                <div class="breed-portrait">${cat.icon}</div>
                <div class="breed-basic-info">
                    <h4>${cat.name}</h4>
                    <p class="breed-description">${cat.description}</p>
                    <div class="breed-meta">
                        <span class="meta-item">
                            <strong>Origin:</strong> ${cat.origin}
                        </span>
                        <span class="meta-item">
                            <strong>Environment:</strong> ${cat.environment.charAt(0).toUpperCase() + cat.environment.slice(1)}
                        </span>
                        <span class="meta-item rarity-${cat.stats.rarity}">
                            <strong>Rarity:</strong> ${cat.stats.rarity.charAt(0).toUpperCase() + cat.stats.rarity.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="breed-stats-section">
                <h4>📊 Stats</h4>
                <div class="stat-bars">
                    <div class="breed-stat-bar-item">
                        <span class="breed-stat-label">💖 Cuteness</span>
                        <div class="breed-stat-bar">
                            <div class="stat-fill" style="width: ${cat.stats.cuteness}%; background: linear-gradient(90deg, #f093fb, #f5576c);"></div>
                        </div>
                        <span class="stat-value">${cat.stats.cuteness}</span>
                    </div>
                    <div class="breed-stat-bar-item">
                        <span class="breed-stat-label">🤝 Friendliness</span>
                        <div class="breed-stat-bar">
                            <div class="stat-fill" style="width: ${cat.stats.friendliness}%; background: linear-gradient(90deg, #66bb6a, #43a047);"></div>
                        </div>
                        <span class="stat-value">${cat.stats.friendliness}</span>
                    </div>
                    <div class="breed-stat-bar-item">
                        <span class="breed-stat-label">⚡ Energy</span>
                        <div class="breed-stat-bar">
                            <div class="stat-fill" style="width: ${cat.stats.energy}%; background: linear-gradient(90deg, #ffa726, #fb8c00);"></div>
                        </div>
                        <span class="stat-value">${cat.stats.energy}</span>
                    </div>
                    <div class="breed-stat-bar-item">
                        <span class="breed-stat-label">🧠 Intelligence</span>
                        <div class="breed-stat-bar">
                            <div class="stat-fill" style="width: ${cat.stats.intelligence}%; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
                        </div>
                        <span class="stat-value">${cat.stats.intelligence}</span>
                    </div>
                </div>
            </div>
            
            <div class="breed-behavior-section">
                <h4>🎭 Behavior</h4>
                <p>${cat.behavior}</p>
                <p><strong>Favorite Activity:</strong> ${cat.favoriteActivity}</p>
            </div>
            
            <div class="breed-facts-section">
                <h4>💡 Did You Know?</h4>
                <div class="fact-box">
                    <p>${regionFacts.fact}</p>
                </div>
                <h4>🗺️ Geography</h4>
                <div class="fact-box">
                    <p>${regionFacts.geography}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Show geography map with cat origins
 */
function showGeographyMap() {
    const content = document.getElementById('encyclopedia-content');
    if (!content || !window.CAT_BREEDS) return;
    
    encyclopediaState.currentView = 'geography';
    
    // Group cats by region
    const regions = {};
    window.CAT_BREEDS.forEach(cat => {
        if (!regions[cat.origin]) {
            regions[cat.origin] = [];
        }
        regions[cat.origin].push(cat);
    });
    
    const collected = window.gameState ? window.gameState.collectedCats : new Set();
    
    let html = `
        <div class="encyclopedia-header">
            <button class="back-btn" onclick="renderEncyclopediaIndex()" aria-label="Back to index">← Back</button>
            <h3>🗺️ Cat Breeds Around the World</h3>
        </div>
        
        <div class="geography-content">
            <p class="geography-intro">Discover where each cat breed originally comes from! Click on a region to learn more.</p>
            <div class="regions-list">
    `;
    
    for (const [region, cats] of Object.entries(regions)) {
        const collectedInRegion = cats.filter(cat => collected.has(cat.id)).length;
        const totalInRegion = cats.length;
        const regionFacts = ENCYCLOPEDIA_FACTS.regions[region];
        
        html += `
            <div class="region-card" onclick="showRegionDetails('${region.replace(/'/g, "\\'")}')" tabindex="0" role="button">
                <div class="region-header">
                    <h4>📍 ${region}</h4>
                    <span class="region-count">${collectedInRegion}/${totalInRegion} discovered</span>
                </div>
                ${regionFacts ? `<p class="region-fact">${regionFacts.geography}</p>` : ''}
                <div class="region-cats">
                    ${cats.map(cat => `
                        <span class="region-cat-icon ${collected.has(cat.id) ? '' : 'locked'}" 
                              title="${cat.name}">${cat.icon}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

/**
 * Show details about a specific region
 * @param {string} region - Region name
 */
function showRegionDetails(region) {
    if (!window.CAT_BREEDS) return;
    
    const cats = window.CAT_BREEDS.filter(cat => cat.origin === region);
    const collected = window.gameState ? window.gameState.collectedCats : new Set();
    const regionFacts = ENCYCLOPEDIA_FACTS.regions[region];
    
    if (!regionFacts) {
        alert(`Learn more about ${region} by collecting cats from this region!`);
        return;
    }
    
    const collectedInRegion = cats.filter(cat => collected.has(cat.id)).length;
    
    if (collectedInRegion === 0) {
        alert(`🔒 You haven't discovered any cats from ${region} yet! Explore to find them!`);
        return;
    }
    
    alert(`📍 ${region}\n\n${regionFacts.geography}\n\n💡 ${regionFacts.fact}\n\nCats from this region:\n${cats.map(cat => `${cat.icon} ${cat.name}`).join('\n')}`);
}

/**
 * Show fun facts page
 */
function showFunFacts() {
    const content = document.getElementById('encyclopedia-content');
    if (!content) return;
    
    encyclopediaState.currentView = 'facts';
    
    let html = `
        <div class="encyclopedia-header">
            <button class="back-btn" onclick="renderEncyclopediaIndex()" aria-label="Back to index">← Back</button>
            <h3>💡 Fun Cat Facts</h3>
        </div>
        
        <div class="fun-facts-content">
            <p class="facts-intro">Amazing facts about our feline friends!</p>
            <div class="facts-grid">
    `;
    
    ENCYCLOPEDIA_FACTS.general.forEach((fact, index) => {
        html += `
            <div class="fact-card">
                <span class="fact-number">${index + 1}</span>
                <p class="fact-text">${fact}</p>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="facts-footer">
                <p>🎓 Ready to test your knowledge? Try the <button class="inline-link-btn" onclick="startQuiz()">Knowledge Quiz</button>!</p>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

/**
 * Start the knowledge quiz
 */
function startQuiz() {
    const content = document.getElementById('encyclopedia-content');
    if (!content) return;
    
    encyclopediaState.currentView = 'quiz';
    encyclopediaState.quizScore = 0;
    encyclopediaState.currentQuestionIndex = 0;
    encyclopediaState.quizAnswers = [];
    
    // Select 10 random questions
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    encyclopediaState.quizQuestions = shuffled.slice(0, 10);
    
    showQuizQuestion();
}

/**
 * Display current quiz question
 */
function showQuizQuestion() {
    const content = document.getElementById('encyclopedia-content');
    if (!content) return;
    
    const questionIndex = encyclopediaState.currentQuestionIndex;
    const question = encyclopediaState.quizQuestions[questionIndex];
    
    if (!question) {
        showQuizResults();
        return;
    }
    
    const difficultyColors = {
        easy: '#66bb6a',
        medium: '#42a5f5',
        hard: '#ab47bc'
    };
    
    content.innerHTML = `
        <div class="encyclopedia-header">
            <button class="back-btn" onclick="renderEncyclopediaIndex()" aria-label="Back to index">← Back</button>
            <h3>🎓 Knowledge Quiz</h3>
        </div>
        
        <div class="quiz-content">
            <div class="quiz-progress">
                <span>Question ${questionIndex + 1} of ${encyclopediaState.quizQuestions.length}</span>
                <span class="quiz-difficulty" style="color: ${difficultyColors[question.difficulty]}">
                    ${question.difficulty.toUpperCase()}
                </span>
            </div>
            
            <div class="quiz-question-card">
                <h4 class="quiz-question">${question.question}</h4>
                <div class="quiz-answers">
                    ${question.answers.map((answer, index) => `
                        <button class="quiz-answer-btn" 
                                onclick="submitQuizAnswer(${index})"
                                aria-label="Answer: ${answer}">
                            ${answer}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="quiz-score-display">
                <span>Current Score: ${encyclopediaState.quizScore}</span>
            </div>
        </div>
    `;
}

/**
 * Submit quiz answer
 * @param {number} answerIndex - Selected answer index
 */
function submitQuizAnswer(answerIndex) {
    const question = encyclopediaState.quizQuestions[encyclopediaState.currentQuestionIndex];
    const correct = answerIndex === question.correct;
    
    if (correct) {
        encyclopediaState.quizScore++;
        if (window.playSuccess) playSuccess();
    } else {
        if (window.playFailure) playFailure();
    }
    
    encyclopediaState.quizAnswers.push({
        question: question.question,
        selectedAnswer: question.answers[answerIndex],
        correctAnswer: question.answers[question.correct],
        correct: correct
    });
    
    // Show feedback
    const correctAnswer = question.answers[question.correct];
    const message = correct 
        ? `✅ Correct!\n\n${question.question}\n\nAnswer: ${correctAnswer}`
        : `❌ Incorrect\n\n${question.question}\n\nYour answer: ${question.answers[answerIndex]}\nCorrect answer: ${correctAnswer}`;
    
    alert(message);
    
    encyclopediaState.currentQuestionIndex++;
    showQuizQuestion();
}

/**
 * Show quiz results
 */
function showQuizResults() {
    const content = document.getElementById('encyclopedia-content');
    if (!content) return;
    
    const score = encyclopediaState.quizScore;
    const total = encyclopediaState.quizQuestions.length;
    const percentage = Math.round((score / total) * 100);
    
    // Update best score
    if (score > encyclopediaState.bestScore) {
        encyclopediaState.bestScore = score;
        saveEncyclopediaData();
    }
    
    // Update challenge progress (Phase 5.1)
    if (window.gameState && window.updateChallengeProgress) {
        updateChallengeProgress(window.gameState, 'minigame_played');
    }
    
    let grade = '📝';
    let message = 'Keep learning!';
    
    if (percentage >= 90) {
        grade = '🌟';
        message = 'Outstanding! You\'re a cat expert!';
    } else if (percentage >= 70) {
        grade = '⭐';
        message = 'Great job! You know a lot about cats!';
    } else if (percentage >= 50) {
        grade = '✨';
        message = 'Good effort! Keep exploring to learn more!';
    }
    
    content.innerHTML = `
        <div class="encyclopedia-header">
            <h3>🎓 Quiz Results</h3>
        </div>
        
        <div class="quiz-results">
            <div class="results-header">
                <div class="results-grade">${grade}</div>
                <h4>${message}</h4>
                <div class="results-score">
                    <span class="score-number">${score}</span>
                    <span class="score-divider">/</span>
                    <span class="score-total">${total}</span>
                </div>
                <div class="results-percentage">${percentage}%</div>
                ${score === encyclopediaState.bestScore && score > 0 ? '<div class="new-record">🏆 New Best Score!</div>' : ''}
                ${encyclopediaState.bestScore > 0 ? `<div class="best-score-display">Best Score: ${encyclopediaState.bestScore}/${total}</div>` : ''}
            </div>
            
            <div class="results-actions">
                <button class="action-btn" onclick="startQuiz()">🔄 Try Again</button>
                <button class="action-btn" onclick="renderEncyclopediaIndex()">📚 Back to Encyclopedia</button>
            </div>
            
            <div class="results-details">
                <h4>Review Your Answers</h4>
                <div class="answers-review">
                    ${encyclopediaState.quizAnswers.map((answer, index) => `
                        <div class="answer-review-item ${answer.correct ? 'correct' : 'incorrect'}">
                            <div class="review-number">${index + 1}</div>
                            <div class="review-content">
                                <p class="review-question">${answer.question}</p>
                                <p class="review-answer">Your answer: <strong>${answer.selectedAnswer}</strong></p>
                                ${!answer.correct ? `<p class="review-correct">Correct answer: <strong>${answer.correctAnswer}</strong></p>` : ''}
                            </div>
                            <div class="review-icon">${answer.correct ? '✅' : '❌'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// EXPOSE ALL FUNCTIONS TO GLOBAL SCOPE
// This must be at the END of the file after all functions are defined
// ============================================================================
window.initEncyclopedia = initEncyclopedia;
window.openEncyclopedia = openEncyclopedia;
window.closeEncyclopedia = closeEncyclopedia;
window.renderEncyclopediaIndex = renderEncyclopediaIndex;
window.showBreedGuide = showBreedGuide;
window.showBreedDetails = showBreedDetails;
window.showGeographyMap = showGeographyMap;
window.showRegionDetails = showRegionDetails;
window.showFunFacts = showFunFacts;
window.startQuiz = startQuiz;
window.submitQuizAnswer = submitQuizAnswer;

console.log('📚 Encyclopedia functions exposed to window object');
