// --- Digital Rain Canvas Effect (Toned down brightness) ---
const canvas = document.getElementById('digitalRain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function draw() {
  // Slightly transparent black background to create trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0, 255, 153, 0.15)'; // <-- Reduced opacity here to tone down brightness
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(draw, 40);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
  
// --- Rest of your script.js below ---

// Copy Wallet Address
function copyWallet() {
  const walletInput = document.getElementById("walletAddress");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(walletInput.value);
  alert("Wallet address copied!");
}

// Enroll user
function enroll() {
  const userWallet = document.getElementById("userWallet").value.trim();
  const message = document.getElementById("message");

  if (!userWallet || userWallet.length < 10) {
    message.innerText = "Please enter a valid wallet address.";
    message.style.color = "red";
    return;
  }

  message.innerText = "🎉 You are enrolled! Come back at 8PM UTC to see if you won!";
  message.style.color = "lime";

  startConfetti();

  // Backend call to enroll user would go here
  // sendEnrollment(userWallet);
}

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

const quoteDisplay = document.getElementById('quoteDisplay');
function updateQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = quotes[idx];
}
setInterval(updateQuote, 8000);
updateQuote();

// --- Fetch Crypto Prices and display cards ---
const cardsContainer = document.getElementById('cardsContainer');

async function fetchCryptoPrices() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd');
    const data = await res.json();
    cardsContainer.innerHTML = '';

    const cryptos = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
      { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
    ];

    cryptos.forEach(coin => {
      const card = document.createElement('div');
      card.className = 'crypto-card';

      card.innerHTML = `
        <h3>${coin.name} (${coin.symbol})</h3>
        <p>Price: $${data[coin.id].usd.toLocaleString()}</p>
        <p>Description: Placeholder description about ${coin.name}.</p>
      `;

      cardsContainer.appendChild(card);
    });
  } catch (error) {
    cardsContainer.innerHTML = `<p style="color:#ff0044; font-weight:bold;">Failed to fetch crypto prices.</p>`;
  }
}
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000); // Refresh every 60 seconds
