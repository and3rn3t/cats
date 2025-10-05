# 🐱 Cat Collector - A Wild Cat Adventure 🐱

A fun, graphical cat collection game designed for ages 10-12! Discover and care for cats in the wild, collect stats and learn about different cat breeds from around the world - just like Pokémon, but with adorable cats!

[![Game Screenshot](https://img.shields.io/badge/Play-Now-brightgreen?style=for-the-badge)](#-quick-start)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](index.html)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](game.js)

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Strategy Guide](docs/STRATEGY_QUICK_REFERENCE.md)** - v2.1.0 Challenge Mode strategies! 🎯
- **[Challenge Mode Details](docs/CHALLENGE_MODE_V2.1.0.md)** - Complete v2.1.0 difficulty overhaul
- **[CSS Design System](docs/CSS_DESIGN_SYSTEM.md)** - v2.1.2 Standardized styling guide 🎨
- **[Developer Guide](DEVELOPER_GUIDE.md)** - Technical documentation
- **[API Reference](API.md)** - Complete function and data reference
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Documentation Index](DOCS_INDEX.md)** - Complete documentation overview

## 📋 Table of Contents

- [🐱 Cat Collector - A Wild Cat Adventure 🐱](#-cat-collector---a-wild-cat-adventure-)
  - [📚 Documentation](#-documentation)
  - [📋 Table of Contents](#-table-of-contents)
  - [🎮 Game Features](#-game-features)
  - [🚀 Quick Start](#-quick-start)
  - [🚀 How to Play](#-how-to-play)
    - [Getting Started](#getting-started)
    - [Game Mechanics](#game-mechanics)
  - [🐾 Cat Stats Explained](#-cat-stats-explained)
  - [🌟 Featured Breeds](#-featured-breeds)
  - [💻 Technical Details](#-technical-details)
    - [Files Structure](#files-structure)
    - [Technologies Used](#technologies-used)
    - [Browser Compatibility](#browser-compatibility)
  - [🎨 Design Philosophy](#-design-philosophy)
  - [🎯 Educational Value](#-educational-value)
  - [🔮 Future Enhancements](#-future-enhancements)
  - [📝 License](#-license)
  - [🤝 Contributing](#-contributing)

## 🎮 Game Features

- **25+ Unique Cat Breeds** - From Persian to Savannah, discover cats from all over the world!
- **🆕 Strategic Challenge Mode (v2.1.0)** - Make meaningful decisions! Wrong choices = real consequences
- **Beautiful Graphic Novel Style** - Comic-book inspired visuals that are colorful and engaging
- **Stat-Based Gameplay** - Each cat has unique stats: Cuteness, Friendliness, Energy, Intelligence, and Rarity
- **🆕 2-Attempt Limit** - Choose wisely - you only get 2 tries before cats run away!
- **No Fighting** - Cats don't battle! Instead, their stats determine how you interact with them
- **🆕 Achievement System** - 20 achievements to unlock across 5 rarity tiers
- **🆕 Visual Effects** - Particle system and enhanced graphics
- **🆕 Analytics Dashboard** - Track your collection progress and stats
- **Collection & Care** - Find cats, care for them, and build your collection
- **Interactive Care Activities** - Feed, play, groom, and train your collected cats to increase their happiness!
- **Training Minigame** - Test your reflexes in a fun cat training challenge
- **Educational** - Learn about real cat breeds, their origins, and behaviors
- **Browser-Based** - No downloads required! Play directly in your web browser
- **Auto-Save** - Your progress is automatically saved using local storage

## 🚀 Quick Start

**Play in 3 Easy Steps:**

1. **Download** the project files (or clone the repository)
2. **Open** `index.html` in your web browser
3. **Start exploring** for cats and building your collection!

**No installation, no dependencies, no build process required!**

For detailed instructions, see the [Quick Start Guide](QUICKSTART.md).

## 🚀 How to Play

### Getting Started

1. Open `index.html` in your web browser
2. Click "Explore for Cats" to venture into the wild
3. When you encounter a cat, **study their stats carefully!** 📊
4. Choose the right action based on their stats:
   - **Approach Gently** - Best for cats with HIGH Friendliness (>80)
   - **Offer Treat** - Perfect for cats with LOW Energy (<40)
   - **Observe** - Works well with HIGH Intelligence (>75)
5. ⚠️ **You only get 2 attempts!** Choose poorly and the cat runs away!
6. Successfully befriend cats to add them to your collection!

**New to v2.1.0?** Check the [Strategy Guide](docs/STRATEGY_QUICK_REFERENCE.md) for complete tips!

### Game Mechanics

- **Energy System**: You have 100 energy. Exploring costs 10 energy. Energy regenerates 1 point every 45 seconds.
- **2-Attempt Limit**: Each cat encounter gives you only 2 chances. Choose wisely or they'll run away!
- **Strategic Success Rates**: Base chance is 30%. Right strategy can boost to 70-90%, wrong strategy drops to 15-30%!
- **Rarity Difficulty**: Legendary cats are 50% harder to collect, even with perfect strategy!
- **Rarity System**: Cats come in 5 rarity levels:
  - Common (40% chance)
  - Uncommon (30% chance)
  - Rare (20% chance)
  - Epic (8% chance)
  - Legendary (2% chance)
- **Stats Matter**: Each cat's stats influence how they respond to different actions
- **Progress Saved**: Your collection is automatically saved in your browser

## 🐾 Cat Stats Explained

- **Cuteness** 😻 - How adorable the cat is
- **Friendliness** 🤝 - How easily the cat trusts you
- **Energy** ⚡ - How active and playful the cat is
- **Intelligence** 🧠 - How clever and trainable the cat is
- **Rarity** ⭐ - How rare this breed is to encounter

## 🌟 Featured Breeds

The game includes 25 cat breeds from around the world:

- Persian (Iran)
- Siamese (Thailand)
- Maine Coon (USA)
- Bengal (USA)
- Scottish Fold (Scotland)
- Sphynx (Canada)
- Ragdoll (USA)
- British Shorthair (UK)
- Abyssinian (Ethiopia)
- Russian Blue (Russia)
- Norwegian Forest Cat (Norway)
- Birman (Myanmar)
- Turkish Angora (Turkey)
- Manx (Isle of Man)
- Egyptian Mau (Egypt)
- Burmese (Myanmar)
- Savannah (USA) - Legendary!
- And many more...

## 💻 Technical Details

### Files Structure

- `index.html` - Main game page
- `styles.css` - Graphic novel style CSS
- `game.js` - Game logic and mechanics
- `catData.js` - Database of all 25 cat breeds

### Technologies Used

- HTML5 Canvas for graphics
- Vanilla JavaScript (no frameworks needed)
- CSS3 for animations and styling
- LocalStorage for save data

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 🎨 Design Philosophy

The game features a **graphic novel aesthetic** with:
- Bold outlines and borders
- Vibrant, contrasting colors
- Comic Sans font for readability (perfect for kids!)
- Smooth animations and transitions
- Large, colorful buttons
- Emoji-based cat representations for universal appeal

## 🎯 Educational Value

Kids learn about:
- Different cat breeds and their origins
- Geography (where cats come from)
- Animal behavior and care
- Patience and strategy (choosing the right approach)
- Collection and completion goals

## 🔮 Future Enhancements

Potential additions:
- More cat breeds (target: 50+)
- ✅ ~~Mini-games for interacting with collected cats~~ (Added training minigame!)
- Trading system (multiplayer)
- ✅ ~~Cat care activities~~ (Feed, play, groom activities implemented!)
- Achievement system
- Sound effects and music
- Different environments to explore

## 📝 License

This is an educational game project. Feel free to use and modify!

## 🤝 Contributing

Want to add more cat breeds or features? Contributions welcome!

---

**Made with 💕 for cat lovers and young Pokémon fans!**
