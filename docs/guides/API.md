# 📚 API Documentation - Cat Collector

This document describes the JavaScript API and data structures used in Cat Collector.

## Table of Contents

- [Game State](#game-state)
- [Cat Data Structure](#cat-data-structure)
- [Core Functions](#core-functions)
- [Rendering Functions](#rendering-functions)
- [Constants](#constants)

---

## Game State

The global `gameState` object tracks all game progress:

```javascript
let gameState = {
    collectedCats: Set,        // Set of collected cat IDs
    playerEnergy: Number,      // Current energy (0-100)
    currentEncounter: Object,  // Current cat encounter object
    lastEncounterTime: Number  // Timestamp of last encounter
};
```

### Methods

#### `saveGameState()`

Saves the current game state to localStorage.

**Returns:** `void`

**Example:**

```javascript
saveGameState();
```

#### `loadGameState()`

Loads saved game state from localStorage.

**Returns:** `void`

**Example:**

```javascript
loadGameState();
```

---

## Cat Data Structure

Each cat in `CAT_BREEDS` array follows this structure:

```javascript
{
    id: Number,              // Unique identifier (1-25)
    name: String,            // Display name
    icon: String,            // Emoji representation
    description: String,     // Flavor text description
    origin: String,          // Geographic origin
    stats: {
        cuteness: Number,    // 0-100
        friendliness: Number,// 0-100
        energy: Number,      // 0-100
        intelligence: Number,// 0-100
        rarity: String       // "common"|"uncommon"|"rare"|"epic"|"legendary"
    },
    behavior: String,        // Behavioral traits
    favoriteActivity: String // Preferred activity
}
```

---

## Core Functions

### Game Initialization

#### `initGame()`

Initializes the game state, loads saved data, and sets up UI.

**Returns:** `void`

**Called:** Automatically on page load

---

### Exploration System

#### `exploreForCats()`

Main exploration function. Costs 10 energy and triggers a random cat encounter.

**Returns:** `void`

**Requirements:**

- Player must have at least 10 energy
- Uncollected cats must be available

**Example:**

```javascript
document.getElementById('explore-btn').addEventListener('click', exploreForCats);
```

#### `selectRandomCat()`

Selects a random cat based on rarity weights.

**Returns:** `Object` - Cat data object, or `null` if all cats collected

**Algorithm:**

1. Filters out already collected cats
2. Uses weighted random selection based on `RARITY_CHANCE`
3. Selects random cat of chosen rarity tier

**Example:**

```javascript
const cat = selectRandomCat();
if (cat) {
    showEncounter(cat);
}
```

---

### Encounter System

#### `showEncounter(cat)`

Displays the cat encounter panel with cat information.

**Parameters:**

- `cat` (Object) - Cat data object to display

**Returns:** `void`

**Example:**

```javascript
const cat = CAT_BREEDS[0];
showEncounter(cat);
```

#### `handleEncounterAction(action)`

Processes player's chosen action during an encounter.

**Parameters:**

- `action` (String) - Action type: `"approach"`, `"treat"`, or `"observe"`

**Returns:** `void`

**Success Calculation:**

- Base chance: 50%
- Modified by cat stats and chosen action
- `"approach"` works better with friendly cats
- `"treat"` works better with high-energy cats
- `"observe"` works better with intelligent cats

**Example:**

```javascript
handleEncounterAction('treat');
```

---

### Collection Management

#### `renderCollection()`

Updates the cat collection grid display.

**Returns:** `void`

**Behavior:**

- Shows collected cats with color
- Shows uncollected cats in grayscale
- Updates collection counter

**Example:**

```javascript
renderCollection(); // Called after collecting a cat
```

#### `showCatDetails(catId)`

Displays detailed information about a specific cat.

**Parameters:**

- `catId` (Number) - ID of the cat to display

**Returns:** `void`

**Example:**

```javascript
showCatDetails(5); // Show Scottish Fold details
```

#### `closeCatDetails()`

Closes the cat details panel.

**Returns:** `void`

---

### UI Updates

#### `updatePlayerStats()`

Updates the player stats display (energy and collection count).

**Returns:** `void`

**Example:**

```javascript
updatePlayerStats(); // Call after energy changes
```

#### `scrollToCollection()`

Smoothly scrolls the page to the collection section.

**Returns:** `void`

---

## Rendering Functions

### Scene Rendering

#### `drawScene()`

Main rendering function. Clears and redraws the entire game scene.

**Returns:** `void`

**Calls:**

- `drawBackground()`
- `drawEnvironment()`
- `drawSceneText()`

#### `drawBackground()`

Renders the sky gradient background.

**Returns:** `void`

#### `drawEnvironment()`

Renders all environmental elements (trees, bushes, clouds, ground).

**Returns:** `void`

### Element Rendering

#### `drawTree(x, y)`

Renders a tree at specified coordinates.

**Parameters:**

- `x` (Number) - X coordinate
- `y` (Number) - Y coordinate (ground level)

**Returns:** `void`

#### `drawCloud(x, y)`

Renders a cloud at specified coordinates.

**Parameters:**

- `x` (Number) - X coordinate
- `y` (Number) - Y coordinate

**Returns:** `void`

#### `drawBush(x, y)`

Renders a bush at specified coordinates.

**Parameters:**

- `x` (Number) - X coordinate
- `y` (Number) - Y coordinate (ground level)

**Returns:** `void`

---

## Constants

### `CAT_BREEDS`

Array containing all 25 cat breed objects.

**Type:** `Array<Object>`

**Length:** 25

### `RARITY_COLORS`

Color mapping for each rarity level.

```javascript
{
    common: "#b0bec5",      // Gray
    uncommon: "#66bb6a",    // Green
    rare: "#42a5f5",        // Blue
    epic: "#ab47bc",        // Purple
    legendary: "#ffa726"    // Orange
}
```

### `RARITY_CHANCE`

Probability weights for cat rarity spawns.

```javascript
{
    common: 0.40,      // 40%
    uncommon: 0.30,    // 30%
    rare: 0.20,        // 20%
    epic: 0.08,        // 8%
    legendary: 0.02    // 2%
}
```

### `CAT_FACTS`

Array of flavor text strings displayed during encounters.

**Type:** `Array<String>`

**Length:** 10

---

## LocalStorage Schema

### Key: `catCollectorGame`

**Structure:**

```javascript
{
    collectedCats: Array<Number>,  // Array of collected cat IDs
    playerEnergy: Number           // Current player energy (0-100)
}
```

**Example:**

```javascript
{
    collectedCats: [1, 3, 5, 7, 12],
    playerEnergy: 70
}
```

---

## Events

### Button Events

- `#explore-btn` → `exploreForCats()`
- `#collection-btn` → `scrollToCollection()`
- `#help-btn` → `showHelp()`
- `#close-details` → `closeCatDetails()`
- `#approach-btn` → `handleEncounterAction('approach')`
- `#offer-treat-btn` → `handleEncounterAction('treat')`
- `#observe-btn` → `handleEncounterAction('observe')`
- `#encyclopedia-btn` → `openEncyclopedia()` (v2.8.0)
- `#challenges-btn` → `openChallenges()` (v2.7.0)
- `#achievements-btn` → `showAchievements()` (v2.5.1)

### Custom Events

Currently, the game uses direct function calls rather than custom events.

---

## New Modules (v2.7.0+)

### Tutorial System (v2.9.0)

#### `initTutorial()`

Initializes the tutorial system for first-time players.

**Returns:** `void`

**Example:**

```javascript
initTutorial(); // Called in initGame() for new players
```

#### `startTutorial()`

Begins the interactive 10-step tutorial.

**Returns:** `void`

#### `nextTutorialStep()`

Advances to the next tutorial step.

**Returns:** `void`

#### `skipTutorial()`

Skips the tutorial and marks it as completed.

**Returns:** `void`

#### `showTooltip(elementId, text, position)`

Displays a contextual tooltip on an element.

**Parameters:**

- `elementId` (String) - ID of element to attach tooltip
- `text` (String) - Tooltip content
- `position` (String) - 'top', 'bottom', 'left', or 'right'

**Returns:** `void`

### Milestone System (v2.9.0)

#### `checkMilestones()`

Checks if any rarity milestones have been completed.

**Returns:** `void`

**Called:** After each cat collection

**Example:**

```javascript
checkMilestones(); // Called in processSuccessfulEncounter()
```

#### `showMilestoneNotification(milestone)`

Displays completion notification for a milestone.

**Parameters:**

- `milestone` (Object) - Milestone object with name, reward, etc.

**Returns:** `void`

#### `renderMilestonesPanel()`

Renders the milestones progress panel in achievements.

**Returns:** `void`

### Personality System (v2.9.0)

#### `getPersonalityModifier(personality, action)`

Gets the success rate modifier for a personality and action.

**Parameters:**

- `personality` (String) - Cat's personality type
- `action` (String) - Player's chosen action

**Returns:** `Number` - Modifier (-0.20 to +0.20)

**Example:**

```javascript
const modifier = getPersonalityModifier('Shy', 'observe'); // Returns +0.20
```

#### `filterCatsByPersonality(personalityType)`

Filters collection to show only cats of a specific personality.

**Parameters:**

- `personalityType` (String) - Personality type to filter by

**Returns:** `void`

#### `renderPersonalityStats()`

Renders personality statistics panel in achievements.

**Returns:** `void`

### Daily Challenges System (v2.7.0)

#### `initChallenges()`

Initializes the daily challenges system.

**Returns:** `void`

**Called:** Once on game initialization

#### `generateDailyChallenges()`

Generates 3 random challenges for today using date-seeded RNG.

**Returns:** `Array<Object>` - Array of challenge objects

#### `updateChallengeProgress(type, value)`

Updates progress for challenges of a specific type.

**Parameters:**

- `type` (String) - Challenge type to update
- `value` (Number) - Amount to increment by (default: 1)

**Returns:** `void`

**Example:**

```javascript
updateChallengeProgress('catsCollected', 1);
updateChallengeProgress('explorations', 1);
```

#### `checkChallengeCompletion(challenge)`

Checks if a challenge has been completed and awards energy.

**Parameters:**

- `challenge` (Object) - Challenge object to check

**Returns:** `Boolean` - True if newly completed

#### `openChallenges()`

Opens the daily challenges panel.

**Returns:** `void`

### Encyclopedia System (v2.8.0)

#### `openEncyclopedia()`

Opens the cat encyclopedia panel.

**Returns:** `void`

#### `showEncyclopediaHome()`

Displays the encyclopedia home screen with 4 main options.

**Returns:** `void`

#### `showBreedGuide()`

Displays all 40 cat breeds in a scrollable grid.

**Returns:** `void`

#### `showBreedDetail(catId)`

Shows detailed information for a specific cat breed.

**Parameters:**

- `catId` (Number) - ID of the cat to display

**Returns:** `void`

#### `showWorldMap()`

Displays interactive world map grouped by regions.

**Returns:** `void`

#### `showFunFacts()`

Displays random cat facts.

**Returns:** `void`

#### `startKnowledgeQuiz()`

Starts the 10-question knowledge quiz.

**Returns:** `void`

#### `checkQuizAnswer(selectedAnswer, correctAnswer)`

Checks if quiz answer is correct and provides feedback.

**Parameters:**

- `selectedAnswer` (String) - User's selected answer
- `correctAnswer` (String) - Correct answer

**Returns:** `Boolean` - True if correct

### Environment System (v2.5.0)

#### `checkEnvironmentUnlocks()`

Checks if new environments should be unlocked based on collection.

**Returns:** `void`

#### `switchEnvironment(environmentName)`

Switches to a different environment.

**Parameters:**

- `environmentName` (String) - 'Forest', 'Mountain', 'Desert', 'City', or 'Beach'

**Returns:** `void`

#### `renderEnvironmentSelector()`

Renders the environment selector with unlock badges.

**Returns:** `void`

### Mini-Games System (v2.4.0)

#### `openMinigames()`

Opens the mini-games selection panel.

**Returns:** `void`

#### `startFollowTheTreat()`

Starts the Follow the Treat memory game.

**Returns:** `void`

#### `startCatToyChase()`

Starts the Cat Toy Chase timing game.

**Returns:** `void`

#### `startHideAndSeek()`

Starts the Hide and Seek observation game.

**Returns:** `void`

---

## Browser Compatibility

### Required Features

- **HTML5 Canvas** - All modern browsers
- **localStorage** - IE8+, all modern browsers
- **ES6 Sets** - IE11+, all modern browsers
- **CSS Grid** - IE11+ (with prefixes), all modern browsers

### Tested Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Performance Considerations

### Canvas Rendering

- **FPS:** Not actively limited (runs on demand)
- **Resolution:** 800x500 pixels
- **Rendering:** Only on initialization (static scene)

### Memory Usage

- **Game State:** ~1-2 KB
- **localStorage:** ~0.5 KB saved data
- **DOM Elements:** Minimal (static collection grid)

### Optimization Tips

1. Avoid frequent full re-renders
2. Use CSS transforms for animations
3. Lazy-load cat details only when clicked
4. Consider canvas caching for complex scenes

---

*For implementation examples, see `game.js` and `catData.js` source files.*
