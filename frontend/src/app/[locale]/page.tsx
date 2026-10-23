import React from "react";
import PrmHeroSection from "@/components/home/hero/prm-hero-section";
import PrmAiAssistantMain from "@/components/home/ai-assistant-section/prm-ai-assistant-main";
import PrmAhpSection from "@/components/home/ahp-section/prm-ahp-section";
import PrmDataPlatformSection from "@/components/home/data-platform-section/prm-data-platform-section";
import PrmServicesSection from "@/components/home/services-section/prm-services-section";
import PrmFlowStorySection from "@/components/home/flow-story-section/prm-flow-story-section";
import PrmDynamicMonitorSection from "@/components/home/dynamic-monitor-section/prm-dynamic-monitor-section";
import PrmContactMain from "@/components/home/contact-section/prm-contact-main";
import PrmFaqMain from '@/components/home/faq-section/prm-faq-main';

export default function HomePage() {
  return (
    <div className="prm-home-page min-h-screen bg-[var(--prm-bg-light)]">
      <PrmHeroSection />
      <PrmAiAssistantMain />
      <PrmAhpSection />
      <PrmDataPlatformSection />
      <PrmServicesSection />
      <PrmFlowStorySection />
      <PrmDynamicMonitorSection />
      <PrmContactMain />
      <PrmFaqMain /> 
    </div>
  );
}
