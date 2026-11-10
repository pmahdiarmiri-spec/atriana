"use client";

import React, { useState } from "react";
import type { PrmPublicAdImage } from "@/lib/prm-advertisements/prm-advertisements-public-api";

interface PrmAdGalleryProps {
  primaryImage: string | null;
  images: PrmPublicAdImage[];
  title: string;
}

export default function PrmAdGallery({
  primaryImage,
  images,
  title,
}: PrmAdGalleryProps) {
  const prmAllImages =
    images.length > 0
      ? images.map((img) => img.url)
      : primaryImage
      ? [primaryImage]
      : [];

  const [activeImage, setActiveImage] = useState<string | null>(
    prmAllImages[0] || null,
  );

  return (
    <div className="prm-ad-gallery flex flex-col gap-3">
      <div className="prm-ad-gallery-main relative h-80 sm:h-96 w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/70 backdrop-blur-2xl shadow-[0_20px_45px_-15px_rgba(15,23,42,0.12)]">
        <div
          className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] opacity-80"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), rgba(245,158,11,0.6), transparent)",
          }}
        />

        {activeImage ? (
          <img
            src={activeImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-4.5-4.5L7 20" />
            </svg>
          </div>
        )}
      </div>

      {prmAllImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {prmAllImages.map((imgUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveImage(imgUrl)}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border transition-all ${
                activeImage === imgUrl
                  ? "border-[var(--prm-secondary-color)] shadow-[0_0_0_3px_rgba(245,158,11,0.25)]"
                  : "border-white/60 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
