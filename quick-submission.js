console.log("🎯 Farcaster Mini App Submission");
console.log("==================================");
console.log("");
console.log("📋 App Details:");
console.log("   Name: Unfollow Tool");
console.log("   Description: A powerful tool to analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don't follow you back. Get insights into your social graph and maintain a cleaner feed.");
console.log("   Manifest URL: https://unfollow-tool.vercel.app/.well-known/farcaster.json");
console.log("   Home URL: https://unfollow-tool.vercel.app/embed");
console.log("");
console.log("📝 Message to sign:");
console.log(JSON.stringify({
  text: "I want to add Unfollow Tool to the Farcaster Mini App directory. A powerful tool to analyze your Farcaster follows and identify who to unfollow. Find inactive users, spam accounts, and users who don't follow you back. Get insights into your social graph and maintain a cleaner feed.",
  embeds: [{
    url: "https://unfollow-tool.vercel.app/.well-known/farcaster.json",
    castId: {
      fid: 0, // Replace with your FID
      hash: "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  }]
}, null, 2));
console.log("");
console.log("🚀 Next Steps:");
console.log("1. Replace YOUR_FARCASTER_FID with your actual FID");
console.log("2. Sign the message with your Farcaster private key");
console.log("3. Submit to Farcaster for approval");
console.log("4. Test in the Farcaster preview tool");
console.log("");
console.log("🔗 Test URLs:");
console.log("   Main App: https://unfollow-tool.vercel.app/embed");
console.log("   Manifest: https://unfollow-tool.vercel.app/.well-known/farcaster.json");
console.log("");
console.log("🎉 Ready for submission!");
