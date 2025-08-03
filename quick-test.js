#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://unfollow.vercel.app';

async function testEndpoint(path, expectedContent) {
  return new Promise((resolve) => {
    const req = https.request(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const success = expectedContent.some(content => data.includes(content));
        resolve({ success, status: res.statusCode, path });
      });
    });
    req.on('error', () => resolve({ success: false, path }));
    req.end();
  });
}

async function runQuickTest() {
  console.log('🧪 Quick Test for Unfollow Tool\n');
  
  const tests = [
    { path: '/', content: ['Unfollow Tool', 'Sign in'] },
    { path: '/embed', content: ['Unfollow Tool', 'Open Full App'] },
    { path: '/farcaster-manifest.json', content: ['"name": "Unfollow Tool"', '"url": "https://unfollow.vercel.app"'] }
  ];

  for (const test of tests) {
    const result = await testEndpoint(test.path, test.content);
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${test.path} (${result.status})`);
  }

  console.log('\n🎯 Key Features to Test:');
  console.log('  • Visit: https://unfollow.vercel.app');
  console.log('  • Embed: https://unfollow.vercel.app/embed');
  console.log('  • No "Ready not called" error');
  console.log('  • Sign-in works');
  console.log('  • Scan functionality works');
  console.log('  • Mobile-optimized interface');
  
  console.log('\n🚀 Ready to post and test!');
}

runQuickTest(); 