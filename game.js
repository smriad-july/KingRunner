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
function setPlayerX(x) {
  const minX = 0;
  const maxX = 630; // game width - player width
  playerX = Math.max(minX, Math.min(maxX, x));
  player.style.left = playerX + "px";
}

// Keyboard controls (fast)
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowLeft") setPlayerX(playerX - 40);
  if (e.key === "ArrowRight") setPlayerX(playerX + 40);
});

// ================= TOUCH CONTROLS (IMPROVED) =================
let touchStartX = 0;
let playerStartX = 0;

game.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  playerStartX = playerX;
}, { passive: true });

game.addEventListener("touchmove", (e) => {
  if (gameOver) return;

  const currentX = e.touches[0].clientX;
  const deltaX = currentX - touchStartX;

  // MULTIPLIER makes it feel faster on mobile
  const speedMultiplier = 1.4;

  setPlayerX(playerStartX + deltaX * speedMultiplier);
}, { passive: true });

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
