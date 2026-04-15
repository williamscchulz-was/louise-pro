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

  const options = {
    body: body,
    icon:  '/louise-pro/assets/icons/icon-192.png',
    badge: '/louise-pro/assets/icons/icon-192.png',
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
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // If app already open, focus it
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.indexOf('/louise-pro/') !== -1 && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow('/louise-pro/');
      }
    })
  );
});
