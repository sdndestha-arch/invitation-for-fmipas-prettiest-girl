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
