/**
 * Enhanced Visual Effects for Cat Collector
 * Particle systems, animations, and improved graphics
 */

// Particle system
class Particle {
    constructor(x, y, color, size, velocityX, velocityY, lifetime) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.lifetime = lifetime;
        this.age = 0;
        this.alpha = 1;
    }
    
    update(deltaTime) {
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        this.velocityY += 0.5 * deltaTime; // Gravity
        this.age += deltaTime;
        this.alpha = Math.max(0, 1 - (this.age / this.lifetime));
        return this.age < this.lifetime;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Particle manager
const particleManager = {
    particles: [],
    lastUpdate: Date.now(),
    animationFrame: null,
    
    add(particle) {
        this.particles.push(particle);
        if (!this.animationFrame) {
            this.animate();
        }
    },
    
    animate() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 16.67; // Normalize to 60fps
        this.lastUpdate = now;
        
        // Update particles
        this.particles = this.particles.filter(p => p.update(deltaTime));
        
        // Redraw canvas with particles
        if (window.ctx && window.canvas) {
            // Redraw the base scene
            if (window.drawScene) {
                window.drawScene();
            }
            
            // Draw particles
            this.particles.forEach(p => p.draw(window.ctx));
        }
        
        // Continue animation if particles exist
        if (this.particles.length > 0) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        } else {
            this.animationFrame = null;
        }
    },
    
    clear() {
        this.particles = [];
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
};

/**
 * Create sparkle effect at position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} color - Particle color
 * @param {number} count - Number of particles
 */
function createSparkles(x, y, color = '#ffd700', count = 15) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        const size = 2 + Math.random() * 3;
        const lifetime = 30 + Math.random() * 30;
        
        particleManager.add(new Particle(x, y, color, size, velocityX, velocityY, lifetime));
    }
}

/**
 * Create confetti effect
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function createConfetti(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3'];
    
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed - 5; // Initial upward velocity
        const size = 3 + Math.random() * 4;
        const lifetime = 60 + Math.random() * 40;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particleManager.add(new Particle(x, y, color, size, velocityX, velocityY, lifetime));
    }
}

/**
 * Create heart particles effect
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function createHearts(x, y) {
    // Use emoji-style hearts by creating text particles
    for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const speed = 1 + Math.random() * 2;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed - 3;
        const size = 15 + Math.random() * 10;
        const lifetime = 40 + Math.random() * 30;
        
        particleManager.add(new Particle(x, y, '#ff69b4', size, velocityX, velocityY, lifetime));
    }
}

/**
 * Create paw print trail effect
 * @param {number} startX - Start X coordinate
 * @param {number} startY - Start Y coordinate
 * @param {number} endX - End X coordinate
 * @param {number} endY - End Y coordinate
 */
function createPawTrail(startX, startY, endX, endY) {
    const steps = 10;
    const stepX = (endX - startX) / steps;
    const stepY = (endY - startY) / steps;
    
    for (let i = 0; i < steps; i++) {
        setTimeout(() => {
            const x = startX + stepX * i;
            const y = startY + stepY * i;
            createSparkles(x, y, '#8b4513', 5);
        }, i * 50);
    }
}

/**
 * Enhanced cat portrait drawing with animations
 * @param {HTMLElement} element - DOM element to draw in
 * @param {Object} cat - Cat object
 */
function drawEnhancedCatPortrait(element, cat) {
    if (!element) return;
    
    const size = 120;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw background based on rarity
    const rarityColors = {
        common: ['#e0e0e0', '#b0bec5'],
        uncommon: ['#81c784', '#66bb6a'],
        rare: ['#64b5f6', '#42a5f5'],
        epic: ['#ba68c8', '#ab47bc'],
        legendary: ['#ffb74d', '#ffa726']
    };
    
    const colors = rarityColors[cat.stats?.rarity] || rarityColors.common;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw cat icon (emoji)
    ctx.font = `${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cat.icon || '😺', size / 2, size / 2);
    
    // Add shine effect
    const shineGradient = ctx.createRadialGradient(
        size * 0.3, size * 0.3, 0,
        size * 0.3, size * 0.3, size * 0.4
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = shineGradient;
    ctx.beginPath();
    ctx.arc(size * 0.3, size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    element.innerHTML = '';
    element.appendChild(canvas);
    
    // Add pulsing animation for legendary cats
    if (cat.stats?.rarity === 'legendary') {
        canvas.classList.add('legendary-pulse');
    }
}

/**
 * Animate stat bars with smooth transitions
 * @param {string} containerId - Container element ID
 * @param {Object} stats - Stats object
 */
function animateStatBars(containerId, stats) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const statNames = ['cuteness', 'friendliness', 'energy', 'intelligence'];
    const statIcons = {
        cuteness: '💖',
        friendliness: '😊',
        energy: '⚡',
        intelligence: '🧠'
    };
    
    let html = '';
    statNames.forEach(stat => {
        const value = stats[stat] || 0;
        html += `
            <div class="stat-row">
                <span class="stat-label">${statIcons[stat]} ${stat}</span>
                <div class="stat-bar-container">
                    <div class="stat-bar" data-value="${value}" style="width: 0%">
                        <span class="stat-value">${value}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('.stat-bar').forEach(bar => {
            const value = bar.getAttribute('data-value');
            bar.style.width = `${value}%`;
        });
    }, 10);
}

/**
 * Create floating text animation
 * @param {string} text - Text to display
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} color - Text color
 */
function createFloatingText(text, x, y, color = '#fff') {
    const element = document.createElement('div');
    element.className = 'floating-text';
    element.textContent = text;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.color = color;
    
    document.body.appendChild(element);
    
    setTimeout(() => element.classList.add('animate'), 10);
    
    setTimeout(() => element.remove(), 2000);
}

/**
 * Create energy pulse effect
 */
function createEnergyPulse() {
    const energyDisplay = document.getElementById('player-energy');
    if (energyDisplay) {
        energyDisplay.classList.add('energy-pulse');
        setTimeout(() => energyDisplay.classList.remove('energy-pulse'), 600);
    }
}

/**
 * Enhanced scene drawing with parallax layers
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} offset - Parallax offset
 */
function drawParallaxScene(ctx, width, height, offset = 0) {
    if (!ctx) return;
    
    // Draw multiple layers with different speeds for depth
    ctx.save();
    
    // Background mountains (slowest)
    ctx.translate(offset * 0.2, 0);
    drawMountains(ctx, width, height, '#667eea');
    ctx.restore();
    
    ctx.save();
    // Mid-ground trees (medium speed)
    ctx.translate(offset * 0.5, 0);
    drawForestLayer(ctx, width, height, '#45a049');
    ctx.restore();
    
    ctx.save();
    // Foreground bushes (fastest)
    ctx.translate(offset * 1, 0);
    drawBushLayer(ctx, width, height, '#2d5016');
    ctx.restore();
}

function drawMountains(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.4);
    ctx.lineTo(width * 0.2, height * 0.25);
    ctx.lineTo(width * 0.4, height * 0.35);
    ctx.lineTo(width * 0.6, height * 0.2);
    ctx.lineTo(width * 0.8, height * 0.3);
    ctx.lineTo(width, height * 0.35);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

function drawForestLayer(ctx, width, height, color) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < width; i += 60) {
        const treeHeight = 80 + Math.sin(i) * 20;
        ctx.fillRect(i, height - treeHeight, 40, treeHeight);
        
        // Tree top
        ctx.beginPath();
        ctx.moveTo(i + 20, height - treeHeight);
        ctx.lineTo(i - 10, height - treeHeight + 30);
        ctx.lineTo(i + 50, height - treeHeight + 30);
        ctx.closePath();
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawBushLayer(ctx, width, height, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.arc(i, height - 20, 25, 0, Math.PI);
        ctx.fill();
    }
}

// Expose functions globally
window.createSparkles = createSparkles;
window.createConfetti = createConfetti;
window.createHearts = createHearts;
window.createPawTrail = createPawTrail;
window.drawEnhancedCatPortrait = drawEnhancedCatPortrait;
window.animateStatBars = animateStatBars;
window.createFloatingText = createFloatingText;
window.createEnergyPulse = createEnergyPulse;
window.drawParallaxScene = drawParallaxScene;
window.particleManager = particleManager;
