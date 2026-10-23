"use client";

import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import PrmMonitorVisuals from "./prm-monitor-visuals";
import PrmMonitorContent from "./prm-monitor-content";

export default function PrmDynamicMonitorSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const activeIndex = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 4]);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-[var(--prm-bg-light)]">
      <div className="sticky top-0 left-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 md:p-12">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[var(--prm-secondary-color)] opacity-[0.06] blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-[var(--prm-accent-color)] opacity-[0.04] blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between h-full gap-8">
          <div className="w-full md:w-1/2 flex items-center justify-center h-[45vh] md:h-[70vh]">
            <div className="relative w-full h-full max-w-xl prm-liquid-glass-container">
              <PrmMonitorVisuals scrollProgress={scrollYProgress} />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center h-[45vh] md:h-[70vh]">
            <PrmMonitorContent activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}
