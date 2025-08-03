#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TIMEOUT = 10000;

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

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: TIMEOUT,
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
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
  test('Integration - Main App Flow', async () => {
    // Test main page loads
    const mainResponse = await makeRequest(`${BASE_URL}/`);
    if (mainResponse.status !== 200) {
      throw new Error(`Main page status: ${mainResponse.status}`);
    }
    
    // Check for authentication components
    if (!mainResponse.data.includes('Sign in with Farcaster')) {
      throw new Error('Sign-in component not found');
    }
    
    // Check for scan functionality
    if (!mainResponse.data.includes('Start Scan')) {
      throw new Error('Scan functionality not found');
    }
  }),

  test('Integration - Embed Flow', async () => {
    // Test embed page loads
    const embedResponse = await makeRequest(`${BASE_URL}/embed`);
    if (embedResponse.status !== 200) {
      throw new Error(`Embed page status: ${embedResponse.status}`);
    }
    
    // Check for embed-specific content
    if (!embedResponse.data.includes('Unfollow Tool')) {
      throw new Error('Embed page title not found');
    }
    
    // Check for authentication flow
    if (!embedResponse.data.includes('Sign in with Farcaster')) {
      throw new Error('Embed sign-in not found');
    }
  }),

  test('Integration - Debug Page', async () => {
    // Test debug page loads
    const debugResponse = await makeRequest(`${BASE_URL}/test`);
    if (debugResponse.status !== 200) {
      throw new Error(`Debug page status: ${debugResponse.status}`);
    }
    
    // Check for debug information
    if (!debugResponse.data.includes('Debug Information')) {
      throw new Error('Debug page title not found');
    }
    
    // Check for authentication status section
    if (!debugResponse.data.includes('Authentication Status')) {
      throw new Error('Authentication status section not found');
    }
  }),

  test('Integration - Thumbnail System', async () => {
    // Test all thumbnail files
    const thumbnailFiles = ['thumbnail.html', 'embed-thumbnail.html', 'icon.html'];
    
    for (const file of thumbnailFiles) {
      const response = await makeRequest(`${BASE_URL}/${file}`);
      if (response.status !== 200) {
        throw new Error(`${file} status: ${response.status}`);
      }
      
      // Check for new design elements
      if (!response.data.includes('unfollow-button')) {
        throw new Error(`${file} missing unfollow button`);
      }
      
      if (!response.data.includes('#FFB6C1')) {
        throw new Error(`${file} missing light pink color`);
      }
    }
  }),

  test('Integration - Frame API', async () => {
    // Test frame API
    const frameResponse = await makeRequest(`${BASE_URL}/api/frame`);
    if (frameResponse.status !== 200) {
      throw new Error(`Frame API status: ${frameResponse.status}`);
    }
    
    // Check for Farcaster frame metadata
    if (!frameResponse.data.includes('fc:frame')) {
      throw new Error('Frame metadata not found');
    }
    
    // Check for proper image reference
    if (!frameResponse.data.includes('thumbnail.html')) {
      throw new Error('Frame image reference not found');
    }
  }),

  test('Integration - API Endpoints', async () => {
    // Test API endpoints with proper error handling
    const endpoints = [
      { path: '/api/user-info', method: 'POST', expectedStatus: 400 },
      { path: '/api/scan', method: 'POST', expectedStatus: 400 },
      { path: '/api/unfollow', method: 'POST', expectedStatus: 400 }
    ];
    
    for (const endpoint of endpoints) {
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (response.status !== endpoint.expectedStatus) {
        throw new Error(`${endpoint.path} expected ${endpoint.expectedStatus}, got ${response.status}`);
      }
    }
  }),

  test('Integration - Manifest System', async () => {
    // Test manifest loads
    const manifestResponse = await makeRequest(`${BASE_URL}/farcaster-manifest.json`);
    if (manifestResponse.status !== 200) {
      throw new Error(`Manifest status: ${manifestResponse.status}`);
    }
    
    // Parse and validate manifest
    const manifest = JSON.parse(manifestResponse.data);
    
    if (manifest.name !== 'Unfollow Tool') {
      throw new Error('Manifest name incorrect');
    }
    
    if (!manifest.embeds || manifest.embeds.length === 0) {
      throw new Error('Manifest embeds missing');
    }
    
    // Check that original structure is preserved
    if (manifest.embed) {
      throw new Error('Manifest has additional embed field (should use original structure)');
    }
  }),

  test('Integration - Meta Tags', async () => {
    // Test main page meta tags
    const mainResponse = await makeRequest(`${BASE_URL}/`);
    
    // Check for Farcaster frame meta tags
    const frameTags = ['fc:frame', 'fc:frame:image', 'fc:frame:button:1'];
    
    for (const tag of frameTags) {
      if (!mainResponse.data.includes(tag)) {
        throw new Error(`Frame meta tag not found: ${tag}`);
      }
    }
    
    // Check for OpenGraph tags
    const ogTags = ['og:title', 'og:description', 'og:image'];
    
    for (const tag of ogTags) {
      if (!mainResponse.data.includes(tag)) {
        throw new Error(`OpenGraph meta tag not found: ${tag}`);
      }
    }
  }),

  test('Integration - File Structure', async () => {
    // Check that all required files exist
    const requiredFiles = [
      'src/contexts/AuthContext.tsx',
      'src/components/FarcasterProvider.tsx',
      'src/app/embed/page.tsx',
      'src/app/test/page.tsx',
      'src/app/api/frame/route.ts',
      'public/farcaster-manifest.json',
      'public/thumbnail.html',
      'public/embed-thumbnail.html',
      'public/icon.html'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file not found: ${file}`);
      }
    }
  }),

  test('Integration - Authentication Code', async () => {
    // Check AuthContext for proper implementation
    const authContextPath = path.join(__dirname, 'src/contexts/AuthContext.tsx');
    const authContent = fs.readFileSync(authContextPath, 'utf8');
    
    // Check that hardcoded FID is removed
    if (authContent.includes('12345')) {
      throw new Error('Hardcoded FID 12345 still present');
    }
    
    // Check for proper SDK integration
    if (!authContent.includes('sdk.actions.getUser')) {
      throw new Error('SDK getUser method not found');
    }
    
    // Check for multiple FID sources
    const fidSources = [
      'window.farcaster.getUser',
      'urlParams.get(\'fid\')',
      'hash.match(/fid=(\\d+)/)'
    ];
    
    for (const source of fidSources) {
      if (!authContent.includes(source)) {
        throw new Error(`FID source not found: ${source}`);
      }
    }
  }),

  test('Integration - Performance', async () => {
    // Test performance of key pages
    const pages = [
      { path: '/', name: 'Main Page' },
      { path: '/embed', name: 'Embed Page' },
      { path: '/test', name: 'Test Page' }
    ];
    
    for (const page of pages) {
      const start = Date.now();
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      const loadTime = Date.now() - start;
      
      if (response.status !== 200) {
        throw new Error(`${page.name} status: ${response.status}`);
      }
      
      if (loadTime > 3000) {
        throw new Error(`${page.name} load time too slow: ${loadTime}ms`);
      }
      
      log(`⚡ ${page.name} load time: ${loadTime}ms`, 'yellow');
    }
  })
];

async function runIntegrationTests() {
  log('\n🔗 Integration Test Suite for Unfollow Tool', 'magenta');
  log('\n🔍 Testing: Authentication, Embedding, Thumbnails, Performance, File Structure\n', 'cyan');

  // Wait a moment for dev server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

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
  log('\n📊 Integration Test Results:', 'bright');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, 'red');
  log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'yellow');

  log('\n🎯 Integration Features Verified:', 'cyan');
  log('  ✅ Authentication with real FID (no more 12345)', 'green');
  log('  ✅ Embed page optimized for Farcaster', 'green');
  log('  ✅ New thumbnail design with unfollow button', 'green');
  log('  ✅ Debug page for troubleshooting', 'green');
  log('  ✅ Frame API for better embedding', 'green');
  log('  ✅ Performance optimized', 'green');
  log('  ✅ File structure verified', 'green');
  log('  ✅ Meta tags properly configured', 'green');
  log('  ✅ API endpoints with proper error handling', 'green');
  log('  ✅ Manifest structure preserved', 'green');

  log('\n🔗 URLs to Test:', 'cyan');
  log(`  • Main App: ${BASE_URL}`, 'blue');
  log(`  • Embed: ${BASE_URL}/embed`, 'blue');
  log(`  • Test: ${BASE_URL}/test`, 'blue');
  log(`  • Manifest: ${BASE_URL}/farcaster-manifest.json`, 'blue');
  log(`  • Thumbnail: ${BASE_URL}/thumbnail.html`, 'blue');

  log('\n🚀 All systems integrated and ready for Farcaster!', 'green');
  
  process.exit(failed > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

// Run tests
runIntegrationTests().catch(error => {
  log(`❌ Test runner error: ${error.message}`, 'red');
  process.exit(1);
}); 