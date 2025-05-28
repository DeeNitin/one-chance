// Set wallet address securely via JavaScript
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("walletAddress").value = "0x6f7BB151D8fF02CccdF183917B8aDD81215d1266";
});

function copyWallet() {
  const walletInput = document.getElementById("walletAddress");
  walletInput.select();
  walletInput.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(walletInput.value).then(() => {
    alert("Wallet address copied!");
  });
}

function enroll() {
  const userWallet = document.getElementById("userWallet").value.trim();
  const message = document.getElementById("message");
  const walletPattern = /^0x[a-fA-F0-9]{40}$/;

  if (!walletPattern.test(userWallet)) {
    message.innerText = "Please enter a valid wallet address (starts with 0x...).";
    message.style.color = "red";
    return;
  }

  message.innerText = "🎉 You are enrolled! Come back at 8PM UTC to see if you won!";
  message.style.color = "lime";

  launchConfetti();

  // TODO: Hook this to a backend later to record entry
}

function launchConfetti() {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 }
  });
}
