// Neon cyberpunk futuristic UI script for One Chance

// Digital Rain Effect Setup
const canvas = document.getElementById('digitalRain');
const ctx = canvas.getContext('2d');
let width, height;
let columns;
let drops = [];
const fontSize = 16;
const letters = '0123456789ABCDEF';

function setupCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  columns = Math.floor(width / fontSize);
  drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * height;
  }
}

function drawDigitalRain() {
  ctx.fillStyle = 'rgba(0, 255, 153, 0.15)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#00ff99';
  ctx.font = `${fontSize}px Share Tech Mono`;

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 0.8;
  }
}

setupCanvas();
setInterval(drawDigitalRain, 33);
window.addEventListener('resize', setupCanvas);

// UI Elements
const walletAddressInput = document.getElementById('walletAddress');
const copyBtn = document.getElementById('copyBtn');
const userWalletInput = document.getElementById('userWallet');
const enrollBtn = document.getElementById('enrollBtn');
const messageEl = document.getElementById('message');
const cardsContainer = document.getElementById('cardsContainer');
const statusMessageEl = document.getElementById('statusMessage');
const quoteDisplay = document.getElementById('quoteDisplay');

// Enrollment wallets set
const enrolledWallets = new Set();

// --- COPY WALLET ---
copyBtn.addEventListener('click', () => {
  walletAddressInput.select();
  walletAddressInput.setSelectionRange(0, 99999);
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      messageEl.style.color = '#00ff99';
      messageEl.textContent = 'Wallet address copied!';
    } else {
      messageEl.style.color = '#ff4444';
      messageEl.textContent = 'Copy failed. Please copy manually.';
    }
  } catch {
    messageEl.style.color = '#ff4444';
    messageEl.textContent = 'Copy not supported on this browser.';
  }
  setTimeout(() => (messageEl.textContent = ''), 3500);
});

// --- ENROLL ---
enrollBtn.addEventListener('click', () => {
  const wallet = userWalletInput.value.trim();
  if (!wallet || wallet.length < 10) {
    messageEl.style.color = '#ff4444';
    messageEl.textContent = 'Enter a valid wallet address.';
    return;
  }
  if (enrolledWallets.has(wallet)) {
    messageEl.style.color = '#ffaa00';
    messageEl.textContent = 'You are already enrolled for today!';
    return;
  }

  // Enrollment success simulation
  enrolledWallets.add(wallet);
  messageEl.style.color = '#00ff99';
  messageEl.textContent = 'Enrollment successful! 🎉';
  userWalletInput.value = '';

  // Log enrollment in status console
  addToConsole(`Enrolled wallet: ${wallet}`);

  // Start confetti effect
  startConfetti();

  // Stop confetti after 3.5 seconds
  setTimeout(stopConfetti, 3500);
});

// --- CONSOLE LOGGING ---
function addToConsole(text) {
  statusMessageEl.textContent = `[${new Date().toLocaleTimeString()}] ${text}\n` + statusMessageEl.textContent;
  if (statusMessageEl.textContent.length > 600) {
    statusMessageEl.textContent = statusMessageEl.textContent.slice(0, 600);
  }
}

// --- STATUS MESSAGE UPDATE ---
function updateStatus() {
  const now = new Date();
  const announcementHourUTC = 20;
  let announcementTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), announcementHourUTC));

  if (now > announcementTime) {
    statusMessageEl.textContent = `[${now.toLocaleTimeString()}] 🎉 Today's winner has been announced! Check back tomorrow.`;
    statusMessageEl.style.color = '#ff0055';
  } else {
    const diff = announcementTime - now;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    statusMessageEl.textContent = `[${now.toLocaleTimeString()}] 🎲 Waiting for winner announcement in ${hours}h ${minutes}m ${seconds}s...`;
    statusMessageEl.style.color = '#00ff99';
  }
}
setInterval(updateStatus, 1000);
updateStatus();

// --- CRYPTO DATA FETCH & CARDS ---
async function fetchCryptoPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,pixar&vs_currencies=usd');
    const data = await response.json();

    // Clear cards
    cardsContainer.innerHTML = '';

    const cryptos = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', min: '0.0005 BTC', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', min: '0.01 ETH', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025' },
      { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', min: '0.01 BNB', img: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=025' }
    ];

    cryptos.forEach(crypto => {
      if (!data[crypto.id]) return;
      const priceUSD = data[crypto.id].usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${crypto.img}" alt="${crypto.name} Logo" />
        <h4>${crypto.name} (${crypto.symbol.toUpperCase()})</h4>
        <p>Current Price: <span class="price">${priceUSD}</span></p>
        <p>Min Donation: <strong>${crypto.min}</strong></p>
      `;
      cardsContainer.appendChild(card);
    });
  } catch (error) {
    cardsContainer.innerHTML = `<p style="color:#ff0044; font-weight:bold;">Failed to fetch crypto prices.</p>`;
  }
}
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000); // Refresh every 60 seconds

// --- Confetti Effect ---
let confettiInterval;
function startConfetti() {
  if (confettiInterval) return;
  const confettiColors = ['#00ff99', '#00ffaa', '#00bb66', '#007f4f'];
  const confettiArea = document.createElement('div');
  confettiArea.id = 'confettiArea';
  document.body.appendChild(confettiArea);

  confettiInterval = setInterval(() => {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.animationDuration = 1 + Math.random() * 2 + 's';
    confettiArea.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }, 150);
}

function stopConfetti() {
  clearInterval(confettiInterval);
  confettiInterval = null;
  const confettiArea = document.getElementById('confettiArea');
  if (confettiArea) confettiArea.remove();
}

// --- Quotes ---
const quotes = [
  "“Risk is the price you pay for opportunity.”",
  "“Fortune favors the bold.”",
  "“In crypto we trust.”",
  "“HODL and prosper.”",
  "“Glitches make legends.”",
  "“The future is digital.”",
  "“One Chance. Infinite possibilities.”"
];

function updateQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[idx];
}
setInterval(updateQuote, 8000);
updateQuote();
