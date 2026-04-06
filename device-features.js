/* ─────────────────────────────────────────────────────────────────
 * Louise Pro · device-features.js
 * ─────────────────────────────────────────────────────────────────
 * Two helpers for accessory device APIs:
 *   - window.Haptic       → tactile feedback (vibration)
 *   - window.PushNotifs   → push notification setup (no dispatch)
 *
 * Both are designed to fail silently when not supported,
 * so the app keeps working on older iOS / unsupported browsers.
 * ───────────────────────────────────────────────────────────────── */

(function () {
  // ═══════════════════════════════════════════════════════════════
  // HAPTIC FEEDBACK
  // ═══════════════════════════════════════════════════════════════
  //
  // Uses navigator.vibrate() — supported on most platforms but with
  // varying intensity. iOS Safari supports it from iOS 18+ (Sep 2024).
  // On older iOS or unsupported browsers, calls become no-ops.
  //
  // Patterns:
  //   light    →  10ms  (micro feedback, side switch, toggle)
  //   medium   →  30ms  (event registered, button press)
  //   heavy    →  60ms  (timer start/stop, important action)
  //   success  →  [20, 40, 20]  (double pulse, goal reached)
  //   warning  →  [30, 50, 30, 50, 30]  (triple pulse, alert)
  // ═══════════════════════════════════════════════════════════════

  var hapticEnabled = true; // synced from profile.hapticEnabled by app

  function hapticIsSupported() {
    return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
  }

  function hapticVibrate(pattern) {
    if (!hapticEnabled) return false;
    if (!hapticIsSupported()) return false;
    try {
      navigator.vibrate(pattern);
      return true;
    } catch (e) {
      // iOS may throw if called outside user gesture context — fail silent
      return false;
    }
  }

  window.Haptic = {
    isSupported: hapticIsSupported,
    light: function () { return hapticVibrate(10); },
    medium: function () { return hapticVibrate(30); },
    heavy: function () { return hapticVibrate(60); },
    success: function () { return hapticVibrate([20, 40, 20]); },
    warning: function () { return hapticVibrate([30, 50, 30, 50, 30]); },
    // Sync enabled state from profile
    setEnabled: function (enabled) {
      hapticEnabled = enabled !== false;
    },
    isEnabled: function () {
      return hapticEnabled;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // PUSH NOTIFICATIONS (setup only — no dispatch)
  // ═══════════════════════════════════════════════════════════════
  //
  // Prepares the app to receive push notifications via Firebase Cloud
  // Messaging (FCM). Does NOT send any notifications — that requires
  // a server-side trigger (Cloud Function, manual console, etc).
  //
  // Requirements for iOS:
  //   - iOS 16.4 or higher
  //   - App installed as PWA on home screen (not Safari tab)
  //   - Permission requested via user gesture (button click)
  //   - Service Worker registered at /louise-pro/sw.js
  //
  // Flow:
  //   1. App calls PushNotifs.isSupported() to check viability
  //   2. User taps "Enable notifications" → triggers requestPermission()
  //   3. If granted, getToken() returns FCM token
  //   4. saveToken(token) persists it in Firestore for later use
  //
  // The actual dispatch (when/what to notify) is intentionally not
  // implemented yet — that's a future decision.
  // ═══════════════════════════════════════════════════════════════

  function pushIsSupported() {
    if (typeof window === "undefined") return false;
    // PWA install check: standalone display mode
    var isStandalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    var isIOSPWA = window.navigator && window.navigator.standalone === true;
    var hasNotification = "Notification" in window;
    var hasServiceWorker = "serviceWorker" in navigator;
    var hasPushManager = "PushManager" in window;
    // Must have all three APIs available
    if (!hasNotification || !hasServiceWorker || !hasPushManager) return false;
    // On iOS specifically, push only works when installed as PWA
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isStandalone && !isIOSPWA) return false;
    return true;
  }

  function pushPermissionStatus() {
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission; // 'default', 'granted', 'denied'
  }

  function pushRequestPermission() {
    return new Promise(function (resolve) {
      if (!pushIsSupported()) {
        resolve(false);
        return;
      }
      if (Notification.permission === "granted") {
        resolve(true);
        return;
      }
      if (Notification.permission === "denied") {
        resolve(false);
        return;
      }
      // Request permission (must be triggered by user gesture on iOS)
      try {
        Notification.requestPermission().then(function (result) {
          resolve(result === "granted");
        }).catch(function () {
          resolve(false);
        });
      } catch (e) {
        // Older browsers used callback-style
        try {
          Notification.requestPermission(function (result) {
            resolve(result === "granted");
          });
        } catch (e2) {
          resolve(false);
        }
      }
    });
  }

  // Register Service Worker for push (if not already registered)
  // The SW file must exist at the app's root path
  function pushRegisterServiceWorker() {
    return new Promise(function (resolve, reject) {
      if (!("serviceWorker" in navigator)) {
        reject(new Error("Service Worker not supported"));
        return;
      }
      // Use relative path so it works regardless of GitHub Pages base
      navigator.serviceWorker.register("./sw.js").then(function (registration) {
        resolve(registration);
      }).catch(function (err) {
        console.warn("[PushNotifs] SW registration failed:", err);
        reject(err);
      });
    });
  }

  // Get FCM token (requires Firebase Messaging SDK to be loaded separately)
  // Returns null if FCM is not initialized — that's OK for now since we're
  // just preparing the infrastructure.
  function pushGetToken() {
    return new Promise(function (resolve) {
      // Firebase Messaging is optional — if not loaded, return null gracefully
      if (typeof firebase === "undefined" || !firebase.messaging) {
        console.info("[PushNotifs] Firebase Messaging not loaded — token unavailable");
        resolve(null);
        return;
      }
      try {
        var messaging = firebase.messaging();
        // VAPID key would be needed here for production push
        // For now we just return null — token retrieval requires VAPID config
        messaging.getToken().then(function (token) {
          resolve(token || null);
        }).catch(function (err) {
          console.warn("[PushNotifs] getToken failed:", err);
          resolve(null);
        });
      } catch (e) {
        resolve(null);
      }
    });
  }

  // Save FCM token to Firestore under config/pushTokens
  // The app must inject a saver function (since FB module is in index.html)
  var tokenSaver = null;
  function pushSaveToken(token) {
    if (!tokenSaver || !token) return Promise.resolve(false);
    return tokenSaver(token).then(function () { return true; }).catch(function () { return false; });
  }

  // Master "is everything ready" check
  function pushIsReady() {
    return pushIsSupported() && pushPermissionStatus() === "granted";
  }

  window.PushNotifs = {
    isSupported: pushIsSupported,
    permissionStatus: pushPermissionStatus,
    requestPermission: pushRequestPermission,
    registerServiceWorker: pushRegisterServiceWorker,
    getToken: pushGetToken,
    saveToken: pushSaveToken,
    isReady: pushIsReady,
    // App injects this so device-features.js doesn't need to know about Firestore
    setTokenSaver: function (fn) {
      tokenSaver = fn;
    }
  };
})();
