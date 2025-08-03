const puppeteer = require('puppeteer');

async function testFarcasterSDK() {
  console.log('🧪 Testing Farcaster SDK Initialization...\n');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Test 1: Check test page
    console.log('Testing: Farcaster SDK Test Page');
    await page.goto('http://localhost:3000/test', { waitUntil: 'networkidle0' });
    
    const testPageTitle = await page.title();
    console.log(`✅ Test page title: ${testPageTitle}`);
    
    // Test 2: Check if SDK info is displayed
    const sdkInfo = await page.evaluate(() => {
      const infoElement = document.querySelector('pre');
      return infoElement ? infoElement.textContent : 'No SDK info found';
    });
    
    console.log(`📊 SDK Info: ${sdkInfo.substring(0, 100)}...`);
    
    // Test 3: Check if ready status is displayed
    const readyStatus = await page.evaluate(() => {
      const statusElement = document.querySelector('[class*="bg-green-100"], [class*="bg-red-100"]');
      return statusElement ? statusElement.textContent.trim() : 'No status found';
    });
    
    console.log(`🔍 Ready Status: ${readyStatus}`);
    
    // Test 4: Test Farcaster test environment
    console.log('\nTesting: Farcaster Test Environment');
    await page.goto('http://localhost:3000/test-farcaster.html', { waitUntil: 'networkidle0' });
    
    const testEnvTitle = await page.title();
    console.log(`✅ Test environment title: ${testEnvTitle}`);
    
    // Test 5: Check if mock SDK is working
    const mockSDKStatus = await page.evaluate(() => {
      const statusElement = document.getElementById('statusText');
      return statusElement ? statusElement.textContent : 'No status found';
    });
    
    console.log(`🔧 Mock SDK Status: ${mockSDKStatus}`);
    
    console.log('\n✅ All browser tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Browser test error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the browser test
testFarcasterSDK().catch(console.error); 