/* ─────────────────────────────────────────────────────────────────
 * Louise Pro · sw.js (Service Worker)
 * ─────────────────────────────────────────────────────────────────
 * Minimal Service Worker that handles push notifications.
 * Does NOT implement caching strategy — that's a future decision.
 * The app continues to work normally without offline support.
 *
 * Responsibilities:
 *   - Register itself silently
 *   - Listen for incoming push events and display notifications
 *   - Handle notification clicks (open the app)
 *
 * No notifications are dispatched FROM here — this only RECEIVES them.
 * ───────────────────────────────────────────────────────────────── */

self.addEventListener("install", function (event) {
  // Activate immediately on first install
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// Receive push notification from FCM
self.addEventListener("push", function (event) {
  if (!event.data) return;

  var payload;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: "Louise Pro", body: event.data.text() };
  }

  // FCM payload may be nested in `notification` or top-level
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

// Handle click on notification — open or focus the app
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      // If there's already an open tab/PWA, focus it
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow("./");
      }
    })
  );
});
