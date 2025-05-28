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
    message.style.color = "red";
    return;
  }

  message.innerText = "🎉 You are enrolled! Come back at 8PM UTC to see if you won!";
  message.style.color = "lime";

  // This will eventually send the userWallet to your backend.
}
