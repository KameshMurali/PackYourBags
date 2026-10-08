"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// A muted, looping background video that sits on top of its poster image.
// - Skipped entirely for people who prefer reduced motion or have Data Saver on,
//   so they just see the poster.
// - Fades to the poster just before the loop point, so the restart isn't a hard cut.
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function canPlayBackgroundVideo() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return !window.matchMedia(REDUCED_MOTION).matches && !nav.connection?.saveData;
}

export function LoopVideo({
  src,
  poster,
  alt = "",
  sizes = "100vw",
  priority = false,
  className,
}: {
  src: string;
  poster: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Server render and first paint show only the poster; the video mounts after hydration.
  const enabled = useSyncExternalStore(subscribeToMotionPreference, canPlayBackgroundVideo, () => false);
  const [ready, setReady] = useState(false);
  const [fading, setFading] = useState(false);

  function onTimeUpdate() {
    const video = ref.current;
    if (!video || !video.duration) return;
    const remaining = video.duration - video.currentTime;
    if (remaining < 0.5) setFading(true);
    else if (fading && video.currentTime > 0.4) setFading(false);
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image src={poster} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {enabled && (
        <video
          ref={ref}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onTimeUpdate={onTimeUpdate}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            ready && !fading ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
