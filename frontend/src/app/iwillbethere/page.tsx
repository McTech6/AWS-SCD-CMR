"use client";

import { Navbar, PageWrapper } from "@/components/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

//////////////////////////////////////////////////
// Validation Schema
//////////////////////////////////////////////////

export const Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export type Data = z.infer<typeof Schema>;

//////////////////////////////////////////////////
// Page
//////////////////////////////////////////////////

export default function IWillBeTherePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(Schema),
  });

  const watchedName = watch("fullName", "");

  //////////////////////////////////////////////////
  // Handle Image Upload
  //////////////////////////////////////////////////

  const handleImageUpload = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  //////////////////////////////////////////////////
  // Submit
  //////////////////////////////////////////////////

  const Submit = async (data: Data) => {
    if (!image) return;

    const formData = new FormData();
    formData.append("name", data.fullName);
    formData.append("image", image);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/poster/generate", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      setResult(result.imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////

  return (
    <PageWrapper>
      <Navbar />

      <main className="min-h-screen pt-28 px-6 pb-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* ── LEFT SIDE — FORM ── */}
          <div className="space-y-8">
            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-6xl font-black tracking-tight leading-none uppercase font-anton text-slate-900">
                I WILL BE
                <br />
                ATTENDING
              </h1>
              <p className="text-xs font-bold uppercase tracking-[3px] pt-2 text-amber-500">
                AWS Student Community Day
              </p>
            </div>

            <p className="text-sm max-w-xs leading-relaxed text-slate-500">
              Upload your photo and enter your name to generate your official
              summit attendance poster.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(Submit)}
              className="space-y-5 max-w-sm"
            >
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Full Name
                </label>
                <input
                  placeholder="e.g. Ibukun Joshua"
                  {...register("fullName")}
                  className="
                    w-full px-4 py-2.5 rounded-[10px] text-sm bg-white text-slate-900
                    border border-black/[0.08] outline-none transition-all
                    focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20
                  "
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Your Photo
                </label>
                <label
                  className="
                  flex flex-col items-center justify-center w-full h-40 cursor-pointer
                  overflow-hidden rounded-[14px] transition-colors bg-white
                  border-2 border-dashed border-amber-300 hover:border-amber-500
                "
                >
                  {!preview ? (
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
                      src={preview}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full font-bold py-3 rounded-[10px] text-sm tracking-[1.5px] uppercase
                  text-white transition-colors
                  bg-amber-500 hover:bg-amber-600
                  disabled:bg-amber-300 disabled:cursor-not-allowed
                "
              >
                {loading ? "Generating..." : "Generate My Poster"}
              </button>
            </form>
          </div>

          {/* ── RIGHT SIDE — POSTER PREVIEW ── */}
          <div className="flex justify-center">
            {result ? (
              /* Generated result */
              <div className="space-y-4 w-full max-w-xl text-center">
                <img
                  src={result}
                  alt="generated poster"
                  className="rounded-xl w-full shadow-2xl"
                />
                <a
                  href={result}
                  download
                  className="
                    block font-bold text-sm uppercase tracking-[1.5px] py-3 rounded-[10px]
                    bg-amber-500 hover:bg-amber-600 text-white transition-colors
                  "
                >
                  Download Poster
                </a>
              </div>
            ) : (
              /* Live poster mockup */
              <div
                className="
                relative w-full max-w-xl rounded-[20px] overflow-hidden min-h-[560px]
                bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50
                shadow-2xl border border-amber-500/15
              "
              >
                {/* Amber wave lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <path
                      key={i}
                      d={`M -100 ${50 + i * 50} Q 150 ${20 + i * 50} 300 ${50 + i * 50} T 700 ${50 + i * 50}`}
                      fill="none"
                      stroke="rgba(255,153,0,0.12)"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                {/* Top logos bar */}
                <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3">
                  {/* Left: org logos */}
                  <div className="flex items-center gap-2">
                    <div
                      className="
                      w-10 h-10 rounded-full flex items-center justify-center
                      bg-amber-500/10 border border-amber-500/30
                      text-[7px] font-extrabold text-amber-700 leading-tight text-center
                    "
                    >
                      AWS
                    </div>
                    <div>
                      <p className="text-[7px] font-extrabold text-slate-900">
                        AWS COMMUNITY
                      </p>
                      <span className="text-[6px] text-slate-500 leading-tight block">
                        AWS
                        <br />
                        STUDENT CLUBS
                      </span>
                    </div>
                    {/* <div
                      className="
                      w-8 h-8 rounded-full flex items-center justify-center ml-1
                      bg-amber-500/10 border border-amber-500/30
                      text-[10px] text-amber-500
                    "
                    >
                      ★
                    </div> */}
                  </div>

                  {/* Right: Summit title */}
                  <div className="text-right">
                    <p className="font-black uppercase leading-tight text-[12px] text-slate-900 font-anton">
                      AWS STUDENT
                      <br />
                      COMMUNITY DAY
                    </p>
                    {/* <div className="text-amber-500 text-[11px] mt-0.5">
                      ★★★★
                    </div> */}
                    <span
                      className="
                      inline-block font-bold bg-amber-500 text-white
                      text-[8px] px-2 py-0.5 rounded mt-0.5 tracking-widest
                    "
                    >
                      2026
                    </span>
                  </div>
                </div>

                {/* Main content */}
                <div className="relative z-10 px-5 pt-2 pb-5 flex flex-col items-center">
                  {/* Headline + Photo row */}
                  <div className="w-full flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="font-black uppercase leading-none text-[40px] text-slate-900 font-anton">
                        I WILL
                        <br/> 
                        Be
                        <br />
                        ATTENDING
                      </h2>
                      <p className="font-bold uppercase mt-2 leading-tight text-[9px] text-slate-900 tracking-wide">
                        AWS STUDENT
                        <br />
                        COMMUNITY DAY 2026
                      </p>
                    </div>

                    {/* Circular profile photo */}
                    <div
                      className="
                      shrink-0 rounded-full overflow-hidden
                      w-60 h-60
                      border-[5px] border-amber-500
                    "
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="Your photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="
                          w-full h-full flex items-center justify-center text-center px-2
                          bg-amber-500/5 text-[10px] text-slate-400
                        "
                        >
                          Your photo here
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name tag — torn paper style */}
                  <div className="w-full mt-4">
                    <svg
                      className="w-full"
                      height="12"
                      viewBox="0 0 400 12"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 12 Q10 2 20 8 Q30 14 40 6 Q50 0 60 8 Q70 14 80 5 Q90 0 100 7 Q110 12 120 5 Q130 0 140 8 Q150 14 160 6 Q170 0 180 8 Q190 14 200 5 Q210 0 220 7 Q230 12 240 5 Q250 0 260 8 Q270 14 280 6 Q290 0 300 8 Q310 14 320 5 Q330 0 340 7 Q350 12 360 5 Q370 0 380 8 Q390 14 400 6 L400 12 Z"
                        fill="white"
                      />
                    </svg>
                    <div className="bg-white text-center py-3 px-4">
                      {watchedName ? (
                        <p className="text-lg font-semibold text-slate-900">
                          {watchedName}
                        </p>
                      ) : (
                        <p className="text-sm italic text-slate-400">
                          Your name will appear here
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Event details */}
                  <div className="w-full mt-5 flex justify-between items-start text-[9px] font-bold text-slate-900">
                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className="
                        w-[18px] h-[18px] flex items-center justify-center flex-shrink-0
                        rounded-full border-2 border-amber-500
                      "
                      >
                        <svg
                          className="w-[9px] h-[9px] fill-amber-500"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span>26 May 2026</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-1.5 text-right max-w-[55%]">
                      <div
                        className="
                        w-[18px] h-[18px] flex items-center justify-center flex-shrink-0
                        rounded-full border-2 border-amber-500 mt-0.5
                      "
                      >
                        <svg
                          className="w-[9px] h-[9px] fill-amber-500"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="leading-tight">
                        DOUALA,
                        <br />
                        CAMEROON
                      </span>
                    </div>
                  </div>

                  {/* Register link */}
                  <div className="w-full mt-5 text-center space-y-1">
                    <span
                      className="
                      inline-block font-bold uppercase tracking-[2px]
                      bg-amber-500 text-white text-[8px] px-4 py-1
                    "
                    >
                      Register with the link below
                    </span>
                    <p className="font-semibold text-[10px] text-amber-700">
                      https://bit.ly/cacyofacadsummit2025
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
