const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const music = document.getElementById("music");

let playerX = 315;
let score = 0;
let gameOver = false;
let musicStarted = false;

// ================= MUSIC =================
document.addEventListener("keydown", startMusic);
game.addEventListener("touchstart", startMusic);

function startMusic() {
  if (!musicStarted) {
    music.volume = 0.5;
    music.play();
    musicStarted = true;
  }
}

// ================= PLAYER MOVE =================
function movePlayer(direction) {
  if (gameOver) return;

  if (direction === "left" && playerX > 0) {
    playerX -= 30;
  }

  if (direction === "right" && playerX < 630) {
    playerX += 30;
  }

  player.style.left = playerX + "px";
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") movePlayer("left");
  if (e.key === "ArrowRight") movePlayer("right");
});

// ================= TOUCH CONTROLS =================
let touchStartX = 0;
let touchEndX = 0;

game.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

game.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 30) return; // ignore tiny swipes

  if (swipeDistance > 0) {
    movePlayer("right");
  } else {
    movePlayer("left");
  }
}

// ================= ENEMY =================
function createEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.className = "enemy";

  const img = document.createElement("img");
  img.src = "duck.png";
  enemy.appendChild(img);

  enemy.style.left = Math.random() * 640 + "px";
  game.appendChild(enemy);

  let enemyY = -70;
  let speed = 4 + Math.random() * 3;

  const fall = setInterval(() => {
    if (gameOver) {
      clearInterval(fall);
      enemy.remove();
      return;
    }

    enemyY += speed;
    enemy.style.top = enemyY + "px";

    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      enemyRect.bottom > playerRect.top &&
      enemyRect.top < playerRect.bottom &&
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left
    ) {
      gameOver = true;
      music.pause();
      alert("🦆 SPLAT!\nGame Over\nScore: " + score);
      location.reload();
    }

    if (enemyY > 750) {
      enemy.remove();
      clearInterval(fall);
    }
  }, 20);
}

// ================= SCORE =================
setInterval(() => {
  if (!gameOver) {
    score++;
    scoreText.innerText = "Score: " + score;
  }
}, 400);

// ================= SPAWN =================
setInterval(createEnemy, 900);
