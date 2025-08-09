window.addEventListener("DOMContentLoaded", () => {
  // First show the music prompt
  showMusicPrompt();

  // Create floating hearts background
  createFloatingHearts();

  // Create sparkles
  createSparkles();
});


function createFloatingHearts() {
  const container = document.querySelector(".floating-hearts");
  const heartCount = 20;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = "❤";

    // Random position and size
    const size = Math.random() * 20 + 10;
    heart.style.fontSize = `${size}px`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${10 + Math.random() * 20}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;

    container.appendChild(heart);
  }
}

function createSparkles() {
  const container = document.querySelector(".sparkles");
  const sparkleCount = 50;

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    // Random position
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;

    // Random movement
    const tx = (Math.random() - 0.5) * 200;
    const ty = (Math.random() - 0.5) * 200;
    sparkle.style.setProperty("--tx", `${tx}px`);
    sparkle.style.setProperty("--ty", `${ty}px`);

    // Random delay
    sparkle.style.animationDelay = `${Math.random() * 2}s`;

    container.appendChild(sparkle);
  }
}

function showMusicPrompt() {
  Swal.fire({
    title: "Background Music",
    text: "Do you want to play music with this birthday surprise?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ff69b4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, please!",
    cancelButtonText: "No thanks",
    background: "#fff",
    backdrop: `
            rgba(255,182,193,0.4)
            url("img/heart.gif")
            center top
            no-repeat
        `,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      // User wants music - initialize with music
      initializePage(true);
    } else {
      // User declined music - initialize without music
      initializePage(false);
    }
  });
}

function initializePage(playMusic) {
  // Hide the song element if music is disabled
  if (!playMusic) {
    document.querySelector(".song").style.display = "none";
  }

  // Start the animations
  animationTimeline();

  // If music is enabled, try to play it
  if (playMusic) {
    const song = document.querySelector(".song");
    song.volume = 0.3; // Set reasonable volume

    // Remove autoplay attribute to prevent blocking
    song.removeAttribute("autoplay");

    // Attempt to play the music
    const playPromise = song.play();

    // Handle any errors
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay prevented, showing play button");
        showMusicButton();
      });
    }
  }
}

function showMusicButton() {
  const playButton = document.createElement("button");
  playButton.textContent = "Click to Play Music";
  playButton.className = "music-play-button";
  playButton.onclick = () => {
    document.querySelector(".song").play();
    playButton.remove();
  };

  // Style the button
  playButton.style.position = "fixed";
  playButton.style.bottom = "20px";
  playButton.style.left = "50%";
  playButton.style.transform = "translateX(-50%)";
  playButton.style.padding = "12px 24px";
  playButton.style.backgroundColor = "#ff69b4";
  playButton.style.color = "white";
  playButton.style.border = "none";
  playButton.style.borderRadius = "30px";
  playButton.style.fontFamily = '"Poppins", sans-serif';
  playButton.style.cursor = "pointer";
  playButton.style.zIndex = "1000";
  playButton.style.boxShadow = "0 4px 15px rgba(255, 105, 180, 0.4)";
  playButton.style.fontWeight = "600";
  playButton.style.transition = "all 0.3s ease";

  playButton.addEventListener("mouseover", () => {
    playButton.style.transform = "translateX(-50%) scale(1.05)";
    playButton.style.boxShadow = "0 6px 20px rgba(255, 105, 180, 0.6)";
  });

  playButton.addEventListener("mouseout", () => {
    playButton.style.transform = "translateX(-50%)";
    playButton.style.boxShadow = "0 4px 15px rgba(255, 105, 180, 0.4)";
  });

  document.body.appendChild(playButton);
}

// animation timeline
const animationTimeline = () => {
  // split chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span>`;

  const hbdHtml = hbd.innerHTML;
  hbd.innerHTML = hbdHtml
    .replace(/<br\s*\/?>/gi, "<br>") // Normalize <br />
    .split(/(<br>)/) // Split by <br>
    .map((part) =>
      part === "<br>"
        ? "<br>"
        : `<span>${part.split("").join("</span><span>")}</span>`
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

  // timeline
  const tl = gsap.timeline();

  tl.to(".container", 0.6, {
    visibility: "visible",
  })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10,
      ease: "power4.out",
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10,
      ease: "power2.out",
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10,
        ease: "power4.in",
      },
      "+=3.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10,
        ease: "power4.in",
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10,
      ease: "bounce.out",
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10,
        ease: "power4.in",
      },
      "+=3"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0,
      ease: "back.out(1.7)",
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0,
      ease: "back.out(1.7)",
    })
    .staggerTo(
      ".hbd-chatbox span",
      1.5,
      {
        visibility: "visible",
        ease: "back.out",
      },
      0.05
    )
    .to(
      ".fake-btn",
      0.1,
      {
        backgroundColor: "rgb(255, 105, 180)",
      },
      "+=4"
    )
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150,
        ease: "back.in",
      },
      "+=1"
    )
    .from(".idea-1", 0.7, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-1",
      0.7,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=2.5"
    )
    .from(".idea-2", 0.7, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-2",
      0.7,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=2.5"
    )
    .from(".idea-3", 0.7, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(255, 105, 180)",
      color: "#fff",
      ease: "elastic.out(1, 0.5)",
    })
    .to(
      ".idea-3",
      3,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=5"
    )
    // new
    .from(".idea-7", 3, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-7",
      3,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=5"
    )
    .from(".idea-8", 3, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-8",
      3,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=5"
    )
    .from(".idea-9", 3, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-9",
      3,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=5"
    )
    .from(".idea-10", 3, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-10",
      3,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=5"
    )
    .from(".idea-11", 3, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-11",
      3,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=5"
    )
    //new end

    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: "elastic.out(1, 0.5)",
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: "elastic.in(1, 0.5)",
      },
      0.2,
      "+=1.5"
    )

    .from(".idea-4", 0.7, {
      ...ideaTextTrans,
      ease: "back.out(1.7)",
    })
    .to(
      ".idea-4",
      0.7,
      {
        ...ideaTextTransLeave,
        ease: "back.in",
      },
      "+=2.5"
    )
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0,
        ease: "back.out(1.7)",
      },
      "+=1.5"
    )
    .to(
      ".idea-5 span",
      0.7,
      {
        rotation: 90,
        x: 8,
        ease: "elastic.out(1, 0.5)",
      },
      "+=1.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0,
        ease: "back.in",
      },
      "+=2"
    )

    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400,
      },
      {
        opacity: 1,
        y: -1000,
        ease: "power1.out",
      },
      0.2
    )
    .from(
      ".photo-frame",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45,
        ease: "back.out(1.7)",
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0,
      ease: "back.out(1.7)",
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        rotation: 150,
        skewX: "30deg",
        ease: "elastic.out(1, 0.5)",
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150,
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: "expo.out",
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg",
        ease: "back.out(1.7)",
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4,
        ease: "power2.out",
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1",
      ease: "power2.in",
    })
    .staggerFrom(
      ".nine p",
      1,
      {
        ...ideaTextTrans,
        ease: "back.out(1.7)",
      },
      1.2
    )
    .from(
      ".kiss",
      0.8,
      {
        y: 50,
        opacity: 0,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    )
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90,
        ease: "back.out(1.7)",
      },
      "+=1"
    );

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};
