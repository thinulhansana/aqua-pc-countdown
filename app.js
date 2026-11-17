/* ==========================================================================
   AQUA PC SOLUTIONS — MINIMAL COUNTDOWN & LOOPING VIDEO CONTROLLER
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

  const mainVideo = document.getElementById("main-video");
  const bgVideo = document.getElementById("bg-loop-video");
  const soundBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-icon");
  const soundText = document.getElementById("sound-text");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const videoShell = document.querySelector(".video-shell");

  function pad(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, "0");
  }

  function tick() {
    const diff = Math.max(0, targetTime - Date.now());
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

  tick();
  setInterval(tick, 250);

  function keepLooping(video) {
    if (!video) return;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }

  keepLooping(mainVideo);
  keepLooping(bgVideo);

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
