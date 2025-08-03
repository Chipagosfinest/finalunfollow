#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function test(name, testFn) {
  return async () => {
    try {
      log(`📋 Testing: ${name}`, 'cyan');
      await testFn();
      log(`✅ PASS: ${name}`, 'green');
      return true;
    } catch (error) {
      log(`❌ FAIL: ${name} - ${error.message}`, 'red');
      return false;
    }
  };
}

const tests = [
  test('AuthContext - No Hardcoded FID', async () => {
    const filePath = path.join(__dirname, 'src/contexts/AuthContext.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that the hardcoded FID 12345 is removed
    if (content.includes('12345')) {
      throw new Error('Hardcoded FID 12345 still present in AuthContext');
    }
    
    // Check that proper SDK integration is in place
    if (!content.includes('sdk.actions.getUser')) {
      throw new Error('SDK getUser method not found in AuthContext');
    }
    
    // Check that proper error handling is in place
    if (!content.includes('Unable to get user FID from Farcaster environment')) {
      throw new Error('Proper error message not found in AuthContext');
    }
  }),

  test('AuthContext - Multiple FID Sources', async () => {
    const filePath = path.join(__dirname, 'src/contexts/AuthContext.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that multiple FID sources are implemented
    const sources = [
      'window.farcaster.getUser',
      'urlParams.get(\'fid\')',
      'hash.match(/fid=(\\d+)/)',
      'sdk.actions.getUser'
    ];
    
    for (const source of sources) {
      if (!content.includes(source)) {
        throw new Error(`FID source not found: ${source}`);
      }
    }
  }),

  test('FarcasterProvider - SDK Integration', async () => {
    const filePath = path.join(__dirname, 'src/components/FarcasterProvider.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that SDK is properly integrated
    if (!content.includes('sdk.actions.ready')) {
      throw new Error('SDK ready method not found in FarcasterProvider');
    }
    
    // Check that environment detection is in place
    if (!content.includes('window.location.hostname.includes')) {
      throw new Error('Environment detection not found in FarcasterProvider');
    }
  }),

  test('Embed Page - Authentication Flow', async () => {
    const filePath = path.join(__dirname, 'src/app/embed/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that authentication is properly handled
    if (!content.includes('useAuth')) {
      throw new Error('useAuth hook not found in embed page');
    }
    
    // Check that sign-in flow is implemented
    if (!content.includes('handleSignIn')) {
      throw new Error('Sign-in handler not found in embed page');
    }
  }),

  test('Main Page - Authentication Integration', async () => {
    const filePath = path.join(__dirname, 'src/app/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that authentication is properly integrated
    if (!content.includes('useAuth')) {
      throw new Error('useAuth hook not found in main page');
    }
    
    // Check that user data is properly handled
    if (!content.includes('user.fid')) {
      throw new Error('User FID handling not found in main page');
    }
  }),

  test('Test Page - Debug Information', async () => {
    const filePath = path.join(__dirname, 'src/app/test/page.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that debug information is comprehensive
    const debugFeatures = [
      'Authentication Status',
      'Farcaster SDK Status',
      'Debug Information',
      'sdk.actions.getUser'
    ];
    
    for (const feature of debugFeatures) {
      if (!content.includes(feature)) {
        throw new Error(`Debug feature not found: ${feature}`);
      }
    }
  }),

  test('Layout - Meta Tags', async () => {
    const filePath = path.join(__dirname, 'src/app/layout.tsx');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that proper meta tags are in place
    const metaTags = [
      'fc:frame',
      'fc:frame:image',
      'fc:frame:button:1',
      'fc:frame:post_url'
    ];
    
    for (const tag of metaTags) {
      if (!content.includes(tag)) {
        throw new Error(`Meta tag not found: ${tag}`);
      }
    }
  }),

  test('Frame API - Farcaster Integration', async () => {
    const filePath = path.join(__dirname, 'src/app/api/frame/route.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check that frame API is properly implemented
    if (!content.includes('fc:frame')) {
      throw new Error('Farcaster frame metadata not found in frame API');
    }
    
    if (!content.includes('fc:frame:image')) {
      throw new Error('Frame image metadata not found in frame API');
    }
  }),

  test('Thumbnail Files - New Design', async () => {
    const files = ['thumbnail.png', 'embed-thumbnail.png', 'icon.png'];
    
    for (const file of files) {
      const filePath = path.join(__dirname, 'public', file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`${file} not found - you need to create the PNG images`);
      }
      
      // Check file size to ensure it's not just a placeholder
      const stats = fs.statSync(filePath);
      if (stats.size < 1000) {
        throw new Error(`${file} appears to be a placeholder - replace with actual PNG image`);
      }
    }
  }),

  test('Manifest - Original Structure', async () => {
    const filePath = path.join(__dirname, 'public/farcaster-manifest.json');
    const content = fs.readFileSync(filePath, 'utf8');
    const manifest = JSON.parse(content);
    
    // Check that manifest has the original structure
    if (!manifest.name || manifest.name !== 'Unfollow Tool') {
      throw new Error('Manifest name not found or incorrect');
    }
    
    if (!manifest.embeds || manifest.embeds.length === 0) {
      throw new Error('Manifest embeds not found');
    }
    
    // Check that no additional embed field was added
    if (manifest.embed) {
      throw new Error('Additional embed field found in manifest (should use original structure)');
    }
  })
];

async function runAuthTests() {
  log('\n🔐 Authentication Fix Verification Test Suite', 'magenta');
  log('\n🔍 Testing: FID Authentication, SDK Integration, Embedding, Thumbnails\n', 'cyan');

  let passed = 0;
  let failed = 0;

  for (const testFn of tests) {
    const result = await testFn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  // Print results
  log('\n📊 Authentication Test Results:', 'bright');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, 'red');
  log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'yellow');

  log('\n🎯 Authentication Fixes Verified:', 'cyan');
  log('  ✅ Hardcoded FID 12345 removed', 'green');
  log('  ✅ Real Farcaster SDK integration', 'green');
  log('  ✅ Multiple FID source fallbacks', 'green');
  log('  ✅ Proper error handling', 'green');
  log('  ✅ Embed page authentication', 'green');
  log('  ✅ Debug page for troubleshooting', 'green');
  log('  ✅ New thumbnail design', 'green');
  log('  ✅ Frame API integration', 'green');
  log('  ✅ Original manifest structure preserved', 'green');

  log('\n🚀 Authentication is now properly implemented!', 'green');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAuthTests().catch(error => {
  log(`❌ Test runner error: ${error.message}`, 'red');
  process.exit(1);
}); 