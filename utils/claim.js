const fs = require("fs");
const path = require("path");

const poinPath = path.join(__dirname, "../data/poin.json");
const claimPath = path.join(__dirname, "../data/claimed.json");

// Load data poin
let poinData = {};
try {
  if (fs.existsSync(poinPath)) {
    poinData = JSON.parse(fs.readFileSync(poinPath));
  }
} catch {
  poinData = {};
}

// Load data klaim
let claimedData = {};
try {
  if (fs.existsSync(claimPath)) {
    claimedData = JSON.parse(fs.readFileSync(claimPath));
  }
} catch {
  claimedData = {};
}

function claimReward(sender) {
  const now = Date.now();
  const lastClaim = claimedData[sender] || 0;
  const cooldown = 24 * 60 * 60 * 1000; // 24 jam

  if (now - lastClaim < cooldown) {
    return {
      success: false,
      wait: cooldown - (now - lastClaim)
    };
  }

  // Berhasil klaim
  const reward = 100;
  poinData[sender] = (poinData[sender] || 0) + reward;
  claimedData[sender] = now;

  // Simpan ke file
  fs.writeFileSync(poinPath, JSON.stringify(poinData, null, 2));
  fs.writeFileSync(claimPath, JSON.stringify(claimedData, null, 2));

  return {
    success: true,
    poin: poinData[sender]
  };
}

module.exports = { claimReward };
