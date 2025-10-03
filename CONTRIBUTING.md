# 🤝 Contributing to Cat Collector

Thank you for your interest in contributing to Cat Collector! This guide will help you get started with contributing to this educational cat collection game.

## 🎯 Project Goals

Cat Collector aims to be:

- **Educational** - Teaching kids about cat breeds and geography
- **Inclusive** - Accessible to children ages 10-12
- **Fun** - Engaging gameplay without violence
- **Simple** - Easy to understand and modify

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Open `index.html`** in your browser to play
4. **Make your changes** using any text editor
5. **Test thoroughly** in multiple browsers
6. **Submit a pull request**

No build process or dependencies required!

## 🛠️ Development Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, or any editor)
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cats.git
cd cats

# Open in browser
# Simply double-click index.html or use a local server
```

For development with hot reload, you can use any static server:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx serve .
```

## 📝 How to Contribute

### 🐱 Adding New Cat Breeds

The easiest way to contribute! We love adding new cat breeds.

1. Open `catData.js`
2. Add your cat to the `CAT_BREEDS` array:

```javascript
{
    id: 26, // Next available ID
    name: "Your Cat Breed",
    icon: "😺", // Choose an appropriate emoji
    description: "A brief, kid-friendly description",
    origin: "Country/Region",
    stats: {
        cuteness: 85,      // 0-100
        friendliness: 80,  // 0-100
        energy: 70,        // 0-100
        intelligence: 75,  // 0-100
        rarity: "uncommon" // common, uncommon, rare, epic, legendary
    },
    behavior: "How the cat typically behaves",
    favoriteActivity: "What they love doing"
}
```

**Guidelines for cat stats:**

- **Cuteness**: Subjective, but based on general appeal
- **Friendliness**: How social the breed typically is
- **Energy**: Activity level and playfulness
- **Intelligence**: Problem-solving and trainability
- **Rarity**: Balance game progression (most should be common/uncommon)

### 🎨 Improving Visuals

We welcome improvements to:

- CSS styling and animations
- Canvas graphics and scene elements
- UI/UX enhancements
- Mobile responsiveness

When making visual changes:

- Maintain the **comic book aesthetic**
- Keep colors **bright and child-friendly**
- Ensure **high contrast** for readability
- Test on **different screen sizes**

### 🎮 Game Features

Ideas for new features:

- **Mini-games** for interacting with collected cats
- **Achievement system** for milestones
- **New environments** to explore
- **Sound effects** and background music
- **Animation improvements**
- **Educational facts** about cat care

### 🐛 Bug Fixes

Found a bug? We'd love your help fixing it!

1. **Check existing issues** first
2. **Reproduce the bug** consistently
3. **Identify the root cause**
4. **Write a clear fix**
5. **Test thoroughly**

## 🔍 Code Style Guidelines

### JavaScript

```javascript
// Use camelCase for variables and functions
let playerEnergy = 100;
function updatePlayerStats() { }

// Use descriptive names
let catEncounter = selectRandomCat(); // Good
let c = selectRandomCat();            // Avoid

// Add comments for complex logic
// Calculate success chance based on cat stats and player action
let successChance = baseChance + (cat.stats.friendliness / 200);
```

### CSS

```css
/* Use semantic class names */
.cat-collection-panel { }  /* Good */
.blue-box { }              /* Avoid */

/* Group related properties */
.game-button {
    /* Layout */
    display: inline-block;
    padding: 15px 30px;
    
    /* Appearance */
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border: 4px solid #333;
    border-radius: 10px;
    
    /* Typography */
    font-family: 'Comic Sans MS', cursive;
    font-size: 1.1em;
    color: white;
}
```

### HTML

```html
<!-- Use semantic HTML -->
<section id="cat-collection">  <!-- Good -->
<div id="cat-collection">      <!-- Less semantic -->

<!-- Include accessibility attributes -->
<button aria-label="Explore for cats" id="explore-btn">
    🔍 Explore for Cats
</button>
```

## 🧪 Testing Your Changes

### Manual Testing Checklist

- [ ] Game loads without errors
- [ ] All buttons work correctly
- [ ] Cat encounters function properly
- [ ] Collection system works
- [ ] Save/load functionality works
- [ ] UI is responsive on different screen sizes

### Browser Testing

Test in at least:

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browser

### Performance Testing

- [ ] Game runs smoothly at 60fps
- [ ] Memory usage stays reasonable
- [ ] No console errors or warnings

## 📋 Pull Request Guidelines

### Before Submitting

1. **Test your changes** thoroughly
2. **Follow the code style** guidelines
3. **Write clear commit messages**
4. **Update documentation** if needed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New cat breed
- [ ] Feature enhancement
- [ ] Documentation update
- [ ] Visual improvement

## Testing
- [ ] Tested in multiple browsers
- [ ] Checked for console errors
- [ ] Verified game functionality

## Screenshots (if applicable)
Add screenshots of visual changes
```

### Commit Message Style

```bash
# Good commit messages
git commit -m "Add Persian Longhair cat breed"
git commit -m "Fix energy depletion bug in exploration"
git commit -m "Improve mobile responsiveness of cat grid"

# Less helpful
git commit -m "Update files"
git commit -m "Fix bug"
git commit -m "Changes"
```

## 🌟 Recognition

All contributors will be acknowledged in:

- Project README
- In-game credits (future feature)
- Release notes

## 📞 Getting Help

Need help or have questions?

- **Open an issue** for bugs or feature requests
- **Start a discussion** for questions or ideas
- **Check existing documentation** first

## 📜 Code of Conduct

This project is intended for children and families. Please ensure all contributions are:

- **Family-friendly** - No inappropriate content
- **Inclusive** - Welcoming to all backgrounds
- **Educational** - Focused on learning and fun
- **Respectful** - Kind and constructive communication

## 🎉 Recognition Wall

Thank you to all our contributors:

- *Your name could be here!*

---

*Every contribution, no matter how small, makes this game better for kids everywhere! 🐱💕*
