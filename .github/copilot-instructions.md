# GitHub Copilot Instructions for Cat Collector

## Project Overview

Cat Collector is an educational browser-based game for ages 10-12 where players discover and collect 40 unique cat breeds from around the world. The game features a comic book aesthetic, no violence, and teaches geography and animal facts.

**Current Version**: 2.9.0 (Tutorial, Milestones & Personalities)

## Technology Stack

- **Pure Vanilla JavaScript** - No frameworks or libraries (by design)
- **HTML5 Canvas** - For game scene rendering  
- **CSS3** - Comic book/graphic novel styling
- **LocalStorage** - For save/load functionality
- **No build process** - Static files served directly

## Code Style & Conventions

### JavaScript

```javascript
// Use camelCase for variables and functions
let playerEnergy = 100;
function updatePlayerStats() { }

// Add JSDoc comments for all functions
/**
 * Description of what the function does
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */

// Use optional chaining for DOM access
document.getElementById('element')?.addEventListener('click', handler);

// Use try-catch for localStorage operations
try {
    localStorage.setItem('key', value);
} catch (error) {
    console.error('Error:', error);
}

// Prefer const over let when possible
const CAT_BREEDS = [...];

// Use template literals for strings
const message = `${catName} joins your collection!`;
```

### CSS

```css
/* Use semantic class names */
.cat-collection-panel { }  /* Good */
.blue-box { }              /* Avoid */

/* Group related properties */
.element {
    /* Layout */
    display: flex;
    
    /* Appearance */
    background: #fff;
    
    /* Typography */
    font-size: 1em;
}

/* Use specific transitions, not "all" */
transition: transform 0.2s ease, box-shadow 0.2s ease;

/* Use GPU-accelerated properties */
transform: translate3d(x, y, 0);
```

### HTML

```html
<!-- Use semantic HTML5 elements -->
<main>, <section>, <nav>, <aside>

<!-- Include ARIA labels for accessibility -->
<button aria-label="Description">Text</button>

<!-- Use aria-live for dynamic updates -->
<span aria-live="polite">Dynamic content</span>
```

## Architecture Patterns

### Game State Management
- Global `gameState` object tracks all game data
- Use `Set` for collected cats (efficient lookups)
- Save to localStorage after each state change
- Defensive loading with fallbacks
- Milestone tracking for rarity completion
- Daily challenge progress tracking
- Tutorial state persistence
- Personality system integration

### Module Organization (v2.9.0+)
- **Core Systems**: game.js (main logic), catData.js (data)
- **Feature Modules**: achievements.js, challenges.js, environments.js, etc.
- **UI Systems**: tutorial.js (onboarding), encyclopedia.js (education)
- **Game Mechanics**: personalities.js (traits), milestones.js (rewards)
- Each module is self-contained with init functions
- Modules integrate via gameState and event callbacks

### Canvas Rendering
- Cache gradients and reusable objects
- Only redraw when necessary (not on animation frame)
- Use efficient drawing operations
- Static scene (no constant animation loop)
- Environment-specific backgrounds cached

### Memory Management
- Clear event listeners when re-rendering
- Stop intervals when not needed
- Clean up on page unload
- No memory leaks from DOM references
- Efficient Map/Set usage for tracking

### Tutorial System (v2.9.0)
- Step-based progression
- Visual highlighting with backdrop
- Contextual tooltips on all UI elements
- Skip/replay functionality
- State persists across sessions
- Lazy-loaded on first play only

### Milestone System (v2.9.0)
- Automatic detection on cat collection
- Progress tracking per rarity tier
- Energy rewards (capped at 100)
- Beautiful notification with confetti
- Integrated into achievements panel

### Personality System (v2.9.0)
- 8 personality types with modifiers
- Applied in success rate calculation
- Filtering in collection view
- Statistics tracking per personality
- Achievement integration

### Daily Challenge System (v2.7.0)
- Date-seeded random generation
- 3 challenges per day
- 8 challenge types
- Real-time progress tracking
- Streak counter for consecutive days
- Toast notifications on completion

### Encyclopedia System (v2.8.0)
- 4 main sections (Breeds, Map, Facts, Quiz)
- Educational content integration
- Interactive geography
- Progress tracking
- Sound integration

### Error Handling
- Use optional chaining (`?.`) for all DOM access
- Wrap localStorage in try-catch
- Log errors for debugging
- Provide user-friendly fallback messages
- Verify external data (CAT_BREEDS) exists

## Performance Guidelines

### DO ✅
- Cache DOM queries in variables
- Use GPU-accelerated CSS properties (transform, opacity)
- Implement smart regeneration (stop when not needed)
- Use specific CSS transitions
- Implement keyboard navigation
- Add ARIA labels for accessibility

### DON'T ❌
- Create gradients on every draw call
- Use `transition: all`
- Run intervals at max capacity
- Add framework dependencies
- Use external libraries (keep it vanilla)
- Add build steps or compilation

## Accessibility Requirements

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space activate buttons
- Escape closes modals
- Focus indicators must be visible

### ARIA Support
- All buttons need descriptive labels
- Use semantic HTML
- aria-live for dynamic content
- aria-modal for dialogs
- role attributes where appropriate

### Visual Accessibility
- High contrast focus indicators
- Support for `prefers-reduced-motion`
- Support for `prefers-contrast: high`
- Visible focus states
- Readable font sizes (minimum 14px)

## Design Philosophy

### Comic Book Aesthetic
- Bold borders (3-5px solid #333)
- Vibrant gradients
- Drop shadows for depth
- Comic Sans MS font (child-friendly)
- Large, colorful buttons
- Emoji icons for universal appeal

### Color Palette
```css
/* Primary */
--primary-pink: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--primary-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accents */
--yellow-info: #fff9c4;
--dark-text: #333;

/* Rarity Colors */
--common: #b0bec5;
--uncommon: #66bb6a;
--rare: #42a5f5;
--epic: #ab47bc;
--legendary: #ffa726;
```

### UI Principles
- Single-screen layout (no page scrolling)
- Internal scrolling for cat grid only
- Large touch targets (minimum 44x44px)
- Clear visual feedback on interactions
- Immediate state updates

## Game Balance

### Energy System
- Start with 100 energy
- Each exploration costs 10 energy
- Regenerates 1 point per 30 seconds
- Maximum of 100 energy
- Regeneration stops at max (performance)

### Rarity Weights
```javascript
common: 40%      // Easy to find
uncommon: 30%    // Fairly common
rare: 20%        // Takes patience
epic: 8%         // Quite rare
legendary: 2%    // Extremely rare
```

### Success Rates
- Base chance: 50%
- Modified by cat stats and action
- Approach: +friendliness bonus
- Treat: Works better with low-energy cats
- Observe: +intelligence bonus

## File Structure

```
cats/
├── index.html          # Main UI structure
├── styles.css          # All styling (single file)
├── game.js            # Core game logic
├── catData.js         # Cat breed database (40 cats)
├── achievements.js    # 36 achievements system
├── analytics.js       # Analytics dashboard
├── animations.js      # Visual effects & particles
├── audio.js           # Sound system
├── challenges.js      # Daily challenges & streaks
├── encyclopedia.js    # Educational content system
├── environments.js    # 5 environment system
├── milestones.js      # Rarity milestone rewards (v2.9.0)
├── minigames.js       # 3 mini-games
├── personalities.js   # Cat personality traits (v2.9.0)
├── tutorial.js        # Tutorial & tooltips (v2.9.0)
├── visuals.js         # Canvas rendering
├── docs/              # Documentation
│   ├── guides/        # Player & developer guides
│   ├── reference/     # Quick references
│   ├── development/   # Phase completion docs
│   ├── deployment/    # Deployment guides
│   ├── bugfixes/      # Bug fix documentation
│   └── releases/      # Release-specific notes
├── CONTRIBUTING.md    # Contribution guidelines
├── README.md          # Main documentation
├── CHANGELOG.md       # Complete change history
└── LICENSE            # MIT License
```

## Adding New Features

### Adding a Cat Breed
```javascript
{
    id: 26,                    // Next available ID
    name: "Cat Breed Name",
    icon: "😺",               // Appropriate emoji
    description: "Kid-friendly description",
    origin: "Country/Region",
    stats: {
        cuteness: 85,          // 0-100
        friendliness: 80,      // 0-100
        energy: 70,            // 0-100
        intelligence: 75,      // 0-100
        rarity: "uncommon"     // Balance carefully
    },
    behavior: "How they behave",
    favoriteActivity: "What they love"
}
```

### Adding UI Elements
1. Add semantic HTML with ARIA labels
2. Style with comic book aesthetic
3. Add keyboard event handlers
4. Include focus states
5. Test accessibility
6. Update documentation

### Adding Game Mechanics
1. Document with JSDoc comments
2. Add error handling
3. Update save/load if needed
4. Test on multiple browsers
5. Check memory usage
6. Update API.md

## Testing Checklist

When making changes, verify:
- [ ] No console errors
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Mobile responsive
- [ ] No memory leaks
- [ ] LocalStorage handles errors
- [ ] Save/load functionality works
- [ ] All 25 cats collectible
- [ ] Energy system works correctly
- [ ] Performance is smooth (60fps)

## Common Patterns

### Safe DOM Access
```javascript
const element = document.getElementById('id');
if (!element) {
    console.error('Element not found');
    return;
}
// or
document.getElementById('id')?.addEventListener('click', handler);
```

### LocalStorage Operations
```javascript
try {
    localStorage.setItem('key', JSON.stringify(data));
} catch (error) {
    console.error('Save failed:', error);
    alert('Could not save progress');
}
```

### Event Listener Cleanup
```javascript
// Clear before re-rendering
grid.innerHTML = '';

// Add with proper cleanup
card.addEventListener('click', handler);
// Listeners auto-removed when element destroyed
```

### Keyboard Navigation
```javascript
element.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAction();
    }
});
```

## Educational Goals

This is an educational game for children, so:
- Keep language simple and positive
- No violence or battles
- Teach real facts about cat breeds
- Include geography (cat origins)
- Encourage patience and strategy
- Make it fun and rewarding
- Family-friendly content only

## Browser Support

Target browsers:
- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Mobile browsers ✅

Features used:
- ES6+ (Sets, arrow functions, template literals)
- Optional chaining (`?.`)
- CSS Grid & Flexbox
- HTML5 Canvas
- LocalStorage

## Performance Targets

- Initial load: < 1 second
- Canvas render: < 10ms
- Memory: Stable (no growth)
- CPU: < 5% when idle
- Smooth 60fps animations
- Responsive interactions (< 100ms)

## Documentation

Always keep documentation updated:
- Add JSDoc to all functions
- Update API.md for API changes
- Update README.md for feature changes
- Document breaking changes in CHANGES.md
- Keep CONTRIBUTING.md current

## Questions to Ask When Reviewing Code

1. Is this vanilla JS (no frameworks)?
2. Are there proper error handlers?
3. Is keyboard navigation supported?
4. Are ARIA labels present?
5. Will this cause memory leaks?
6. Is it child-friendly content?
7. Does it follow the comic book style?
8. Is it documented with JSDoc?
9. Does it work on mobile?
10. Is performance optimized?

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Keyboard Accessibility](https://webaim.org/techniques/keyboard/)

---

**Remember:** This is an educational game for kids. Keep it simple, fun, accessible, and family-friendly! 🐱✨
