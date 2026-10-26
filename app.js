// ==========================================================================
// Elige tu destino - Lógica del Juego
// ==========================================================================

const btnRed = document.getElementById('btn-red');
const btnBlue = document.getElementById('btn-blue');
const btnReset = document.getElementById('btn-reset');

const resultContainer = document.getElementById('result-container');
const resultBadge = document.getElementById('result-badge');
const resultIcon = document.getElementById('result-icon');
const resultText = document.getElementById('result-text');
const resultDesc = document.getElementById('result-desc');

const winsCountEl = document.getElementById('wins-count');
const lossesCountEl = document.getElementById('losses-count');

let wins = 0;
let losses = 0;
let gamePlayed = false;

/**
 * Procesa la elección del jugador (Rojo o Azul)
 * @param {'red' | 'blue'} choice
 */
function handleChoice(choice) {
  if (gamePlayed) return;
  gamePlayed = true;

  // Marcar visualmente el botón seleccionado y deshabilitar ambos
  const selectedBtn = choice === 'red' ? btnRed : btnBlue;
  selectedBtn.classList.add('selected');
  btnRed.disabled = true;
  btnBlue.disabled = true;

  // Determinar resultado aleatorio: 50% probabilidad
  const isWin = Math.random() < 0.5;

  // Actualizar estadísticas y vistas
  if (isWin) {
    wins++;
    winsCountEl.textContent = wins;
    showResult(true, choice);
    launchConfetti();
  } else {
    losses++;
    lossesCountEl.textContent = losses;
    showResult(false, choice);
  }
}

/**
 * Muestra el resultado en pantalla
 * @param {boolean} won
 * @param {'red' | 'blue'} choice
 */
function showResult(won, choice) {
  resultBadge.className = 'result-badge ' + (won ? 'win' : 'loss');
  resultIcon.textContent = won ? '🎉' : '💀';
  resultText.textContent = won ? '¡Has ganado!' : 'Has perdido';

  const colorName = choice === 'red' ? 'rojo' : 'azul';
  resultDesc.textContent = won
    ? `El botón ${colorName} era el camino a la victoria. ¡Excelente elección!`
    : `El botón ${colorName} no tuvo suerte esta vez. ¡Prueba otra vez!`;

  resultContainer.classList.remove('hidden');
}

/**
 * Reinicia la ronda para volver a jugar
 */
function resetGame() {
  gamePlayed = false;

  // Restaurar estado de los botones de elección
  btnRed.disabled = false;
  btnBlue.disabled = false;
  btnRed.classList.remove('selected');
  btnBlue.classList.remove('selected');

  // Ocultar resultados
  resultContainer.classList.add('hidden');
  resultBadge.className = 'result-badge';
  resultIcon.textContent = '';
  resultText.textContent = '';
  resultDesc.textContent = '';
}

// Event Listeners
btnRed.addEventListener('click', () => handleChoice('red'));
btnBlue.addEventListener('click', () => handleChoice('blue'));
btnReset.addEventListener('click', resetGame);

// ==========================================================================
// Efecto de Confeti Ligero (Canvas Nativo)
// ==========================================================================
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  particles = [];
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const count = 75;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.01,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10
    });
  }

  if (animationId) cancelAnimationFrame(animationId);
  renderConfetti();
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35; // Gravedad
    p.alpha -= p.decay;
    p.rotation += p.vRotation;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  }

  if (particles.length > 0) {
    animationId = requestAnimationFrame(renderConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
