/* ============================================================
   GIFT REVEAL — script.js
   ------------------------------------------------------------
   TO ADD / CHANGE SONGS LATER:
   1. Drop the mp3 file into the /music folder.
   2. Add a new line to the SONGS array below:
        { title: "Song Title", artist: "Artist Name", file: "music/your-file.mp3" }
   That's it — the player builds itself from this array.
   ============================================================ */

const SONGS = [
  { title: "There Is a Light That Never Goes Out", artist: "The Smiths", file: "music/01-there-is-a-light-that-never-goes-out.mp3" },
  { title: "It's Not Living (If It's Not With You)", artist: "The 1975", file: "music/02-its-not-living-if-its-not-with-you.mp3" },
  { title: "Mirrors", artist: "Justin Timberlake", file: "music/03-mirrors.mp3" },
  { title: "Robbers", artist: "The 1975", file: "music/04-robbers.mp3" },
  { title: "Those Eyes", artist: "New West ft. Zeph", file: "music/05-those-eyes.mp3" },
  { title: "All Too Well (10 Minute Version)", artist: "Taylor Swift", file: "music/06-all-too-well-10-minute-version.mp3" },
  { title: "The Bitch Is Back", artist: "Elton John", file: "music/07-the-bitch-is-back.mp3" },
];

/* ============================================================
   Gift open sequence — runs once
   ============================================================ */

(function giftReveal() {
  const giftWrap = document.getElementById("gift-wrap");
  const giftButton = document.getElementById("gift-button");
  const sceneGift = document.getElementById("scene-gift");
  const sceneCard = document.getElementById("scene-card");
  const sunflowerBloom = document.getElementById("sunflower-bloom");

  let opened = false;

  giftButton.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    giftButton.setAttribute("aria-disabled", "true");
    giftButton.style.pointerEvents = "none";

    giftWrap.classList.add("is-opening");
    sceneGift.classList.add("is-opening");
    sunflowerBloom.classList.add("is-blooming");

    window.setTimeout(() => {
      sceneGift.classList.add("is-hidden");
      sceneCard.classList.add("is-visible");
    }, 600);
  });
})();

/* ============================================================
   Editable note, with autosave to this browser only
   ============================================================ */

(function noteEditor() {
  const noteBody = document.getElementById("note-body");
  const editBtn = document.getElementById("note-edit-btn");
  const editLabel = document.getElementById("note-edit-label");

  try {
    const saved = localStorage.getItem("gift-note-text");
    if (saved) noteBody.innerText = saved;
  } catch (e) {
    /* localStorage unavailable — ignore, default note still shows */
  }

  let editing = false;

  editBtn.addEventListener("click", () => {
    editing = !editing;
    noteBody.setAttribute("contenteditable", editing ? "true" : "false");
    editLabel.textContent = editing ? "Save" : "Edit";

    if (editing) {
      noteBody.focus();
      placeCaretAtEnd(noteBody);
    } else {
      try {
        localStorage.setItem("gift-note-text", noteBody.innerText.trim());
      } catch (e) {
        /* ignore */
      }
    }
  });

  function placeCaretAtEnd(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();

/* ============================================================
   Voucher copy-to-clipboard
   ============================================================ */

(function voucherCopy() {
  const copyBtn = document.getElementById("copy-btn");
  const copyLabel = document.getElementById("copy-btn-label");
  const toast = document.getElementById("toast");

  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  copyBtn.addEventListener("click", async () => {
    const code = document.getElementById("voucher-code").textContent.trim();
    const pin = document.getElementById("voucher-pin").textContent.trim();
    const text = `Code: ${code}  Pin: ${pin}`;

    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch (err) {
        /* ignore */
      }
      document.body.removeChild(ta);
    }

    copyBtn.classList.add("is-copied");
    copyLabel.textContent = "Copied!";
    showToast("Voucher code & pin copied");

    window.setTimeout(() => {
      copyBtn.classList.remove("is-copied");
      copyLabel.textContent = "Copy code & pin";
    }, 1800);
  });
})();

/* ============================================================
   Music player — builds itself from SONGS array
   ============================================================ */

(function musicPlayer() {
  const playlistEl = document.getElementById("playlist");
  const trackRefs = [];

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function buildTrackEl(song) {
    const li = document.createElement("li");
    li.className = "track";
    li.innerHTML = `
      <button type="button" class="track-play" aria-label="Play ${escapeHtml(song.title)}">
        <svg class="icon-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
      </button>
      <div class="track-body">
        <div class="track-meta">
          <div class="track-titles">
            <div class="track-title">${escapeHtml(song.title)}</div>
            <div class="track-artist">${escapeHtml(song.artist)}</div>
          </div>
          <div class="track-time"><span class="time-current">0:00</span>&nbsp;/&nbsp;<span class="time-duration">--:--</span></div>
        </div>
        <div class="track-progress" tabindex="0" role="slider" aria-label="Seek ${escapeHtml(song.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="track-progress-fill"></div>
          <div class="track-progress-handle"></div>
        </div>
      </div>
    `;
    return li;
  }

  function updateProgress(refs, audio) {
    const dur = audio.duration;
    const cur = audio.currentTime;
    const pct = dur ? (cur / dur) * 100 : 0;
    refs.fillEl.style.width = pct + "%";
    refs.handleEl.style.left = pct + "%";
    refs.curEl.textContent = formatTime(cur);
    if (isFinite(dur)) refs.progressEl.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  function togglePlay(i) {
    const target = trackRefs[i];

    // only one song plays at a time
    trackRefs.forEach((refs, idx) => {
      if (idx !== i && !refs.audio.paused) {
        refs.audio.pause();
        refs.li.classList.remove("is-active");
      }
    });

    if (target.audio.paused) {
      target.audio.play().catch(() => {
        /* playback blocked until user gesture — button click already counts as one */
      });
      target.li.classList.add("is-active");
    } else {
      target.audio.pause();
    }
  }

  function seek(refs, audio, clientX) {
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    const rect = refs.progressEl.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = fraction * audio.duration;
    updateProgress(refs, audio);
  }

  SONGS.forEach((song, i) => {
    const audio = new Audio(song.file);
    audio.preload = "metadata";

    const li = buildTrackEl(song);
    playlistEl.appendChild(li);

    const refs = {
      audio,
      li,
      playBtn: li.querySelector(".track-play"),
      progressEl: li.querySelector(".track-progress"),
      fillEl: li.querySelector(".track-progress-fill"),
      handleEl: li.querySelector(".track-progress-handle"),
      curEl: li.querySelector(".time-current"),
      durEl: li.querySelector(".time-duration"),
    };
    trackRefs.push(refs);

    audio.addEventListener("loadedmetadata", () => {
      refs.durEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", () => updateProgress(refs, audio));
    audio.addEventListener("play", () => li.classList.add("is-playing"));
    audio.addEventListener("pause", () => li.classList.remove("is-playing"));
    audio.addEventListener("ended", () => {
      li.classList.remove("is-playing", "is-active");
      audio.currentTime = 0;
      updateProgress(refs, audio);
    });

    refs.playBtn.addEventListener("click", () => togglePlay(i));

    refs.progressEl.addEventListener("click", (e) => seek(refs, audio, e.clientX));
    refs.progressEl.addEventListener("keydown", (e) => {
      if (!isFinite(audio.duration)) return;
      if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      else if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        togglePlay(i);
      } else {
        return;
      }
      updateProgress(refs, audio);
    });
  });
})();

/* ============================================================
   Ambient backdrop — soft drifting gold motes (canvas)
   ============================================================ */

(function ambientMotes() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function spawn() {
    return {
      x: Math.random() * w,
      y: h + Math.random() * 40,
      r: 1 + Math.random() * 1.8,
      speed: 0.12 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: 0.12 + Math.random() * 0.3,
    };
  }

  const count = w < 600 ? 16 : 28;
  particles = Array.from({ length: count }, () => {
    const p = spawn();
    p.y = Math.random() * h; // scatter initial positions through the viewport
    return p;
  });

  function tick() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f7c948";
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) Object.assign(p, spawn());
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  tick();
})();
