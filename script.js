// === CONFETTI LIB ===
// minimal confetti effect without external libs
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;
confettiCanvas.width = W;
confettiCanvas.height = H;

const confettiCount = 120;
const confettiPieces = [];

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function ConfettiPiece() {
  this.x = randomRange(0, W);
  this.y = randomRange(-H, 0);
  this.radius = randomRange(5, 10);
  this.density = randomRange(10, 30);
  this.color = `hsl(${randomRange(340, 360)}, 70%, 65%)`;
  this.tilt = randomRange(-10, 10);
  this.tiltAngle = 0;
  this.tiltAngleIncrement = randomRange(0.05, 0.12);
}

ConfettiPiece.prototype.update = function (angle) {
  this.tiltAngle += this.tiltAngleIncrement;
  this.y += (Math.cos(angle + this.density) + 1 + this.radius / 2) * 0.7;
  this.x += Math.sin(angle);
  this.tilt = Math.sin(this.tiltAngle) * 15;
  if (this.y > H) {
    this.x = randomRange(0, W);
    this.y = -10;
  }
};

ConfettiPiece.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = this.radius / 2;
  ctx.strokeStyle = this.color;
  ctx.moveTo(this.x + this.tilt + this.radius / 4, this.y);
  ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.radius / 4);
  ctx.stroke();
};

function initConfetti() {
  for (let i = 0; i < confettiCount; i++) {
    confettiPieces.push(new ConfettiPiece());
  }
}

let angle = 0;
function drawConfetti() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < confettiPieces.length; i++) {
    confettiPieces[i].update(angle);
    confettiPieces[i].draw();
  }
  angle += 0.01;
}

let confettiActive = false;
let confettiAnim;

function startConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  confettiCanvas.style.display = "block";
  confettiAnim = requestAnimationFrame(runConfetti);
}

function stopConfetti() {
  confettiActive = false;
  confettiCanvas.style.display = "none";
  cancelAnimationFrame(confettiAnim);
}

function runConfetti() {
  if (!confettiActive) return;
  drawConfetti();
  confettiAnim = requestAnimationFrame(runConfetti);
}

initConfetti();
confettiCanvas.style.display = "none";

// === FLOATING SPIRITS ===
const spiritColors = [
  "#ff7390cc",
  "#ff8ca0cc",
  "#ffadc0cc",
  "#ff5c7080",
  "#ffa0bcc0",
];

function createSpirit(xPercent, yPercent, delay) {
  const spirit = document.createElement("div");
  spirit.classList.add("spirit");
  spirit.style.left = `${xPercent}%`;
  spirit.style.top = `${yPercent}%`;
  spirit.style.animationDelay = `${delay}s`;
  spirit.style.backgroundColor =
    spiritColors[Math.floor(Math.random() * spiritColors.length)];
  document.body.appendChild(spirit);
}

// Create 6 spirits randomly placed
createSpirit(12, 18, 0);
createSpirit(70, 30, 1.7);
createSpirit(42, 50, 0.8);
createSpirit(84, 62, 1.3);
createSpirit(25, 75, 0.2);
createSpirit(60, 82, 1.1);

// === MAIN LOGIC ===
const walletAddressInput = document.getElementById("walletAddress");
const copyBtn = document.getElementById("copyBtn");
const userWalletInput = document.getElementById("userWallet");
const enrollBtn = document.getElementById("enrollBtn");
const messageEl = document.getElementById("message");
const statusMessageEl = document.getElementById("statusMessage");
const minDonationEl = document.getElementById("minDonation");
const cardsContainer = document.getElementById("cardsContainer");
const quoteDisplay = document.getElementById("quoteDisplay");

let enrolledWallets = new Set();
let minDonationUSD = 10; // base minimum $10
let currentMinDonation = 0.001; // updated dynamically in crypto units

// --- LIVE CRYPTO DATA FETCHING ---
async function fetchCryptoPrices() {
  try {
    // CoinGecko public API to get ETH, BNB, BTC, and PI (Pi is not on CG, so will show N/A)
    const coins = ["ethereum", "binancecoin", "bitcoin"];
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(
        ","
      )}&vs_currencies=usd`
    );
    const data = await res.json();

    // Prices in USD
    const ethPrice = data.ethereum.usd;
    const bnbPrice = data.binancecoin.usd;
    const btcPrice = data.bitcoin.usd;

    // Calculate minimum donation in crypto, assuming $10 minimum USD
    const minEth = (minDonationUSD / ethPrice).toFixed(5);
    const minBnb = (minDonationUSD / bnbPrice).toFixed(5);
    const minBtc = (minDonationUSD / btcPrice).toFixed(6);

    currentMinDonation = minEth; // for display

    minDonationEl.textContent = `${minEth} ETH | ${minBnb} BNB | ${minBtc} BTC | 20 PI`;

    // Update cards
    cardsContainer.innerHTML = "";

    // Coin cards with live prices
    const coinsInfo = [
      {
        id: "ethereum",
        name: "Ethereum (ETH)",
        price: ethPrice,
        min: minEth,
        img: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025",
      },
      {
        id: "binancecoin",
        name: "Binance Coin (BNB)",
        price: bnbPrice,
        min: minBnb,
        img: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=025",
      },
      {
        id: "bitcoin",
        name: "Bitcoin (BTC)",
        price: btcPrice,
        min: minBtc,
        img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025",
      },
      {
        id: "pi",
        name: "Pi Network (PI)",
        price: "N/A",
        min: 20,
        img: "https://upload.wikimedia.org/wikipedia/commons/9/99/Pi_symbol.svg",
      },
    ];

    coinsInfo.forEach((coin) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${coin.img}" alt="${coin.name} Logo" />
        <h4>${coin.name}</h4>
        <p>Current Price: ${
          coin.price === "N/A" ? "N/A" : "$" + coin.price.toLocaleString()
        }</p>
        <p>Min Donation: ${coin.min} ${coin.id === "pi" ? "PI" : coin.id.toUpperCase()}</p>
      `;
      cardsContainer.appendChild(card);
    });

    // Concept card
    const conceptCard = document.createElement("div");
    conceptCard.className = "card";
    conceptCard.innerHTML = `
      <img src="https://i.imgur.com/o6jXxFt.png" alt="One Chance Concept" />
      <h4>One Chance Concept</h4>
      <p>Send crypto. Join the pool. Get daily winner. Simple, fair, and fun.</p>
    `;
    cardsContainer.appendChild(conceptCard);
  } catch (err) {
    console.error("Error fetching crypto prices", err);
    cardsContainer.innerHTML = `<div class="card"><h4>Unable to load live data</h4><p>Check your connection or try later.</p></div>`;
  }
}

// --- COPY WALLET ---
copyBtn.addEventListener("click", () => {
  walletAddressInput.select();
  walletAddressInput.setSelectionRange(0, 99999);
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      messageEl.style.color = "#4caf50";
      messageEl.textContent = "Wallet address copied!";
    } else {
      messageEl.style.color = "#e74c3c";
      messageEl.textContent = "Copy failed. Please copy manually.";
    }
  } catch {
    messageEl.style.color = "#e74c3c";
    messageEl.textContent = "Copy not supported on this browser.";
  }
  setTimeout(() => (messageEl.textContent = ""), 3500);
});

// --- ENROLL ---
enrollBtn.addEventListener("click", () => {
  const wallet = userWalletInput.value.trim();
  if (!wallet || wallet.length < 10) {
    messageEl.style.color = "#e74c3c";
    messageEl.textContent = "Enter a valid wallet address.";
    return;
  }
  if (enrolledWallets.has(wallet)) {
    messageEl.style.color = "#e67e22";
    messageEl.textContent = "You are already enrolled for today!";
    return;
  }

  // Simulate enrollment success
  enrolledWallets.add(wallet);
  messageEl.style.color = "#4caf50";
  messageEl.textContent = "Enrollment successful! 🎉";
  userWalletInput.value = "";

  // Show confetti
  startConfetti();

  // Stop confetti after 4 seconds
  setTimeout(() => {
    stopConfetti();
  }, 4000);
});

// --- STATUS MESSAGE UPDATE ---
function updateStatus() {
  const now = new Date();
  // Simulate announcement at 20:00 UTC every day
  const announcementHourUTC = 20;
  let announcementTime = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), announcementHourUTC)
  );

  if (now > announcementTime) {
    statusMessageEl.textContent = `🎉 Today's winner has been announced! Check back tomorrow at 20:00 UTC.`;
    statusMessageEl.style.color = "#d32f62";
  } else {
    const diff = announcementTime - now;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    statusMessageEl.textContent = `🎲 Waiting for winner announcement in ${hours}h ${minutes}m ${seconds}s...`;
    statusMessageEl.style.color = "#cc3366";
  }
}
setInterval(updateStatus, 1000);
updateStatus();

// --- QUOTES ROTATION ---
const quotes = [
  "“The future belongs to those who believe in the beauty of their dreams.” — Eleanor Roosevelt",
  "“Risk comes from not knowing what you're doing.” — Warren Buffett",
  "“In crypto we trust.” — Anonymous",
  "“Every great journey begins with a single step.” — Lao Tzu",
  "“Fortune favors the bold.” — Latin Proverb",
];

let currentQuoteIndex = 0;
function rotateQuotes() {
  quoteDisplay.textContent = quotes[currentQuoteIndex];
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
}
rotateQuotes();
setInterval(rotateQuotes, 15000);

// --- INIT ---
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 30000); // refresh every 30 sec

// Resize confetti canvas on window resize
window.addEventListener("resize", () => {
  W = window.innerWidth;
  H = window.innerHeight;
  confettiCanvas.width = W;
  confettiCanvas.height = H;
});
