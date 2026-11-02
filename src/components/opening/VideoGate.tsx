"use client";

import { useEffect, useRef, useState } from "react";
import { OPENING_VIDEO_SRC } from "@/lib/constants";
import { SkipButton } from "@/components/opening/SkipButton";

type VideoGateProps = {
  onComplete: () => void;
  onPlayFailed: () => void;
  onPlaying: () => void;
  autoplayBlocked: boolean;
};

export function VideoGate({
  onComplete,
  onPlayFailed,
  onPlaying,
  autoplayBlocked,
}: VideoGateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {
      onPlayFailed();
    });
  }, [hydrated, onPlayFailed]);

  if (!hydrated) {
    return <div className="fixed inset-0 z-[100] bg-black" aria-hidden />;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={OPENING_VIDEO_SRC}
        muted
        playsInline
        autoPlay
        onEnded={onComplete}
        onPlay={onPlaying}
        onError={() => {
          onPlayFailed();
          onComplete();
        }}
      />
      {autoplayBlocked ? (
        <button
          type="button"
          className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-4 bg-black/50 text-white backdrop-blur-sm"
          onClick={() => {
            void videoRef.current?.play().then(
              () => onPlaying(),
              () => onPlayFailed(),
            );
          }}
        >
          <span className="text-lg font-medium">Tap to play opening</span>
          <span className="text-sm text-white/80">Preview is muted</span>
        </button>
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-10 pt-6">
        <div className="pointer-events-auto px-6">
          <SkipButton
            onPress={() => {
              videoRef.current?.pause();
              onComplete();
            }}
          />
        </div>
      </div>
    </div>
  );
}
