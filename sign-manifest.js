const crypto = require('crypto');
const fs = require('fs');
<<<<<<< HEAD

// Your Farcaster account details
const FARCASTER_FID = "YOUR_FARCASTER_FID"; // Replace with your FID
const FARCASTER_PRIVATE_KEY = "YOUR_PRIVATE_KEY"; // Replace with your private key

// Manifest details
const manifestUrl = "https://unfollow-7vqsoy96p-chipagosfinests-projects.vercel.app/.well-known/farcaster.json";
const appName = "Unfollow Tool";
const appDescription = "A powerful tool to analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don't follow you back. Get insights into your social graph and maintain a cleaner feed.";

// Read the manifest file
const manifestPath = './public/.well-known/farcaster.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Create the message to sign
const message = {
  text: `I want to add ${appName} to the Farcaster Mini App directory. ${appDescription}`,
  embeds: [
    {
      url: manifestUrl,
      castId: {
        fid: parseInt(FARCASTER_FID),
        hash: "0x0000000000000000000000000000000000000000000000000000000000000000"
      }
    }
  ]
};

// Sign the message
function signMessage(message, privateKey) {
  const messageBytes = Buffer.from(JSON.stringify(message), 'utf8');
  const hash = crypto.createHash('sha256').update(messageBytes).digest();
  
  // This is a simplified signing - you'll need to use proper cryptographic signing
  console.log("⚠️  NOTE: This is a template. You need to implement proper cryptographic signing.");
  console.log("📝 Message to sign:", JSON.stringify(message, null, 2));
  
  return "SIGNATURE_PLACEHOLDER";
}

// Generate the signed message
const signature = signMessage(message, FARCASTER_PRIVATE_KEY);

// Create the final submission
const submission = {
  message: message,
  signature: signature,
  signer: FARCASTER_FID,
  timestamp: Math.floor(Date.now() / 1000)
};

console.log("🎯 Farcaster Mini App Submission");
console.log("==================================");
console.log("");
console.log("📋 App Details:");
console.log(`   Name: ${appName}`);
console.log(`   Description: ${appDescription}`);
console.log(`   Manifest URL: ${manifestUrl}`);
console.log(`   Home URL: ${manifest.miniapp.homeUrl}`);
console.log("");
console.log("🔧 Required Setup:");
console.log("1. Replace YOUR_FARCASTER_FID with your actual FID");
console.log("2. Replace YOUR_PRIVATE_KEY with your actual private key");
console.log("3. Implement proper cryptographic signing");
console.log("");
console.log("📝 Message to sign:");
console.log(JSON.stringify(message, null, 2));
console.log("");
console.log("🚀 Next Steps:");
console.log("1. Sign the message with your Farcaster private key");
console.log("2. Submit to Farcaster for approval");
console.log("3. Test in the Farcaster preview tool");
console.log("");
console.log("🔗 Test URLs:");
console.log(`   Main App: ${manifest.miniapp.homeUrl}`);
console.log(`   Manifest: ${manifestUrl}`);
console.log("");

// Save the submission to a file
fs.writeFileSync('./manifest-submission.json', JSON.stringify(submission, null, 2));
console.log("✅ Submission saved to manifest-submission.json");
console.log("");
console.log("🎉 Ready for submission! Follow the steps above to get your Mini App approved."); 
=======
const path = require('path');

// Read the manifest file
const manifestPath = path.join(__dirname, 'public', '.well-known', 'farcaster.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Create the message to sign (canonical JSON)
const message = JSON.stringify(manifest, Object.keys(manifest).sort());

console.log('🔐 Mini Apps Manifest Signing');
console.log('================================');
console.log('');
console.log('Manifest content to sign:');
console.log(message);
console.log('');
console.log('📝 Next Steps:');
console.log('1. Copy the manifest content above');
console.log('2. Sign it with your Farcaster account');
console.log('3. Add the signature to the manifest');
console.log('');
console.log('💡 You can sign this using:');
console.log('- Farcaster CLI: farcaster sign <message>');
console.log('- Warpcast: Settings > Developer > Sign Message');
console.log('- Or any other Farcaster client with signing capability');
console.log('');
console.log('🔗 After signing, add the signature to the manifest like this:');
console.log('"signature": "0x...your_signature_here..."');
console.log('');
console.log('📋 Then submit to Farcaster for Mini Apps approval!'); 
>>>>>>> 5ef29b6bf689da319bf2e4f6cc2fc769b6262497
