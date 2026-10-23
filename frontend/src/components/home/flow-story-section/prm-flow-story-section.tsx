"use client";

import { useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Database, BrainCircuit, PackageCheck } from "lucide-react";
import PrmFlowStoryBackground from "@/components/home/flow-story-section/prm-flow-story-background";
import PrmFlowStoryContent from "@/components/home/flow-story-section/prm-flow-story-content";
import PrmFlowStoryStepper from "@/components/home/flow-story-section/prm-flow-story-stepper";
import { usePrmFlowStoryStage } from "@/components/home/flow-story-section/prm-use-flow-story-stage";

type PrmFlowStoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

const prmFlowStoryIcons = [Database, BrainCircuit, PackageCheck];

export default function PrmFlowStorySection() {
  const t = useTranslations("home.flowStory");
  const prmSectionRef = useRef<HTMLElement | null>(null);

  const prmSteps = useMemo(() => t.raw("steps") as PrmFlowStoryStep[], [t]);

  const prmTotalPanels = prmSteps.length;
  const { activeStage, progress } = usePrmFlowStoryStage(
    prmSectionRef,
    prmTotalPanels
  );

  const currentStep = prmSteps[activeStage];
  const currentIcon = prmFlowStoryIcons[activeStage];

  const prmScrollToStage = (index: number) => {
    if (!prmSectionRef.current) return;
    const prmRect = prmSectionRef.current.getBoundingClientRect();
    const prmSectionTop = window.scrollY + prmRect.top;
    const prmPanelHeight = (prmRect.height - window.innerHeight) / (prmTotalPanels - 1 || 1);
    
    window.scrollTo({
      top: prmSectionTop + (index * prmPanelHeight),
      behavior: "smooth"
    });
  };

  return (
    <section
      ref={prmSectionRef}
      className="prm-flow-story-section relative z-20 w-full overflow-visible py-24 scroll-mt-20"
      style={{ height: `${prmTotalPanels * 100}vh` }}
    >
      <div className="sticky top-20 flex h-screen w-full items-center justify-center overflow-hidden">
        <PrmFlowStoryBackground />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_400px]">
            <div className="order-2 flex min-h-[450px] items-center lg:order-1">
              <AnimatePresence mode="wait">
                {currentStep && (
                  <PrmFlowStoryContent
                    key={currentStep.id}
                    icon={currentIcon}
                    eyebrow={currentStep.eyebrow}
                    title={currentStep.title}
                    description={currentStep.description}
                    points={currentStep.points}
                    index={activeStage}
                    total={prmSteps.length}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="order-1 lg:order-2">
              <PrmFlowStoryStepper
                badge={t("badge")}
                title={t("title")}
                description={t("description")}
                steps={prmSteps}
                activeStage={activeStage}
                progress={progress}
                onSelect={prmScrollToStage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
