/* ============================================================
   GUD SPACE GYM — Service Worker
   PWA caching for offline support & fast loads
   ============================================================ */

const CACHE_NAME = 'gudspace-v1';

// Core files to cache on install
const PRECACHE_URLS = [
  '/gudspace-gym-frontend/',
  '/gudspace-gym-frontend/index.html',
  '/gudspace-gym-frontend/login.html',
  '/gudspace-gym-frontend/register.html',
  '/gudspace-gym-frontend/dashboard.html',
  '/gudspace-gym-frontend/workout.html',
  '/gudspace-gym-frontend/nutrition.html',
  '/gudspace-gym-frontend/attendance.html',
  '/gudspace-gym-frontend/progress.html',
  '/gudspace-gym-frontend/profile.html',
  '/gudspace-gym-frontend/musclemap.html',
  '/gudspace-gym-frontend/onboarding.html',
  '/gudspace-gym-frontend/style.css',
  '/gudspace-gym-frontend/kots.css',
  '/gudspace-gym-frontend/script.js',
  '/gudspace-gym-frontend/api.js',
  '/gudspace-gym-frontend/kots.js',
  '/gudspace-gym-frontend/manifest.json',
  '/gudspace-gym-frontend/icons/icon-192x192.png',
  '/gudspace-gym-frontend/icons/icon-512x512.png'
];

// Install — cache all core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET and API requests (always live)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('onrender.com')) return;
  if (event.request.url.includes('api.anthropic.com')) return;
  if (event.request.url.includes('api.groq.com')) return;
  if (event.request.url.includes('res.cloudinary.com')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache fresh responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
