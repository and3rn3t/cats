# Loading States Quick Reference

**Version**: 2.6.1  
**Phase**: 4.2  

---

## 🎯 Quick Usage Guide

### Loading Overlay

Show/hide full-screen loading:

```javascript
// Show loading
showLoadingOverlay('Processing...');

// Update message
updateLoadingText('Almost done...');

// Hide loading
hideLoadingOverlay();
```

### Button Loading

Add spinner to button:

```javascript
const button = document.getElementById('my-btn');

// Start loading
addButtonLoading(button);

// Do async work...

// Stop loading
removeButtonLoading(button);
```

### Skeleton Cards

Show placeholders:

```javascript
// Show skeleton cards
renderSkeletonCards(25);

// Load real data...

// Replace with real content
renderCollection();
```

---

## 📦 Available Components

### 1. Loading Overlay

**HTML:**
```html
<div id="loading-overlay" aria-live="polite" aria-busy="true">
  <div class="loading-content">
    <div class="loading-cat">🐱</div>
    <div class="loading-overlay-spinner"></div>
    <div class="loading-text">Loading...</div>
    <div class="loading-subtext">Please wait</div>
  </div>
</div>
```

**Functions:**
- `showLoadingOverlay(text)` - Show overlay
- `updateLoadingText(text)` - Update message
- `hideLoadingOverlay()` - Hide with fade

### 2. Button Loading

**Usage:**
```javascript
addButtonLoading(button);    // Add spinner
removeButtonLoading(button); // Remove spinner
```

**Automatic Features:**
- Button becomes disabled
- Text becomes transparent
- Spinner appears
- Smooth transitions

### 3. Skeleton Cards

**Function:**
```javascript
renderSkeletonCards(count); // count = number of cards
```

**Features:**
- Shimmer animation
- Card placeholders
- Icon/title/text bars
- Auto-removed when real content loads

### 4. Progress Bar

**HTML:**
```html
<div class="progress-bar-container">
  <div class="progress-bar">
    <div class="progress-bar-fill" style="width: 50%"></div>
  </div>
</div>
```

**JavaScript:**
```javascript
const fill = document.querySelector('.progress-bar-fill');
fill.style.width = '75%'; // Update progress
```

### 5. Loading Dots

**HTML:**
```html
<span class="loading-dots">Loading</span>
<!-- Animates: Loading. .. ... -->
```

**CSS-Only:** No JavaScript needed!

### 6. Modal Loading

**HTML:**
```html
<div class="modal-loading">
  <div class="modal-spinner"></div>
</div>
```

### 7. Inline Loading

**HTML:**
```html
<span class="inline-loading">
  <span class="inline-spinner"></span>
  Loading data...
</span>
```

### 8. Loading Pulse

**Usage:**
```javascript
element.classList.add('loading-pulse');
// Remove when done:
element.classList.remove('loading-pulse');
```

---

## 🎨 CSS Classes

### Loading States

```css
.loading-overlay         /* Full-screen overlay */
.loading-content        /* Centered content */
.loading-cat           /* Bouncing cat icon */
.loading-overlay-spinner /* Rotating spinner */
.loading-text          /* Main message */
.loading-subtext       /* Secondary text */
```

### Skeleton

```css
.skeleton-grid         /* Grid container */
.skeleton-card        /* Card placeholder */
.skeleton-icon        /* Icon placeholder */
.skeleton-title       /* Title bar */
.skeleton-text        /* Text bar */
```

### Button Loading

```css
.main-btn.loading     /* Loading state */
.action-btn.loading   /* Loading state */
```

### Progress

```css
.progress-bar-container  /* Outer container */
.progress-bar           /* Bar background */
.progress-bar-fill      /* Fill (set width) */
```

### Utilities

```css
.loading-dots          /* Animated ellipsis */
.loading-pulse        /* Pulse animation */
.modal-loading        /* Modal spinner */
.inline-loading       /* Inline indicator */
```

---

## ⚡ Performance Tips

### DO ✅

- Use GPU-accelerated properties (transform, opacity)
- Show loading for operations >300ms
- Update loading text for long operations
- Remove loading states when done
- Use skeleton screens for >500ms loads

### DON'T ❌

- Show loading for <100ms operations
- Block UI unnecessarily
- Forget to remove loading states
- Use too many spinners at once
- Ignore accessibility attributes

---

## ♿ Accessibility

### Required Attributes

```html
<!-- Loading overlay -->
<div aria-live="polite" aria-busy="true">

<!-- Loading button -->
<button aria-busy="true" disabled>

<!-- Loading region -->
<div role="status" aria-live="polite">
```

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .loading-cat {
    animation: none;
  }
  
  .skeleton-card::before {
    animation: none;
  }
  
  .loading-dots::after {
    animation: none;
    content: '...';
  }
}
```

---

## 🔧 Implementation Patterns

### Pattern 1: Simple Button Loading

```javascript
async function handleClick() {
  const btn = document.getElementById('my-btn');
  
  // Start loading
  addButtonLoading(btn);
  
  try {
    // Do async work
    await doSomething();
  } finally {
    // Always remove loading
    removeButtonLoading(btn);
  }
}
```

### Pattern 2: Loading with Delay

```javascript
function startAction() {
  const btn = document.getElementById('action-btn');
  
  addButtonLoading(btn);
  
  // Brief delay for smooth UX
  setTimeout(() => {
    performAction();
    removeButtonLoading(btn);
  }, 400);
}
```

### Pattern 3: Progressive Loading

```javascript
async function initializeGame() {
  showLoadingOverlay('Starting...');
  
  updateLoadingText('Loading data...');
  await loadData();
  
  updateLoadingText('Loading assets...');
  await loadAssets();
  
  updateLoadingText('Ready!');
  setTimeout(() => {
    hideLoadingOverlay();
  }, 500);
}
```

### Pattern 4: Skeleton Screen

```javascript
function loadCollection() {
  // Show skeletons
  renderSkeletonCards(25);
  
  // Load real data
  fetchCatData().then(() => {
    // Replace with real content
    renderCollection();
  });
}
```

---

## 📊 Timing Guidelines

| Operation | Show Loading? | Type | Duration |
|-----------|---------------|------|----------|
| <100ms | ❌ No | - | Too fast |
| 100-300ms | ⚠️ Optional | Button | Barely noticeable |
| 300-500ms | ✅ Yes | Button | Recommended |
| 500ms-2s | ✅ Yes | Overlay | Needed |
| >2s | ✅ Yes | Progress bar | Informative |

---

## 🎯 When to Use What

### Loading Overlay
- Game initialization
- Major state changes
- Full-screen transitions
- Operations >1 second

### Button Loading
- Button click actions
- Form submissions
- Quick operations (300-1000ms)
- User-initiated actions

### Skeleton Screens
- Collection rendering
- List loading
- Card grids
- >500ms render times

### Progress Bars
- File uploads
- Multi-step processes
- Long operations (>2s)
- Measurable progress

### Loading Dots
- Inline text updates
- Stream responses
- Continuous loading
- Indefinite waits

---

## 🐛 Troubleshooting

### Loading State Won't Remove

```javascript
// ALWAYS use try/finally
try {
  addButtonLoading(btn);
  await action();
} finally {
  removeButtonLoading(btn); // Guaranteed
}
```

### Multiple Loading States

```javascript
// Track loading state
let isLoading = false;

function start() {
  if (isLoading) return; // Prevent duplicates
  isLoading = true;
  addButtonLoading(btn);
}

function stop() {
  isLoading = false;
  removeButtonLoading(btn);
}
```

### Overlay Won't Hide

```javascript
// Check element exists
const overlay = document.getElementById('loading-overlay');
if (overlay) {
  hideLoadingOverlay();
}
```

---

## 📝 Checklist

When adding loading states:

- [ ] Add loading indicator
- [ ] Add aria-busy attribute
- [ ] Handle reduced motion
- [ ] Remove loading when done
- [ ] Handle errors (try/finally)
- [ ] Test loading duration
- [ ] Test accessibility
- [ ] Update loading text for long operations

---

## 🎊 Complete Example

```javascript
/**
 * Complete example with all best practices
 */
async function completeExample() {
  const btn = document.getElementById('action-btn');
  
  // Show loading overlay for major operation
  showLoadingOverlay('Initializing...');
  
  try {
    // Step 1
    updateLoadingText('Loading configuration...');
    await loadConfig();
    
    // Step 2
    updateLoadingText('Loading data...');
    await loadData();
    
    // Step 3
    updateLoadingText('Rendering...');
    renderSkeletonCards(25);
    await renderContent();
    
    // Success
    updateLoadingText('Ready!');
    
  } catch (error) {
    console.error('Load failed:', error);
    updateLoadingText('Error occurred');
    
  } finally {
    // Always hide overlay
    setTimeout(() => {
      hideLoadingOverlay();
    }, 500);
  }
}
```

---

**Version**: 2.6.1  
**Status**: Production Ready  
**Documentation**: `PHASE_4.2_LOADING_STATES.md`
