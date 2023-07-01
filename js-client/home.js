document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", function () {
    window.location.href = "index.html";
  });

  const motto = document.getElementById("motto");
  motto.classList.add("animate-motto");
});

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
  window.location.href = "index.html";
});
