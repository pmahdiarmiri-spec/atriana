"use client";

import { RefObject, useEffect, useState } from "react";

export function usePrmFlowStoryStage(
  containerRef: RefObject<HTMLElement | null>,
  totalPanels: number
) {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prmUpdateScroll = () => {
      const prmElement = containerRef.current;
      if (!prmElement) return;

      const prmRect = prmElement.getBoundingClientRect();
      const prmWindowHeight = window.innerHeight;
      const prmSectionHeight = prmRect.height;
      
      const prmDistanceFromTop = -prmRect.top;
      const prmTotalScrollable = prmSectionHeight - prmWindowHeight;
      
      const prmRawProgress = prmDistanceFromTop / (prmTotalScrollable || 1);
      const prmClampedProgress = Math.min(Math.max(prmRawProgress, 0), 1);

      setProgress(prmClampedProgress);
      
      const prmStageSize = 1 / totalPanels;
      const prmCurrentStage = Math.floor(prmClampedProgress / prmStageSize);
      
      setActiveStage(Math.min(prmCurrentStage, totalPanels - 1));
    };

    window.addEventListener("scroll", prmUpdateScroll, { passive: true });
    window.addEventListener("resize", prmUpdateScroll);
    prmUpdateScroll();

    return () => {
      window.removeEventListener("scroll", prmUpdateScroll);
      window.removeEventListener("resize", prmUpdateScroll);
    };
  }, [containerRef, totalPanels]);

  return { activeStage, progress };
}
