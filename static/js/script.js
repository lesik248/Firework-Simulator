const display = document.getElementById('fireworks-display');
const frequencySlider = document.getElementById('frequency');
const sizeSlider = document.getElementById('size');
const particlesSlider = document.getElementById('particles');
const durationSlider = document.getElementById('duration');
const colorMode = document.getElementById('color-mode');
const fireworkColor = document.getElementById('firework-color');
const backgroundMode = document.getElementById('background-mode');
const backgroundColor = document.getElementById('background-color');
const patternSelect = document.getElementById('pattern');

function getPatternAngles(pattern, count) {
  switch (pattern) {
    case 'heart':
      return Array.from({
        length: count
      }, (_, i) => {
        const t = i / count * Math.PI * 2;
        const x = -16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return {
          angle: Math.atan2(y, x),
          speed: Math.sqrt(x * x + y * y) / 16 * (0.7 + Math.random() * 0.6)
        };
      });
    case 'star':
      const points = 5;
      return Array.from({
        length: count
      }, (_, i) => {
        const spikeIndex = Math.floor(i / (count / points));
        const baseAngle = spikeIndex * 2 * Math.PI / points - Math.PI / 2;
        const angleVariation = (Math.random() - 0.5) * 0.5;
        const angle = baseAngle + angleVariation;
        const isSpikeTip = i % (count / points) < count / points * 0.2;
        return {
          angle: angle,
          speed: isSpikeTip ? 1 : 0.3 + Math.random() * 0.3
        };
      });
    default:
      return Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() + 0.5
      }));
  }
}

function createRandomStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => star.remove());
  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    display.appendChild(star);
  }
}

function getColor() {
  return colorMode.value === 'random' 
    ? `hsl(${Math.random() * 360}, 100%, 50%)` 
    : fireworkColor.value;
}

function updateBackground() {
  display.className = '';
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => star.remove());
  switch (backgroundMode.value) {
    case 'starry':
      display.classList.add('starry-night');
      createRandomStars();
      break;
    case 'moonlit':
      display.classList.add('moonlit-sky');
      createRandomStars();
      break;
    case 'custom':
      display.style.backgroundColor = backgroundColor.value;
      break;
    default:
      display.style.backgroundColor = '#000000';
  }
}

function createFirework(x, y) {
  const size = parseInt(sizeSlider.value);
  const particleCount = parseInt(particlesSlider.value);
  const duration = parseInt(durationSlider.value);
  x = x ?? Math.random() * display.clientWidth;
  y = y ?? Math.random() * display.clientHeight;
  createExplosion(x, y, size, particleCount, duration, getColor());
}

function createExplosion(x, y, size, particleCount, duration, color) {
  const pattern = patternSelect.value;
  const angles = getPatternAngles(pattern, particleCount);
  angles.forEach(({ angle, speed }) => {
    const particle = document.createElement('div');
    particle.className = 'firework';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = color;
    display.appendChild(particle);
    const animation = particle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * size * speed}px, ${Math.sin(angle) * size * speed}px) scale(0)`, opacity: 0 }
    ], { duration, easing: 'linear' });
    animation.onfinish = () => particle.remove();
  });
}

display.addEventListener('click', (event) => {
  const rect = display.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  createFirework(x, y);
});

backgroundMode.addEventListener('change', updateBackground);
backgroundColor.addEventListener('input', () => {
  if (backgroundMode.value === 'custom') {
    display.style.backgroundColor = backgroundColor.value;
  }
});

function startFireworksShow() {
  const frequency = 11 - parseInt(frequencySlider.value);
  createFirework();
  setTimeout(startFireworksShow, frequency * 200);
}

startFireworksShow();
updateBackground();
