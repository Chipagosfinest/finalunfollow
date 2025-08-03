const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TESTS = [
  {
    name: 'Test Page Accessibility',
    url: '/test',
    expected: 'Farcaster SDK Test Page'
  },
  {
    name: 'Farcaster Test Environment',
    url: '/test-farcaster.html',
    expected: 'Farcaster SDK Test Environment'
  },
  {
    name: 'Main App Page',
    url: '/',
    expected: 'Unfollow Tool'
  },
  {
    name: 'Embed Page',
    url: '/embed',
    expected: 'Loading'
  }
];

// Helper function to make HTTP requests
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('🧪 Running Farcaster SDK Tests...\n');
  
  let passed = 0;
  let failed = 0;

  for (const test of TESTS) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await makeRequest(test.url);
      
      if (response.statusCode === 200 && response.data.includes(test.expected)) {
        console.log(`✅ PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${test.name}`);
        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Expected: ${test.expected}`);
        console.log(`   Found: ${response.data.substring(0, 100)}...`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${test.name} - ${error.message}`);
      failed++;
    }
    console.log('');
  }

  // Test API endpoints
  console.log('Testing API Endpoints...\n');
  
  try {
    const scanResponse = await makeRequest('/api/scan');
    console.log(`📊 Scan API Status: ${scanResponse.statusCode}`);
    
    const userInfoResponse = await makeRequest('/api/user-info');
    console.log(`👤 User Info API Status: ${userInfoResponse.statusCode}`);
    
    const unfollowResponse = await makeRequest('/api/unfollow');
    console.log(`🚫 Unfollow API Status: ${unfollowResponse.statusCode}`);
  } catch (error) {
    console.log(`❌ API Test Error: ${error.message}`);
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your Farcaster app is ready for testing.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Run the tests
runTests().catch(console.error); 