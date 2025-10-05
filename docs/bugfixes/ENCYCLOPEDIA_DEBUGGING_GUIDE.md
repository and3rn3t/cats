# Encyclopedia Panel Troubleshooting Guide

**Date:** October 4, 2025  
**Issue:** Encyclopedia panel not showing when button is clicked  
**Status:** 🔍 Investigating

## Fixes Applied

### Fix #1: Function Exposure (v2.8.0c)

✅ **Fixed** - Corrected function names in window exposure:

- Changed `window.showRegionInfo` → `window.showRegionDetails`
- Added missing `window.submitQuizAnswer`

### Fix #2: Enhanced Debugging (v2.8.0d)

✅ **Added** - Comprehensive console logging to track:

- Panel element existence
- CSS class changes
- Computed display values
- Right position values
- Fallback display forcing

## Debugging Checklist

When encyclopedia panel doesn't show, check the following in browser console:

### 1. Check Button Click

```
📚 Encyclopedia button clicked!
```

If this doesn't appear, the button event listener isn't working.

### 2. Check Function Availability

```
📚 Calling openEncyclopedia()
```

If you see "❌ openEncyclopedia function not found!" then encyclopedia.js didn't load.

### 3. Check Panel DOM Element

```
📚 Panel found: [object HTMLElement]
```

If you see "❌ Encyclopedia panel not found", the HTML is missing the panel div.

### 4. Check CSS Classes

```
📚 Panel classes before: side-panel hidden
📚 Panel classes after: side-panel
```

The `hidden` class should be removed.

### 5. Check Display Property

```
📚 Panel display before: none
📚 Panel display after: flex
```

Display should change from `none` to `flex`.

### 6. Check Position

```
📚 Panel right after: 20px
```

Should be `20px` (visible), not `-450px` (off-screen).

### 7. Check Content Rendering

```
📚 renderEncyclopediaIndex() called
📚 Content element found, rendering...
📚 Collected: X/40 (Y%)
```

Content should be populated.

## Common Issues and Solutions

### Issue 1: Panel Element Not Found

**Symptoms:** "❌ Encyclopedia panel not found"  
**Cause:** HTML missing or malformed  
**Solution:** Check `index.html` for `<aside id="encyclopedia-panel">`

### Issue 2: Function Not Exposed

**Symptoms:** "❌ openEncyclopedia function not found!"  
**Cause:** encyclopedia.js not loaded or function not in window object  
**Solution:**  

1. Check browser network tab - encyclopedia.js loaded?
2. Check console for script errors
3. Verify `window.openEncyclopedia` exists in console

### Issue 3: Display Still None

**Symptoms:** Display property remains `none` after removing `hidden` class  
**Cause:** CSS specificity or caching issue  
**Solution:**  

1. Hard refresh browser (Ctrl+F5)
2. Check if another CSS rule is overriding
3. Fallback: Code now forces `display: flex` via inline style

### Issue 4: Panel Off-Screen

**Symptoms:** Panel exists but not visible, `right` value is negative  
**Cause:** CSS transition not working or `.side-panel:not(.hidden)` rule not applying  
**Solution:**  

1. Check CSS is loaded (inspect element in DevTools)
2. Verify no conflicting CSS rules
3. Check browser supports `:not()` pseudo-class

### Issue 5: Z-Index Problem

**Symptoms:** Panel renders but is behind other elements  
**Cause:** Another element has higher z-index  
**Solution:**  

1. Check loading overlay is hidden (`display: none`)
2. Inspect z-index stack in DevTools
3. Panel has `z-index: 1000`, loading overlay has `z-index: 10000` but should be hidden

### Issue 6: Content Not Rendering

**Symptoms:** Panel shows but is empty  
**Cause:** `renderEncyclopediaIndex()` failing  
**Solution:**  

1. Check console for "❌ encyclopedia-content element not found"
2. Verify `CAT_BREEDS` array is loaded
3. Check `gameState.collectedCats` exists

## Browser Console Tests

Run these in browser console to diagnose:

```javascript
// Test 1: Check if functions exist
console.log('openEncyclopedia:', typeof window.openEncyclopedia);
console.log('closeEncyclopedia:', typeof window.closeEncyclopedia);
console.log('renderEncyclopediaIndex:', typeof window.renderEncyclopediaIndex);

// Test 2: Check panel element
const panel = document.getElementById('encyclopedia-panel');
console.log('Panel exists:', !!panel);
console.log('Panel classes:', panel?.className);
console.log('Panel computed display:', panel ? window.getComputedStyle(panel).display : 'N/A');

// Test 3: Manually open panel
if (window.openEncyclopedia) {
    window.openEncyclopedia();
} else {
    console.error('openEncyclopedia not available');
}

// Test 4: Check content
const content = document.getElementById('encyclopedia-content');
console.log('Content exists:', !!content);
console.log('Content HTML length:', content?.innerHTML.length || 0);

// Test 5: Check gameState
console.log('gameState exists:', !!window.gameState);
console.log('Collected cats:', window.gameState?.collectedCats.size || 0);

// Test 6: Check CAT_BREEDS
console.log('CAT_BREEDS exists:', !!window.CAT_BREEDS);
console.log('CAT_BREEDS length:', window.CAT_BREEDS?.length || 0);
```

## Files to Check

1. **index.html** - Panel HTML structure (lines 77-82)
2. **encyclopedia.js** - Function implementations and exposure (lines 250-268, 310-345)
3. **game.js** - Button event listener (lines 312-321)
4. **styles.css** - Panel CSS rules (lines 1226-1250, 2607+)

## Test Files

- `test-encyclopedia.html` - Full encyclopedia test with mock data
- `test-encyclopedia-simple.html` - Detailed debugging test
- `test-panel-minimal.html` - Minimal CSS/HTML test

## Next Steps if Still Not Working

1. **Check browser console** - Run all diagnostic tests above
2. **Test minimal page** - Open `test-panel-minimal.html` to verify CSS works
3. **Compare with working panel** - Open challenges panel, compare behavior
4. **Check network tab** - Ensure all JS/CSS files load without errors
5. **Try different browser** - Rule out browser-specific issues
6. **Clear cache completely** - Hard refresh or clear browser cache

## Version History

- **v2.8.0** - Original implementation
- **v2.8.0b** - Attempted fix
- **v2.8.0c** - Fixed function exposure bug
- **v2.8.0d** - Added comprehensive debugging and fallback display forcing

## Related Documentation

- `BUGFIX_ENCYCLOPEDIA_FUNCTIONS.md` - Details on function exposure fix
- `BUGFIX_ENCYCLOPEDIA_V2.8.0.md` - Original bug report
- `ENCYCLOPEDIA_TROUBLESHOOTING.md` - General encyclopedia issues
