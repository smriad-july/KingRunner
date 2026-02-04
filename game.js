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
      showGameOverPopup(score);
      clearInterval(fall);
      enemy.remove();
      return;
    }

    if (enemyY > 750) {
      enemy.remove();
      clearInterval(fall);
    }
  }, 20);
}

      // ================= GAME OVER POPUP =================
      function showGameOverPopup(finalScore) {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        `;

        // Create popup
        const popup = document.createElement("div");
        popup.style.cssText = `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          max-width: 400px;
          width: 90%;
          animation: slideIn 0.4s ease;
        `;

        popup.innerHTML = `
          <div style="font-size: 60px; margin-bottom: 10px;">🦆</div>
          <h2 style="color: #fff; font-size: 32px; margin: 10px 0; font-weight: bold;">The King Is DEAD!</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 20px;">Game Over</p>
          <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin: 20px 0;">
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">YOUR SCORE</p>
        <p style="color: #fff; font-size: 48px; font-weight: bold; margin: 10px 0;">${finalScore}</p>
          </div>
          <button id="saveScoreBtn" style="
        background: #fff;
        color: #667eea;
        border: none;
        padding: 15px 40px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 30px;
        cursor: pointer;
        margin: 10px 5px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        💾 Save Score
          </button>
          <button id="restartBtn" style="
        background: rgba(255,255,255,0.2);
        color: #fff;
        border: 2px solid #fff;
        padding: 15px 40px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 30px;
        cursor: pointer;
        margin: 10px 5px;
        transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        🔄 Play Again
          </button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Add CSS animations
        const style = document.createElement("style");
        style.textContent = `
          @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
          }
          @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);

        // Save score button - Download scorecard image
        document.getElementById("saveScoreBtn").addEventListener("click", () => {
          const date = new Date().toLocaleString();
          
          // Create canvas for scorecard
          const canvas = document.createElement("canvas");
          canvas.width = 600;
          canvas.height = 800;
          const ctx = canvas.getContext("2d");
          
          // Gradient background
          const gradient = ctx.createLinearGradient(0, 0, 0, 800);
          gradient.addColorStop(0, "#667eea");
          gradient.addColorStop(1, "#764ba2");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 600, 800);
          
          // Title emoji
          ctx.font = "bold 120px Arial";
          ctx.textAlign = "center";
          ctx.fillText("🦆", 300, 150);
          
          // Game title
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 48px Arial";
          ctx.fillText("The King Is DEAD", 300, 240);
          
          // "SPLAT!" text
          // ctx.font = "bold 56px Arial";
          // ctx.fillText("SPLAT!", 300, 310);
          
          // Score box background
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.beginPath();
          ctx.roundRect(100, 350, 400, 180, 20);
          ctx.fill();
          
          // "YOUR SCORE" label
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.font = "20px Arial";
          ctx.fillText("YOUR SCORE", 300, 395);
          
          // Score value
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 96px Arial";
          ctx.fillText(finalScore.toString(), 300, 490);
          
          // Date
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.font = "24px Arial";
          ctx.fillText(date, 300, 600);
          
          // Crown emoji at bottom
          ctx.font = "60px Arial";
          ctx.fillText("👑", 300, 700);
          
          // "Long Live the King" text
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.font = "28px Arial";
          ctx.fillText("Long Live the King", 300, 760);
          
          // Convert to image and download
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `duck-dodge-king-score-${finalScore}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });
          
          // Also save to localStorage
          const scoreData = { score: finalScore, date: date };
          let scores = JSON.parse(localStorage.getItem("kingRunnerScores") || "[]");
          scores.push(scoreData);
          scores.sort((a, b) => b.score - a.score);
          localStorage.setItem("kingRunnerScores", JSON.stringify(scores));
        });

        // Restart button
        document.getElementById("restartBtn").addEventListener("click", () => {
          location.reload();
        });
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
