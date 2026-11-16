/* ==========================================================================
   AQUA PC SOLUTIONS — MINIMAL COUNTDOWN & SMOOTH 60FPS VIDEO CONTROLLER
   Target Launch: November 21, 2026 at 00:00:00
   ========================================================================== */

(function () {
  "use strict";

  const targetTime = new Date(2026, 10, 21, 0, 0, 0, 0).getTime();

  const daysEl = document.getElementById("val-days");
  const hoursEl = document.getElementById("val-hours");
  const minutesEl = document.getElementById("val-minutes");
  const secondsEl = document.getElementById("val-seconds");
  const countdownGrid = document.getElementById("countdown-grid");
  const launchLabel = document.getElementById("launch-label");

  const videoShell = document.getElementById("video-shell");
  const mainVideo = document.getElementById("main-video");
  const soundBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-icon");
  const soundText = document.getElementById("sound-text");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  function pad(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, "0");
  }

  let lastRenderedEpochSec = -1;

  function updateClock() {
    const now = Date.now();
    const epochSec = Math.floor(now / 1000);

    if (epochSec !== lastRenderedEpochSec) {
      lastRenderedEpochSec = epochSec;
      const diff = Math.max(0, targetTime - now);
      const totalSec = Math.floor(diff / 1000);

      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);

      if (diff <= 0) {
        countdownGrid?.classList.add("launched");
        if (launchLabel) launchLabel.textContent = "LIVE NOW · NOVEMBER 21";
      }
    }

    requestAnimationFrame(updateClock);
  }

  requestAnimationFrame(updateClock);

  if (mainVideo) {
    mainVideo.loop = true;
    mainVideo.playsInline = true;

    const markReady = () => {
      videoShell?.classList.add("is-ready");
    };

    if (mainVideo.readyState >= 2) {
      markReady();
    } else {
      mainVideo.addEventListener("loadeddata", markReady, { once: true });
      mainVideo.addEventListener("canplay", markReady, { once: true });
    }

    const startPlayback = () => {
      const p = mainVideo.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          mainVideo.muted = true;
          mainVideo.play().catch(() => {});
        });
      }
    };

    startPlayback();

    mainVideo.addEventListener("ended", () => {
      mainVideo.currentTime = 0;
      startPlayback();
    });
  }

  function syncSoundUI(muted) {
    if (soundIcon) soundIcon.textContent = muted ? "volume_off" : "volume_up";
    if (soundText) soundText.textContent = muted ? "Sound Off" : "Sound On";
    soundBtn?.classList.toggle("active", !muted);
  }

  function toggleSound() {
    if (!mainVideo) return;
    mainVideo.muted = !mainVideo.muted;
    if (mainVideo.paused) mainVideo.play().catch(() => {});
    syncSoundUI(mainVideo.muted);
  }

  soundBtn?.addEventListener("click", toggleSound);
  mainVideo?.addEventListener("click", toggleSound);

  fullscreenBtn?.addEventListener("click", () => {
    const target = videoShell || mainVideo;
    if (!target) return;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  });
})();
