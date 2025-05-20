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
  fishState.set(fish, {
    start: null,
    swimLeft: swimLeft,
    animationFrameId: null,
    baseY,
    duration: 5000 + Math.random() * 1000,
    waveAmplitude: 20 + Math.random() * 30,
    waveFrequency: 0.005 + Math.random() * 0.003,
  });

  if (swimLeft) {
    fish.style.transform = `translate(${screenWidth}, ${baseY}px)`;
  } else {
    fish.style.transform = `translate(-100px, ${baseY}px`;
  }
}

function animateFish(timestamp, fish) {
  const state = fishState.get(fish);
  if (!state.start) state.start = timestamp;

  const elapsed = timestamp - state.start;
  const progress = elapsed / state.duration;
  const x =
    state && state.swimLeft
      ? screenWidth - progress * screenWidth
      : progress * screenWidth;

  const y =
    state.baseY + Math.sin(elapsed * state.waveFrequency) * state.waveAmplitude;

  if (state && state.swimLeft) {
    fish.style.transform = `translate(${x}px, ${y}px)`;
  } else {
    fish.style.transform = `translate(${x}px, ${y}px) scaleX(-1)`;
  }

  fish.style.visibility = "visible";

  if (progress < 1) {
    state.animationFrameId = requestAnimationFrame((ts) =>
      animateFish(ts, fish),
    );
  } else {
    state.start = null;
    // if (state && state.swimLeft) {
    //   fish.style.transform = `translate(100px, ${y}px)`;
    // } else {
    //   fish.style.transform = `translate(-100px, ${y}px)`;
    // }
    // state.animationFrameId = requestAnimationFrame((ts) =>
    //   animateFish(ts, fish),
    // );
  }
}

// Set up observer for each fish
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const fish = entry.target;
    const state = fishState.get(fish);
    if (!state) continue;

    if (entry.isIntersecting) {
      // Reset start and position
      state.start = null;
      state.animationFrameId = requestAnimationFrame((ts) =>
        animateFish(ts, fish),
      );
    } else {
      // Cancel animation
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
    }
  }
});

// Initialize and observe each fish
[basicFish, koi, tropical].forEach((fish) => {
  initFish(fish);
  observer.observe(fish);
});
