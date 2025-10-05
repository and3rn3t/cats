# Testing Guide for v2.5.0 Environment System

**Date**: October 3, 2025  
**Version**: v2.5.0  
**Purpose**: Comprehensive testing of multi-environment expansion

---

## 🎯 Testing Objectives

1. Verify all 40 cats are collectable
2. Confirm environment filtering works correctly
3. Test environment unlock system
4. Validate save/load functionality
5. Check UI responsiveness
6. Verify no console errors

---

## 🧪 Test Plan

### Test 1: Fresh Start - Forest Environment

**Steps:**

1. Open browser console (F12)
2. Clear localStorage: `localStorage.clear()`
3. Refresh page (F5)
4. Check initial state:
   - ✅ Should be in Forest environment
   - ✅ Energy should be 100
   - ✅ No cats collected (0/40)
   - ✅ Only Forest is unlocked in environment selector

**Expected Results:**

- Forest environment active (🌲)
- Canvas shows forest colors (green/blue)
- No console errors

**Console Check:**

```javascript
// Run in browser console:
console.log('Current Environment:', gameState.currentEnvironment);
console.log('Unlocked Environments:', gameState.environmentsUnlocked);
console.log('Collected Cats:', gameState.collectedCats.size);
```

---

### Test 2: Cat Collection in Forest

**Steps:**

1. Click "Explore for Cats" multiple times
2. Collect 3-5 forest cats
3. Check each collected cat's environment

**Expected Results:**

- All encountered cats should have forest environment
- Environment badge shows 🌲 on collected cats
- Forest cats: Persian, Maine Coon, Ragdoll, Norwegian Forest Cat, Birman, Chartreux, Japanese Bobtail, European Wildcat

**Console Verification:**

```javascript
// Check what cats are in forest
CAT_BREEDS.filter(c => c.environment === 'forest').map(c => c.name)

// Check collected cats
Array.from(gameState.collectedCats).map(id => 
  CAT_BREEDS.find(c => c.id === id)?.name
)
```

---

### Test 3: Mountain Environment Unlock (5 Cats)

**Steps:**

1. Continue collecting until you have 5 cats total
2. Watch for unlock notification
3. Check environment selector

**Expected Results:**

- 🎉 Notification: "NEW ENVIRONMENT UNLOCKED! 🏔️ Snowy Peaks"
- Mountain should now be clickable
- Forest cats should still appear if in Forest environment

**Console Check:**

```javascript
console.log('Total Cats:', gameState.collectedCats.size);
console.log('Unlocked:', gameState.environmentsUnlocked);
// Should show: ['forest', 'mountain']
```

---

### Test 4: Switch to Mountain Environment

**Steps:**

1. Click on Mountain environment (🏔️) in selector
2. Observe canvas color change
3. Explore and collect a few cats

**Expected Results:**

- Canvas changes to mountain colors (blue sky, grey/white ground)
- Environment selector highlights Mountain
- Only mountain cats appear: Russian Blue, Turkish Angora, Himalayan, Siberian, Turkish Van, Nebelung, American Curl, Mountain Lynx

**Console Check:**

```javascript
console.log('Current Env:', gameState.currentEnvironment); // 'mountain'
CAT_BREEDS.filter(c => c.environment === 'mountain').map(c => c.name)
```

---

### Test 5: Desert Unlock (10 Cats Total)

**Steps:**

1. Switch between Forest and Mountain
2. Collect until you have 10 cats total
3. Watch for Desert unlock

**Expected Results:**

- Desert unlocks at 10 cats
- Canvas changes to golden/orange colors when selected
- Desert cats: Siamese, Abyssinian, Egyptian Mau, Burmese, Arabian Mau, Somali, Chausie, Sand Cat

**Console Check:**

```javascript
console.log('Total:', gameState.collectedCats.size); // Should be >= 10
console.log('Unlocked:', gameState.environmentsUnlocked);
// Should show: ['forest', 'mountain', 'desert']
```

---

### Test 6: City Unlock (15 Cats)

**Steps:**

1. Continue collecting across Forest, Mountain, Desert
2. Reach 15 cats total
3. Verify City unlocks

**Expected Results:**

- City unlocks with grey/steel blue colors
- City cats: Bengal, Scottish Fold, British Shorthair, Manx, Devon Rex, American Shorthair, Bombay, Korat

---

### Test 7: Beach Unlock (20 Cats)

**Steps:**

1. Collect across all available environments
2. Reach 20 cats total
3. All environments should now be unlocked

**Expected Results:**

- Beach unlocks with tropical colors
- Beach cats: Sphynx, Savannah, Tonkinese, Ocicat, Singapura, Exotic Shorthair, Balinese, Havana Brown (LEGENDARY!)

**Console Check:**

```javascript
console.log('All unlocked:', gameState.environmentsUnlocked.length === 5);
```

---

### Test 8: Save/Load Functionality

**Steps:**

1. Note your current state (cats collected, current environment)
2. Save state manually: `saveGameState()` in console
3. Close browser tab
4. Reopen index.html
5. Verify state restored

**Expected Results:**

- Same number of cats collected
- Same environment active
- Same environments unlocked
- All progress preserved

**Console Check:**

```javascript
// Before closing:
console.log('Saving:', {
  cats: gameState.collectedCats.size,
  env: gameState.currentEnvironment,
  unlocked: gameState.environmentsUnlocked
});

// After reopening:
console.log('Loaded:', {
  cats: gameState.collectedCats.size,
  env: gameState.currentEnvironment,
  unlocked: gameState.environmentsUnlocked
});
```

---

### Test 9: Complete Collection (All 40 Cats)

**Steps:**

1. Methodically collect all cats from each environment
2. Track progress per environment

**Expected Results:**

- 8 cats per environment = 40 total
- Each environment shows completion
- Legendary cat (Havana Brown) collected from Beach

**Console Verification:**

```javascript
// Check collection per environment
const envs = ['forest', 'mountain', 'desert', 'city', 'beach'];
envs.forEach(env => {
  const total = CAT_BREEDS.filter(c => c.environment === env).length;
  const collected = CAT_BREEDS.filter(c => 
    c.environment === env && gameState.collectedCats.has(c.id)
  ).length;
  console.log(`${env}: ${collected}/${total}`);
});

// Should all show 8/8
```

---

### Test 10: Environment Progress Tracking

**Steps:**

1. Check environment progress data
2. Verify visits and discoveries are tracked

**Console Check:**

```javascript
// View all environment progress
Object.entries(gameState.environmentProgress).forEach(([env, data]) => {
  console.log(`${env}:`, {
    visits: data.visits,
    discovered: data.discovered.size
  });
});
```

---

### Test 11: UI/UX Testing

**Steps:**

1. Test environment selector responsiveness
2. Check environment badges on cat cards
3. Verify locked environment messages
4. Test canvas color transitions

**Expected Results:**

- Smooth transitions between environments
- Clear visual feedback
- Locked environments show lock message
- Badges visible and correctly positioned

---

### Test 12: Edge Cases

**Test 12a: Try to Switch to Locked Environment**

- Click a locked environment
- Should show lock message with requirement

**Test 12b: Collect All Cats in One Environment**

- Collect all 8 cats from one environment
- Try to explore again in that environment
- Should show "collected all cats in this environment" message

**Test 12c: Environment Switch During Encounter**

- Start an encounter with a cat
- Note: Environment should not be switchable during encounter
- Complete encounter, then switch

**Test 12d: Rapid Environment Switching**

- Quickly switch between multiple environments
- Canvas should update correctly each time
- No visual glitches or errors

---

## 🐛 Bug Tracking Template

If you find issues, document them:

```
**Bug ID**: [Number]
**Severity**: [Critical/High/Medium/Low]
**Environment**: [Which environment(s)]
**Description**: [What happened]
**Steps to Reproduce**:
1. 
2. 
3. 
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Console Errors**: [Any errors shown]
**Screenshot**: [If applicable]
```

---

## ✅ Success Criteria

### Core Functionality

- [ ] All 40 cats are collectable
- [ ] Cats only appear from current environment
- [ ] All 5 environments unlock correctly
- [ ] Environment switching works smoothly
- [ ] Save/load preserves all state

### Visual/UI

- [ ] Environment badges visible on cat cards
- [ ] Canvas colors update per environment
- [ ] Environment selector shows correct state
- [ ] No visual glitches

### Data Integrity

- [ ] Progress tracked per environment
- [ ] No duplicate cats collected
- [ ] Rarity distribution maintained
- [ ] No console errors

---

## 🔧 Quick Console Commands

```javascript
// === Inspection Commands ===

// View current state
console.table({
  environment: gameState.currentEnvironment,
  cats: gameState.collectedCats.size,
  unlocked: gameState.environmentsUnlocked.join(', ')
});

// List all cats by environment
const byEnv = {};
CAT_BREEDS.forEach(cat => {
  if (!byEnv[cat.environment]) byEnv[cat.environment] = [];
  byEnv[cat.environment].push(cat.name);
});
console.table(byEnv);

// Check collection progress
console.log('Progress:', 
  `${gameState.collectedCats.size}/40 cats (${Math.round(gameState.collectedCats.size/40*100)}%)`
);

// === Debug Commands (use carefully) ===

// Unlock all environments (for testing)
gameState.environmentsUnlocked = ['forest', 'mountain', 'desert', 'city', 'beach'];
if (window.renderEnvironmentSelector) renderEnvironmentSelector(gameState);

// Add cats to collection (for testing)
// gameState.collectedCats.add(1); // Adds cat ID 1
// renderCollection();

// Reset game
// localStorage.clear();
// location.reload();

// Switch environment programmatically
// switchEnvironment('desert');

// Check what cats are still needed in current environment
const currentEnv = gameState.currentEnvironment;
const needed = CAT_BREEDS.filter(c => 
  c.environment === currentEnv && 
  !gameState.collectedCats.has(c.id)
).map(c => `${c.name} (${c.stats.rarity})`);
console.log(`Still needed in ${currentEnv}:`, needed);
```

---

## 📊 Performance Checks

```javascript
// Check for memory leaks (run after playing for 5+ minutes)
console.log('Energy regen interval:', energyRegenInterval !== null);
console.log('Cached gradients:', cachedGradients !== null);

// Verify environment progress not growing indefinitely
console.log('Progress size:', 
  JSON.stringify(gameState.environmentProgress).length, 'bytes'
);
```

---

## 📝 Test Results Template

```markdown
## Test Session Results

**Date**: [Date]
**Tester**: [Name]
**Duration**: [Time]
**Browser**: [Chrome/Firefox/Safari + Version]

### Tests Completed
- [ ] Test 1: Fresh Start
- [ ] Test 2: Forest Collection
- [ ] Test 3: Mountain Unlock
- [ ] Test 4: Environment Switch
- [ ] Test 5: Desert Unlock
- [ ] Test 6: City Unlock
- [ ] Test 7: Beach Unlock
- [ ] Test 8: Save/Load
- [ ] Test 9: Complete Collection
- [ ] Test 10: Progress Tracking
- [ ] Test 11: UI/UX
- [ ] Test 12: Edge Cases

### Issues Found
[List any bugs or issues]

### Overall Assessment
[ ] PASS - Ready for release
[ ] PASS with minor issues - Document for future
[ ] FAIL - Blocking issues found

### Notes
[Any additional observations]
```

---

## 🚀 Ready to Test

Start with **Test 1** and work through sequentially. Open browser console to run verification commands.

**Happy Testing! 🐱✨**
