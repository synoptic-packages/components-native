# Example app Maestro suite

On-device sweep for the `QA/Gallery` Storybook story, which renders one
marker per component family (including the 8 harvested field types and
`FieldImage`). No screenshots are kept — pass/fail plus maestro output is
the record.

## Run

1. Build + install the dev client once: `npx expo run:ios` (from `example/`).
2. `bash .maestro/run.sh`

`run.sh` rebuilds the library, packs it, installs the tarball into the
example app (mirroring the release candidate exactly — no Metro aliases, no
source mounts), starts Metro pinned at `qa-gallery--default`, waits for the
bundle, then runs `flows/` in order with up to 3 attempts per flow.

## Layout

- `flows/01-controls.yaml` … `flows/09-money.yaml` — one flow per story
  section. Each flow relaunches the app without stopping it (scroll position
  is preserved) and asserts its section markers.
- Only `01` cold-starts the app (`stopApp: true`); the rest continue the
  same session.

## Scroll-notes (hard-won, sim iPhone 16)

- iOS hides off-screen elements from the accessibility tree, so every
  below-fold marker needs a scroll hop first.
- The story root is our own `ScrollView` (the Storybook preview does not
  scroll). Fast 400ms swipes do not move it — hops use slow
  `scrollUntilVisible` (`speed: 5`).
- Maestro's in-hop visibility polls go stale on this long story: the
  viewport demonstrably reaches an anchor while the gate still times out.
  Hops therefore carry `optional: true` (movement only); the following
  `assertVisible`/`extendedWaitUntil` use fresh snapshots and do the real
  verification. A genuinely missing marker still fails its assert.
- Text matching is exact: assert the full marker string (e.g. the money
  label is `Gallery money v2`, not `Gallery money`).
