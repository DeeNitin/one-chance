function copyWallet() {
  const walletInput = document.getElementById("walletAddress");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(walletInput.value);
  alert("Wallet address copied!");
}

function enroll() {
  const userWallet = document.getElementById("userWallet").value.trim();
  const message = document.getElementById("message");

  if (!userWallet || userWallet.length < 10) {
    message.innerText = "Please enter a valid wallet address.";
    message.style.color = "#d9534f"; // red
    return;
  }

  message.innerText = "🎉 You are enrolled! Come back at 8PM UTC to see if you won!";
  message.style.color = "#5cb85c"; // green

  launchConfetti();
}

// Confetti animation
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#e75480', '#f8a1c4', '#fce4ec']
  });
}

// Create floating spirits animation
const spiritContainer = document.querySelector('.floating-spirits');

function createSpirit() {
  const spirit = document.createElement('div');
  spirit.classList.add('spirit');

  // Random size 8-16 px
  const size = 8 + Math.random() * 8;
  spirit.style.width = size + 'px';
  spirit.style.height = size + 'px';

  // Random horizontal position across viewport
  spirit.style.left = (Math.random() * 100) + 'vw';

  // Random animation duration between 6 and 14 seconds
  spirit.style.animationDuration = (6 + Math.random() * 8) + 's';

  spiritContainer.appendChild(spirit);

  // Remove and re-create after animation ends to loop spirits
  spirit.addEventListener('animationend', () => {
    spirit.remove();
    createSpirit();
  });
}

// Start with 20 spirits floating
for (let i = 0; i < 20; i++) {
  createSpirit();
}
