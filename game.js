const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");

let playerX = 170;
let score = 0;
let gameOver = false;

// Move player
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
  }
  if (e.key === "ArrowRight" && playerX < 340) {
    playerX += 20;
  }
  player.style.left = playerX + "px";
});

// Create enemies
function createEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.random() * 350 + "px";
  game.appendChild(enemy);

  let enemyY = -40;

  const fall = setInterval(() => {
    if (gameOver) {
      clearInterval(fall);
      enemy.remove();
      return;
    }

    enemyY += 5;
    enemy.style.top = enemyY + "px";

    // Collision detection
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      enemyRect.bottom > playerRect.top &&
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left
    ) {
      gameOver = true;
      alert("💀 Game Over! Score: " + score);
      location.reload();
    }

    if (enemyY > 500) {
      enemy.remove();
      clearInterval(fall);
    }
  }, 20);
}

// Score counter
setInterval(() => {
  if (!gameOver) {
    score++;
    scoreText.innerText = "Score: " + score;
  }
}, 500);

// Enemy spawn rate
setInterval(createEnemy, 1200);
