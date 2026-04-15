/* ─────────────────────────────────────────────────────────────────
 * Louise Pro · sw.js (Service Worker)
 * ─────────────────────────────────────────────────────────────────
 * Does two things:
 *   1. Caches static assets (HTML, JS, CDN scripts, fonts, icons) so
 *      2nd+ cold starts are near-instant, especially in installed PWA.
 *   2. Receives FCM push notifications and handles clicks.
 *
 * Caching strategy:
 *   - Precache on install: critical-path scripts (React, Firebase, app JS)
 *     + index.html + icons + Outfit font CSS.
 *   - Stale-while-revalidate on fetch: return cached immediately, update
 *     cache in background. Safe because the Action rebuilds and purges
 *     old caches on every deploy via the version bump below.
 *   - Bypass Firestore / FCM API calls: they must always hit the network.
 *
 * CACHE_VERSION is replaced at build time by build/build.mjs with the
 * app's APP_VERSION. A new value triggers a full cache purge on activate.
 * ───────────────────────────────────────────────────────────────── */

const CACHE_VERSION = "__APP_VERSION__";
const CACHE_NAME = "louise-pro-" + CACHE_VERSION;

// Same-origin paths. Keep relative so this works on both localhost and
// GitHub Pages (/louise-pro/) without knowing the base.
const PRECACHE_LOCAL = [
  "./",
  "./manifest.json",
  "./js/splash-icon.js",
  "./js/who-growth.js",
  "./js/curiosities.js",
  "./js/wake-lock.js",
  "./js/device-features.js",
  "./js/routine-engine.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
];

// Third-party CDN scripts. Cached so we don't hit unpkg/gstatic on every
// cold start. CORS is permissive on these, but we request as no-cors to
// be safe — browser still serves the opaque response back to <script>.
const PRECACHE_CDN = [
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js",
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js",
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap",
];

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // addAll is atomic — a single failure aborts the whole precache.
      // We'd rather install with partial cache than fail entirely, so
      // add each URL individually and swallow failures.
      var localAdds = PRECACHE_LOCAL.map(function (url) {
        return cache.add(url).catch(function (err) {
          console.warn("[sw] local precache skip:", url, err && err.message);
        });
      });
      var cdnAdds = PRECACHE_CDN.map(function (url) {
        // no-cors allows caching opaque responses for cross-origin scripts.
        return cache.add(new Request(url, { mode: "no-cors" })).catch(function (err) {
          console.warn("[sw] cdn precache skip:", url, err && err.message);
        });
      });
      return Promise.all(localAdds.concat(cdnAdds));
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (name) {
        if (name.indexOf("louise-pro-") === 0 && name !== CACHE_NAME) {
          return caches.delete(name);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Requests we NEVER intercept. These are dynamic APIs that must hit the
// network every time (Firestore real-time listeners, FCM registration,
// analytics). Returning from cache would break the app.
function shouldBypass(url) {
  return (
    url.indexOf("firestore.googleapis.com") !== -1 ||
    url.indexOf("firebaseinstallations.googleapis.com") !== -1 ||
    url.indexOf("fcmregistrations.googleapis.com") !== -1 ||
    url.indexOf("fcm.googleapis.com") !== -1 ||
    url.indexOf("google-analytics.com") !== -1 ||
    url.indexOf("googletagmanager.com") !== -1 ||
    url.indexOf("identitytoolkit.googleapis.com") !== -1 ||
    url.indexOf("securetoken.googleapis.com") !== -1 ||
    url.indexOf("chrome-extension:") === 0 ||
    url.indexOf("data:") === 0
  );
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  if (shouldBypass(req.url)) return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      // Fetch in the background (whether or not we have a cache hit).
      // If successful, refresh the cache entry. If offline, fall back to
      // the cached response if there is one.
      var fetchAndUpdate = fetch(req).then(function (resp) {
        if (resp && (resp.status === 200 || resp.type === "opaque")) {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, clone).catch(function () { /* quota, ignore */ });
          });
        }
        return resp;
      }).catch(function () {
        // Offline and no cache for this URL — let the browser surface
        // the network error rather than hanging.
        return cached || Response.error();
      });
      return cached || fetchAndUpdate;
    }).catch(function () {
      // Cache API itself failed (extremely rare). Fall back to network.
      return fetch(req);
    })
  );
});

// ─── PUSH NOTIFICATIONS (unchanged from previous version) ───

self.addEventListener("push", function (event) {
  if (!event.data) return;

  var payload;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: "Louise Pro", body: event.data.text() };
  }

  var notification = payload.notification || payload;
  var title = notification.title || "Louise Pro";
  var options = {
    body: notification.body || "",
    icon: notification.icon || "./assets/icons/icon-192.png",
    badge: notification.badge || "./assets/icons/icon-192.png",
    tag: notification.tag || "louise-pro",
    data: notification.data || {},
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("./");
      }
    })
  );
});
