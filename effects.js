document.addEventListener('DOMContentLoaded', () => {
  // Centralized helper to safely add event listeners if element exists
  function addSafeEventListener(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }

  // 1. Fade-in main content with class toggle for CSS (add .visible in CSS)
  const content = document.querySelector('.center-content');
  if (content) requestAnimationFrame(() => content.classList.add('visible'));

  // 2. Parallax background effect
  const bgBlack = document.getElementById('bg-black');
  const tsparticles = document.getElementById('tsparticles');
  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 10;
    const my = (e.clientY / window.innerHeight - 0.5) * 10;
    if (bgBlack) bgBlack.style.transform = `translate(${mx * 0.1}px, ${my * 0.1}px)`;
    if (tsparticles) tsparticles.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
  });

  // 3. Typing effect with fade and fixed width
  const animatedTitle = document.getElementById('animated-title');
  const placeholder = document.getElementById('animated-title-placeholder');

  if (animatedTitle && placeholder) {
    const texts = ['Jaineel', 'LostAstr0'];
    const longestText = texts.reduce((a, b) => (a.length >= b.length ? a : b));
    placeholder.textContent = longestText;

    placeholder.style.visibility = 'hidden';
    placeholder.style.opacity = '0';

    let currentIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const delayAfterTyping = 1400;
    const delayAfterErasing = 600;

    // Helper for delaying with Promises 
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeEraseCycle() {
      while (true) {
        // Typing
        while (charIndex < texts[currentIndex].length) {
          animatedTitle.textContent = texts[currentIndex].substring(0, charIndex + 1);
          charIndex++;
          await delay(typingSpeed);
        }
        await delay(delayAfterTyping);

        // Erasing
        while (charIndex > 0) {
          animatedTitle.textContent = texts[currentIndex].substring(0, charIndex - 1);
          charIndex--;
          await delay(erasingSpeed);
        }
        currentIndex = (currentIndex + 1) % texts.length;
        await delay(delayAfterErasing);
      }
    }

    typeEraseCycle();
  }

  // 4. Shooting stars canvas animation encapsulated in a class for modularity

  class ShootingStarsCanvas {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.shootingStars = [];
      this.maxStars = 3;
      this.width = 0;
      this.height = 0;

      this.setupCanvas();
      this.createStars();
      this.animate();

      window.addEventListener('resize', () => this.resize());
    }

    setupCanvas() {
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '-1';
      document.body.appendChild(this.canvas);
      this.resize();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createStars() {
      for (let i = 0; i < this.maxStars; i++) {
        this.shootingStars.push(new ShootingStar(this));
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.shootingStars.forEach(star => {
        star.update();
        star.draw(this.ctx);
      });
      requestAnimationFrame(() => this.animate());
    }
  }

  class ShootingStar {
    constructor(canvasInstance) {
      this.canvasInstance = canvasInstance;
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * this.canvasInstance.width;
      this.y = Math.random() * this.canvasInstance.height;
      this.len = Math.random() * 80 + 50;
      this.speed = Math.random() * (3.0 - 1.5) + 1.5;
      this.angle = Math.PI / 4;
      this.opacity = initial ? Math.random() : 0;
      this.fadeIn = true;
      this.fadeSpeed = 0.01;
    }

    update() {
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      if (this.fadeIn) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 1) this.fadeIn = false;
      } else {
        this.opacity -= this.fadeSpeed;
      }
      if (this.opacity <= 0 || this.x > this.canvasInstance.width || this.y > this.canvasInstance.height) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.strokeStyle = `rgba(23, 138, 255, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - this.len * Math.cos(this.angle),
        this.y - this.len * Math.sin(this.angle)
      );
      ctx.stroke();
    }
  }

  new ShootingStarsCanvas();

  // 5. tsParticles initialization if available
  if (window.tsParticles) {
    tsParticles.load('tsparticles', {
      background: { color: '#000' },
      fpsLimit: 60,
      interactivity: { events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        color: { value: ['#178aff', '#7f74ff', '#21d0ff', '#bae1ff'] },
        shape: { type: 'circle' },
        opacity: { value: 1, random: true, anim: { enable: true, speed: 1.5, opacity_min: 0.3, sync: false } },
        size: { value: { min: 1, max: 3 }, random: true, anim: { enable: false } },
        move: { enable: true, speed: 0.3, direction: 'none', random: false, straight: false, outModes: 'out' },
      },
      detectRetina: true,
    });
  }

  // 6. Cake Easter egg popup
  const secretCake = document.getElementById('secret-cake');
  const cakeEgg = document.getElementById('cake-easter-egg');
  if (secretCake && cakeEgg) {
    addSafeEventListener(secretCake, 'click', () => {
      cakeEgg.style.display = 'block';
      cakeEgg.classList.remove('fade-out');
      setTimeout(() => {
        cakeEgg.classList.add('fade-out');
        setTimeout(() => {
          cakeEgg.style.display = 'none';
        }, 500);
      }, 4000);
    });
  }

  // 7. LinkedIn alert with toast instead of alert
  const linkedinLink = document.getElementById('linkedin-link');
  if (linkedinLink) {
    addSafeEventListener(linkedinLink, 'click', () => {
      showToast('LinkedIn profile in progress. Stay tuned!');
    });
  }

  // 8. Discord username copy with toast instead of alert
  const discordLink = document.getElementById('discord-link');
  if (discordLink) {
    addSafeEventListener(discordLink, 'click', () => {
      const username = discordLink.getAttribute('data-clipboard-text');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(username)
          .then(() => showToast(`Discord username "${username}" copied to clipboard!`))
          .catch(() => showToast(`Failed to copy. Please copy manually: ${username}`));
      } else {
        showToast(`Please copy manually: ${username}`);
      }
    });
  }

  // 9. Contact button popup replaced with disabled button (no click handler needed)

  // Simple toast function for demo purposes
  function showToast(message) {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#178aff';
    toast.style.color = '#fff';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    toast.style.zIndex = 3000;
    toast.style.fontSize = '1rem';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
});
