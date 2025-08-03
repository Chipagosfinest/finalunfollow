#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://unfollow.vercel.app';

async function testEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    https.get(url, (res) => {
      const status = res.statusCode;
      if (status === expectedStatus) {
        console.log(`✅ PASS: ${path} (${status})`);
        resolve(true);
      } else {
        console.log(`❌ FAIL: ${path} (${status})`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`❌ FAIL: ${path} (Error: ${err.message})`);
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('🧪 Quick Test for Unfollow Tool\n');

  const tests = [
    { path: '/', expectedStatus: 200 },
    { path: '/embed', expectedStatus: 200 },
    { path: '/.well-known/farcaster.json', expectedStatus: 200 }
  ];

  const results = await Promise.all(tests.map(test => testEndpoint(test.path, test.expectedStatus)));
  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\n🎯 Key Features to Test:`);
  console.log(`  • Visit: ${BASE_URL}`);
  console.log(`  • Embed: ${BASE_URL}/embed`);
  console.log(`  • No "Ready not called" error`);
  console.log(`  • Sign-in works`);
  console.log(`  • Scan functionality works`);
  console.log(`  • Mobile-optimized interface`);
  console.log(`\n🚀 Ready to post and test!`);
}

runTests(); 