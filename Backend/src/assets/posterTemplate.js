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
export function buildPosterHTML({ name, imageDataUri, eventDate, eventVenue }) {
  const W = 1200;
  const H = 1200;

  // ── Layout constants (poster-px) ──────────────────────────────────────────
  const PAD = 70;
  const TOP = 70;

  const BADGE_D = 90; // diameter of AWS circle badge
  const BADGE_R = BADGE_D / 2;

  // Header bar occupies TOP → TOP + BADGE_D
  const HEADER_BOTTOM = TOP + BADGE_D;

  // Circular photo — right column, starts just below header
  const PHOTO_D = 600;
  const PHOTO_R = PHOTO_D / 2;
  const PHOTO_CX = W - PAD - PHOTO_R;
  const PHOTO_CY = HEADER_BOTTOM + 60 + PHOTO_R;

  // Wavy divider — 28px gap below photo bottom
  const WAVE_Y = PHOTO_CY + PHOTO_R + 50;

  // Lower section (sits on gradient, not white)
  const NAME_Y = WAVE_Y + 100; // centre of name text
  const DETAIL_Y = NAME_Y + 80;
  const CTA_Y = DETAIL_Y + 70;

  // Headline — left column, vertically centred with photo
  const HEAD_TOP = PHOTO_CY - PHOTO_R + 80;

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
         font-family: "Epilogue", sans-serif; font-weight="600">
         YOUR PHOTO
       </text>
       <text x="${PHOTO_CX}" y="${PHOTO_CY + 22}"
         text-anchor="middle" dominant-baseline="middle"
         fill="rgba(148,163,184,0.9)" font-size="34"
         font-family="Epilogue", sans-serif; font-weight="600">
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
          display: ['"Epilogue"', 'sans-serif'],
          sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        },
        colors: {
          electric: '#FF9900',
          void: '#f8fafc',
          surface: '#ffffff'
        }
      },
    },
  };
</script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

<style>
  /* Hard-reset so Tailwind base styles don't fight our fixed dimensions */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: ${W}px;
    height: ${H}px;
    overflow: hidden;
    background: transparent;
  }
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  }
</style>
</head>

<body>
<!-- ═══════════════════════════════════════════════════════════════════
     POSTER  — 1080 × 1080 px
     Light theme matching the website with AWS Electric Orange accents.
═══════════════════════════════════════════════════════════════════ -->
<div
  id="poster"
  class="relative overflow-hidden font-display bg-void"
  style="
    width:${W}px; height:${H}px;
    background-image: radial-gradient(circle at 100% 0%, rgba(255,153,0,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 0% 100%, rgba(255,153,0,0.05) 0%, transparent 40%);
  "
>

  <!-- Premium Grid Background -->
  <div class="absolute inset-0 pointer-events-none" style="background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px); background-size: 40px 40px; z-index: 1;"></div>

  <!-- ── 1. Ambient wave lines (full background layer) ─────────────── -->
  <svg class="absolute inset-0 pointer-events-none"
       width="${W}" height="${H}"
       xmlns="http://www.w3.org/2000/svg"
       style="z-index:0;">
    ${Array.from({ length: 14 }, (_, i) => {
      const y = 55 + i * 78;
      return `<path
        d="M -90 ${y} Q ${W * 0.22} ${y - 38} ${W * 0.5} ${y} T ${W + 90} ${y}"
        fill="none" stroke="rgba(255,153,0,0.15)" stroke-width="1.6"/>`;
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
               bg-electric/10 border-2 border-electric/30
               text-electric font-black tracking-widest"
        style="width:${BADGE_D}px; height:${BADGE_D}px; font-size:17px;"
      >
        AWS
      </div>
      <!-- Org text -->
      <div class="flex flex-col gap-0.5">
        <span class="text-slate-900 font-bold tracking-wider uppercase"
              style="font-size:19px; line-height:1.2;">AWS COMMUNITY</span>
        <span class="text-slate-500 font-normal tracking-wide uppercase"
              style="font-size:16px; line-height:1.2;">AWS STUDENT CLUBS</span>
      </div>
    </div>

    <!-- Right: event title + year badge -->
    <div class="text-right">
      <div
        class="text-slate-900 font-black uppercase tracking-widest leading-tight"
        style="font-size:34px;"
      >
        AWS STUDENT<br>COMMUNITY DAY
      </div>
      <span
        class="inline-block mt-1.5 bg-electric text-white font-bold
               tracking-[4px] uppercase rounded"
        style="font-size:18px; padding:4px 18px;"
      >
        2026
      </span>
    </div>
  </div>

  <!-- ── 3. CIRCULAR USER PHOTO — right column ─────────────────────── -->
  <!-- Premium Ring -->
  <div
    class="absolute rounded-full border-[6px] border-electric pointer-events-none shadow-[0_0_40px_rgba(255,153,0,0.3)] flex items-center justify-center"
    style="
      width:${PHOTO_D + 32}px; height:${PHOTO_D + 32}px;
      top:${PHOTO_CY - PHOTO_R - 16}px;
      left:${PHOTO_CX - PHOTO_R - 16}px;
      z-index:5;
    "
  >
    <!-- Inner dashed ring for modern look -->
    <div class="rounded-full border-[2px] border-dashed border-electric/60 w-full h-full m-2"></div>
  </div>

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
      class="text-slate-900 font-black uppercase"
      style="font-size:84px; letter-spacing:-2px; line-height:1;"
    >I WILL BE</span>
    <span
      class="text-electric font-black uppercase"
      style="font-size:84px; letter-spacing:-2px; line-height:1;"
    >ATTENDING</span>
    <div class="mt-8 flex items-center gap-3">
      <div class="h-[2px] w-12 bg-electric"></div>
      <span
        class="text-slate-900 font-bold uppercase tracking-widest"
        style="font-size:18px;"
      >
        AWS STUDENT COMMUNITY DAY 2026
      </span>
    </div>
  </div>

  <!-- ── 5. DECORATIVE WAVE — shimmer only, gradient continues below ── -->
  <svg
    class="absolute pointer-events-none"
    width="${W}" height="${H}"
    xmlns="http://www.w3.org/2000/svg"
    style="top:0; left:0; z-index:6;"
  >
    <!-- Soft shimmer wave — semi-transparent -->
    <path d="${waveDecorPath}" fill="rgba(255,153,0,0.1)" />
  </svg>

  <!-- ── 6. NAME TAG ─────────────────────────────────────────────────── -->
  <div
    class="absolute w-full flex flex-col items-center justify-center"
    style="top:${NAME_Y - 40}px; z-index:12;"
  >
    <div class="glass-card px-10 py-5 rounded-2xl flex flex-col items-center border border-slate-200">
      <div
        class="text-slate-500 font-bold uppercase tracking-[8px]"
        style="font-size:16px; margin-bottom:4px;"
      >
        ATTENDEE
      </div>
      <!-- font-bold = weight 700 -->
      <div
        class="text-slate-900 font-black uppercase tracking-wider"
        style="font-size:52px; line-height:1.0; font-family: 'Epilogue', sans-serif;"
      >
        ${name ?? "YOUR NAME WILL APPEAR HERE"}
      </div>
    </div>
  </div>

  <!-- ── 7. EVENT DETAILS ROW ──────────────────────────────────────── -->
  <div
    class="absolute flex items-center justify-between"
    style="top:${DETAIL_Y}px; left:${PAD}px; right:${PAD}px; z-index:12;"
  >
    <!-- Date -->
    <div class="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
      <div class="text-electric flex items-center justify-center" style="width:28px; height:28px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
      </div>
      <span
        class="text-slate-900 font-bold uppercase tracking-[2px]"
        style="font-size:22px;"
      >${eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : "23 MAY 2026"}</span>
    </div>

    <!-- Location -->
    <div class="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
      <div class="text-electric flex items-center justify-center" style="width:28px; height:28px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <span
        class="text-slate-900 font-bold uppercase tracking-[2px]"
        style="font-size:22px;"
      >${eventVenue ? eventVenue.toUpperCase() : "DOUALA, CAMEROON"}</span>
    </div>
  </div>

  <!-- ── 8. CTA STRIP ──────────────────────────────────────────────── -->
  <div
    class="absolute w-full flex flex-col items-center"
    style="top:${CTA_Y}px; z-index:12;"
  >
    <div class="flex flex-col items-center bg-white px-10 py-4 rounded-xl border border-slate-200 shadow-sm">
      <span
        class="text-slate-500 font-bold uppercase tracking-[4px]"
        style="font-size:14px; margin-bottom:4px;"
      >
        Register with the link below
      </span>
      <span
        class="text-electric font-black font-sans tracking-wide"
        style="font-size:28px;"
      >
        awsscdcmr.com
      </span>
    </div>
  </div>

</div><!-- /#poster -->
</body>
</html>`;
}
