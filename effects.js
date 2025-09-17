document.addEventListener('DOMContentLoaded', () => {
  // 1. Fade-in main content
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
    const texts = ["Jaineel", "LostAstr0"];
    const longestText = texts.reduce((a, b) => a.length >= b.length ? a : b);
    placeholder.textContent = longestText;

    let currentIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const delayAfterTyping = 1400;
    const delayAfterErasing = 600;

    function type() {
      if (charIndex < texts[currentIndex].length) {
        animatedTitle.textContent += texts[currentIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        setTimeout(erase, delayAfterTyping);
      }
    }

    function erase() {
      if (charIndex > 0) {
        animatedTitle.textContent = texts[currentIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
      } else {
        currentIndex = (currentIndex + 1) % texts.length;
        setTimeout(type, delayAfterErasing);
      }
    }

    type();
  }

  // 4. Shooting stars canvas animation
  (function() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class ShootingStar {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
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
        if (this.opacity <= 0 || this.x > width || this.y > height) {
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

    const shootingStars = [];
    const maxStars = 3;
    for(let i = 0; i < maxStars; i++ ) shootingStars.push(new ShootingStar());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      shootingStars.forEach(star => { star.update(); star.draw(ctx); });
      requestAnimationFrame(animate);
    }
    animate();
  })();

  // 5. tsParticles initialization if available
  if(window.tsParticles){
    tsParticles.load("tsparticles", {
      background: { color: "#000" },
      fpsLimit: 60,
      interactivity: { events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        color: { value: ["#178aff", "#7f74ff", "#21d0ff", "#bae1ff"] },
        shape: { type: "circle" },
        opacity: { value: 1, random: true, anim: { enable: true, speed: 1.5, opacity_min: 0.3, sync: false } },
        size: { value: { min: 1, max: 3 }, random: true, anim: { enable: false } },
        move: { enable: true, speed: 0.3, direction: "none", random: false, straight: false, outModes: "out" }
      },
      detectRetina: true,
    });
  }

  // 6. Cake Easter egg popup
  const secretCake = document.getElementById('secret-cake');
  const cakeEgg = document.getElementById('cake-easter-egg');
  if(secretCake && cakeEgg){
    secretCake.addEventListener('click', () => {
      cakeEgg.style.display = 'block';
      cakeEgg.classList.remove('fade-out');
      setTimeout(() => {
        cakeEgg.classList.add('fade-out');
        setTimeout(() => { cakeEgg.style.display = 'none'; }, 500);
      }, 4000);
    });
  }

  // 7. LinkedIn alert
  const linkedinLink = document.getElementById('linkedin-link');
  if(linkedinLink){
    linkedinLink.addEventListener('click', () => alert('LinkedIn profile in progress. Stay tuned!'));
  }

  // 8. Discord username copy alert
  const discordLink = document.getElementById('discord-link');
  if(discordLink){
    discordLink.addEventListener('click', () => {
      const username = discordLink.getAttribute('data-clipboard-text');
      if(navigator.clipboard){
        navigator.clipboard.writeText(username).then(() => {
          alert(`Discord username "${username}" copied to clipboard!`);
        }).catch(() => {
          alert(`Failed to copy. Please copy manually: ${username}`);
        });
      } else {
        alert(`Please copy manually: ${username}`);
      }
    });
  }

  // 9. Contact button popup
  const contactBtn = document.getElementById('contact-button');
  if(contactBtn){
    contactBtn.addEventListener('click', () => {
      alert("Nice try! 😄\n\nThis feature will come later.");
    });
  }
});
