/**
 * Automated Verification Script for v2.5.0
 * Run this in the browser console after the game loads
 */

console.log('🧪 Starting v2.5.0 Verification Tests...\n');

const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function test(name, condition, details = '') {
    const passed = condition;
    results.tests.push({ name, passed, details });
    if (passed) {
        results.passed++;
        console.log(`✅ PASS: ${name}`);
    } else {
        results.failed++;
        console.error(`❌ FAIL: ${name}${details ? ' - ' + details : ''}`);
    }
}

// Test 1: CAT_BREEDS loaded
test('CAT_BREEDS loaded', 
    window.CAT_BREEDS && Array.isArray(window.CAT_BREEDS)
);

// Test 2: Total cat count
test('40 cats available', 
    window.CAT_BREEDS?.length === 40,
    `Found ${window.CAT_BREEDS?.length || 0} cats`
);

// Test 3: All cats have environment property
test('All cats have environment property',
    window.CAT_BREEDS?.every(cat => cat.environment),
    'Some cats missing environment'
);

// Test 4: Environment distribution (8 per environment)
const envCounts = {};
window.CAT_BREEDS?.forEach(cat => {
    envCounts[cat.environment] = (envCounts[cat.environment] || 0) + 1;
});

test('Forest has 8 cats', envCounts.forest === 8, `Has ${envCounts.forest}`);
test('Mountain has 8 cats', envCounts.mountain === 8, `Has ${envCounts.mountain}`);
test('Desert has 8 cats', envCounts.desert === 8, `Has ${envCounts.desert}`);
test('City has 8 cats', envCounts.city === 8, `Has ${envCounts.city}`);
test('Beach has 8 cats', envCounts.beach === 8, `Has ${envCounts.beach}`);

// Test 5: ENVIRONMENTS object loaded
test('ENVIRONMENTS object loaded',
    window.ENVIRONMENTS && typeof window.ENVIRONMENTS === 'object'
);

// Test 6: All 5 environments defined
const expectedEnvs = ['forest', 'mountain', 'desert', 'city', 'beach'];
test('All 5 environments defined',
    expectedEnvs.every(env => window.ENVIRONMENTS?.[env])
);

// Test 7: gameState initialized
test('gameState initialized',
    typeof gameState !== 'undefined' && gameState !== null
);

// Test 8: gameState has environment properties
test('gameState has currentEnvironment',
    gameState?.currentEnvironment !== undefined
);

test('gameState has environmentProgress',
    gameState?.environmentProgress !== undefined &&
    typeof gameState.environmentProgress === 'object'
);

test('gameState has environmentsUnlocked',
    Array.isArray(gameState?.environmentsUnlocked)
);

// Test 9: Forest starts unlocked
test('Forest environment unlocked by default',
    gameState?.environmentsUnlocked?.includes('forest')
);

// Test 10: Current environment is valid
test('Current environment is valid',
    expectedEnvs.includes(gameState?.currentEnvironment)
);

// Test 11: Rarity distribution
const rarityCounts = {};
window.CAT_BREEDS?.forEach(cat => {
    const rarity = cat.stats?.rarity;
    rarityCounts[rarity] = (rarityCounts[rarity] || 0) + 1;
});

test('Common cats (16)', rarityCounts.common === 16, `Has ${rarityCounts.common}`);
test('Uncommon cats (12)', rarityCounts.uncommon === 12, `Has ${rarityCounts.uncommon}`);
test('Rare cats (8)', rarityCounts.rare === 8, `Has ${rarityCounts.rare}`);
test('Epic cats (3)', rarityCounts.epic === 3, `Has ${rarityCounts.epic}`);
test('Legendary cats (1)', rarityCounts.legendary === 1, `Has ${rarityCounts.legendary}`);

// Test 12: Canvas exists
test('Canvas element exists',
    document.getElementById('game-canvas') !== null
);

// Test 13: Environment selector exists
test('Environment selector exists',
    document.getElementById('environment-selector') !== null
);

// Test 14: Collection grid exists
test('Cat grid exists',
    document.getElementById('cat-grid') !== null
);

// Test 15: switchEnvironment function exposed
test('switchEnvironment function available',
    typeof window.switchEnvironment === 'function'
);

// Test 16: Check for console errors (manual check)
console.log('\n📋 Manual Checks Needed:');
console.log('- Check browser console for any errors');
console.log('- Verify canvas is displaying correctly');
console.log('- Test environment switching manually');
console.log('- Test cat collection and unlocks');

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Total: ${results.tests.length}`);
console.log(`🎯 Success Rate: ${Math.round(results.passed / results.tests.length * 100)}%`);

if (results.failed === 0) {
    console.log('\n🎉 ALL AUTOMATED TESTS PASSED! 🎉');
    console.log('Proceed with manual testing using TESTING_GUIDE_V2.5.0.md');
} else {
    console.log('\n⚠️  SOME TESTS FAILED - Review failures above');
}

console.log('\n📝 Next Steps:');
console.log('1. Fix any failed tests above');
console.log('2. Run manual tests from TESTING_GUIDE_V2.5.0.md');
console.log('3. Test complete gameplay loop');
console.log('4. Verify save/load functionality');

// Export results for further analysis
window.testResults = results;
console.log('\n💾 Results saved to window.testResults');
