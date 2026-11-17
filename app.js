/* ==========================================================================
   AQUA PC SOLUTIONS — TRIPLE WEBSITE LAUNCH COUNTDOWN ENGINE & VIDEO CONTROLLER
   Target Launch Date: November 21, 00:00:00
   Looping Video: E:\Aqua soft Site\marketing-video\aqua_pc_solutions_ad.mp4
   ========================================================================== */

(function () {
  "use strict";

  // ── 1. Target Launch Date Configuration (November 21, 00:00:00) ──────────
  const FOUNDED_TIMESTAMP_LOCAL = new Date(2026, 10, 6, 0, 0, 0, 0).getTime(); // Nov 6, 2026 00:00:00

  function getTargetTimestamp(mode) {
    const now = new Date();
    const year = now.getFullYear() <= 2026 ? 2026 : now.getFullYear();
    if (mode === "slt") {
      // November 21, 00:00:00 Sri Lanka Standard Time (UTC+05:30)
      return new Date(`${year}-11-21T00:00:00+05:30`).getTime();
    }
    // Default: November 21, 00:00:00 Local Time
    return new Date(year, 10, 21, 0, 0, 0, 0).getTime();
  }

  let currentTzMode = "local";
  let simulateZeroMode = false;
  let targetTimestamp = getTargetTimestamp(currentTzMode);

  // ── 2. DOM Elements ──────────────────────────────────────────────────────
  const valDays = document.getElementById("val-days");
  const valHours = document.getElementById("val-hours");
  const valMinutes = document.getElementById("val-minutes");
  const valSeconds = document.getElementById("val-seconds");
  const valMs = document.getElementById("val-ms");

  const ringDays = document.getElementById("ring-days");
  const ringHours = document.getElementById("ring-hours");
  const ringMinutes = document.getElementById("ring-minutes");
  const ringSeconds = document.getElementById("ring-seconds");
  const ringMs = document.getElementById("ring-ms");

  const navMiniTimer = document.getElementById("nav-mini-timer");
  const launchStatusBadge = document.getElementById("launch-status-badge");
  const targetDateReadout = document.getElementById("target-date-readout");
  const launchPctReadout = document.getElementById("launch-pct-readout");
  const totalSecondsReadout = document.getElementById("total-seconds-readout");
  const launchProgressFill = document.getElementById("launch-progress-fill");
  const countdownBoard = document.getElementById("countdown-board");

  const tzLocalBtn = document.getElementById("tz-local-btn");
  const tzSltBtn = document.getElementById("tz-slt-btn");
  const simulateLaunchBtn = document.getElementById("simulate-launch-btn");
  const simBtnText = document.getElementById("sim-btn-text");

  const RING_CIRCUMFERENCE = 2 * Math.PI * 52; // r = 52 -> ~326.73

  function setRingProgress(circleEl, fraction) {
    if (!circleEl) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    const offset = RING_CIRCUMFERENCE * (1 - clamped);
    circleEl.style.strokeDasharray = `${RING_CIRCUMFERENCE.toFixed(2)}`;
    circleEl.style.strokeDashoffset = `${offset.toFixed(2)}`;
  }

  function pad2(n) {
    return String(Math.floor(Math.max(0, n))).padStart(2, "0");
  }

  let lastSecond = -1;

  function updateCountdownFrame() {
    const now = Date.now();
    const diffMs = simulateZeroMode ? 0 : Math.max(0, targetTimestamp - now);

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((diffMs % 1000) / 10);

    if (valDays) valDays.textContent = pad2(days);
    if (valHours) valHours.textContent = pad2(hours);
    if (valMinutes) valMinutes.textContent = pad2(minutes);
    if (valSeconds) valSeconds.textContent = pad2(seconds);
    if (valMs) valMs.textContent = pad2(centiseconds);

    // Update SVG telemetry rings
    if (seconds !== lastSecond) {
      lastSecond = seconds;
      // Days ring relative to a 15-day pre-launch window (Nov 6 -> Nov 21)
      setRingProgress(ringDays, Math.min(1, days / 15));
      setRingProgress(ringHours, hours / 24);
      setRingProgress(ringMinutes, minutes / 60);
      setRingProgress(ringSeconds, seconds / 60);

      if (navMiniTimer) {
        navMiniTimer.textContent =
          diffMs <= 0
            ? "LIVE NOW · 00:00:00"
            : `${pad2(days)}D ${pad2(hours)}H ${pad2(minutes)}M ${pad2(seconds)}S`;
      }

      if (totalSecondsReadout) {
        totalSecondsReadout.textContent =
          diffMs <= 0
            ? "TRIPLE ECOSYSTEM UNLOCKED"
            : `${totalSeconds.toLocaleString()} SECONDS LEFT`;
      }

      // Calculate overall pre-launch readiness percentage (Nov 6 -> Nov 21)
      const totalWindow = Math.max(1, targetTimestamp - FOUNDED_TIMESTAMP_LOCAL);
      const elapsed = totalWindow - diffMs;
      const pct = diffMs <= 0 ? 100 : Math.max(5, Math.min(99.9, (elapsed / totalWindow) * 100));

      if (launchPctReadout) {
        launchPctReadout.textContent = `${pct.toFixed(1)}%`;
      }
      if (launchProgressFill) {
        launchProgressFill.style.width = `${pct.toFixed(2)}%`;
      }

      if (diffMs <= 0) {
        countdownBoard?.classList.add("launched");
        if (launchStatusBadge) {
          launchStatusBadge.textContent =
            "ALL 3 WEBSITES ARE OFFICIALLY LIVE · NOVEMBER 21, 00:00:00 REACHED!";
        }
      } else {
        countdownBoard?.classList.remove("launched");
        if (launchStatusBadge) {
          launchStatusBadge.textContent =
            currentTzMode === "slt"
              ? "SYNCHRONIZED TRIPLE-SITE LAUNCH · NOV 21, 00:00:00 SLT (UTC+5:30)"
              : "SYNCHRONIZED TRIPLE-SITE LAUNCH · NOVEMBER 21, 00:00:00";
        }
      }
    }

    setRingProgress(ringMs, (diffMs % 1000) / 1000);
    requestAnimationFrame(updateCountdownFrame);
  }

  // Timezone & Simulate 00:00:00 Mode Controls
  if (tzLocalBtn) {
    tzLocalBtn.addEventListener("click", () => {
      currentTzMode = "local";
      simulateZeroMode = false;
      targetTimestamp = getTargetTimestamp("local");
      lastSecond = -1;
      tzLocalBtn.classList.add("active");
      tzSltBtn?.classList.remove("active");
      simulateLaunchBtn?.classList.remove("active");
      if (simBtnText) simBtnText.textContent = "Preview 00:00:00";
      if (targetDateReadout) {
        targetDateReadout.textContent = "NOVEMBER 21, 2026 · 00:00:00 (LOCAL)";
      }
    });
  }

  if (tzSltBtn) {
    tzSltBtn.addEventListener("click", () => {
      currentTzMode = "slt";
      simulateZeroMode = false;
      targetTimestamp = getTargetTimestamp("slt");
      lastSecond = -1;
      tzSltBtn.classList.add("active");
      tzLocalBtn?.classList.remove("active");
      simulateLaunchBtn?.classList.remove("active");
      if (simBtnText) simBtnText.textContent = "Preview 00:00:00";
      if (targetDateReadout) {
        targetDateReadout.textContent = "NOVEMBER 21, 2026 · 00:00:00 SLT (UTC+5:30)";
      }
    });
  }

  if (simulateLaunchBtn) {
    simulateLaunchBtn.addEventListener("click", () => {
      simulateZeroMode = !simulateZeroMode;
      lastSecond = -1;
      simulateLaunchBtn.classList.toggle("active", simulateZeroMode);
      if (simBtnText) {
        simBtnText.textContent = simulateZeroMode ? "Resume Live Clock" : "Preview 00:00:00";
      }
      if (simulateZeroMode) {
        triggerCelebrationBurst();
      }
    });
  }

  requestAnimationFrame(updateCountdownFrame);

  // ── 3. Looping Marketing Video Controller (aqua_pc_solutions_ad.mp4) ─────
  const mainVideo = document.getElementById("main-showcase-video");
  const bgVideo = document.getElementById("bg-loop-video");
  const loopCounterEl = document.getElementById("loop-counter");
  const activeScenePill = document.getElementById("active-scene-pill");
  const videoTimecode = document.getElementById("video-timecode");
  const scrubberWrap = document.getElementById("video-scrubber");
  const scrubberFill = document.getElementById("video-scrubber-fill");

  const unmuteOverlayBtn = document.getElementById("video-unmute-overlay");
  const navSoundBtn = document.getElementById("nav-sound-btn");
  const navSoundIcon = document.getElementById("nav-sound-icon");
  const navSoundText = document.getElementById("nav-sound-text");

  const vcPlayBtn = document.getElementById("vc-play-btn");
  const vcPlayIcon = document.getElementById("vc-play-icon");
  const vcMuteBtn = document.getElementById("vc-mute-btn");
  const vcMuteIcon = document.getElementById("vc-mute-icon");
  const vcMuteLabel = document.getElementById("vc-mute-label");
  const vcVolumeSlider = document.getElementById("vc-volume-slider");
  const vcRestartBtn = document.getElementById("vc-restart-btn");
  const vcPipBtn = document.getElementById("vc-pip-btn");
  const vcTheaterBtn = document.getElementById("vc-theater-btn");
  const vcFullscreenBtn = document.getElementById("vc-fullscreen-btn");
  const cinemaWrap = document.getElementById("trailer-showcase");
  const cinemaStage = document.getElementById("cinema-stage");

  const chapterPills = Array.from(document.querySelectorAll(".chapter-pill"));
  const siteCards = Array.from(document.querySelectorAll(".site-card"));
  const watchSceneBtns = Array.from(document.querySelectorAll(".btn-watch-scene"));

  const VIDEO_SCENES = [
    { start: 0, end: 5, label: "SCENE 01 · AQUA PC SOLUTIONS HOOK", siteId: "all" },
    { start: 5, end: 12, label: "SCENE 02 · AQUA PC SOLUTIONS MAIN HUB", siteId: "site-1" },
    { start: 12, end: 19, label: "SCENE 03 · AQUA PC PARTS SUPERSTORE", siteId: "site-2" },
    { start: 19, end: 26, label: "SCENE 04 · 3D PC BUILDER STUDIO", siteId: "site-3" },
    { start: 26, end: 33, label: "SCENE 05 · ENGINEERED BY PASSION", siteId: "site-1" },
    { start: 33, end: 41, label: "SCENE 06 · TRIPLE LAUNCH CONTACT & CTA", siteId: "all" },
  ];

  let loopCount = 1;
  let lastVideoTime = 0;

  function ensureSeamlessLoop(vid) {
    if (!vid) return;
    vid.loop = true;
    vid.playsInline = true;
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay fallback: keep muted and retry
        vid.muted = true;
        vid.play().catch(() => {});
      });
    }
    vid.addEventListener("ended", () => {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    });
  }

  ensureSeamlessLoop(mainVideo);
  ensureSeamlessLoop(bgVideo);

  function formatTimecode(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "00:00.0";
    const mins = Math.floor(sec / 60);
    const rem = (sec % 60).toFixed(1).padStart(4, "0");
    return `${String(mins).padStart(2, "0")}:${rem}`;
  }

  function syncAudioUI(isMuted) {
    if (unmuteOverlayBtn) {
      unmuteOverlayBtn.classList.toggle("hidden", !isMuted);
    }
    if (navSoundIcon) {
      navSoundIcon.textContent = isMuted ? "volume_off" : "volume_up";
    }
    if (navSoundText) {
      navSoundText.textContent = isMuted ? "UNMUTE AD" : "SOUND ON";
    }
    if (navSoundBtn) {
      navSoundBtn.classList.toggle("sound-active", !isMuted);
    }
    if (vcMuteIcon) {
      vcMuteIcon.textContent = isMuted ? "volume_off" : "volume_up";
    }
    if (vcMuteLabel) {
      vcMuteLabel.textContent = isMuted ? "SOUND OFF" : "SOUND ON";
    }
  }

  function toggleVideoSound(forceUnmute) {
    if (!mainVideo) return;
    const nextMuted = typeof forceUnmute === "boolean" ? !forceUnmute : !mainVideo.muted;
    mainVideo.muted = nextMuted;
    if (!nextMuted && mainVideo.volume === 0) {
      mainVideo.volume = 0.85;
      if (vcVolumeSlider) vcVolumeSlider.value = "0.85";
    }
    if (mainVideo.paused) {
      mainVideo.play().catch(() => {});
    }
    syncAudioUI(mainVideo.muted);
  }

  unmuteOverlayBtn?.addEventListener("click", () => toggleVideoSound(true));
  navSoundBtn?.addEventListener("click", () => toggleVideoSound());
  vcMuteBtn?.addEventListener("click", () => toggleVideoSound());

  vcVolumeSlider?.addEventListener("input", (e) => {
    if (!mainVideo) return;
    const val = parseFloat(e.target.value);
    mainVideo.volume = val;
    mainVideo.muted = val === 0;
    syncAudioUI(mainVideo.muted);
  });

  vcPlayBtn?.addEventListener("click", () => {
    if (!mainVideo) return;
    if (mainVideo.paused) {
      mainVideo.play().catch(() => {});
      bgVideo?.play().catch(() => {});
    } else {
      mainVideo.pause();
    }
  });

  mainVideo?.addEventListener("play", () => {
    if (vcPlayIcon) vcPlayIcon.textContent = "pause";
  });

  mainVideo?.addEventListener("pause", () => {
    if (vcPlayIcon) vcPlayIcon.textContent = "play_arrow";
  });

  vcRestartBtn?.addEventListener("click", () => {
    if (!mainVideo) return;
    mainVideo.currentTime = 0;
    if (bgVideo) bgVideo.currentTime = 0;
    mainVideo.play().catch(() => {});
  });

  vcPipBtn?.addEventListener("click", async () => {
    if (!mainVideo) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await mainVideo.requestPictureInPicture();
      }
    } catch (_) {}
  });

  vcTheaterBtn?.addEventListener("click", () => {
    cinemaWrap?.classList.toggle("theater-mode");
  });

  vcFullscreenBtn?.addEventListener("click", () => {
    const target = cinemaStage || mainVideo;
    if (!target) return;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  });

  // Video Timeupdate: Scrubber, Loop Counter, Chapter Pills & 3-Site Card Sync
  mainVideo?.addEventListener("timeupdate", () => {
    const cur = mainVideo.currentTime || 0;
    const dur = mainVideo.duration || 40.0;

    // Detect loop wrap-around
    if (cur < 1.2 && lastVideoTime > dur - 2.0) {
      loopCount += 1;
      if (loopCounterEl) loopCounterEl.textContent = String(loopCount);
    }
    lastVideoTime = cur;

    const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
    if (scrubberFill) scrubberFill.style.width = `${pct.toFixed(2)}%`;
    if (videoTimecode) {
      videoTimecode.textContent = `${formatTimecode(cur)} / ${formatTimecode(dur)}`;
    }

    // Active Scene Detection
    const activeScene =
      VIDEO_SCENES.find((s) => cur >= s.start && cur < s.end) || VIDEO_SCENES[0];
    if (activeScenePill && activeScenePill.textContent !== activeScene.label) {
      activeScenePill.textContent = activeScene.label;
    }

    chapterPills.forEach((pill) => {
      const st = parseFloat(pill.dataset.start || "0");
      const en = parseFloat(pill.dataset.end || "40");
      pill.classList.toggle("active", cur >= st && cur < en);
    });

    siteCards.forEach((card) => {
      const cardSiteId = card.dataset.siteId;
      card.classList.toggle(
        "video-sync-active",
        activeScene.siteId !== "all" && cardSiteId === activeScene.siteId
      );
    });
  });

  // Scrubber Click to Seek
  scrubberWrap?.addEventListener("click", (e) => {
    if (!mainVideo) return;
    const rect = scrubberWrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const dur = mainVideo.duration || 40.0;
    mainVideo.currentTime = ratio * dur;
    if (bgVideo) bgVideo.currentTime = mainVideo.currentTime;
    mainVideo.play().catch(() => {});
  });

  // Chapter Pill Click to Seek
  chapterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      if (!mainVideo) return;
      const startSec = parseFloat(pill.dataset.start || "0");
      mainVideo.currentTime = startSec;
      if (bgVideo) bgVideo.currentTime = startSec;
      mainVideo.play().catch(() => {});
    });
  });

  // Website Card "Preview in Video" Buttons
  watchSceneBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const seekSec = parseFloat(btn.dataset.seek || "0");
      if (mainVideo) {
        mainVideo.currentTime = seekSec;
        if (bgVideo) bgVideo.currentTime = seekSec;
        mainVideo.play().catch(() => {});
      }
      cinemaWrap?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // ── 4. Calendar Reminder (.ICS & Google Calendar) for Nov 21, 00:00:00 ──
  function downloadLaunchIcs() {
    const icsLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aqua PC Solutions//Triple Website Launch//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:aqua-pc-launch-20261121@aquapcsolutions.yyth.workers.dev",
      "DTSTAMP:20261116T000000Z",
      "DTSTART:20261121T000000",
      "DTEND:20261121T020000",
      "SUMMARY:Aqua PC Solutions — 3-Website Ecosystem Official Launch",
      "DESCRIPTION:Official release of Aqua PC Solutions (https://aquapcsolutions.yyth.workers.dev), Aqua PC Parts (https://aquapcparts.pages.dev), and Aqua PC 3D Studio (https://aquapc3dportal.pages.dev).",
      "LOCATION:Embilipitiya, Sri Lanka (https://aquapcsolutions.yyth.workers.dev)",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aqua-pc-solutions-launch-nov-21.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  document.getElementById("add-calendar-btn")?.addEventListener("click", downloadLaunchIcs);

  document.getElementById("google-cal-btn")?.addEventListener("click", () => {
    const title = encodeURIComponent("Aqua PC Solutions — 3-Website Ecosystem Launch");
    const details = encodeURIComponent(
      "Official launch of Aqua PC Solutions (https://aquapcsolutions.yyth.workers.dev), Aqua PC Parts Superstore (https://aquapcparts.pages.dev), and Aqua PC 3D Studio (https://aquapc3dportal.pages.dev)."
    );
    const location = encodeURIComponent("https://aquapcsolutions.yyth.workers.dev");
    const dates = "20261121T000000/20261121T020000";
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(gcalUrl, "_blank", "noopener,noreferrer");
  });

  // ── 5. VIP Launch Notification & WhatsApp Early Pass Form ────────────────
  const vipForm = document.getElementById("vip-notify-form");
  const vipFeedback = document.getElementById("vip-feedback");

  vipForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("vip-name")?.value.trim() || "Valued Client";
    const contact = document.getElementById("vip-contact")?.value.trim() || "";
    const platform = document.getElementById("vip-platform")?.value || "All 3 Websites";

    try {
      localStorage.setItem(
        "aqua_launch_vip_pass",
        JSON.stringify({ name, contact, platform, savedAt: new Date().toISOString() })
      );
    } catch (_) {}

    if (vipFeedback) {
      vipFeedback.hidden = false;
      vipFeedback.textContent = `✓ Priority Pass saved for ${name}! Opening WhatsApp launch confirmation...`;
    }

    const msg = [
      "🚀 *AQUA PC SOLUTIONS — NOV 21 (00:00:00) VIP LAUNCH PASS*",
      `• *Name:* ${name}`,
      `• *Contact:* ${contact}`,
      `• *Interested Platform:* ${platform}`,
      "• *Release Target:* November 21, 2026 at 00:00:00",
      "",
      "Please notify me as soon as the 3 websites go live!",
    ].join("\n");

    const waUrl = `https://wa.me/94788194535?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });

  // ── 6. Ambient Particle Canvas & Celebration Confetti ────────────────────
  const pCanvas = document.getElementById("particle-canvas");
  if (pCanvas) {
    const ctx = pCanvas.getContext("2d");
    let w = (pCanvas.width = window.innerWidth);
    let h = (pCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      w = pCanvas.width = window.innerWidth;
      h = pCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 36 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.45 + 0.15,
      cyan: Math.random() > 0.35,
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan
          ? `rgba(0, 242, 254, ${p.alpha})`
          : `rgba(16, 185, 129, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }
    requestAnimationFrame(drawParticles);
  }

  function triggerCelebrationBurst() {
    const cCanvas = document.getElementById("confetti-canvas");
    if (!cCanvas) return;
    const ctx = cCanvas.getContext("2d");
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;

    const pieces = Array.from({ length: 90 }, () => ({
      x: cCanvas.width / 2 + (Math.random() - 0.5) * 260,
      y: cCanvas.height * 0.35,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 4,
      size: Math.random() * 7 + 4,
      color: ["#00f2fe", "#10b981", "#3b82f6", "#f8fafc"][Math.floor(Math.random() * 4)],
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.2,
      life: 1,
    }));

    function stepConfetti() {
      ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
      let alive = false;
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.26;
        p.rot += p.vrot;
        p.life -= 0.012;
        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }
      if (alive) {
        requestAnimationFrame(stepConfetti);
      } else {
        ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
      }
    }
    requestAnimationFrame(stepConfetti);
  }
})();

