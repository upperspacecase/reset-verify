"use client";

import { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { Demo, DEMO_DURATION, DEMO_FPS, DEMO_HEIGHT, DEMO_WIDTH, VERIFIED_FRAME } from "@/remotion/Demo";

export function DemoPlayer() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="glass overflow-hidden rounded-2xl p-2 sm:p-3">
      <div className="overflow-hidden rounded-xl">
        <Player
          component={Demo}
          durationInFrames={DEMO_DURATION}
          fps={DEMO_FPS}
          compositionWidth={DEMO_WIDTH}
          compositionHeight={DEMO_HEIGHT}
          autoPlay={!reducedMotion}
          loop
          initiallyMuted
          controls={false}
          acknowledgeRemotionLicense
          initialFrame={reducedMotion ? VERIFIED_FRAME : 0}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
