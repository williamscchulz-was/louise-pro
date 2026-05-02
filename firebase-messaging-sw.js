/* ─────────────────────────────────────────────────────────────────
 * Louise Pro · firebase-messaging-sw.js
 * ─────────────────────────────────────────────────────────────────
 * Service Worker dedicated to Firebase Cloud Messaging (FCM).
 *
 * This is SEPARATE from the main app Service Worker (sw.js).
 * Reason: Firebase Messaging requires its own SW at a known path
 * to handle background push messages. They cannot share the same SW.
 *
 * Both SWs coexist peacefully — sw.js handles app caching/install,
 * this one handles push notifications when the app is closed.
 *
 * Triggered when:
 *   - The app is in background or fully closed
 *   - A push arrives via FCM
 *
 * What it does:
 *   - Receives the payload from FCM
 *   - Calls self.registration.showNotification() to display it
 *
 * When the app is OPEN, FCM messages are handled in-app via
 * messaging.onMessage() instead — not by this SW.
 * ───────────────────────────────────────────────────────────────── */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Same Firebase config as the main app
firebase.initializeApp({
  apiKey:            "AIzaSyBPiWTlC0ZKLEX5Z8PqKM2c3zaXN8p7DH8",
  authDomain:        "louise-pro.firebaseapp.com",
  projectId:         "louise-pro",
  storageBucket:     "louise-pro.firebasestorage.app",
  messagingSenderId: "670065554630",
  appId:             "1:670065554630:web:e8bdf489a3db28b8fe53c7"
});

const messaging = firebase.messaging();

// Handle background push messages (app closed or in background)
messaging.onBackgroundMessage(function (payload) {
  const title = (payload && payload.notification && payload.notification.title) || "Louise Pro";
  const body  = (payload && payload.notification && payload.notification.body)  || "Lembrete";

  // v11.9.2: paths relativos ao scope do SW (registration.scope) em vez de
  // hardcode /louise-pro/. Funciona em GH Pages (subpath) E em domínio próprio.
  const scope = self.registration && self.registration.scope ? self.registration.scope : self.location.origin + '/';
  const iconUrl = scope + 'assets/icons/icon-192.png';
  const options = {
    body: body,
    icon:  iconUrl,
    badge: iconUrl,
    tag:   'louise-pro-reminder',
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300],
    data: payload.data || {}
  };

  return self.registration.showNotification(title, options);
});

// When user taps the notification, open or focus the app
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  // v11.9.2: usa scope do SW pra match + abrir, em vez de '/louise-pro/' hardcoded.
  const scope = self.registration && self.registration.scope ? self.registration.scope : self.location.origin + '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // If app already open under our scope, focus it
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.indexOf(scope) === 0 && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(scope);
      }
    })
  );
});
