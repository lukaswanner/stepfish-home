const basicFish = document.getElementById("fish");
const koi = document.getElementById("koi");
const tropical = document.getElementById("tropical");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Store per-fish state
const fishState = new Map();

function initFish(fish) {
  const swimLeft = Math.random() < 0.5;
  const baseY = Math.random() * (screenHeight * 0.6) + screenHeight * 0.2;

  // Initial position
  const startX = swimLeft ? screenWidth - fish.clientWidth : -fish.clientWidth;
  fish.style.transform = `translate(${startX}px, ${baseY}px)`;

  // Hide initially until we animate
  fish.style.visibility = "hidden";

  fishState.set(fish, {
    start: null,
    swimLeft,
    animationFrameId: null,
    baseY,
    duration: 5000 + Math.random() * 1000,
    waveAmplitude: 20 + Math.random() * 30,
    waveFrequency: 0.005 + Math.random() * 0.003,
  });
}

function animateFish(timestamp, fish) {
  const state = fishState.get(fish);
  if (!state.start) state.start = timestamp;

  const elapsed = timestamp - state.start;
  const progress = elapsed / state.duration;

  const x = state.swimLeft
    ? screenWidth -
      fish.clientWidth -
      progress * (screenWidth + fish.clientWidth)
    : -fish.clientWidth + progress * (screenWidth + fish.clientWidth);

  const y =
    state.baseY + Math.sin(elapsed * state.waveFrequency) * state.waveAmplitude;

  fish.style.transform = `translate(${x}px, ${y}px) ${!state.swimLeft ? "scaleX(-1)" : ""}`;
  fish.style.visibility = "visible";

  if (progress <= 1.0) {
    state.animationFrameId = requestAnimationFrame((ts) =>
      animateFish(ts, fish),
    );
  } else {
    // Hide fish after animation is done
    fish.style.display = "none";
    state.start = null;
    state.animationFrameId = null;
  }
}

// Set up observer for each fish
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const fish = entry.target;
    const state = fishState.get(fish);
    if (!state) continue;

    if (entry.isIntersecting) {
      if (!state.animationFrameId) {
        state.animationFrameId = requestAnimationFrame((ts) =>
          animateFish(ts, fish),
        );
      }
    } else {
      // Cancel animation if fish leaves view
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }
    }
  }
});

// Initialize and observe each fish
[basicFish, koi, tropical].forEach((fish) => {
  initFish(fish);
  observer.observe(fish);
});
