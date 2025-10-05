/**
 * Tutorial & Onboarding System for Cat Collector
 * Provides interactive tooltips and first-time player guidance
 * @module tutorial
 */

// Tutorial state
let tutorialState = {
    isFirstTime: false,
    currentStep: 0,
    completed: false,
    tooltipsEnabled: true,
    stepsCompleted: new Set()
};

// Tutorial steps configuration
const TUTORIAL_STEPS = [
    {
        id: 'welcome',
        target: '#game-canvas',
        title: '🎉 Welcome to Cat Collector!',
        content: 'Your mission is to discover and collect 40 unique cat breeds from around the world. Let\'s learn how to play!',
        position: 'center',
        buttonText: 'Start Tutorial'
    },
    {
        id: 'energy',
        target: '#player-energy',
        title: '⚡ Energy System',
        content: 'This is your energy! Each exploration costs 10 energy. Energy regenerates 1 point every 30 seconds, up to a maximum of 100.',
        position: 'bottom',
        highlight: true
    },
    {
        id: 'explore',
        target: '#explore-btn',
        title: '🔍 Explore Button',
        content: 'Click this button to explore the wilderness and search for cats! You might encounter a cat if you\'re lucky.',
        position: 'top',
        highlight: true,
        action: 'wait-for-explore'
    },
    {
        id: 'encounter',
        target: '#encounter-dialog',
        title: '🐱 Cat Encounter',
        content: 'When you find a cat, choose an action! Each action has different success rates based on the cat\'s personality.',
        position: 'center',
        highlight: true,
        triggerOn: 'encounter-shown'
    },
    {
        id: 'actions',
        target: '.encounter-actions',
        title: '🎯 Choose Your Approach',
        content: '• Gentle Approach (friendliness bonus)\n• Offer Treat (works on low-energy cats)\n• Observe Quietly (intelligence bonus)\n\nTry different strategies!',
        position: 'bottom',
        highlight: true
    },
    {
        id: 'collection',
        target: '#collection-btn',
        title: '📚 Your Collection',
        content: 'View all your collected cats here! Click on any cat to see detailed stats and information.',
        position: 'top',
        highlight: true
    },
    {
        id: 'environments',
        target: '#environment-selector',
        title: '🗺️ Environments',
        content: 'Each environment has 8 unique cats! Unlock new environments by collecting cats. Explore different regions!',
        position: 'top',
        highlight: true
    },
    {
        id: 'challenges',
        target: '#challenges-btn',
        title: '🎯 Daily Challenges',
        content: 'Complete daily challenges to earn extra energy! Challenges reset every day and build your streak.',
        position: 'top',
        highlight: true
    },
    {
        id: 'encyclopedia',
        target: '#encyclopedia-btn',
        title: '📖 Encyclopedia',
        content: 'Learn about cat breeds, geography, and take fun quizzes! Education meets adventure!',
        position: 'top',
        highlight: true
    },
    {
        id: 'complete',
        target: '#game-canvas',
        title: '🎊 You\'re Ready!',
        content: 'You now know the basics! Start exploring and build your collection. Good luck, and have fun! 🐱✨',
        position: 'center',
        buttonText: 'Start Playing!'
    }
];

// Tooltip definitions for UI elements
const TOOLTIPS = {
    'explore-btn': {
        text: 'Search the wilderness for cats (Costs 10 energy)',
        position: 'top'
    },
    'collection-btn': {
        text: 'View your collected cats and their details',
        position: 'top'
    },
    'challenges-btn': {
        text: 'Complete daily challenges for energy rewards',
        position: 'top'
    },
    'encyclopedia-btn': {
        text: 'Learn about cat breeds and test your knowledge',
        position: 'top'
    },
    'achievements-btn': {
        text: 'Track your progress and unlock achievements',
        position: 'top'
    },
    'analytics-btn': {
        text: 'View detailed statistics about your gameplay',
        position: 'top'
    },
    'help-btn': {
        text: 'Get help and replay the tutorial',
        position: 'top'
    },
    'player-energy': {
        text: 'Your current energy level. Regenerates 1 per 30 seconds.',
        position: 'bottom'
    },
    'cats-collected': {
        text: 'Total number of unique cats you\'ve collected',
        position: 'bottom'
    },
    'environment-selector': {
        text: 'Choose which environment to explore. Unlock more by collecting cats!',
        position: 'top'
    }
};

/**
 * Initialize the tutorial system
 * Checks if this is the player's first time
 */
function initTutorial() {
    // Load tutorial state from localStorage
    loadTutorialState();
    
    // Check if this is truly first time (no cats, no explorations)
    if (gameState.collectedCats.size === 0 && gameState.explorationCount === 0 && !tutorialState.completed) {
        tutorialState.isFirstTime = true;
    }
    
    // Set up tooltip listeners
    setupTooltipListeners();
    
    // Start tutorial for first-time players
    if (tutorialState.isFirstTime && !tutorialState.completed) {
        setTimeout(() => startTutorial(), 500); // Small delay after game loads
    }
}

/**
 * Start the interactive tutorial
 */
function startTutorial() {
    tutorialState.currentStep = 0;
    showTutorialStep(0);
}

/**
 * Show a specific tutorial step
 * @param {number} stepIndex - Index of the tutorial step
 */
function showTutorialStep(stepIndex) {
    if (stepIndex >= TUTORIAL_STEPS.length) {
        completeTutorial();
        return;
    }
    
    const step = TUTORIAL_STEPS[stepIndex];
    tutorialState.currentStep = stepIndex;
    
    // Create tutorial overlay
    createTutorialOverlay(step);
    
    // Mark step as seen
    tutorialState.stepsCompleted.add(step.id);
    saveTutorialState();
}

/**
 * Create and display tutorial overlay with step content
 * @param {Object} step - Tutorial step configuration
 */
function createTutorialOverlay(step) {
    // Remove any existing tutorial overlay
    removeTutorialOverlay();
    
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.className = 'tutorial-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'tutorial-title');
    overlay.setAttribute('aria-describedby', 'tutorial-content');
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'tutorial-backdrop';
    
    // Highlight target element if specified
    if (step.highlight && step.target && step.target !== '#game-canvas') {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
            highlightElement(targetEl);
        }
    }
    
    // Create tutorial box
    const box = document.createElement('div');
    box.className = 'tutorial-box';
    box.style.animation = 'tutorialBounceIn 0.5s ease-out';
    
    // Position the box
    positionTutorialBox(box, step);
    
    // Add content
    box.innerHTML = `
        <div class="tutorial-header">
            <h3 id="tutorial-title">${step.title}</h3>
            <button class="tutorial-skip-btn" onclick="skipTutorial()" aria-label="Skip tutorial">Skip Tutorial</button>
        </div>
        <div class="tutorial-body">
            <p id="tutorial-content">${step.content.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="tutorial-footer">
            <div class="tutorial-progress">
                Step ${tutorialState.currentStep + 1} of ${TUTORIAL_STEPS.length}
            </div>
            <button class="tutorial-btn" onclick="nextTutorialStep()" aria-label="Next step">
                ${step.buttonText || 'Next'} →
            </button>
        </div>
    `;
    
    overlay.appendChild(backdrop);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    // Add keyboard navigation
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            skipTutorial();
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            nextTutorialStep();
        }
    });
    
    // Focus the next button
    setTimeout(() => {
        const nextBtn = box.querySelector('.tutorial-btn');
        nextBtn?.focus();
    }, 100);
}

/**
 * Position tutorial box relative to target element
 * @param {HTMLElement} box - Tutorial box element
 * @param {Object} step - Tutorial step configuration
 */
function positionTutorialBox(box, step) {
    if (step.position === 'center' || !step.target || step.target === '#game-canvas') {
        box.classList.add('tutorial-box-center');
        return;
    }
    
    const target = document.querySelector(step.target);
    if (!target) {
        box.classList.add('tutorial-box-center');
        return;
    }
    
    box.classList.add(`tutorial-box-${step.position}`);
    box.setAttribute('data-target', step.target);
}

/**
 * Highlight a target element during tutorial
 * @param {HTMLElement} element - Element to highlight
 */
function highlightElement(element) {
    element.classList.add('tutorial-highlight');
    element.style.position = 'relative';
    element.style.zIndex = '10001';
}

/**
 * Remove highlight from all elements
 */
function removeHighlights() {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
        if (el.style.zIndex === '10001') {
            el.style.zIndex = '';
        }
    });
}

/**
 * Move to next tutorial step
 */
function nextTutorialStep() {
    removeHighlights();
    tutorialState.currentStep++;
    
    const nextStep = TUTORIAL_STEPS[tutorialState.currentStep];
    
    // Handle special wait conditions
    if (nextStep && nextStep.action === 'wait-for-explore') {
        // Show the step but wait for player to click explore
        showTutorialStep(tutorialState.currentStep);
        // Tutorial will continue after they explore (handled in game.js)
        return;
    }
    
    showTutorialStep(tutorialState.currentStep);
}

/**
 * Skip the entire tutorial
 */
function skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial? You can replay it anytime from the Help menu.')) {
        completeTutorial();
    }
}

/**
 * Complete the tutorial
 */
function completeTutorial() {
    tutorialState.completed = true;
    tutorialState.isFirstTime = false;
    saveTutorialState();
    removeTutorialOverlay();
    removeHighlights();
    
    // Show completion message
    if (typeof showToast === 'function') {
        showToast('🎉 Tutorial complete! Have fun collecting cats!', 'success');
    }
}

/**
 * Remove tutorial overlay
 */
function removeTutorialOverlay() {
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Set up tooltip listeners for all interactive elements
 */
function setupTooltipListeners() {
    if (!tutorialState.tooltipsEnabled) return;
    
    Object.keys(TOOLTIPS).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const tooltip = TOOLTIPS[elementId];
        
        // Add tooltip icon
        addTooltipIcon(element, tooltip);
        
        // Mouse events
        element.addEventListener('mouseenter', (e) => showTooltip(e, tooltip));
        element.addEventListener('mouseleave', hideTooltip);
        
        // Focus events for keyboard navigation
        element.addEventListener('focus', (e) => showTooltip(e, tooltip));
        element.addEventListener('blur', hideTooltip);
    });
}

/**
 * Add tooltip info icon to element
 * @param {HTMLElement} element - Element to add icon to
 * @param {Object} tooltip - Tooltip configuration
 */
function addTooltipIcon(element, tooltip) {
    // Check if icon already exists
    if (element.querySelector('.tooltip-icon')) return;
    
    // Only add icons to buttons and interactive elements
    if (!element.matches('button, .stat-item, #player-stats p')) return;
    
    const icon = document.createElement('span');
    icon.className = 'tooltip-icon';
    icon.textContent = 'ⓘ';
    icon.setAttribute('aria-label', 'Help information');
    icon.style.marginLeft = '5px';
    icon.style.opacity = '0.6';
    icon.style.fontSize = '0.8em';
    icon.style.cursor = 'help';
    
    element.appendChild(icon);
}

/**
 * Show tooltip on hover/focus
 * @param {Event} event - Mouse or focus event
 * @param {Object} tooltipConfig - Tooltip configuration
 */
function showTooltip(event, tooltipConfig) {
    // Remove any existing tooltip
    hideTooltip();
    
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.id = 'active-tooltip';
    tooltip.className = 'tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent = tooltipConfig.text;
    
    // Position tooltip
    document.body.appendChild(tooltip);
    
    const tooltipRect = tooltip.getBoundingClientRect();
    let top, left;
    
    switch (tooltipConfig.position) {
        case 'top':
            top = rect.top - tooltipRect.height - 10;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tooltip.classList.add('tooltip-top');
            break;
        case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            tooltip.classList.add('tooltip-bottom');
            break;
        case 'left':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - 10;
            tooltip.classList.add('tooltip-left');
            break;
        case 'right':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 10;
            tooltip.classList.add('tooltip-right');
            break;
        default:
            top = rect.bottom + 10;
            left = rect.left;
            tooltip.classList.add('tooltip-bottom');
    }
    
    // Keep tooltip on screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = rect.bottom + 10;
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.opacity = '1';
}

/**
 * Hide active tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('active-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

/**
 * Show help dialog with tutorial option
 */
function showTutorialHelp() {
    const dialog = document.getElementById('help-dialog');
    if (!dialog) return;
    
    // Add replay tutorial button to help dialog
    const helpContent = dialog.querySelector('.help-content');
    if (helpContent && !helpContent.querySelector('#replay-tutorial-btn')) {
        const replayBtn = document.createElement('button');
        replayBtn.id = 'replay-tutorial-btn';
        replayBtn.className = 'main-btn';
        replayBtn.textContent = '🎓 Replay Tutorial';
        replayBtn.onclick = replayTutorial;
        
        // Insert at the top of help content
        helpContent.insertBefore(replayBtn, helpContent.firstChild);
    }
}

/**
 * Replay the tutorial
 */
function replayTutorial() {
    tutorialState.currentStep = 0;
    tutorialState.completed = false;
    
    // Close help dialog
    const helpDialog = document.getElementById('help-dialog');
    if (helpDialog) {
        helpDialog.close();
    }
    
    // Start tutorial
    startTutorial();
}

/**
 * Toggle tooltips on/off
 */
function toggleTooltips() {
    tutorialState.tooltipsEnabled = !tutorialState.tooltipsEnabled;
    saveTutorialState();
    
    if (tutorialState.tooltipsEnabled) {
        setupTooltipListeners();
        if (typeof showToast === 'function') {
            showToast('✅ Tooltips enabled', 'success');
        }
    } else {
        hideTooltip();
        // Remove tooltip icons
        document.querySelectorAll('.tooltip-icon').forEach(icon => icon.remove());
        if (typeof showToast === 'function') {
            showToast('❌ Tooltips disabled', 'info');
        }
    }
}

/**
 * Save tutorial state to localStorage
 */
function saveTutorialState() {
    try {
        const saveData = {
            completed: tutorialState.completed,
            tooltipsEnabled: tutorialState.tooltipsEnabled,
            stepsCompleted: Array.from(tutorialState.stepsCompleted)
        };
        localStorage.setItem('catCollectorTutorial', JSON.stringify(saveData));
    } catch (error) {
        console.error('Failed to save tutorial state:', error);
    }
}

/**
 * Load tutorial state from localStorage
 */
function loadTutorialState() {
    try {
        const saved = localStorage.getItem('catCollectorTutorial');
        if (saved) {
            const data = JSON.parse(saved);
            tutorialState.completed = data.completed || false;
            tutorialState.tooltipsEnabled = data.tooltipsEnabled !== false; // Default true
            tutorialState.stepsCompleted = new Set(data.stepsCompleted || []);
        }
    } catch (error) {
        console.error('Failed to load tutorial state:', error);
    }
}

// Export functions for use in game.js
if (typeof window !== 'undefined') {
    window.initTutorial = initTutorial;
    window.startTutorial = startTutorial;
    window.nextTutorialStep = nextTutorialStep;
    window.skipTutorial = skipTutorial;
    window.replayTutorial = replayTutorial;
    window.toggleTooltips = toggleTooltips;
    window.showTutorialHelp = showTutorialHelp;
    window.tutorialState = tutorialState;
}
