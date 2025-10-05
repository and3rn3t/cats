# Animation System Quick Reference

**Version**: 2.6.0  
**File**: `animations.js`

---

## 🎯 Quick Usage

### Check if Animations Available

```javascript
if (window.animateDialogOpen) {
    animateDialogOpen(dialog);
}
```

### Reduced Motion Detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## 📚 Function Reference

### Modal/Dialog Animations

```javascript
// Open with fade-in
animateDialogOpen(dialog);

// Close with fade-out (returns Promise)
animateDialogClose(dialog).then(() => {
    dialog.close();
});
```

### Panel Animations

```javascript
// Slide in from right
animatePanelOpen(panel);

// Slide out to right (returns Promise)
animatePanelClose(panel).then(() => {
    panel.classList.add('hidden');
});
```

### Particle Effects

```javascript
// Create particles at position
createParticleEffect(x, y, '✨', 5);

// Create particles on element
createParticlesOnElement(element, '⭐', 10);

// Full-screen confetti
createConfetti(3000); // duration in ms
```

### Feedback Animations

```javascript
// Shake element
shakeElement(button);

// Add glow effect
addGlowEffect(element, 2000); // duration in ms, 0 = infinite

// Bounce element
bounceElement(element);
```

### Card Animations

```javascript
// Reveal animation with delay
animateCatCardReveal(card, 100); // delay in ms

// Flip animation
animateCardFlip(card);
```

### Energy Animations

```javascript
// Start/stop regeneration pulse
animateEnergyRegen(energyElement, true);  // start
animateEnergyRegen(energyElement, false); // stop
```

### Encounter Animations

```javascript
// Success animation
animateEncounterSuccess(encounterPanel);

// Failure animation
animateEncounterFailure(encounterPanel);
```

### Celebration Animations

```javascript
// Achievement celebration
celebrateAchievement(achievementCard);

// Milestone celebration
celebrateMilestone(20); // number of cats

// Stats update celebration
animateStatsUpdate(statsElement);
```

### Loading Animations

```javascript
// Create spinner
const spinner = createLoadingSpinner(container);

// Remove spinner
removeLoadingSpinner(spinner);
```

---

## 🎨 CSS Classes

### Animation Classes

```css
.fade-in           /* Fade in effect */
.fade-out          /* Fade out effect */
.bounce-in         /* Bounce entrance */
.shake-animation   /* Shake effect */
.glow-effect       /* Pulsing glow */
.success-animation /* Success bounce */
.newly-collected   /* Card flip */
.revealing         /* Card reveal */
.regenerating      /* Energy pulse */
.just-unlocked     /* Achievement glow */
.celebration-animation /* Milestone bounce */
```

### Particle Elements

```css
.particle          /* Floating particle */
.confetti          /* Falling confetti */
.legendary-sparkle /* Sparkle effect */
.loading-spinner   /* Spinner */
.skeleton          /* Loading placeholder */
```

---

## ⚡ CSS Keyframes

### Entrance/Exit

```css
@keyframes fadeIn
@keyframes fadeInBackdrop
@keyframes fadeOut
@keyframes slideInRight
@keyframes slideOutRight
@keyframes bounceIn
```

### Feedback

```css
@keyframes shake
@keyframes errorShake
@keyframes pulse
@keyframes badgePulse
@keyframes glow
```

### Effects

```css
@keyframes particleFloat
@keyframes confettiFall
@keyframes sparkle
@keyframes catAppear
@keyframes catBounce
```

### Progress

```css
@keyframes progressFill
@keyframes energyFill
@keyframes energyPulse
```

### Card Animations

```css
@keyframes cardFlip
@keyframes cardReveal
@keyframes celebrationScale
```

### Utility

```css
@keyframes spin
@keyframes skeleton
@keyframes fadeInSimple
```

---

## 🎯 Common Patterns

### Animate Modal Opening

```javascript
const modal = document.getElementById('my-modal');
modal.showModal();
if (window.animateDialogOpen) {
    animateDialogOpen(modal);
}
```

### Animate Modal Closing

```javascript
const modal = document.getElementById('my-modal');
if (window.animateDialogClose) {
    animateDialogClose(modal).then(() => {
        modal.close();
    });
} else {
    modal.close();
}
```

### Success with Particles

```javascript
// Animate success
if (window.animateEncounterSuccess) {
    animateEncounterSuccess(encounterPanel);
}

// Add particles
if (window.createParticlesOnElement) {
    createParticlesOnElement(encounterPanel, '✨', 10);
}
```

### Milestone Celebration

```javascript
const count = gameState.collectedCats.size;

// Celebrate
if (window.celebrateMilestone) {
    celebrateMilestone(count);
}

// Animate stats
const statsElement = document.getElementById('cats-collected');
if (window.animateStatsUpdate) {
    animateStatsUpdate(statsElement);
}
```

### Error Feedback

```javascript
// Shake the button
if (window.shakeElement) {
    shakeElement(button);
}

// Add particles
if (window.createParticlesOnElement) {
    createParticlesOnElement(button, '💔', 3);
}
```

---

## ⚙️ Animation Variables

```css
:root {
    --anim-duration-fast: 0.2s;
    --anim-duration-base: 0.3s;
    --anim-duration-slow: 0.5s;
    --anim-easing: cubic-bezier(0.4, 0, 0.2, 1);
    --anim-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## ♿ Accessibility

All animations automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

JavaScript functions check the preference:

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    return; // Skip animation
}
```

---

## 🎨 Rarity-Based Effects

### Legendary Cards

Automatic sparkles via CSS:

```css
.cat-card[data-rarity="legendary"]::before,
.cat-card[data-rarity="legendary"]::after {
    content: '✨';
    animation: sparkle 2s ease-in-out infinite;
}
```

### Legendary Achievements

Automatic confetti on unlock:

```javascript
if (achievement.rarity === 'legendary') {
    if (window.createConfetti) {
        createConfetti(3000);
    }
}
```

---

## 📊 Performance Tips

### GPU Acceleration

Only animate these properties:

- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ❌ Avoid: `left`, `top`, `width`, `height`

### Cleanup

Particles auto-cleanup:

```javascript
setTimeout(() => {
    particle.remove();
}, 1300);
```

### Conditional Execution

Always check before applying:

```javascript
if (!element || prefersReducedMotion) {
    return;
}
```

---

## 🎯 Integration Checklist

When adding animations to new features:

- [ ] Check if function exists (`if (window.functionName)`)
- [ ] Use optional chaining for safety
- [ ] Respect reduced motion preference
- [ ] Clean up particle/confetti elements
- [ ] Use GPU-accelerated properties
- [ ] Test on multiple browsers
- [ ] Verify 60 FPS performance
- [ ] Check accessibility

---

## 📝 Examples from Game

### From game.js

```javascript
// Encounter success
if (window.animateEncounterSuccess && encounterPanel) {
    animateEncounterSuccess(encounterPanel);
}
if (window.createParticlesOnElement && encounterPanel) {
    createParticlesOnElement(encounterPanel, '✨', 10);
}

// Milestone celebration
if (window.celebrateMilestone) {
    celebrateMilestone(gameState.collectedCats.size);
}

// Energy regeneration
if (window.animateEnergyRegen && energyElement) {
    animateEnergyRegen(energyElement, true);
    setTimeout(() => {
        animateEnergyRegen(energyElement, false);
    }, 2000);
}
```

### From achievements.js

```javascript
// Achievement notification
if (window.createParticlesOnElement) {
    createParticlesOnElement(notification, '⭐', 5);
}

if (achievement.rarity === 'legendary') {
    if (window.createConfetti) {
        createConfetti(3000);
    }
}
```

---

## 🚀 Advanced Usage

### Promise-Based Sequencing

```javascript
animateDialogClose(modal1)
    .then(() => modal1.close())
    .then(() => {
        modal2.showModal();
        return animateDialogOpen(modal2);
    });
```

### Staggered Animations

```javascript
cards.forEach((card, index) => {
    animateCatCardReveal(card, index * 30);
});
```

### Conditional Celebrations

```javascript
const count = gameState.collectedCats.size;

if (count === 10 || count === 20 || count === 25 || count === 40) {
    createConfetti(4000);
}

createParticlesOnElement(canvas, '🎉', 15);
```

---

## 📖 Full Documentation

See `docs/PHASE_4.1_ANIMATIONS.md` for:

- Complete feature list
- Implementation details
- Performance considerations
- Accessibility guidelines
- Testing results

---

**Quick Start**: Most animations work automatically. For custom use, just check if the function exists and call it!

```javascript
if (window.animationFunction) {
    animationFunction(element);
}
```

**Remember**: Always respect reduced motion preferences! 🎨✨
