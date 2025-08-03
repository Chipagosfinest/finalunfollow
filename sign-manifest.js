const crypto = require('crypto');
const fs = require('fs');
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