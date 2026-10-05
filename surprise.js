const decor = document.getElementById("falling-decor");
const fallingSymbols = [
  { symbol: "♥", color: "#ed6f9b" },
  { symbol: "♥", color: "#49a96e" },
  { symbol: "✿", color: "#ef83aa" },
  { symbol: "❀", color: "#5ab67a" },
];

if (decor) {
  for (let index = 0; index < 42; index += 1) {
    const particle = document.createElement("span");
    const item = fallingSymbols[Math.floor(Math.random() * fallingSymbols.length)];
    const duration = 5 + Math.random() * 6;

    particle.className = "falling-particle";
    particle.textContent = item.symbol;
    particle.style.setProperty("--fall-color", item.color);
    particle.style.setProperty("--fall-left", `${Math.random() * 100}%`);
    particle.style.setProperty("--fall-size", `${16 + Math.random() * 24}px`);
    particle.style.setProperty("--fall-duration", `${duration}s`);
    particle.style.setProperty("--fall-delay", `${-Math.random() * duration}s`);
    particle.style.setProperty("--fall-drift", `${Math.random() * 140 - 70}px`);
    particle.style.setProperty("--fall-spin", `${Math.random() * 540 - 270}deg`);
    decor.appendChild(particle);
  }
}

const music = document.getElementById("surprise-music");
const musicButton = document.getElementById("music-button");
const musicStatus = document.getElementById("music-status");
let musicStarting = false;

async function startSurpriseMusic() {
  if (!(music instanceof HTMLAudioElement) || !music.paused || musicStarting) {
    return;
  }

  musicStarting = true;
  music.volume = 0;
  music.muted = true;
  const playRequest = music.play();

  try {
    await playRequest;

    if (music.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise((resolve) => {
        music.addEventListener("loadedmetadata", resolve, { once: true });
      });
    }

    const savedTime = Number.parseFloat(sessionStorage.getItem("invitation-music-time"));
    sessionStorage.removeItem("invitation-music-time");
    const startTime = Number.isFinite(savedTime) ? savedTime : 134;
    music.currentTime = Math.min(Math.max(startTime, 0), Math.max(music.duration - 1, 0));

    if (music.seeking) {
      await new Promise((resolve) => {
        music.addEventListener("seeked", resolve, { once: true });
      });
    }

    music.muted = false;
    musicStarting = false;
    if (musicButton) {
      musicButton.textContent = "♫ Music is playing";
      musicButton.disabled = true;
    }
    if (musicStatus) {
      musicStatus.textContent = "♪ lagu lanjut dari tempat terakhir";
    }

    window.removeEventListener("pointerdown", startSurpriseMusic);
    window.removeEventListener("keydown", startSurpriseMusic);

    const fadeStartedAt = performance.now();
    const fadeDuration = 2000;
    const fadeIn = (now) => {
      if (music.paused) {
        return;
      }

      music.volume = Math.min((now - fadeStartedAt) / fadeDuration, 1);
      if (music.volume < 1) {
        requestAnimationFrame(fadeIn);
      }
    };

    requestAnimationFrame(fadeIn);
  } catch (error) {
    music.pause();
    music.muted = false;
    musicStarting = false;
    if (!(error instanceof DOMException && error.name === "NotAllowedError")) {
      console.error("Surprise page music could not be played:", error);
    }
    if (musicStatus) {
      musicStatus.textContent = "Ketuk tombol musik untuk memutarnya ♫";
    }
  }
}

window.addEventListener("pointerdown", startSurpriseMusic);
window.addEventListener("keydown", startSurpriseMusic);
musicButton?.addEventListener("click", startSurpriseMusic);
startSurpriseMusic();
