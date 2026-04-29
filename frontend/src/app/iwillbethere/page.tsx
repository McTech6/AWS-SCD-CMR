"use client";

import { Navbar, PageWrapper } from "@/components/layout";
import { generatePoster } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

//////////////////////////////////////////////////
// Validation Schema
//////////////////////////////////////////////////
export const Schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type Data = z.infer<typeof Schema>;

//////////////////////////////////////////////////
// buildWavePath — shared helper
//////////////////////////////////////////////////
function buildWavePath(totalW: number, startY: number, segW = 44): string {
  let d = `M 0 ${startY + 14}`;
  for (let x = 0; x <= totalW; x += segW) {
    d += ` Q ${x + segW * 0.25} ${startY} ${x + segW * 0.5} ${startY + 11}`;
    d += ` Q ${x + segW * 0.75} ${startY + 22} ${x + segW} ${startY + 14}`;
  }
  d += ` L ${totalW} ${totalW} L 0 ${totalW} Z`;
  return d;
}

//////////////////////////////////////////////////
// buildPosterHTML
// ─────────────────────────────────────────────
// CLIENT-SIDE mirror of posterTemplate.js.
// Must stay byte-for-byte in sync with the backend.
// Styling: Tailwind CDN utilities only.
// Background: full-bleed gradient (no white bottom half).
// Name weight: font-normal (400).
//////////////////////////////////////////////////
function buildPosterHTML({
  name,
  imageDataUri,
}: {
  name: string;
  imageDataUri: string | null;
}): string {
  const W = 1080;

  const PAD = 52;
  const TOP = 52;

  const BADGE_D = 80;
  const BADGE_R = BADGE_D / 2;
  const HEADER_BOTTOM = TOP + BADGE_D;

  const PHOTO_D = 470;
  const PHOTO_R = PHOTO_D / 2;
  const PHOTO_CX = W - PAD - PHOTO_R;
  const PHOTO_CY = HEADER_BOTTOM + 32 + PHOTO_R;

  const WAVE_Y = PHOTO_CY + PHOTO_R + 28;
  const NAME_Y = WAVE_Y + 88;
  const DETAIL_Y = NAME_Y + 78;
  const CTA_Y = DETAIL_Y + 62;
  const HEAD_TOP = PHOTO_CY - PHOTO_R - 4;

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
         font-family="Barlow Condensed, sans-serif" font-weight="400">YOUR PHOTO</text>
       <text x="${PHOTO_CX}" y="${PHOTO_CY + 22}"
         text-anchor="middle" dominant-baseline="middle"
         fill="rgba(148,163,184,0.9)" font-size="34"
         font-family="Barlow Condensed, sans-serif" font-weight="400">HERE</text>`;

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
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
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${W}px; overflow: hidden; background: transparent; }
</style>
</head>
<body>
<div id="poster" class="relative overflow-hidden font-condensed"
  style="width:${W}px;height:${W}px;background:linear-gradient(135deg,#fffbeb 0%,#fff7ed 48%,#fef9c3 100%);">

  <!-- Ambient wave lines -->
  <svg class="absolute inset-0 pointer-events-none" width="${W}" height="${W}"
       xmlns="http://www.w3.org/2000/svg" style="z-index:0;">
    ${Array.from({ length: 14 }, (_, i) => {
      const y = 55 + i * 78;
      return `<path d="M -90 ${y} Q ${W * 0.22} ${y - 38} ${W * 0.5} ${y} T ${W + 90} ${y}" fill="none" stroke="rgba(251,191,36,0.13)" stroke-width="1.6"/>`;
    }).join("\n    ")}
  </svg>

  <!-- TOP BAR -->
  <div class="absolute flex items-center justify-between"
       style="top:${TOP}px;left:${PAD}px;right:${PAD}px;z-index:10;">
    <div class="flex items-center gap-4">
      <div class="flex items-center justify-center rounded-full flex-shrink-0 bg-amber-400/10 border-2 border-amber-400/30 text-amber-700 font-black tracking-widest"
           style="width:${BADGE_D}px;height:${BADGE_D}px;font-size:17px;">AWS</div>
      <div class="flex flex-col gap-0.5">
        <span class="text-slate-900 font-bold tracking-wider uppercase" style="font-size:17px;line-height:1.2;">AWS COMMUNITY</span>
        <span class="text-slate-500 font-normal tracking-wide uppercase" style="font-size:14px;line-height:1.2;">AWS STUDENT CLUBS</span>
      </div>
    </div>
    <div class="text-right">
      <div class="text-slate-900 font-black uppercase tracking-widest leading-tight" style="font-size:30px;">AWS STUDENT<br>COMMUNITY DAY</div>
      <span class="inline-block mt-1.5 bg-amber-400 text-white font-bold tracking-[4px] uppercase rounded" style="font-size:16px;padding:4px 16px;">2026</span>
    </div>
  </div>

  <!-- PHOTO RING -->
  <div class="absolute rounded-full border-[10px] border-amber-400 pointer-events-none"
       style="width:${PHOTO_D + 24}px;height:${PHOTO_D + 24}px;top:${PHOTO_CY - PHOTO_R - 12}px;left:${PHOTO_CX - PHOTO_R - 12}px;z-index:5;"></div>

  <!-- PHOTO SVG -->
  <svg class="absolute pointer-events-none" width="${W}" height="${W}"
       xmlns="http://www.w3.org/2000/svg" style="top:0;left:0;z-index:4;">
    <defs><clipPath id="photoClip"><circle cx="${PHOTO_CX}" cy="${PHOTO_CY}" r="${PHOTO_R}"/></clipPath></defs>
    ${photoEl}
  </svg>

  <!-- HEADLINE -->
  <div class="absolute flex flex-col leading-none"
       style="top:${HEAD_TOP}px;left:${PAD}px;z-index:10;">
    <span class="text-slate-900  uppercase" style="font-size:122px;letter-spacing:-3px;line-height:0.9;">I WILL</span>
    <span class="text-slate-900  uppercase" style="font-size:122px;letter-spacing:-3px;line-height:0.9;">BE</span>
    <span class="text-slate-900  uppercase" style="font-size:122px;letter-spacing:-3px;line-height:0.9;">ATTENDING</span>
    <span class="text-slate-900 font-semibold uppercase tracking-widest" style="font-size:21px;margin-top:20px;line-height:1.5;">AWS STUDENT<br>COMMUNITY DAY 2026</span>
  </div>

  <!-- DECORATIVE WAVE (shimmer, gradient shows through) -->
  <svg class="absolute pointer-events-none" width="${W}" height="${W}"
       xmlns="http://www.w3.org/2000/svg" style="top:0;left:0;z-index:6;">
    <path d="${wavePath}" fill="rgba(255,255,255,0.02)"/>
  </svg>

  <!-- NAME TAG — font-normal (400), NOT bold -->
  <div class="absolute w-full text-center" style="top:${NAME_Y - 52}px;z-index:12;">
    <div class="text-slate-400 font-medium uppercase tracking-[6px]" style="font-size:16px;margin-bottom:6px;">attending</div>
    <div class="text-slate-900 font-normal uppercase tracking-widest" style="font-size:68px;line-height:1.0;letter-spacing:2px;">
      ${name || "YOUR NAME WILL APPEAR HERE"}
    </div>
  </div>

  <!-- EVENT DETAILS -->
  <div class="absolute flex items-center justify-between"
       style="top:${DETAIL_Y}px;left:${PAD}px;right:${PAD}px;z-index:12;">
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center rounded-full border-[3px] border-amber-400 shrink-0" style="width:42px;height:42px;font-size:20px;">📅</div>
      <span class="text-slate-900 font-semibold uppercase tracking-[3px]" style="font-size:24px;">26 MAY 2026</span>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center rounded-full border-[3px] border-amber-400 shrink-0" style="width:42px;height:42px;font-size:20px;">📍</div>
      <span class="text-slate-900 font-semibold uppercase tracking-[3px]" style="font-size:24px;">DOUALA, CAMEROON</span>
    </div>
  </div>

  <!-- CTA STRIP -->
  <div class="absolute w-full flex flex-col items-center" style="top:${CTA_Y}px;z-index:12;">
    <span class="bg-amber-400 text-white font-bold uppercase tracking-[4px] rounded" style="font-size:18px;padding:8px 36px;">Register with the link below</span>
    <span class="text-amber-700 font-medium font-sans tracking-wide" style="font-size:20px;margin-top:14px;">https://bit.ly/awsstudentcommunityday2026</span>
  </div>

</div>
</body>
</html>`;
}

//////////////////////////////////////////////////
// PosterPreview
// Renders the 1080×1080 HTML inside a scaled iframe.
// The iframe IS the poster — what you see = what downloads.
//////////////////////////////////////////////////
function PosterPreview({
  name,
  imageDataUri,
}: {
  name: string;
  imageDataUri: string | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const POSTER_SIZE = 1080;
  const CONTAINER_SIZE = 560;
  const scale = CONTAINER_SIZE / POSTER_SIZE;

  const html = buildPosterHTML({ name, imageDataUri });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  return (
    <div
      className="relative rounded-[20px] overflow-hidden shadow-2xl border border-amber-400/20"
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
    >
      <iframe
        ref={iframeRef}
        scrolling="no"
        title="poster-preview"
        style={{
          width: POSTER_SIZE,
          height: POSTER_SIZE,
          border: "none",
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

//////////////////////////////////////////////////
// Page
//////////////////////////////////////////////////
export default function IWillBeTherePage() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>({ resolver: zodResolver(Schema) });

  // Convert File → base64 data URI immediately on upload
  const handleImageUpload = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImageDataUri(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const Submit = async (data: Data) => {
    if (!image) {
      setError("Please upload a photo.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const url = await generatePoster(data.email, image);
      setResult(url);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to generate poster. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImageDataUri(null);
    setImage(null);
    setError(null);
  };

  return (
    <PageWrapper>
      <Navbar />

      <main className="min-h-screen pt-28 px-6 pb-16">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col gap-3.5">
              <p className="text-[11px] font-bold uppercase tracking-[4px] text-amber-500">
                AWS Student Community Day · Douala, Cameroon · 26 May 2026
              </p>
              <div className="flex flex-col gap-2">
                <h1 className="text-6xl font-black tracking-tight leading-none uppercase font-anton text-slate-900">
                  I WILL BE <span className="text-amber-500">ATTENDING</span>
                </h1>
                <p className="text-xs font-bold uppercase text-amber-500">
                  AWS Student Community Day
                </p>
              </div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Generate your personalized poster for the AWS Student Community
                Day 2026.
              </p>
            </div>

            <div className="grid md:grid-cols-[1fr_560px] gap-10 items-start">
              <form
                onSubmit={handleSubmit(Submit)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 space-y-6"
              >
                   <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                  </svg>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Use the email you registered with. Your name is fetched automatically from your registration.
                </p>
              </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ibukun@example.com"
                    {...register("email")}
                    className="w-full px-4 py-2.5 rounded-md text-sm bg-white text-slate-900 border border-black/[0.08] outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Photo upload */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Your Photo
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer overflow-hidden rounded-[14px] transition-colors bg-white border-2 border-dashed border-amber-300 hover:border-amber-500">
                    {!imageDataUri ? (
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-8 h-8 stroke-amber-300"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 16v-8m-4 4h8M4 16.5A2.5 2.5 0 016.5 19h11a2.5 2.5 0 002.5-2.5V9a2.5 2.5 0 00-2.5-2.5H6.5A2.5 2.5 0 004 9v7.5z"
                          />
                        </svg>
                        <span className="text-sm text-slate-500">
                          Click to upload your photo
                        </span>
                      </div>
                    ) : (
                      <img
                        src={imageDataUri}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleImageUpload(e.target.files[0])
                      }
                    />
                  </label>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-3 rounded-md text-sm tracking-[1.5px] uppercase text-white transition-colors bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Generating..." : "Generate My Poster"}
                </button>
                
           
              </form>
           

            {/* ── RIGHT — LIVE PREVIEW / RESULT ── */}
            <div className="flex justify-center">
              {result ? (
                <div className="space-y-4 w-full max-w-140 text-center">
                  <img
                    src={result}
                    alt="generated poster"
                    className="rounded-xl w-full shadow-2xl"
                  />
                  <a
                    href={result}
                    download="my-aws-poster.png"
                    className="block font-bold text-sm uppercase tracking-[1.5px] py-3 rounded-[10px] bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                  >
                    Download Poster
                  </a>
                  <button
                    onClick={handleReset}
                    className="block w-full text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Generate another
                  </button>
                </div>
              ) : (
                // Live iframe preview — exact same HTML Puppeteer will screenshot
                <PosterPreview name="YOUR NAME" imageDataUri={imageDataUri} />
              )}
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
