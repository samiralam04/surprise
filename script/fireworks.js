document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("fireworks");
  if (!canvas) return;

  // Respect user's reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let W = window.innerWidth;
  let H = window.innerHeight;
  let loopId = null;
  let lastFrameTime = performance.now();
  let starfield = [];

  const isMobile =
    /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const SETTINGS = {
    particlesPerExplosion: isMobile ? 30 : 80,
    spawnChancePerFrame: isMobile ? 0.008 : 0.015,
    maxParticles: isMobile ? 400 : 1200,
    specialEffectChance: 0.1,
    starCount: isMobile ? 50 : 150,
  };

  function drawHeart(ctx, x, y, size, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 16, size / 16);

    ctx.beginPath();
    // Heart shape path
    for (let t = 0; t < Math.PI * 2; t += 0.1) {
      const px = 16 * Math.pow(Math.sin(t), 3);
      const py = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      if (t === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();

    ctx.fillStyle = `rgba(255, 182, 193, ${opacity})`; // Light pink color
    ctx.fill();
    ctx.restore();
  }

  // Initialize starfield
  function initStarfield() {
    starfield = [];
    for (let i = 0; i < SETTINGS.starCount; i++) {
      starfield.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 0.5 + Math.random() * 4.5, // Smaller size for hearts
        opacity: 0.2 + Math.random() * 0.8,
        speed: 0.1 + Math.random() * 0.3,
      });
    }
  }

  function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(DPR, DPR);

    initStarfield();
  }

  resize();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(loopId);
    resize();
    loop();
  });

  const rockets = [];
  const particles = [];
  const specialEffects = [];

  // Enhanced Rocket class
  class Rocket {
    constructor() {
      this.x = Math.random() * W;
      this.y = H + 10;
      this.targetY = 50 + Math.random() * (H * 0.6);
      this.speed = 3 + Math.random() * 3;
      this.radius = 1.7;
      this.hue = Math.floor(Math.random() * 360);
      this.color = `hsl(${this.hue}, 90%, 55%)`;
      this.alive = true;
      this.trail = [];
      this.maxTrailLength = 15;
      this.isSpecial = Math.random() < SETTINGS.specialEffectChance;
    }

    update() {
      // Store previous position for trail
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }

      this.y -= this.speed;
      // Slight horizontal movement for more natural feel
      this.x += (Math.random() - 0.5) * 0.8;

      if (this.y <= this.targetY) {
        this.explode();
        this.alive = false;
      }
    }

    draw() {
      // Draw trail
      if (this.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = `hsla(${this.hue}, 90%, 55%, 0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw rocket
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      // Add glow effect
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 3
      );
      gradient.addColorStop(0, `hsla(${this.hue}, 90%, 55%, 0.8)`);
      gradient.addColorStop(1, `hsla(${this.hue}, 90%, 55%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(
        this.x - this.radius * 3,
        this.y - this.radius * 3,
        this.radius * 6,
        this.radius * 6
      );
    }

    explode() {
      const particleCount = this.isSpecial
        ? SETTINGS.particlesPerExplosion * 1.5
        : SETTINGS.particlesPerExplosion;

      for (let i = 0; i < particleCount; i++) {
        particles.push(
          new Particle(this.x, this.y, this.color, this.isSpecial)
        );
      }

      if (this.isSpecial) {
        this.createSpecialEffect();
      }
    }

    createSpecialEffect() {
      const effectType = Math.floor(Math.random() * 3);

      switch (effectType) {
        case 0: // Heart shape
          specialEffects.push(new HeartEffect(this.x, this.y, this.hue));
          break;
        case 1: // Ring explosion
          specialEffects.push(new RingEffect(this.x, this.y, this.hue));
          break;
        case 2: // Spiral effect
          specialEffects.push(new SpiralEffect(this.x, this.y, this.hue));
          break;
        case 3: // Smiley face
          specialEffects.push(new SmileyEffect(this.x, this.y, this.hue));
          break;
      }
    }
  }

  // Enhanced Particle class
  class Particle {
    constructor(x, y, color, isSpecial = false) {
      this.x = x;
      this.y = y;
      this.hue = parseInt(color.match(/\d+/)[0]);
      this.color = `hsl(${this.hue}, 90%, ${isSpecial ? "75%" : "55%"})`;
      this.radius = Math.random() * (isSpecial ? 2.5 : 1.8) + 0.8;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * (isSpecial ? 6 : 4) + 1.2;
      this.friction = isSpecial ? 0.93 : 0.96;
      this.gravity = 0.12;
      this.life = 80 + Math.random() * 60;
      this.opacity = 1;
      this.isSpecial = isSpecial;
      this.flicker = Math.random() > 0.7;
      this.flickerSpeed = 0.05 + Math.random() * 0.1;
      this.flickerPhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.life--;

      if (this.flicker) {
        this.flickerPhase += this.flickerSpeed;
        this.opacity = 0.5 + 0.5 * Math.sin(this.flickerPhase);
      } else {
        this.opacity = Math.max(0, this.life / 100);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

      if (this.isSpecial) {
        // Special particles get a glow effect
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius * 2
        );
        gradient.addColorStop(
          0,
          `hsla(${this.hue}, 90%, 75%, ${this.opacity * 0.8})`
        );
        gradient.addColorStop(1, `hsla(${this.hue}, 90%, 75%, 0)`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = this.color
          .replace("hsl", "hsla")
          .replace(")", `, ${this.opacity})`);
      }

      ctx.fill();
    }
  }

  // Special Effects Classes
  class HeartEffect {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.size = 10 + Math.random() * 20;
      this.life = 100;
      this.points = [];
      this.createHeartPoints();
    }

    createHeartPoints() {
      for (let t = 0; t < Math.PI * 2; t += 0.1) {
        const px = 16 * Math.pow(Math.sin(t), 3);
        const py = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        this.points.push({ x: px, y: py, life: this.life });
      }
    }

    update() {
      this.life -= 1;
      this.size *= 0.98;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.size / 16, this.size / 16);

      ctx.beginPath();
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.closePath();

      const opacity = Math.max(0, this.life / 100);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${opacity * 0.7})`;
      ctx.fill();

      ctx.restore();
    }
  }

  class RingEffect {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.radius = 5;
      this.maxRadius = 50 + Math.random() * 50;
      this.life = 80;
      this.width = 3;
    }

    update() {
      this.radius += (this.maxRadius - this.radius) * 0.1;
      this.life -= 1;
      this.width *= 0.95;
    }

    draw() {
      const opacity = Math.max(0, this.life / 80);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${this.hue}, 90%, 65%, ${opacity})`;
      ctx.lineWidth = this.width;
      ctx.stroke();

      // Inner glow
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        this.radius - this.width,
        this.x,
        this.y,
        this.radius + this.width
      );
      gradient.addColorStop(0, `hsla(${this.hue}, 90%, 65%, ${opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${this.hue}, 90%, 65%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + this.width, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class SpiralEffect {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.angle = 0;
      this.radius = 1;
      this.life = 120;
      this.particles = [];
      this.spiralDensity = 50;
    }

    update() {
      this.angle += 0.2;
      this.radius += 1;
      this.life -= 1;

      if (this.life % 3 === 0) {
        for (let i = 0; i < 3; i++) {
          const a = this.angle + (i * Math.PI * 2) / 3;
          const x = this.x + Math.cos(a) * this.radius;
          const y = this.y + Math.sin(a) * this.radius;
          this.particles.push({
            x,
            y,
            size: 2 + Math.random() * 3,
            life: 30 + Math.random() * 30,
            hue: this.hue + (Math.random() * 40 - 20),
          });
        }
      }

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= 1;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw() {
      // Draw spiral particles
      for (const p of this.particles) {
        const opacity = Math.max(0, p.life / 60);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * opacity, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${opacity})`;
        ctx.fill();
      }
    }
  }

  class SmileyEffect {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      this.size = 30 + Math.random() * 30;
      this.life = 100;
    }

    update() {
      this.life -= 1;
      this.size *= 0.98;
    }

    draw() {
      const opacity = Math.max(0, this.life / 100);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.size / 30, this.size / 30);

      // Face
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${opacity * 0.7})`;
      ctx.fill();

      // Eyes
      ctx.beginPath();
      ctx.arc(-5, -3, 2, 0, Math.PI * 2);
      ctx.arc(5, -3, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(0, 0%, 20%, ${opacity})`;
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(0, 2, 8, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsla(0, 0%, 20%, ${opacity})`;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Draw starfield background
  function drawStarfield() {
    for (const star of starfield) {
      drawHeart(ctx, star.x, star.y, star.size, star.opacity);

      // Animate stars slightly
      star.y += star.speed;
      if (star.y > H) {
        star.y = 0;
        star.x = Math.random() * W;
      }
    }
  }

  // Main loop with delta time calculation
  function loop() {
    const now = performance.now();
    const deltaTime = Math.min(100, now - lastFrameTime) / 16.67; // Normalize to ~60fps
    lastFrameTime = now;

    loopId = requestAnimationFrame(loop);

    // Clear with subtle fade for trails
    ctx.fillStyle = "rgba(5, 5, 15, 0.2)";
    ctx.fillRect(0, 0, W, H);

    // Draw starfield
    drawStarfield();

    // Spawn rockets
    if (Math.random() < SETTINGS.spawnChancePerFrame * deltaTime) {
      rockets.push(new Rocket());
    }

    // Update and draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      if (r.alive) {
        r.update();
        r.draw();
      } else {
        rockets.splice(i, 1);
      }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Update and draw special effects
    for (let i = specialEffects.length - 1; i >= 0; i--) {
      const e = specialEffects[i];
      e.update();
      e.draw();
      if (e.life <= 0) specialEffects.splice(i, 1);
    }

    // Performance management
    if (particles.length > SETTINGS.maxParticles) {
      particles.splice(0, particles.length - SETTINGS.maxParticles);
    }
  }

  // Visibility management
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(loopId);
    } else {
      lastFrameTime = performance.now();
      loop();
    }
  });

  // Start the show
  initStarfield();
  loop();
});
