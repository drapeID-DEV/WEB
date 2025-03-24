const deadline = new Date().getTime() + 30_000;
const timerDisplay = document.querySelector(`.timer`);
const subscribeButton = document.querySelector(`.subscribe`);
let remainingTime;

function updateTimer() {
  const currentTime = new Date().getTime();
  remainingTime = Math.floor((deadline - currentTime) / 1000);

  if (remainingTime > 0) {
    let day = Math.floor(remainingTime / 86400);
    let hour = Math.floor((remainingTime % 86400) / 3600);
    let minutes = Math.floor((remainingTime % 3600) / 60);
    let second = remainingTime % 60;
    timerDisplay.innerHTML = `${day}d ${hour}h ${minutes}m ${second}s`;
  } else {
    timerDisplay.innerHTML = "Time's up!";
    subscribeButton.disabled = true;
    clearInterval(interval);
  }
}

function handleSubscribe() {
  document.querySelector(".response").innerText = `Thank you for subscription! Time remaining: ${remainingTime}.`;
  subscribeButton.disabled = true;
}

subscribeButton.addEventListener(`click`, handleSubscribe)

updateTimer();
const interval = setInterval(updateTimer, 1000);
