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
