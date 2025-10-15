let btn = document.querySelector("button");
let h5 = document.querySelector("h5");
let h3 = document.querySelector("h3");
let growth = document.querySelector(".growth");
let main = document.querySelector(".main");

let interval = null;
let isDownloading = false;

function stopAudio(a) {
  if (!a) return;
  // simple stop
  a.pause();
  a.currentTime = 0;
}

// optional smooth fade-out
function fadeOutAndStop(a, duration = 400) {
  if (!a) return;
  const start = a.volume;
  const step = 50; // ms
  const steps = Math.max(1, Math.floor(duration / step));
  let i = 0;
  const iv = setInterval(() => {
    i++;
    a.volume = Math.max(0, start * (1 - i / steps));
    if (i >= steps) {
      clearInterval(iv);
      a.pause();
      a.currentTime = 0;
      a.volume = start; // reset for next play
    }
  }, step);
}

function fakeSleep() {
  const sleepScreen = document.getElementById("fake-sleep");
  sleepScreen.classList.remove("hidden");
  document.body.style.transition = "filter 2.5s ease    ";
  document.body.style.filter = "brightness(0)";
}

btn.addEventListener("click", function () {
  if (isDownloading) {
    clearInterval(interval);
    isDownloading = false;
    btn.innerHTML = "Download File";
    btn.style.backgroundColor = "#008236";
    growth.style.width = "0%";
    h5.innerHTML = "0%";
    h3.innerHTML = "🚫 Download Cancelled!";
    return;
  }

  let i = 0;
  isDownloading = true;
  btn.innerHTML = "Cancel";
  btn.style.backgroundColor = "red";
  h5.innerHTML = "0%";
  growth.style.width = "0%";
  h3.innerHTML = "⬇️ Download Started...";

  let speed = Math.floor(Math.random() * 10) + 30;

  interval = setInterval(() => {
    if (i >= 100) {
      clearInterval(interval);
      isDownloading = false;
      h3.innerHTML = "💀 Malware Downloaded!";
      btn.style.backgroundColor = "#a50000ff";
      main.style.backgroundColor = "#a50000ff";
      btn.innerHTML = "PC Closed ❌";
      growth.style.backgroundColor = "#a50000ff"
      growth.style.border = "1px dashed yellow";

      // show malware screen after short delay
      setTimeout(() => {
        main.style.opacity = 0;
        showMalwareScreen({
          autoHideMs: 8000,
          messages: [
            "Payload: Trojan.Injector",
            "Status: Encrypting local data...",
            "Network: Exfiltrating user credentials...",
            "System: AV Disabled",
            "💀 Malware Active",
          ],
        });
      }, 700);

      setTimeout(() => {
        fakeSleep();
      }, 8900);
    } else {
      i++;
      h5.innerHTML = i + "%";
      growth.style.width = i + "%";
    }
  }, speed);
});

// 🧨 MALWARE SCREEN SCRIPT BELOW — defined globally
function showMalwareScreen(options = {}) {
  const screen = document.getElementById("malware-screen");
  const typeEl = document.getElementById("malware-type");
  const rain = document.getElementById("matrix-rain");

  if (!screen) return;

  // 🟢 Play audio AFTER user has already clicked (allowed by browser)
  const soundURL = "./sound.mp3";
  const audio = new Audio(options.soundURL || soundURL);
  audio.volume = 1;
  audio.loop = true;
  audio.play().catch((err) => {
    console.warn("Audio play blocked:", err);
  });

  screen.style.display = "flex";
  screen.style.opacity = "1";
  screen.classList.add("shake");
  createMatrixRain(rain, options.rainCount || 14);

  const messages = [
    "Payload: Trojan.Injector",
    "Status: Local files encrypted",
    "Network: Exfiltrating data...",
    "Security: AV disabled",
    "Contact: attacker[at]example[dot]com",
  ];

  let idx = 0;
  function typeNext() {
    if (idx >= messages.length) return;
    typewriter(typeEl, messages[idx], options.typeSpeed || 40, () => {
      idx++;
      setTimeout(typeNext, options.delayBetween || 600);
    });
  }
  setTimeout(typeNext, 300);

  // Hide screen after delay
  if (options.autoHideMs) {
    setTimeout(() => hideScreen(), options.autoHideMs);
  }

  // Close function
  function hideScreen() {
    screen.style.transition = "opacity .4s ease";
    screen.style.opacity = "0";
    setTimeout(() => {
      screen.style.display = "none";
      audio.pause();
      audio.currentTime = 0;
    }, 400);
  }
  goFullScreen();
}

// Try to go fullscreen (only works if user clicked something)
function goFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function typewriter(el, text, speed = 100, cb) {
  if (!el) {
    cb && cb();
    return;
  }
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      el.style.borderRightColor =
        i % 2 === 0 ? "rgba(255,120,120,0.9)" : "transparent";
    }
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      el.style.borderRightColor = "transparent";
      cb && cb();
    }
  }, Math.max(10, speed));
}

function createMatrixRain(container, columns = 12) {
  if (!container) return;
  container.innerHTML = "";
  const chars = "01█ ▓ ▒░< > /\\|+-* # @ % $";
  for (let i = 0; i < columns; i++) {
    const span = document.createElement("span");
    const length = 20 + Math.floor(Math.random() * 80);
    let s = "";
    for (let j = 0; j < length; j++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    span.textContent = s;
    span.style.left = i * (100 / columns) + "%";
    span.style.fontSize = 8 + Math.floor(Math.random() * 12) + "px";
    span.style.opacity = 0.04 + Math.random() * 0.12;
    span.style.animationDuration = 6 + Math.random() * 14 + "s";
    span.style.animationDelay = Math.random() * -8 + "s";
    container.appendChild(span);
  }
}
