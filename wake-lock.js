// ╔══════════════════════════════════════════════════════╗
// ║  LOUISE PRO · WAKE LOCK HELPER                       ║
// ║                                                      ║
// ║  Keeps the screen awake during specific timer states ║
// ║  (night wake, nursing) so the user doesn't need to   ║
// ║  tap the screen with hands occupied (holding baby,   ║
// ║  feeding, changing diapers).                         ║
// ║                                                      ║
// ║  Uses the standard Wake Lock API:                    ║
// ║    https://developer.mozilla.org/en-US/docs/Web/     ║
// ║    API/Screen_Wake_Lock_API                          ║
// ║                                                      ║
// ║  Browser support:                                    ║
// ║    iOS Safari: 16.4+                                 ║
// ║    Chrome: 84+                                       ║
// ║    Firefox: 126+                                     ║
// ║    Edge: 84+                                         ║
// ║                                                      ║
// ║  Behavior:                                           ║
// ║    - Silently no-ops on unsupported browsers         ║
// ║    - Auto-releases when user leaves the page         ║
// ║    - Re-acquires on visibilitychange when returning  ║
// ║      (must be called by the host app)                ║
// ║    - Logs failures to console but never throws       ║
// ║                                                      ║
// ║  Exposes: window.WakeLock                            ║
// ╚══════════════════════════════════════════════════════╝

(function() {
  const WakeLock = {
    // The active WakeLockSentinel from the browser API, or null
    sentinel: null,

    // True when we currently hold an active screen lock
    active: false,

    // True if the browser supports the Wake Lock API at all
    isSupported() {
      return typeof navigator !== "undefined" && "wakeLock" in navigator;
    },

    // Request a screen wake lock. Returns true on success, false on failure.
    // Safe to call repeatedly — if already active, returns true immediately.
    // Never throws — failures are caught and logged.
    async request() {
      if (this.sentinel) return true;
      if (!this.isSupported()) return false;
      try {
        this.sentinel = await navigator.wakeLock.request("screen");
        this.active = true;
        // The browser may release the lock automatically (tab hidden, low battery, etc).
        // Listen for that so we can update our internal state.
        this.sentinel.addEventListener("release", () => {
          this.sentinel = null;
          this.active = false;
          console.log("[LP] WakeLock: released by browser");
        });
        console.log("[LP] WakeLock: acquired");
        return true;
      } catch (e) {
        // Common reasons: page not visible, no user interaction yet,
        // power save mode, permission denied
        console.log("[LP] WakeLock request failed:", e.message);
        this.sentinel = null;
        this.active = false;
        return false;
      }
    },

    // Release the wake lock. Safe to call when no lock is held.
    // Never throws.
    async release() {
      if (!this.sentinel) return;
      try {
        await this.sentinel.release();
        console.log("[LP] WakeLock: released manually");
      } catch (e) {
        console.log("[LP] WakeLock release failed:", e.message);
      } finally {
        this.sentinel = null;
        this.active = false;
      }
    },

    // Convenience: request or release based on a boolean.
    // Useful for `useEffect` hooks that watch a derived state.
    async sync(shouldBeActive) {
      if (shouldBeActive) {
        return await this.request();
      } else {
        await this.release();
        return false;
      }
    },
  };

  // Auto re-acquire when the page becomes visible again.
  // The browser auto-releases on tab hide; this restores the lock
  // when the user comes back to the tab IF the host app still wants it.
  // The host app must call `WakeLock.request()` again from its own
  // visibility handler since we don't track "intent" here.

  if (typeof window !== "undefined") {
    window.WakeLock = WakeLock;
  }
})();
