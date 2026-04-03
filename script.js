/* ============================================================
   GUD SPACE GYM — script.js
   Landing page interactions & shared utilities
   ============================================================ */

'use strict';

/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = -999, mouseY = -999;
  let followerX = -999, followerY = -999;
  let hasMovedOnce = false;

  // Hide both until the mouse actually moves on this page
  cursor.style.opacity = '0';
  follower.style.opacity = '0';

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';

    if (!hasMovedOnce) {
      hasMovedOnce = true;
      followerX = mouseX;
      followerY = mouseY;
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    }
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Grow on interactive elements — exclude sidebar nav links and small UI buttons
  document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
    if (el.classList.contains('sb-nav-link') || el.classList.contains('sb-logout-btn') ||
        el.classList.contains('water-btn') || el.classList.contains('wday-tab')) return;
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
})();

/* ===== NAVBAR SCROLL ===== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ===== HAMBURGER MENU ===== */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });
})();

/* ===== SCROLL ANIMATIONS ===== */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));

  // Trigger hero elements immediately
  setTimeout(() => {
    document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
    });
  }, 100);
})();

/* ===== LIVE CLOCK IN HERO ===== */
(function initHeroClock() {
  const el = document.getElementById('heroTime');
  if (!el) return;

  function update() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    el.textContent = `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }
  update();
  setInterval(update, 1000);
})();

/* ===== TOAST UTILITY ===== */
window.GudSpace = window.GudSpace || {};

window.GudSpace.showToast = function(message, icon = '✅', duration = 4000) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.closest('.toast').remove()">✕</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
};

/* ===== LOCAL STORAGE HELPERS ===== */
window.GudSpace.storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem('gudspace_' + key)); }
    catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem('gudspace_' + key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove: (key) => {
    try { localStorage.removeItem('gudspace_' + key); return true; }
    catch { return false; }
  }
};

/* ===== AUTH GUARD (redirect if not logged in) ===== */
window.GudSpace.requireAuth = function() {
  const user = window.GudSpace.storage.get('currentUser');
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
};

/* ===== AUTH CHECK (redirect if already logged in) ===== */
window.GudSpace.redirectIfLoggedIn = function(dest) {
  const user = window.GudSpace.storage.get('currentUser');
  if (user) {
    window.location.href = dest || 'dashboard.html';
  }
};

/* ===== PASSWORD VALIDATOR ===== */
window.GudSpace.validatePassword = function(password) {
  return {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^A-Za-z0-9]/.test(password),
    score: (
      (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(password) ? 1 : 0)
    )
  };
};

/* ===== SCREENSHOT SAVE FEATURE ===== */
window.GudSpace.saveCredentials = function(email, password) {
  // Creates a canvas image of credentials for the user to save
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#101010';
  ctx.fillRect(0, 0, 600, 320);

  // Pink accent bar
  ctx.fillStyle = '#FF1A5E';
  ctx.fillRect(0, 0, 8, 320);

  // Logo
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px "Bebas Neue", Impact, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('GUD', 36, 60);
  ctx.fillStyle = '#FF1A5E';
  ctx.fillText('SPACE', 80, 60);
  ctx.fillStyle = '#666666';
  ctx.font = 'bold 20px "Bebas Neue", Impact, sans-serif';
  ctx.fillText('GYM', 168, 60);

  // Subtitle
  ctx.fillStyle = '#888888';
  ctx.font = '13px Arial, sans-serif';
  ctx.fillText('Account Credentials — Keep this safe!', 36, 90);

  // Divider
  ctx.fillStyle = '#222222';
  ctx.fillRect(36, 104, 528, 1);

  // Email
  ctx.fillStyle = '#FF1A5E';
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillText('EMAIL / USERNAME', 36, 130);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText(email, 36, 155);

  // Password
  ctx.fillStyle = '#FF1A5E';
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillText('PASSWORD', 36, 195);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText(password, 36, 220);

  // Footer
  ctx.fillStyle = '#444444';
  ctx.font = '11px Arial, sans-serif';
  ctx.fillText('Saved on ' + new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }), 36, 286);
  ctx.fillText('gudspacegym.com  |  Keep this private.', 36, 304);

  // Download
  const link = document.createElement('a');
  link.download = 'GudSpaceGym_Credentials.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/* ===== BMI CALCULATOR ===== */
window.GudSpace.calculateBMI = function(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let classification, color;
  if      (bmi < 18.5) { classification = 'Underweight';  color = '#74b9ff'; }
  else if (bmi < 25)   { classification = 'Normal';        color = '#48c78e'; }
  else if (bmi < 30)   { classification = 'Overweight';    color = '#fdcb6e'; }
  else                 { classification = 'Obese';          color = '#ff6b6b'; }

  return { bmi: rounded, classification, color };
};

/* ===== CALORIE & MACRO CALCULATOR ===== */
window.GudSpace.calculateNutrition = function({ gender, age, weightKg, heightCm, activityLevel = 1.375 }) {
  // Mifflin-St Jeor BMR
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  const tdee = Math.round(bmr * activityLevel);
  const protein = Math.round(weightKg * 1.8); // grams per kg
  const fat = Math.round(tdee * 0.25 / 9);
  const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);

  return { bmr: Math.round(bmr), tdee, protein, fat, carbs };
};

/* ===== LOGOUT ===== */
window.GudSpace.logout = function() {
  window.GudSpace.storage.remove('currentUser');
  window.GudSpace.storage.remove('loginTime');
  window.location.href = 'login.html';
};

/* ===== DATE UTILITIES ===== */
window.GudSpace.formatDate = function(date) {
  return new Date(date).toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

window.GudSpace.formatTime = function(date) {
  return new Date(date).toLocaleTimeString('en-PH', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};

window.GudSpace.getGreeting = function() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
};

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c GUD SPACE GYM ', 'background: #FF1A5E; color: white; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
  console.log('%c Portal v1.0 — Train Different ', 'color: #FF1A5E; font-size: 12px;');
});