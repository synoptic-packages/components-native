#!/usr/bin/env bash
# On-device gallery sweep for the component library.
#
# The library ships to devices as a tarball install that mirrors the release
# candidate exactly (see below) — no Metro aliases, no source mounts.
#
# Usage (from example/):
#   1. Build + install the dev client once: npx expo run:ios
#   2. bash .maestro/run.sh
#
# The script rebuilds the library, packs it, installs the tarball, starts
# Metro pinned at the gallery story, runs the sweep, and reports. Metro is
# left running; the dev client stays installed.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="$(cd "$here/../.." && pwd)"
example="$here/.."
cp "$example/package.json" /tmp/opencode-images/ex-package.json.bak
cp "$example/yarn.lock" /tmp/opencode-images/ex-yarn.lock.bak
cleanup() {
	cp /tmp/opencode-images/ex-package.json.bak "$example/package.json"
	cp /tmp/opencode-images/ex-yarn.lock.bak "$example/yarn.lock"
}
trap cleanup EXIT

echo "== build library =="
yarn --cwd "$root" build
echo "== pack + install release candidate =="
tarball="/tmp/opencode-images/synotech-components-native.tgz"
rm -f "$tarball"
yarn --cwd "$root" pack --filename "$tarball" >/dev/null
yarn --cwd "$example" add "file:$tarball"
echo "== start Metro (gallery pinned, local bundle) =="
tmux kill-session -t sb-maestro 2>/dev/null || true
tmux new-session -d -s sb-maestro -x 200 -y 50 "sh -c 'EXPO_PUBLIC_STORYBOOK_ENABLED=true EXPO_PUBLIC_SB_STORY=qa-gallery--default npx expo start --port 8081 --lan'"
echo "== wait for Metro =="
for i in $(seq 1 24); do
	curl -s -o /dev/null --max-time 5 http://127.0.0.1:8081/status 2>/dev/null && break
	sleep 5
done
echo "== point dev client at Metro =="
UDID="$(xcrun simctl list devices | grep -i booted | head -1 | sed -E 's/.*\(([0-9A-F-]+)\).*/\1/')"
LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo 192.168.0.100)"
xcrun simctl openurl "$UDID" "synotech-components-native://expo-development-client/?url=http%3A%2F%2F${LAN_IP}%3A8081" >/dev/null
echo "== wait for bundle load =="
for i in $(seq 1 40); do
	if maestro hierarchy 2>/dev/null | grep -q "Gallery controls"; then
		echo "gallery on screen after ~$((i * 15))s"
		break
	fi
	sleep 15
done
echo "== sweep (one flow per section, fresh driver session each) =="
pass=0
fail=0
for flow in "$here"/flows/*.yaml; do
	name="$(basename "$flow")"
	attempt=0
	until [ "$attempt" -ge 3 ]; do
		attempt=$((attempt + 1))
		if maestro test "$flow" >/tmp/opencode-images/maestro-"$name".log 2>&1; then
			echo "PASS $name (attempt $attempt)"
			pass=$((pass + 1))
			break
		elif [ "$attempt" -ge 3 ]; then
			echo "FAIL $name (after 3 attempts; see /tmp/opencode-images/maestro-$name.log)"
			fail=$((fail + 1))
		else
			echo "retry $name (attempt $attempt failed, scrolling further)"
		fi
	done
done
echo "== result: $pass passed, $fail failed =="
[ "$fail" -eq 0 ]
