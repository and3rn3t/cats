/**
 * Animation System
 * ================
 * Handles all smooth transitions and visual effects for Cat Collector.
 * 
 * Features:
 * - Modal fade in/out animations
 * - Side panel slide animations
 * - Particle effects for success/failure
 * - Confetti for milestones
 * - Energy regeneration effects
 * - Card reveal animations
 * - Glow effects for legendary cats
 * 
 * Respects prefers-reduced-motion accessibility setting.
 * 
 * @version 2.6.0
 * @since Phase 4.1
 */

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animate modal/dialog opening with fade effect
 * @param {HTMLDialogElement} dialog - The dialog element to animate
 */
function animateDialogOpen(dialog) {
    if (!dialog || prefersReducedMotion) {
        return;
    }
    
    // Dialog already has CSS animation via [open] selector
    // This function is for additional JS-based effects if needed
    dialog.classList.remove('closing');
}

/**
 * Animate modal/dialog closing with fade effect
 * @param {HTMLDialogElement} dialog - The dialog element to animate
 * @returns {Promise} Resolves when animation completes
 */
function animateDialogClose(dialog) {
    return new Promise((resolve) => {
        if (!dialog || prefersReducedMotion) {
            resolve();
            return;
        }
        
        dialog.classList.add('closing');
        
        // Wait for animation to complete
        setTimeout(() => {
            dialog.classList.remove('closing');
            resolve();
        }, 300); // Match CSS animation duration
    });
}

/**
 * Animate side panel opening with slide effect
 * @param {HTMLElement} panel - The panel element to animate
 */
function animatePanelOpen(panel) {
    if (!panel || prefersReducedMotion) {
        return;
    }
    
    panel.classList.remove('closing');
    panel.classList.remove('hidden');
}

/**
 * Animate side panel closing with slide effect
 * @param {HTMLElement} panel - The panel element to animate
 * @returns {Promise} Resolves when animation completes
 */
function animatePanelClose(panel) {
    return new Promise((resolve) => {
        if (!panel || prefersReducedMotion) {
            resolve();
            return;
        }
        
        panel.classList.add('closing');
        
        // Wait for animation to complete
        setTimeout(() => {
            panel.classList.add('hidden');
            panel.classList.remove('closing');
            resolve();
        }, 300); // Match CSS animation duration
    });
}

/**
 * Create particle effect at specified position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} emoji - Emoji to display
 * @param {number} count - Number of particles
 */
function createParticleEffect(x, y, emoji, count = 5) {
    if (prefersReducedMotion) {
        return;
    }
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random offset for variety
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--offset-x', `${offsetX}px`);
        particle.style.setProperty('--offset-y', `${offsetY}px`);
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 0.3}s`;
        
        document.body.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 1300);
    }
}

/**
 * Create particle effect on element
 * @param {HTMLElement} element - Element to create particles on
 * @param {string} emoji - Emoji to display
 * @param {number} count - Number of particles
 */
function createParticlesOnElement(element, emoji, count = 5) {
    if (!element || prefersReducedMotion) {
        return;
    }
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    createParticleEffect(x, y, emoji, count);
}

/**
 * Create confetti effect for major milestones
 * @param {number} duration - Duration in milliseconds
 */
function createConfetti(duration = 3000) {
    if (prefersReducedMotion) {
        return;
    }
    
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const confettiCount = 50;
    const interval = duration / confettiCount;
    
    let created = 0;
    const confettiInterval = setInterval(() => {
        if (created >= confettiCount) {
            clearInterval(confettiInterval);
            return;
        }
        
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 4000);
        
        created++;
    }, interval);
}

/**
 * Shake element (for errors/failures)
 * @param {HTMLElement} element - Element to shake
 */
function shakeElement(element) {
    if (!element || prefersReducedMotion) {
        return;
    }
    
    element.classList.add('shake-animation');
    
    setTimeout(() => {
        element.classList.remove('shake-animation');
    }, 500);
}

/**
 * Add glow effect to element
 * @param {HTMLElement} element - Element to add glow to
 * @param {number} duration - Duration in milliseconds (0 = infinite)
 */
function addGlowEffect(element, duration = 2000) {
    if (!element || prefersReducedMotion) {
        return;
    }
    
    element.classList.add('glow-effect');
    
    if (duration > 0) {
        setTimeout(() => {
            element.classList.remove('glow-effect');
        }, duration);
    }
}

/**
 * Animate cat card reveal
 * @param {HTMLElement} card - Cat card element
 * @param {number} delay - Delay before animation starts
 */
function animateCatCardReveal(card, delay = 0) {
    if (!card || prefersReducedMotion) {
        return;
    }
    
    setTimeout(() => {
        card.classList.add('revealing');
        
        setTimeout(() => {
            card.classList.remove('revealing');
        }, 500);
    }, delay);
}

/**
 * Animate card flip (when collecting a cat)
 * @param {HTMLElement} card - Cat card element
 */
function animateCardFlip(card) {
    if (!card || prefersReducedMotion) {
        return;
    }
    
    card.classList.add('newly-collected');
    
    setTimeout(() => {
        card.classList.remove('newly-collected');
    }, 600);
}

/**
 * Animate energy regeneration
 * @param {HTMLElement} energyElement - Energy display element
 * @param {boolean} isRegenerating - Whether energy is regenerating
 */
function animateEnergyRegen(energyElement, isRegenerating) {
    if (!energyElement) {
        return;
    }
    
    if (isRegenerating && !prefersReducedMotion) {
        energyElement.classList.add('regenerating');
    } else {
        energyElement.classList.remove('regenerating');
    }
}

/**
 * Celebrate achievement unlock
 * @param {HTMLElement} achievementCard - Achievement card element
 */
function celebrateAchievement(achievementCard) {
    if (!achievementCard) {
        return;
    }
    
    if (!prefersReducedMotion) {
        achievementCard.classList.add('just-unlocked');
        
        // Create particles
        createParticlesOnElement(achievementCard, '⭐', 8);
        
        setTimeout(() => {
            achievementCard.classList.remove('just-unlocked');
        }, 3000);
    }
}

/**
 * Celebrate collection milestone
 * @param {number} count - Number of cats collected
 */
function celebrateMilestone(count) {
    if (prefersReducedMotion) {
        return;
    }
    
    // Major milestones get confetti
    if (count === 10 || count === 20 || count === 25 || count === 40 || count % 10 === 0) {
        createConfetti(4000);
    }
    
    // All milestones get particles
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
        createParticlesOnElement(canvas, '🎉', 15);
    }
}

/**
 * Success animation for encounter
 * @param {HTMLElement} encounterPanel - Encounter dialog element
 */
function animateEncounterSuccess(encounterPanel) {
    if (!encounterPanel || prefersReducedMotion) {
        return;
    }
    
    const catElement = encounterPanel.querySelector('#encounter-cat');
    if (catElement) {
        catElement.classList.add('success-animation');
        createParticlesOnElement(catElement, '💚', 6);
        
        setTimeout(() => {
            catElement.classList.remove('success-animation');
        }, 500);
    }
}

/**
 * Failure animation for encounter
 * @param {HTMLElement} encounterPanel - Encounter dialog element
 */
function animateEncounterFailure(encounterPanel) {
    if (!encounterPanel || prefersReducedMotion) {
        return;
    }
    
    const catElement = encounterPanel.querySelector('#encounter-cat');
    if (catElement) {
        shakeElement(catElement);
        createParticlesOnElement(catElement, '💔', 3);
    }
}

/**
 * Animate collection stats update
 * @param {HTMLElement} statsElement - Stats display element
 */
function animateStatsUpdate(statsElement) {
    if (!statsElement || prefersReducedMotion) {
        return;
    }
    
    statsElement.classList.add('celebration-animation');
    
    setTimeout(() => {
        statsElement.classList.remove('celebration-animation');
    }, 600);
}

/**
 * Create loading spinner
 * @param {HTMLElement} container - Container to add spinner to
 * @returns {HTMLElement} The spinner element
 */
function createLoadingSpinner(container) {
    if (!container) {
        return null;
    }
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.setAttribute('aria-label', 'Loading...');
    spinner.setAttribute('role', 'status');
    
    container.appendChild(spinner);
    return spinner;
}

/**
 * Remove loading spinner
 * @param {HTMLElement} spinner - Spinner element to remove
 */
function removeLoadingSpinner(spinner) {
    if (spinner && spinner.parentElement) {
        spinner.remove();
    }
}

/**
 * Add bounce animation to element
 * @param {HTMLElement} element - Element to bounce
 */
function bounceElement(element) {
    if (!element || prefersReducedMotion) {
        return;
    }
    
    element.classList.add('bounce-in');
    
    setTimeout(() => {
        element.classList.remove('bounce-in');
    }, 500);
}

/**
 * Initialize animations system
 * Sets up event listeners and prepares animation utilities
 */
function initAnimations() {
    console.log('Animation system initialized');
    console.log(`Reduced motion: ${prefersReducedMotion ? 'ON' : 'OFF'}`);
    
    // Add animation classes to buttons for enhanced feedback
    const buttons = document.querySelectorAll('.main-btn, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!prefersReducedMotion) {
                // Add ripple effect at click position
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.width = ripple.style.height = '100px';
                ripple.style.left = `${x - 50}px`;
                ripple.style.top = `${y - 50}px`;
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.pointerEvents = 'none';
                ripple.style.transition = 'transform 0.6s, opacity 0.6s';
                ripple.style.opacity = '1';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.style.transform = 'scale(2)';
                    ripple.style.opacity = '0';
                }, 0);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.animateDialogOpen = animateDialogOpen;
    window.animateDialogClose = animateDialogClose;
    window.animatePanelOpen = animatePanelOpen;
    window.animatePanelClose = animatePanelClose;
    window.createParticleEffect = createParticleEffect;
    window.createParticlesOnElement = createParticlesOnElement;
    window.createConfetti = createConfetti;
    window.shakeElement = shakeElement;
    window.addGlowEffect = addGlowEffect;
    window.animateCatCardReveal = animateCatCardReveal;
    window.animateCardFlip = animateCardFlip;
    window.animateEnergyRegen = animateEnergyRegen;
    window.celebrateAchievement = celebrateAchievement;
    window.celebrateMilestone = celebrateMilestone;
    window.animateEncounterSuccess = animateEncounterSuccess;
    window.animateEncounterFailure = animateEncounterFailure;
    window.animateStatsUpdate = animateStatsUpdate;
    window.createLoadingSpinner = createLoadingSpinner;
    window.removeLoadingSpinner = removeLoadingSpinner;
    window.bounceElement = bounceElement;
    window.initAnimations = initAnimations;
}
