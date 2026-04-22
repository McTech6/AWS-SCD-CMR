/**
 * posterTemplate.js
 *
 * Single source of truth for the poster's visual design.
 *
 * Styling: Tailwind CSS via CDN (play.tailwindcss.com build).
 * No hand-written CSS — everything is Tailwind utilities.
 *
 * Consumed by:
 *   1. Puppeteer (backend)  — screenshot at 1080×1080 → PNG
 *   2. IWillBeTherePage.tsx (frontend) — iframe scaled to 560px preview
 *
 * Design decisions:
 *   - Gradient background covers the ENTIRE 1080×1080 poster
 *   - The wavy divider is decorative only; it does NOT change the bg colour
 *   - The name tag uses font-normal (400) — no bold
 *   - All layout values are inline px styles because Tailwind's
 *     arbitrary-value JIT syntax ([value]) is not available in the
 *     CDN play build for absolute positioning — so we use
 *     style="top:Xpx; left:Xpx" alongside Tailwind for colour/type/spacing
 */

// ─── Wave path ──────────────────────────────────────────────────────────────
function buildWavePath(totalW, startY, segW = 44) {
  let d = `M 0 ${startY + 14}`;
  for (let x = 0; x <= totalW; x += segW) {
    d += ` Q ${x + segW * 0.25} ${startY} ${x + segW * 0.5} ${startY + 11}`;
    d += ` Q ${x + segW * 0.75} ${startY + 22} ${x + segW} ${startY + 14}`;
  }
  d += ` L ${totalW} ${totalW} L 0 ${totalW} Z`;
  return d;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function buildPosterHTML({ name, imageDataUri }) {
  const W = 1080;
  const H = 1080;

  // ── Layout constants (poster-px) ──────────────────────────────────────────
  const PAD = 52;
  const TOP = 52;

  const BADGE_D = 80; // diameter of AWS circle badge
  const BADGE_R = BADGE_D / 2;

  // Header bar occupies TOP → TOP + BADGE_D
  const HEADER_BOTTOM = TOP + BADGE_D;

  // Circular photo — right column, starts just below header
  const PHOTO_D = 470;
  const PHOTO_R = PHOTO_D / 2;
  const PHOTO_CX = W - PAD - PHOTO_R;
  const PHOTO_CY = HEADER_BOTTOM + 32 + PHOTO_R;

  // Wavy divider — 28px gap below photo bottom
  const WAVE_Y = PHOTO_CY + PHOTO_R + 28;

  // Lower section (sits on gradient, not white)
  const NAME_Y = WAVE_Y + 88; // centre of name text
  const DETAIL_Y = NAME_Y + 78;
  const CTA_Y = DETAIL_Y + 62;

  // Headline — left column, vertically centred with photo
  const HEAD_TOP = PHOTO_CY - PHOTO_R - 4;

  // ── SVG pieces ────────────────────────────────────────────────────────────
  const wavePath = buildWavePath(W, WAVE_Y, 44);

  const photoEl = imageDataUri
    ? `<image
         href="${imageDataUri}"
         x="${PHOTO_CX - PHOTO_R}" y="${PHOTO_CY - PHOTO_R}"
         width="${PHOTO_D}" height="${PHOTO_D}"
         clip-path="url(#photoClip)"
         preserveAspectRatio="xMidYMid slice" />`
    : `<circle cx="${PHOTO_CX}" cy="${PHOTO_CY}" r="${PHOTO_R}"
         fill="rgba(148,163,184,0.25)" clip-path="url(#photoClip)" />
       <text x="${PHOTO_CX}" y="${PHOTO_CY - 16}"
         text-anchor="middle" dominant-baseline="middle"
         fill="rgba(148,163,184,0.9)" font-size="34"
         font-family="Barlow Condensed, sans-serif" font-weight="400">
         YOUR PHOTO
       </text>
       <text x="${PHOTO_CX}" y="${PHOTO_CY + 22}"
         text-anchor="middle" dominant-baseline="middle"
         fill="rgba(148,163,184,0.9)" font-size="34"
         font-family="Barlow Condensed, sans-serif" font-weight="400">
         HERE
       </text>`;

  // Wave SVG — purely decorative amber squiggle on top of gradient.
  // fill="rgba(255,255,255,0.18)" gives a soft shimmer WITHOUT hiding the bg.
  const waveDecorPath = buildWavePath(W, WAVE_Y, 44);

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- Tailwind CSS CDN — full utility set available in the browser -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          condensed: ['"Barlow Condensed"', 'sans-serif'],
          sans:      ['"Barlow"',           'sans-serif'],
        },
      },
    },
  };
</script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />

<style>
  /* Hard-reset so Tailwind base styles don't fight our fixed dimensions */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${W}px;
    height: ${H}px;
    overflow: hidden;
    background: transparent;
  }
</style>
</head>

<body>
<!-- ═══════════════════════════════════════════════════════════════════
     POSTER  — 1080 × 1080 px
     Full amber-50→orange-50→yellow-50 gradient covers the entire card.
     The wave is a semi-transparent shimmer, NOT a colour change.
═══════════════════════════════════════════════════════════════════ -->
<div
  id="poster"
  class="relative overflow-hidden font-condensed"
  style="
    width:${W}px; height:${H}px;
    background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 48%, #fef9c3 100%);
  "
>

  <!-- ── 1. Ambient wave lines (full background layer) ─────────────── -->
  <svg class="absolute inset-0 pointer-events-none"
       width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg"
       style="z-index:0;">
    ${Array.from({ length: 14 }, (_, i) => {
      const y = 55 + i * 78;
      return `<path
        d="M -90 ${y} Q ${W * 0.22} ${y - 38} ${W * 0.5} ${y} T ${W + 90} ${y}"
        fill="none" stroke="rgba(251,191,36,0.13)" stroke-width="1.6"/>`;
    }).join("\n    ")}
  </svg>

  <!-- ── 2. TOP BAR ─────────────────────────────────────────────────── -->
  <div
    class="absolute flex items-center justify-between"
    style="top:${TOP}px; left:${PAD}px; right:${PAD}px; z-index:10;"
  >
    <!-- Left: AWS badge + org name -->
    <div class="flex items-center gap-4">
      <!-- AWS circle badge -->
      <div
        class="flex items-center justify-center rounded-full flex-shrink-0
               bg-amber-400/10 border-2 border-amber-400/30
               text-amber-700 font-black tracking-widest"
        style="width:${BADGE_D}px; height:${BADGE_D}px; font-size:17px;"
      >
        AWS
      </div>
      <!-- Org text -->
      <div class="flex flex-col gap-0.5">
        <span class="text-slate-900 font-bold tracking-wider uppercase"
              style="font-size:17px; line-height:1.2;">AWS COMMUNITY</span>
        <span class="text-slate-500 font-normal tracking-wide uppercase"
              style="font-size:14px; line-height:1.2;">AWS STUDENT CLUBS</span>
      </div>
    </div>

    <!-- Right: event title + year badge -->
    <div class="text-right">
      <div
        class="text-slate-900 font-black uppercase tracking-widest leading-tight"
        style="font-size:30px;"
      >
        AWS STUDENT<br>COMMUNITY DAY
      </div>
      <span
        class="inline-block mt-1.5 bg-amber-400 text-white font-bold
               tracking-[4px] uppercase rounded"
        style="font-size:16px; padding:4px 16px;"
      >
        2026
      </span>
    </div>
  </div>

  <!-- ── 3. CIRCULAR USER PHOTO — right column ─────────────────────── -->
  <!-- Amber ring (sits on top of the photo) -->
  <div
    class="absolute rounded-full border-[10px] border-amber-400 pointer-events-none"
    style="
      width:${PHOTO_D + 24}px; height:${PHOTO_D + 24}px;
      top:${PHOTO_CY - PHOTO_R - 12}px;
      left:${PHOTO_CX - PHOTO_R - 12}px;
      z-index:5;
    "
  ></div>

  <!-- Photo SVG (clip to circle) -->
  <svg
    class="absolute pointer-events-none"
    width="${W}" height="${H}"
    xmlns="http://www.w3.org/2000/svg"
    style="top:0; left:0; z-index:4;"
  >
    <defs>
      <clipPath id="photoClip">
        <circle cx="${PHOTO_CX}" cy="${PHOTO_CY}" r="${PHOTO_R}" />
      </clipPath>
    </defs>
    ${photoEl}
  </svg>

  <!-- ── 4. HEADLINE — left column ─────────────────────────────────── -->
  <div
    class="absolute flex flex-col leading-none"
    style="top:${HEAD_TOP}px; left:${PAD}px; z-index:10;"
  >
    <span
      class="text-slate-900 uppercase"
      style="font-size:122px; letter-spacing:-3px; line-height:0.9;"
    >I WILL</span>
    <span
      class="text-slate-900  uppercase"
      style="font-size:122px; letter-spacing:-3px; line-height:0.9;"
    >BE</span>
    <span
      class="text-slate-900  uppercase"
      style="font-size:122px; letter-spacing:-3px; line-height:0.9;"
    >ATTENDING</span>
    <span
      class="text-slate-900 font-semibold uppercase tracking-widest"
      style="font-size:21px; margin-top:20px; line-height:1.5;"
    >
      AWS STUDENT<br>COMMUNITY DAY 2026
    </span>
  </div>

  <!-- ── 5. DECORATIVE WAVE — shimmer only, gradient continues below ── -->
  <svg
    class="absolute pointer-events-none"
    width="${W}" height="${H}"
    xmlns="http://www.w3.org/2000/svg"
    style="top:0; left:0; z-index:6;"
  >
    <!-- Soft white shimmer wave — semi-transparent so gradient shows through -->
    <path d="${waveDecorPath}" fill="rgba(255,255,255,0.22)" />
  </svg>

  <!-- ── 6. NAME TAG ─────────────────────────────────────────────────── -->
  <div
    class="absolute w-full text-center"
    style="top:${NAME_Y - 52}px; z-index:12;"
  >
    <div
      class="text-slate-400 font-medium uppercase tracking-[6px]"
      style="font-size:16px; margin-bottom:6px;"
    >
      attending
    </div>
    <!-- font-normal = weight 400, NOT bold -->
    <div
      class="text-slate-900 font-normal uppercase tracking-widest"
      style="font-size:68px; line-height:1.0; letter-spacing:2px;"
    >
      ${name ?? "YOUR NAME WILL APPEAR HERE"}
    </div>
  </div>

  <!-- ── 7. EVENT DETAILS ROW ──────────────────────────────────────── -->
  <div
    class="absolute flex items-center justify-between"
    style="top:${DETAIL_Y}px; left:${PAD}px; right:${PAD}px; z-index:12;"
  >
    <!-- Date -->
    <div class="flex items-center gap-3">
      <div
        class="flex items-center justify-center rounded-full border-[3px] border-amber-400 flex-shrink-0"
        style="width:42px; height:42px; font-size:20px;"
      >📅</div>
      <span
        class="text-slate-900 font-semibold uppercase tracking-[3px]"
        style="font-size:24px;"
      >26 MAY 2026</span>
    </div>

    <!-- Location -->
    <div class="flex items-center gap-3">
      <div
        class="flex items-center justify-center rounded-full border-[3px] border-amber-400 flex-shrink-0"
        style="width:42px; height:42px; font-size:20px;"
      >📍</div>
      <span
        class="text-slate-900 font-semibold uppercase tracking-[3px]"
        style="font-size:24px;"
      >DOUALA, CAMEROON</span>
    </div>
  </div>

  <!-- ── 8. CTA STRIP ──────────────────────────────────────────────── -->
  <div
    class="absolute w-full flex flex-col items-center"
    style="top:${CTA_Y}px; z-index:12;"
  >
    <span
      class="bg-amber-400 text-white font-bold uppercase tracking-[4px] rounded"
      style="font-size:18px; padding:8px 36px;"
    >
      Register with the link below
    </span>
    <span
      class="text-amber-700 font-medium font-sans tracking-wide"
      style="font-size:20px; margin-top:14px;"
    >
      https://bit.ly/awsstudentcommunityday2026
    </span>
  </div>

</div><!-- /#poster -->
</body>
</html>`;
}
