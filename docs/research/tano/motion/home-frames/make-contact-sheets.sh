#!/usr/bin/env bash
# Regenerate the ten 4-column contact sheets from the captured PNG frames.
# Requires ImageMagick `montage` and DejaVuSans.ttf.
set -euo pipefail
cd "$(dirname "$0")"

FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
geometry='380x218+6+14'

sheet() {
  local out=$1; shift
  montage -font "$FONT" -pointsize 12 -fill '#fbf9f5' -background '#141210' \
    -label '%f' "$@" -tile 4x -geometry "$geometry" "$out"
}

# Time scenes in target order.
for scene in hp-camp-time counters conversations experiments logo-marquee closing-cards; do
  mapfile -t files < <(find "$scene" -maxdepth 1 -name '*.png' ! -name 'contact-sheet.png' | sort)
  sheet "$scene/contact-sheet.png" "${files[@]}"
done

# Announcement: load -> entry -> dismiss.
mapfile -t files < <(for p in load-* entry-* dismiss-*; do printf 'announcement/%s\n' "$p"; done)
sheet announcement/contact-sheet.png "${files[@]}"

# Hero scroll: numeric order, then the exact release and inview-off probes.
mapfile -t files < <(for y in $(seq 0 50 1600); do printf 'hp-camp-scroll/scroll-%04d.png\n' "$y"; done
  printf 'hp-camp-scroll/scroll-release-1121.png\n'
  printf 'hp-camp-scroll/scroll-inviewoff-1350.png\n')
sheet hp-camp-scroll/contact-sheet.png "${files[@]}"

# Case deck: nine time frames then eight scroll probes.
mapfile -t files < <(for t in 0000 0250 0500 0750 1000 1500 2000 3000 5000; do printf 'case-stack/t-%s.png\n' "$t"; done
  for y in 4800 4950 5100 5250 5400 5550 5700 5850; do printf 'case-stack/scroll-%s.png\n' "$y"; done)
sheet case-stack/contact-sheet.png "${files[@]}"

# Hover: before + 0/120/240/400 for each target.
mapfile -t files < <(for p in \
  nav-getstarted-before nav-getstarted-0000 nav-getstarted-0120 nav-getstarted-0240 nav-getstarted-0400 \
  section-getstarted-before section-getstarted-0000 section-getstarted-0120 section-getstarted-0240 section-getstarted-0400 \
  stage-card-send-before stage-card-send-0000 stage-card-send-0120 stage-card-send-0240 stage-card-send-0400 \
  stage-card-library-0400; do printf 'hover/%s.png\n' "$p"; done)
sheet hover/contact-sheet.png "${files[@]}"
