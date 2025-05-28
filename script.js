// Load sound effects
const copySound = new Audio('copy.mp3');
const enrollSound = new Audio('enroll.mp3');

function copyWallet() {
  const walletInput = document.getElementById("walletAddress");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(walletInput.value);
  copySound.play();
  alert("Wallet address copied!");
}

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
  enrollSound.play();
  launchConfetti();
}

// Confetti animation
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff66a3', '#a3bfff', '#ffd1dc', '#cceeff']
  });
}

// Sakura petals animation generator
const sakuraContainer = document.getElementById('sakura-container');

function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('sakura-petal');
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.animationDuration = (5 + Math.random() * 5) + 's';
  petal.style.animationDelay = Math.random() * 10 + 's';
  sakuraContainer.appendChild(petal);

  // Remove petal after animation
  setTimeout(() => {
    sakuraContainer.removeChild(petal);
    createPetal(); // Create new one to keep flow
  }, (parseFloat(petal.style.animationDuration) + parseFloat(petal.style.animationDelay)) * 1000);
}

// Create initial petals
for(let i = 0; i < 30; i++) {
  createPetal();
}
