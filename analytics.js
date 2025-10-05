/**
 * Analytics System for Cat Collector
 * Tracks gameplay statistics and displays insights
 */

/**
 * Initialize analytics tracking
 * @param {Object} state - Game state
 */
function initAnalytics(state) {
    if (!state.analytics) {
        state.analytics = {
            sessionStart: Date.now(),
            totalPlayTime: 0,
            explorationHistory: [],
            successRateByAction: {
                approach: { attempts: 0, successes: 0 },
                treat: { attempts: 0, successes: 0 },
                observe: { attempts: 0, successes: 0 }
            },
            catsFoundByRarity: {
                common: 0,
                uncommon: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            },
            dailyProgress: {},
            favoriteOrigins: {},
            averageTimePerCat: 0,
            longestSession: 0,
            fastestCatFound: null
        };
    }
}

/**
 * Record exploration attempt
 * @param {Object} state - Game state
 * @param {Object} cat - Cat encountered
 * @param {string} action - Action taken
 * @param {boolean} success - Whether attempt succeeded
 */
function recordExploration(state, cat, action, success) {
    if (!state.analytics) initAnalytics(state);
    
    const timestamp = Date.now();
    
    // Record exploration history
    state.analytics.explorationHistory.push({
        timestamp,
        catId: cat.id,
        catName: cat.name,
        action,
        success,
        rarity: cat.stats?.rarity
    });
    
    // Update action success rates
    if (state.analytics.successRateByAction[action]) {
        state.analytics.successRateByAction[action].attempts++;
        if (success) {
            state.analytics.successRateByAction[action].successes++;
        }
    }
    
    // Record successful collection
    if (success) {
        const rarity = cat.stats?.rarity || 'common';
        state.analytics.catsFoundByRarity[rarity]++;
        
        // Track origin
        if (cat.origin) {
            state.analytics.favoriteOrigins[cat.origin] = 
                (state.analytics.favoriteOrigins[cat.origin] || 0) + 1;
        }
        
        // Track fastest find
        if (!state.analytics.fastestCatFound || 
            (state.lastEncounterTime && timestamp - state.lastEncounterTime < state.analytics.fastestCatFound)) {
            state.analytics.fastestCatFound = state.lastEncounterTime ? timestamp - state.lastEncounterTime : null;
        }
    }
    
    // Update daily progress
    const today = new Date().toDateString();
    if (!state.analytics.dailyProgress[today]) {
        state.analytics.dailyProgress[today] = {
            explorations: 0,
            catsCollected: 0,
            energySpent: 0
        };
    }
    state.analytics.dailyProgress[today].explorations++;
    state.analytics.dailyProgress[today].energySpent += 10;
    if (success) {
        state.analytics.dailyProgress[today].catsCollected++;
    }
}

/**
 * Calculate current session time
 * @param {Object} state - Game state
 * @returns {number} Session time in milliseconds
 */
function getCurrentSessionTime(state) {
    if (!state.analytics?.sessionStart) return 0;
    return Date.now() - state.analytics.sessionStart;
}

/**
 * Update total play time
 * @param {Object} state - Game state
 */
function updatePlayTime(state) {
    if (!state.analytics) initAnalytics(state);
    
    const sessionTime = getCurrentSessionTime(state);
    state.analytics.totalPlayTime = (state.analytics.previousPlayTime || 0) + sessionTime;
    
    if (sessionTime > (state.analytics.longestSession || 0)) {
        state.analytics.longestSession = sessionTime;
    }
}

/**
 * Calculate success rate for an action
 * @param {Object} state - Game state
 * @param {string} action - Action name
 * @returns {number} Success rate percentage
 */
function getSuccessRate(state, action) {
    if (!state.analytics?.successRateByAction[action]) return 0;
    
    const data = state.analytics.successRateByAction[action];
    if (data.attempts === 0) return 0;
    
    return Math.round((data.successes / data.attempts) * 100);
}

/**
 * Get most common origin
 * @param {Object} state - Game state
 * @returns {string} Most common origin
 */
function getMostCommonOrigin(state) {
    if (!state.analytics?.favoriteOrigins) return 'Unknown';
    
    const origins = Object.entries(state.analytics.favoriteOrigins);
    if (origins.length === 0) return 'Unknown';
    
    origins.sort((a, b) => b[1] - a[1]);
    return origins[0][0];
}

/**
 * Format time duration
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Render analytics dashboard
 * @param {Object} state - Game state
 */
function renderAnalyticsDashboard(state) {
    const content = document.getElementById('analytics-content');
    if (!content) return;
    
    if (!state.analytics) initAnalytics(state);
    updatePlayTime(state);
    
    const analytics = state.analytics;
    const totalExplorations = analytics.explorationHistory.length;
    const totalCollected = state.collectedCats.size;
    const sessionTime = getCurrentSessionTime(state);
    const totalTime = analytics.totalPlayTime;
    
    // Calculate overall success rate
    let totalAttempts = 0;
    let totalSuccesses = 0;
    Object.values(analytics.successRateByAction).forEach(action => {
        totalAttempts += action.attempts;
        totalSuccesses += action.successes;
    });
    const overallSuccessRate = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0;
    
    // Get favorite action
    let favoriteAction = 'None';
    let maxAttempts = 0;
    Object.entries(analytics.successRateByAction).forEach(([action, data]) => {
        if (data.attempts > maxAttempts) {
            maxAttempts = data.attempts;
            favoriteAction = action.charAt(0).toUpperCase() + action.slice(1);
        }
    });
    
    const html = `
        <div class="analytics-grid">
            <!-- Summary Stats -->
            <div class="stat-card primary">
                <div class="stat-icon">🐱</div>
                <div class="stat-content">
                    <div class="stat-label">Cats Collected</div>
                    <div class="stat-number">${totalCollected} / 25</div>
                    <div class="stat-progress">
                        <div class="progress-bar" style="width: ${(totalCollected / 25) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="stat-card secondary">
                <div class="stat-icon">🔍</div>
                <div class="stat-content">
                    <div class="stat-label">Explorations</div>
                    <div class="stat-number">${totalExplorations}</div>
                    <div class="stat-subtext">${totalAttempts} collection attempts</div>
                </div>
            </div>
            
            <div class="stat-card success">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                    <div class="stat-label">Success Rate</div>
                    <div class="stat-number">${overallSuccessRate}%</div>
                    <div class="stat-subtext">${totalSuccesses} successful</div>
                </div>
            </div>
            
            <div class="stat-card info">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                    <div class="stat-label">Total Play Time</div>
                    <div class="stat-number">${formatTime(totalTime)}</div>
                    <div class="stat-subtext">Session: ${formatTime(sessionTime)}</div>
                </div>
            </div>
            
            <!-- Action Success Rates -->
            <div class="analytics-section full-width">
                <h4>🎯 Action Success Rates</h4>
                <div class="action-stats">
                    ${renderActionStats(analytics.successRateByAction)}
                </div>
            </div>
            
            <!-- Rarity Distribution -->
            <div class="analytics-section full-width">
                <h4>⭐ Cats by Rarity</h4>
                <div class="rarity-chart">
                    ${renderRarityChart(analytics.catsFoundByRarity)}
                </div>
            </div>
            
            <!-- Geographic Distribution -->
            <div class="analytics-section full-width">
                <h4>🌍 Geographic Distribution</h4>
                <div class="origin-stats">
                    ${renderOriginStats(analytics.favoriteOrigins)}
                </div>
            </div>
            
            <!-- Personal Bests -->
            <div class="analytics-section full-width">
                <h4>🏆 Personal Bests</h4>
                <div class="bests-grid">
                    <div class="best-stat">
                        <span class="best-label">Favorite Action:</span>
                        <span class="best-value">${favoriteAction}</span>
                    </div>
                    <div class="best-stat">
                        <span class="best-label">Longest Session:</span>
                        <span class="best-value">${formatTime(analytics.longestSession || sessionTime)}</span>
                    </div>
                    <div class="best-stat">
                        <span class="best-label">Most Common Origin:</span>
                        <span class="best-value">${getMostCommonOrigin(state)}</span>
                    </div>
                    <div class="best-stat">
                        <span class="best-label">Collection Progress:</span>
                        <span class="best-value">${Math.round((totalCollected / 25) * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

/**
 * Render action statistics
 * @param {Object} actionData - Action success rate data
 * @returns {string} HTML string
 */
function renderActionStats(actionData) {
    const icons = {
        approach: '🤝',
        treat: '🍖',
        observe: '👁️'
    };
    
    let html = '';
    Object.entries(actionData).forEach(([action, data]) => {
        const successRate = data.attempts > 0 ? Math.round((data.successes / data.attempts) * 100) : 0;
        const actionName = action.charAt(0).toUpperCase() + action.slice(1);
        
        html += `
            <div class="action-stat">
                <div class="action-header">
                    <span class="action-icon">${icons[action]}</span>
                    <span class="action-name">${actionName}</span>
                </div>
                <div class="action-bar-container">
                    <div class="action-bar" style="width: ${successRate}%">
                        <span class="action-rate">${successRate}%</span>
                    </div>
                </div>
                <div class="action-details">
                    ${data.successes} / ${data.attempts} successful
                </div>
            </div>
        `;
    });
    
    return html || '<p>No data yet. Start exploring!</p>';
}

/**
 * Render rarity distribution chart
 * @param {Object} rarityData - Rarity count data
 * @returns {string} HTML string
 */
function renderRarityChart(rarityData) {
    const rarityColors = {
        common: '#b0bec5',
        uncommon: '#66bb6a',
        rare: '#42a5f5',
        epic: '#ab47bc',
        legendary: '#ffa726'
    };
    
    const rarityIcons = {
        common: '🥉',
        uncommon: '🥈',
        rare: '🥇',
        epic: '💎',
        legendary: '👑'
    };
    
    const total = Object.values(rarityData).reduce((sum, count) => sum + count, 0);
    
    let html = '';
    Object.entries(rarityData).forEach(([rarity, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        const rarityName = rarity.charAt(0).toUpperCase() + rarity.slice(1);
        
        html += `
            <div class="rarity-bar">
                <div class="rarity-label">
                    <span>${rarityIcons[rarity]} ${rarityName}</span>
                    <span>${count} cats (${percentage}%)</span>
                </div>
                <div class="rarity-bar-container">
                    <div class="rarity-bar-fill" 
                         style="width: ${percentage}%; background: ${rarityColors[rarity]}">
                    </div>
                </div>
            </div>
        `;
    });
    
    return html || '<p>No cats collected yet!</p>';
}

/**
 * Render origin statistics
 * @param {Object} originData - Origin count data
 * @returns {string} HTML string
 */
function renderOriginStats(originData) {
    const sortedOrigins = Object.entries(originData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5
    
    if (sortedOrigins.length === 0) {
        return '<p>No cats collected yet!</p>';
    }
    
    const maxCount = sortedOrigins[0][1];
    
    let html = '';
    sortedOrigins.forEach(([origin, count]) => {
        const percentage = Math.round((count / maxCount) * 100);
        
        html += `
            <div class="origin-row">
                <div class="origin-name">${origin}</div>
                <div class="origin-bar-container">
                    <div class="origin-bar" style="width: ${percentage}%">
                        <span class="origin-count">${count}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * Export analytics data as JSON
 * @param {Object} state - Game state
 * @returns {string} JSON string
 */
function exportAnalytics(state) {
    if (!state.analytics) return '{}';
    
    updatePlayTime(state);
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalCatsCollected: state.collectedCats.size,
        totalPlayTime: formatTime(state.analytics.totalPlayTime),
        analytics: state.analytics
    };
    
    return JSON.stringify(exportData, null, 2);
}

/**
 * Download analytics as file
 * @param {Object} state - Game state
 */
function downloadAnalytics(state) {
    const data = exportAnalytics(state);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cat-collector-analytics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Expose functions globally
window.initAnalytics = initAnalytics;
window.recordExploration = recordExploration;
window.updatePlayTime = updatePlayTime;
window.renderAnalyticsDashboard = renderAnalyticsDashboard;
window.exportAnalytics = exportAnalytics;
window.downloadAnalytics = downloadAnalytics;
