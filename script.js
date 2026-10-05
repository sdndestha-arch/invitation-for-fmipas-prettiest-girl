const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".yes-btn");
const catSurpriseButton = document.getElementById("cat-surprise-button");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const letterWindow = document.querySelector(".letter-window");
const heartLayer = document.getElementById("envelope-hearts");
const photoCards = document.querySelectorAll(".photo-card");
const noAlert = document.getElementById("no-alert");
const backgroundMusic = document.getElementById("background-music");

if (heartLayer) {
  for (let index = 0; index < 14; index += 1) {
    const heart = document.createElement("span");
    heart.className = `floating-heart ${index % 2 === 0 ? "red" : "green"}`;
    heart.textContent = "♥";
    heart.style.setProperty("--heart-left", `${Math.random() * 100}%`);
    heart.style.setProperty("--heart-size", `${14 + Math.random() * 16}px`);
    heart.style.setProperty("--heart-duration", `${3.2 + Math.random() * 2}s`);
    heart.style.setProperty("--heart-delay", `${-Math.random() * 5}s`);
    heart.style.setProperty("--heart-drift", `${Math.random() * 80 - 40}px`);
    heartLayer.appendChild(heart);
  }
}

const heartColors = ["#f04f78", "#ff7b54", "#c84b9b", "#9b59d0", "#f2a900", "#39a96b"];

function showPhotoHearts(card, count) {
  let particleLayer = card.querySelector(".photo-hearts");

  if (!particleLayer) {
    particleLayer = document.createElement("span");
    particleLayer.className = "photo-hearts";
    particleLayer.setAttribute("aria-hidden", "true");
    card.prepend(particleLayer);
  }

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.45;
    const startDistance = 68 + Math.random() * 28;
    const distance = 48 + Math.random() * 48;
    const duration = 2100 + Math.random() * 500;

    heart.className = "photo-heart";
    heart.textContent = "♥";
    heart.style.setProperty("--heart-color", heartColors[Math.floor(Math.random() * heartColors.length)]);
    heart.style.setProperty("--heart-size", `${17 + Math.random() * 14}px`);
    heart.style.setProperty("--heart-start-x", `${Math.cos(angle) * startDistance}px`);
    heart.style.setProperty("--heart-start-y", `${Math.sin(angle) * startDistance}px`);
    heart.style.setProperty("--heart-x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--heart-y", `${Math.sin(angle) * distance}px`);
    heart.style.setProperty("--heart-rotate", `${Math.random() * 80 - 40}deg`);
    heart.style.animationDuration = `${duration}ms`;
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
    particleLayer.appendChild(heart);
  }
}

photoCards.forEach((card) => {
  card.addEventListener("pointerenter", () => showPhotoHearts(card, 8));
  card.addEventListener("click", () => showPhotoHearts(card, 18));
});

let musicStarted = false;
let musicStarting = false;

async function startBackgroundMusic() {
  if (!(backgroundMusic instanceof HTMLAudioElement) || musicStarted || musicStarting) {
    return;
  }

  musicStarting = true;
  backgroundMusic.volume = 0;

  try {
    await backgroundMusic.play();

    if (backgroundMusic.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise((resolve) => {
        backgroundMusic.addEventListener("loadedmetadata", resolve, { once: true });
      });
    }

    backgroundMusic.currentTime = 134;

    if (backgroundMusic.seeking) {
      await new Promise((resolve) => {
        backgroundMusic.addEventListener("seeked", resolve, { once: true });
      });
    }

    musicStarted = true;
    window.removeEventListener("pointerdown", startBackgroundMusic);
    window.removeEventListener("keydown", startBackgroundMusic);

    const fadeStartedAt = performance.now();
    const fadeDuration = 2000;
    const fadeIn = (now) => {
      if (backgroundMusic.paused) {
        return;
      }

      backgroundMusic.volume = Math.min((now - fadeStartedAt) / fadeDuration, 1);
      if (backgroundMusic.volume < 1) {
        requestAnimationFrame(fadeIn);
      }
    };

    requestAnimationFrame(fadeIn);
  } catch (error) {
    musicStarting = false;
    if (!(error instanceof DOMException && error.name === "NotAllowedError")) {
      console.error("Background music could not be played:", error);
    }
  }
}

window.addEventListener("pointerdown", startBackgroundMusic);
window.addEventListener("keydown", startBackgroundMusic);
startBackgroundMusic();

if (envelope && letter) {
  envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout(() => {
      if (letterWindow) {
        letterWindow.classList.add("open");
      }
    }, 50);
  });
}

if (noBtn) {
  let noChaseCount = 0;
  let lastNoChase = 0;
  let alertCount = 0;
  let alertTimeout;
  const extraNoAlerts = [
    "NO-nya jangan dikejar terus dong! Aku capek kabur nih 😤",
    "Yah, NO lagi? Tombol YES di sebelah sana lho, jangan pura-pura nggak lihat 😾",
    "Kamu gigih banget ngejar NO... tapi aku lebih gigih buat kabur! 😤💨",
    "Awas ya, kalau masih ngejar NO, aku ngambek beneran nih! 😠💕",
  ];

  noBtn.addEventListener("pointerenter", (event) => {
    const now = Date.now();
    noChaseCount = now - lastNoChase > 4000 ? 1 : noChaseCount + 1;
    lastNoChase = now;

    if (noChaseCount >= 3 && noAlert) {
      alertCount += 1;
      noAlert.textContent =
        alertCount === 1
          ? "Ih, jangan maksa pilih NO terus dong! 😤 Coba pencet YES aja 💚"
          : alertCount === 2
            ? "HEYYY AYO PILIH YESS, KM GAMAU Y ? KL GMAU CHAT ORG YG SENT LINK INI"
            : extraNoAlerts[(alertCount - 3) % extraNoAlerts.length];
      noAlert.classList.add("visible");
      window.clearTimeout(alertTimeout);
      alertTimeout = window.setTimeout(() => {
        noAlert.classList.remove("visible");
      }, 2600);
      noChaseCount = 0;
    }

    const bounds = noBtn.getBoundingClientRect();
    const coverBounds = letterWindow?.getBoundingClientRect();
    const padding = 12;
    const coverLeft = Math.max(padding, coverBounds?.left ?? padding);
    const coverRight = Math.min(
      window.innerWidth - padding,
      coverBounds?.right ?? window.innerWidth - padding
    );
    const coverTop = Math.max(padding, coverBounds?.top ?? padding);
    const coverBottom = Math.min(
      window.innerHeight - padding,
      coverBounds?.bottom ?? window.innerHeight - padding
    );
    const travelRange = Math.min(90, window.innerWidth * 0.16);
    const minLeft = Math.max(coverLeft, bounds.left - travelRange);
    const maxLeft = Math.max(
      minLeft,
      Math.min(coverRight - bounds.width, bounds.left + travelRange)
    );
    const minTop = Math.max(coverTop, bounds.top - travelRange);
    const maxTop = Math.max(
      minTop,
      Math.min(coverBottom - bounds.height, bounds.top + travelRange)
    );
    const pointerX = event.clientX;
    const pointerY = event.clientY;
    let left = Math.max(minLeft, Math.min(bounds.left, maxLeft));
    let top = Math.max(minTop, Math.min(bounds.top, maxTop));
    let greatestDistance = -1;

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const candidateLeft = minLeft + Math.random() * (maxLeft - minLeft);
      const candidateTop = minTop + Math.random() * (maxTop - minTop);
      const distance = Math.hypot(
        candidateLeft + bounds.width / 2 - pointerX,
        candidateTop + bounds.height / 2 - pointerY
      );

      if (distance > greatestDistance) {
        left = candidateLeft;
        top = candidateTop;
        greatestDistance = distance;
      }
    }

    noBtn.style.position = "fixed";
    noBtn.style.zIndex = "10";
    noBtn.style.margin = "0";
    noBtn.style.transition = "left 0.2s ease, top 0.2s ease";
    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;
  });
}

if (catSurpriseButton) {
  catSurpriseButton.addEventListener("click", () => {
    if (backgroundMusic instanceof HTMLAudioElement && !backgroundMusic.paused) {
      sessionStorage.setItem("invitation-music-time", String(backgroundMusic.currentTime));
    }

    window.location.href = "surprise.html";
  });
}

if (yesBtn && title && catImg && buttons && finalText && letterWindow) {
  yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";
    catImg.src = "cat_dance.gif";
    if (catSurpriseButton) {
      catSurpriseButton.disabled = false;
    }
    letterWindow.classList.add("final");
    buttons.style.display = "none";
    finalText.style.display = "block";
  });
}