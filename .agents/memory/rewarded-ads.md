---
name: Rewarded ads
description: Durable guidance for implementing rewarded ads in the HTML5 game.
---

Use Google's Ad Placement API for opt-in game rewards. A reward must be granted only from `adViewed`, while `adDismissed` must not grant it; `beforeReward` is the point where the game exposes its own reward prompt and receives `showAdFn`.

**Why:** A normal AdSense `data-ad-slot` identifies a standard ad unit but does not reliably signal that a player completed a rewarded ad.

**How to apply:** Keep the AdSense client script in the page, configure the API with `adConfig`, and pause/mute the game in `beforeAd` until `afterAd`. Do not simulate completion with a timer.