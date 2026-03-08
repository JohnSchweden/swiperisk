---
status: fixed
trigger: "expected: Speech-to-text works on mobile; actual: getUserMedia error"
created: 2025-03-07T00:00:00.000Z
updated: 2025-03-07T00:00:00.000Z
---

## Current Focus

hypothesis: navigator.mediaDevices is undefined on mobile in non-secure or unsupported contexts
test: Error "undefined is not an object (evaluating 'navigator.mediaDevices.getUserMedia')"
expecting: Root cause = missing mediaDevices API (HTTP, WebView, or old browser)
next_action: Completed — guard added

## Symptoms

expected: Speech-to-text transcription works when user taps microphone button on mobile
actual: Error displayed: "undefined is not an object (evaluating 'navigator.mediaDevices.getUserMedia')"
errors: navigator.mediaDevices is undefined — getUserMedia throws before being called
reproduction: Open app on mobile device, tap microphone button to start speech input
timeline: User reported; ever worked unknown

## Eliminated

## Evidence

- timestamp: 2025-03-07
  checked: hooks/useLiveAPISpeechRecognition.ts line 75
  found: startMicCapture() calls navigator.mediaDevices.getUserMedia with no guard
  implication: Throws when mediaDevices is undefined

- timestamp: 2025-03-07
  checked: MDN / browser behavior
  found: navigator.mediaDevices is undefined when (1) not in secure context (HTTP vs HTTPS), (2) some WebViews/embedded browsers, (3) older mobile browsers
  implication: Common on mobile especially over HTTP

- timestamp: 2025-03-07
  checked: .planning/debug/haptic-not-on-mobile.md
  found: Similar pattern — mobile-specific APIs blocked without guards (vibrate requires user gesture)
  implication: Project has precedent for mobile API guards

## Resolution

root_cause: startMicCapture() assumes navigator.mediaDevices exists. On mobile over HTTP, in WebViews, or on older browsers, mediaDevices is undefined and calling getUserMedia throws.
fix: Added guard at start of startMicCapture: if (typeof navigator?.mediaDevices?.getUserMedia !== "function") throw a clear error. Error message: "Microphone access is not available. Use HTTPS and a modern browser."
verification: Run app over HTTPS on supported mobile browser; mic button should work. On HTTP or unsupported context, user sees clear error instead of cryptic crash.
files_changed:
  - hooks/useLiveAPISpeechRecognition.ts
