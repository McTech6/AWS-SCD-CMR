"use client";

import { Navbar, PageWrapper } from "@/components/layout";
import { lookupAttendeeByEmail } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const Schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type Data = z.infer<typeof Schema>;

// ─── Poster HTML builder ──────────────────────────────────────────────────────
function buildPosterHTML({
  name,
  imageDataUri,
  eventDate,
  eventVenue,
}: {
  name: string;
  imageDataUri: string | null;
  eventDate?: string;
  eventVenue?: string;
}): string {
  const W = 1080;
  const H = 1080;

  const dateStr = eventDate
    ? new Date(eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()
    : "23 MAY 2026";
  const venueStr = eventVenue ? eventVenue.toUpperCase() : "IUC DOUALA, CAMEROON";

  const photoEl = imageDataUri
    ? `<image href="${imageDataUri}" x="0" y="0" width="1080" height="1080" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice" />`
    : `<rect x="0" y="0" width="1080" height="1080" fill="#1a1a2e"/>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:${W}px;height:${H}px;overflow:hidden;background:#0a0a0a;}
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap');
</style>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
</head>
<body>
<div id="poster" style="width:${W}px;height:${H}px;position:relative;overflow:hidden;font-family:'Montserrat',sans-serif;background:#0a0a0a;">

  <!-- FULL BG PHOTO -->
  <svg width="${W}" height="${H}" style="position:absolute;top:0;left:0;z-index:0;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="photoClip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
    </defs>
    ${photoEl}
  </svg>

  <!-- DARK GRADIENT OVERLAY — bottom heavy so text pops -->
  <div style="position:absolute;inset:0;z-index:1;background:linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.95) 100%);"></div>

  <!-- LEFT EDGE ACCENT -->
  <div style="position:absolute;left:0;top:0;bottom:0;width:6px;z-index:10;background:linear-gradient(to bottom,#FF9900,#FF6B00);"></div>

  <!-- TOP BAR -->
  <div style="position:absolute;top:0;left:0;right:0;z-index:10;padding:36px 48px 0;display:flex;align-items:center;justify-content:space-between;">
    <!-- AWS Badge -->
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(255,153,0,0.15);border:2px solid #FF9900;display:flex;align-items:center;justify-content:center;">
        <span style="color:#FF9900;font-size:13px;font-weight:900;letter-spacing:1px;">AWS</span>
      </div>
      <div>
        <div style="color:rgba(255,255,255,0.95);font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Student Community</div>
        <div style="color:rgba(255,153,0,0.9);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Cloud Club · Cameroon</div>
      </div>
    </div>
    <!-- Year pill -->
    <div style="background:#FF9900;color:#000;font-size:13px;font-weight:900;letter-spacing:4px;padding:8px 20px;border-radius:4px;">2026</div>
  </div>

  <!-- BOTTOM CONTENT -->
  <div style="position:absolute;bottom:0;left:0;right:0;z-index:10;padding:0 48px 44px;">

    <!-- I WILL BE ATTENDING -->
    <div style="margin-bottom:18px;">
      <div style="color:rgba(255,255,255,0.7);font-size:15px;font-weight:700;letter-spacing:6px;text-transform:uppercase;margin-bottom:4px;">✦ I WILL BE ATTENDING ✦</div>
      <div style="color:#FF9900;font-size:72px;font-weight:900;line-height:0.95;letter-spacing:-2px;text-transform:uppercase;text-shadow:0 0 60px rgba(255,153,0,0.4);">AWS STUDENT</div>
      <div style="color:#ffffff;font-size:72px;font-weight:900;line-height:0.95;letter-spacing:-2px;text-transform:uppercase;">COMMUNITY DAY</div>
      <div style="color:#FF9900;font-size:72px;font-weight:900;line-height:0.95;letter-spacing:-2px;text-transform:uppercase;">CAMEROON</div>
    </div>

    <!-- DIVIDER -->
    <div style="height:1px;background:linear-gradient(to right,#FF9900,rgba(255,153,0,0.1));margin-bottom:18px;"></div>

    <!-- NAME -->
    <div style="margin-bottom:20px;">
      <div style="color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">Attendee</div>
      <div style="color:#ffffff;font-size:38px;font-weight:800;letter-spacing:1px;text-transform:uppercase;line-height:1.1;">${name || "YOUR NAME"}</div>
    </div>

    <!-- DATE + VENUE ROW -->
    <div style="display:flex;gap:24px;align-items:center;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;border-radius:50%;background:rgba(255,153,0,0.15);border:1px solid rgba(255,153,0,0.4);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9900" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <span style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:600;letter-spacing:1px;">${dateStr}</span>
      </div>
      <div style="width:4px;height:4px;border-radius:50%;background:#FF9900;"></div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:32px;height:32px;border-radius:50%;background:rgba(255,153,0,0.15);border:1px solid rgba(255,153,0,0.4);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9900" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <span style="color:rgba(255,255,255,0.9);font-size:14px;font-weight:600;letter-spacing:1px;">${venueStr}</span>
      </div>
      <div style="margin-left:auto;color:rgba(255,153,0,0.7);font-size:12px;font-weight:700;letter-spacing:2px;">awsscdcmr.com</div>
    </div>
  </div>

  <!-- TOP-RIGHT DECORATIVE CORNER -->
  <svg width="180" height="180" style="position:absolute;top:0;right:0;z-index:2;opacity:0.12;" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
    <circle cx="180" cy="0" r="140" fill="none" stroke="#FF9900" stroke-width="1"/>
    <circle cx="180" cy="0" r="100" fill="none" stroke="#FF9900" stroke-width="1"/>
    <circle cx="180" cy="0" r="60" fill="none" stroke="#FF9900" stroke-width="1"/>
  </svg>

  <!-- BOTTOM-LEFT DECORATIVE CORNER -->
  <svg width="160" height="160" style="position:absolute;bottom:0;left:6px;z-index:2;opacity:0.1;" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
    <circle cx="0" cy="160" r="120" fill="none" stroke="#FF9900" stroke-width="1"/>
    <circle cx="0" cy="160" r="80" fill="none" stroke="#FF9900" stroke-width="1"/>
  </svg>

</div>
</body>
</html>`;
}

// ─── Live Preview ─────────────────────────────────────────────────────────────
function PosterPreview({ name, imageDataUri, eventDate, eventVenue }: {
  name: string; imageDataUri: string | null; eventDate?: string; eventVenue?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const POSTER_SIZE = 1080;
  const CONTAINER_SIZE = 520;
  const scale = CONTAINER_SIZE / POSTER_SIZE;
  const html = buildPosterHTML({ name, imageDataUri, eventDate, eventVenue });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open(); doc.write(html); doc.close();
  }, [html]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
      <iframe ref={iframeRef} scrolling="no" title="poster-preview"
        style={{ width: POSTER_SIZE, height: POSTER_SIZE, border: "none",
          transformOrigin: "top left", transform: `scale(${scale})`, pointerEvents: "none" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IWillBeTherePage() {
  const [image, setImage] = useState<File | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendeeName, setAttendeeName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [eventDate, setEventDate] = useState<string | undefined>();
  const [eventVenue, setEventVenue] = useState<string | undefined>();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<Data>({ resolver: zodResolver(Schema) });

  useEffect(() => {
    import("@/lib/api").then((api) => {
      api.getPublicEventStats().then((data: any) => {
        if (data?.eventDate) setEventDate(data.eventDate);
        if (data?.venue) setEventVenue(data.venue);
      }).catch(console.error);
    });
  }, []);

  const handleImageUpload = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImageDataUri(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleVerifyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getValues("email");
    if (!email) { setError("Please enter your email"); return; }
    setVerifying(true); setError(null);
    try {
      const res = await lookupAttendeeByEmail(email);
      if (res?.success && res.data) {
        setAttendeeName(res.data.name);
      } else {
        setError(res?.message || "No registration found for this email.");
      }
    } catch (err: any) {
      setError(err.message || "Could not verify email.");
    } finally {
      setVerifying(false);
    }
  };

  const Submit = async (data: Data) => {
    if (!imageDataUri) { setError("Please upload a photo."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const html = buildPosterHTML({ name: attendeeName || "", imageDataUri, eventDate, eventVenue });
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1080px;height:1080px;border:none;";
      document.body.appendChild(iframe);

      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        const doc = iframe.contentDocument!;
        doc.open(); doc.write(html); doc.close();
      });

      await iframe.contentDocument!.fonts.ready;
      await new Promise((r) => setTimeout(r, 1800));

      const { default: html2canvas } = await import("html2canvas");
      const posterEl = iframe.contentDocument!.getElementById("poster")!;
      const canvas = await html2canvas(posterEl, {
        useCORS: true, allowTaint: true, scale: 2,
        width: 1080, height: 1080, backgroundColor: "#0a0a0a",
      });

      document.body.removeChild(iframe);
      setResult(canvas.toDataURL("image/png"));
    } catch (err: any) {
      setError(err.message || "Failed to generate poster. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null); setImageDataUri(null);
    setImage(null); setError(null); setAttendeeName(null);
  };

  return (
    <PageWrapper>
      <Navbar />
      <main className="min-h-screen pt-28 px-6 pb-16 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">

          {/* Header */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[4px] text-amber-500">
              AWS Student Community Day · Cameroon · 2026
            </p>
            <h1 className="text-5xl font-black tracking-tight leading-none uppercase text-slate-900">
              Generate Your <span className="text-amber-500">Poster</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-1">
              Enter your registered email, upload your photo, and download your personalized event poster to share on social media.
            </p>
          </div>

          <div className="grid md:grid-cols-[400px_1fr] gap-10 items-start">

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit(Submit)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Registered Email
                </label>
                <div className="flex gap-2 items-center">
                  <input type="email" placeholder="your@email.com"
                    {...register("email")}
                    disabled={!!attendeeName}
                    className="w-full px-4 py-2.5 rounded-lg text-sm bg-white text-slate-900 border border-slate-200 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  {!attendeeName && (
                    <button onClick={handleVerifyEmail} disabled={verifying} type="button"
                      title="Find my registration"
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 transition-colors text-white">
                      {verifying
                        ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
                      }
                    </button>
                  )}
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              {attendeeName && (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Success */}
                  <div className="px-4 py-3 bg-green-50 text-green-800 rounded-lg text-sm font-medium border border-green-200 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    Found! Welcome, <strong>{attendeeName}</strong>
                  </div>

                  {/* Photo upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">Your Photo</label>
                    <label className="flex flex-col items-center justify-center w-full h-44 cursor-pointer overflow-hidden rounded-xl transition-all bg-slate-50 border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/30">
                      {!imageDataUri ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                          </svg>
                          <span className="text-sm font-medium">Click to upload photo</span>
                          <span className="text-xs">JPG, PNG — best results with portrait photos</span>
                        </div>
                      ) : (
                        <img src={imageDataUri} alt="preview" className="h-full w-full object-cover"/>
                      )}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}/>
                    </label>
                  </div>

                  <button type="submit" disabled={loading || !imageDataUri}
                    className="w-full font-bold py-3 rounded-xl text-sm tracking-widest uppercase text-white transition-all bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        Generating...
                      </>
                    ) : "Generate My Poster"}
                  </button>
                </div>
              )}
            </form>

            {/* ── PREVIEW / RESULT ── */}
            <div className="flex flex-col items-center gap-4">
              {result ? (
                <>
                  <img src={result} alt="generated poster" className="rounded-2xl w-full max-w-[520px] shadow-2xl"/>
                  <div className="flex gap-3 w-full max-w-[520px]">
                    <a href={result} download="AWS-SCD-Cameroon-2026.png"
                      className="flex-1 text-center font-bold text-sm uppercase tracking-widest py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors">
                      Download Poster
                    </a>
                    <button onClick={handleReset}
                      className="px-5 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors">
                      Reset
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <PosterPreview name={attendeeName || "YOUR NAME"} imageDataUri={imageDataUri} eventDate={eventDate} eventVenue={eventVenue}/>
                  <p className="text-xs text-slate-400 text-center">Live preview · Your photo fills the background</p>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
