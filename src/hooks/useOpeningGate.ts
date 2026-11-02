"use client";

import { useCallback, useState } from "react";

export type GatePhase = "video" | "main";

export function useOpeningGate() {
  const [gatePhase, setGatePhase] = useState<GatePhase>("video");
  const [videoAutoplayBlocked, setVideoAutoplayBlocked] = useState(false);

  const enterMain = useCallback(() => {
    setGatePhase("main");
  }, []);

  const onVideoPlayFailed = useCallback(() => {
    setVideoAutoplayBlocked(true);
  }, []);

  const onVideoPlaying = useCallback(() => {
    setVideoAutoplayBlocked(false);
  }, []);

  return {
    gatePhase,
    enterMain,
    videoAutoplayBlocked,
    onVideoPlayFailed,
    onVideoPlaying,
  };
}
