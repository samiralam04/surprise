window.addEventListener("DOMContentLoaded", () => {
  // Build star field
  createStars();

  // Show music prompt
  showMusicPrompt();

  // Create ambient romantic elements
  createFloatingHearts();
  createSparkles();
  createRosePetals();
});

/* ──────────────────────────────────────────
   STAR FIELD
   ────────────────────────────────────────── */
function createStars() {
  const container = document.getElementById("stars");
  if (!container) return;
  const count = 150;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const size = Math.random() * 2.5 + 0.8;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 5}s;
    `;
    container.appendChild(star);
  }
}

/* ──────────────────────────────────────────
   FLOATING HEARTS (background)
   ────────────────────────────────────────── */
function createFloatingHearts() {
  const container = document.querySelector(".floating-hearts");
  const heartEmojis = ["❤️", "💕", "💗", "💓", "💖", "🌹", "💝"];
  const heartCount = 25;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const size = Math.random() * 22 + 10;
    heart.style.fontSize = `${size}px`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${10 + Math.random() * 20}s`;
    heart.style.animationDelay = `${Math.random() * 8}s`;

    container.appendChild(heart);
  }
}

/* ──────────────────────────────────────────
   ROSE PETALS RAIN
   ────────────────────────────────────────── */
function createRosePetals() {
  const container = document.querySelector(".rose-petals");
  if (!container) return;
  const petalEmojis = ["🌸", "🌺", "🌹", "🪷", "💮"];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.innerHTML = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    const drift = (Math.random() - 0.5) * 200;
    const spin = Math.random() > 0.5 ? 360 : -360;
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 14 + 10}px;
      --dur: ${8 + Math.random() * 14}s;
      --delay: ${Math.random() * 12}s;
      --drift: ${drift}px;
      --spin: ${spin}deg;
    `;
    container.appendChild(petal);
  }
}

/* ──────────────────────────────────────────
   GOLD SPARKLES
   ────────────────────────────────────────── */
function createSparkles() {
  const container = document.querySelector(".sparkles");
  const sparkleCount = 60;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;

    const tx = (Math.random() - 0.5) * 200;
    const ty = (Math.random() - 0.5) * 200;
    sparkle.style.setProperty("--tx", `${tx}px`);
    sparkle.style.setProperty("--ty", `${ty}px`);
    sparkle.style.animationDelay = `${Math.random() * 3}s`;
    sparkle.style.animationDuration = `${2 + Math.random() * 2}s`;

    container.appendChild(sparkle);
  }
}

/* ──────────────────────────────────────────
   ROMANTIC MUSIC PROMPT
   ────────────────────────────────────────── */
function showMusicPrompt() {
  Swal.fire({
    title: "🌹 A Gift Just for You",
    html: `<p style="font-family:'Dancing Script',cursive; font-size:1.3rem; color:#c0315a; line-height:1.7">
             Play some soft music<br>while you read my heart? 💕
           </p>`,
    showCancelButton: true,
    confirmButtonColor: "#e8517a",
    cancelButtonColor: "#8b1a3a",
    confirmButtonText: "Yes, play music 🎵",
    cancelButtonText: "Continue silently",
    background: "linear-gradient(135deg, #1a0a12 0%, #2d0b1f 100%)",
    color: "#f7c5d5",
    backdrop: `
      rgba(45, 11, 31, 0.85)
      url("img/heart.gif")
      center top
      no-repeat
    `,
    allowOutsideClick: false,
    customClass: {
      popup: "romantic-swal",
      confirmButton: "swal-confirm-romantic",
      cancelButton: "swal-cancel-romantic",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      initializePage(true);
    } else {
      initializePage(false);
    }
  });
}

/* ──────────────────────────────────────────
   INITIALIZE
   ────────────────────────────────────────── */
function initializePage(playMusic) {
  if (!playMusic) {
    document.querySelector(".song").style.display = "none";
  }

  animationTimeline();

  if (playMusic) {
    const song = document.querySelector(".song");
    song.volume = 0.3;
    song.removeAttribute("autoplay");

    const playPromise = song.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        showMusicButton();
      });
    }
  }
}

/* ──────────────────────────────────────────
   FLOATING MUSIC BUTTON (fallback)
   ────────────────────────────────────────── */
function showMusicButton() {
  const playButton = document.createElement("button");
  playButton.innerHTML = "🎵 Click to Play Music";
  playButton.className = "music-play-button";
  playButton.onclick = () => {
    document.querySelector(".song").play();
    playButton.remove();
  };

  Object.assign(playButton.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 28px",
    background: "linear-gradient(135deg, #e8517a, #c0315a)",
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontFamily: '"Dancing Script", cursive',
    fontSize: "1.1rem",
    cursor: "pointer",
    zIndex: "1000",
    boxShadow: "0 4px 20px rgba(232, 81, 122, 0.5)",
    fontWeight: "600",
    transition: "all 0.3s ease",
    letterSpacing: "1px",
  });

  playButton.addEventListener("mouseover", () => {
    playButton.style.transform = "translateX(-50%) scale(1.06)";
    playButton.style.boxShadow = "0 6px 28px rgba(232, 81, 122, 0.8)";
  });

  playButton.addEventListener("mouseout", () => {
    playButton.style.transform = "translateX(-50%)";
    playButton.style.boxShadow = "0 4px 20px rgba(232, 81, 122, 0.5)";
  });

  document.body.appendChild(playButton);
}

/* ──────────────────────────────────────────
   MAIN ANIMATION TIMELINE
   ────────────────────────────────────────── */
const animationTimeline = () => {
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span>`;

  const hbdHtml = hbd.innerHTML;
  hbd.innerHTML = hbdHtml
    .replace(/<br\s*\/?>/gi, "<br>")
    .split(/(<br>)/)
    .map((part) =>
      part === "<br>"
        ? "<br>"
        : `<span>${part.split("").join("</span><span>")}</span>`,
    )
    .join("");

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg",
  };

  const tl = gsap.timeline();

  tl.to(".container", 0.6, { visibility: "visible" })

    /* ── Slide 1 ── */
    .from(".one", 0.8, { opacity: 0, y: 15, ease: "power4.out" })
    .from(".two", 0.5, { opacity: 0, y: 10, ease: "power2.out" })
    .to(".one", 0.7, { opacity: 0, y: 10, ease: "power4.in" }, "+=3.5")
    .to(".two", 0.7, { opacity: 0, y: 10, ease: "power4.in" }, "-=1")

    /* ── Slide 2 ── */
    .from(".three", 0.8, { opacity: 0, y: 10, ease: "bounce.out" })
    .to(".three", 0.7, { opacity: 0, y: 10, ease: "power4.in" }, "+=3")

    /* ── Slide 3: Chat bubble ── */
    .from(".four", 0.7, { scale: 0.2, opacity: 0, ease: "back.out(1.7)" })
    .from(".fake-btn", 0.3, { scale: 0.2, opacity: 0, ease: "back.out(1.7)" })
    .staggerTo(".hbd-chatbox span", 1.5, { visibility: "visible", ease: "back.out" }, 0.05)
    .to(".fake-btn", 0.1, { backgroundColor: "#e8517a" }, "+=4")
    .to(".four", 0.5, { scale: 0.2, opacity: 0, y: -150, ease: "back.in" }, "+=1")

    /* ── Slide 4-6: Story ── */
    .from(".idea-1", 0.7, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-1", 0.7, { ...ideaTextTransLeave, ease: "back.in" }, "+=2.5")

    .from(".idea-2", 0.7, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-2", 0.7, { ...ideaTextTransLeave, ease: "back.in" }, "+=2.5")

    .from(".idea-3", 0.7, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-3 strong", 0.5, {
      scale: 1.2, x: 10,
      backgroundColor: "#e8517a",
      color: "#fff",
      ease: "elastic.out(1, 0.5)",
    })
    .to(".idea-3", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    /* ── Romantic Quotes ── */
    .from(".idea-7", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-7", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    .from(".idea-8", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-8", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    .from(".idea-9", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-9", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    .from(".idea-10", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-10", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    .from(".idea-11", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-11", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    .from(".idea-12", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-12", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    .from(".idea-13", 3, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-13", 3, { ...ideaTextTransLeave, ease: "back.in" }, "+=5")

    /* ── SO lettering ── */
    .staggerFrom(
      ".idea-6 span", 0.8,
      { scale: 3, opacity: 0, rotation: 15, ease: "elastic.out(1, 0.5)" },
      0.2,
    )
    .staggerTo(
      ".idea-6 span", 0.8,
      { scale: 3, opacity: 0, rotation: -15, ease: "elastic.in(1, 0.5)" },
      0.2,
      "+=1.5",
    )

    /* ── idea-4 & idea-5 ── */
    .from(".idea-4", 0.7, { ...ideaTextTrans, ease: "back.out(1.7)" })
    .to(".idea-4", 0.7, { ...ideaTextTransLeave, ease: "back.in" }, "+=2.5")
    .from(".idea-5", 0.7, {
      rotationX: 15, rotationZ: -10, skewY: "-5deg",
      y: 50, z: 10, opacity: 0, ease: "back.out(1.7)",
    }, "+=1.5")
    .to(".idea-5 span", 0.7, {
      rotation: 90, x: 8, ease: "elastic.out(1, 0.5)",
    }, "+=1.4")
    .to(".idea-5", 0.7, { scale: 0.2, opacity: 0, ease: "back.in" }, "+=2")

    /* ── Balloons + Photo ── */
    .staggerFromTo(
      ".baloons img", 2.5,
      { opacity: 0.9, y: 1400 },
      { opacity: 1, y: -1000, ease: "power1.out" },
      0.2,
    )
    .from(
      ".photo-frame", 0.5,
      { scale: 3.5, opacity: 0, x: 25, y: -25, rotationZ: -45, ease: "back.out(1.7)" },
      "-=2",
    )
    .from(".hat", 0.5, {
      x: -100, y: 350, rotation: -180, opacity: 0, ease: "back.out(1.7)",
    })

    /* ── Wish text ── */
    .staggerFrom(
      ".wish-hbd span", 0.7,
      { opacity: 0, y: -50, rotation: 150, skewX: "30deg", ease: "elastic.out(1, 0.5)" },
      0.1,
    )
    .staggerFromTo(
      ".wish-hbd span", 0.7,
      { scale: 1.4, rotationY: 150 },
      { scale: 1, rotationY: 0, color: "#f0c040", ease: "expo.out" },
      0.1,
      "party",
    )
    .from(
      ".wish h5", 0.5,
      { opacity: 0, y: 10, skewX: "-15deg", ease: "back.out(1.7)" },
      "party",
    )

    /* ── Circle bursts ── */
    .staggerTo(
      ".eight svg", 1.5,
      { visibility: "visible", opacity: 0, scale: 80, repeat: 3, repeatDelay: 1.4, ease: "power2.out" },
      0.3,
    )

    /* ── Fade out photo, show final message ── */
    .to(".six", 0.5, { opacity: 0, y: 30, zIndex: "-1", ease: "power2.in" })
    .staggerFrom(
      ".nine p", 1,
      { ...ideaTextTrans, ease: "back.out(1.7)" },
      1.2,
    )
    .from(".kiss", 0.8, { y: 50, opacity: 0, ease: "back.out(1.7)" }, "-=0.5")
    .to(".last-smile", 0.5, { rotation: 90, ease: "back.out(1.7)" }, "+=1");

  /* ── Replay ── */
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};
