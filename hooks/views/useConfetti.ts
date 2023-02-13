import confetti from 'canvas-confetti';

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const duration = 5 * 1000;
const defaults = { startVelocity: 30, spread: 560, ticks: 80, zIndex: 100 };

export const openConfetti = () => {
  const animationEnd = Date.now() + duration;
  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    const particleCount = 100 * (timeLeft / duration);

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 },
      })
    );
  }, 100);
};
