#!/bin/bash
# Marquee Socials - Social Media Management App
# Uses the omarchy-social browser profile for all logins

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
# Use the SAME profile as omarchy-social so all logins are preserved
PROFILE_DIR="$HOME/omarchy-social/browser-profile"

mkdir -p "$HOME/.local/share/marquee-socials"

# Copy icons if they don't exist
if [ ! -f "$HOME/.local/share/marquee-socials/icon-256.png" ]; then
    cp "$APP_DIR"/icon-*.png "$HOME/.local/share/marquee-socials/" 2>/dev/null
fi

# Start Chromium in app mode with the omarchy-social profile
exec chromium \
    --app="file://$APP_DIR/index.html" \
    --user-data-dir="$PROFILE_DIR" \
    --class=marquee-socials \
    --window-size=1500,900 \
    --remote-debugging-port=9555 \
    --remote-debugging-address=127.0.0.1 \
    --no-first-run \
    --no-default-browser-check \
    "$@"
