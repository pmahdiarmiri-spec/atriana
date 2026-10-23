import PrmHeroStats from "./prm-hero-stats";
import PrmHeroText from "./prm-hero-text";
import PrmWorldMap from "./prm-world-map";

export default function PrmHeroSection() {
  return (
    <section
      id="prm-home-hero"
      className="prm-home-hero relative isolate flex h-[calc(100svh-5rem)] min-h-0 items-center overflow-hidden px-3 py-3 sm:px-5 sm:py-4 lg:px-8"
    >
      <div className="prm-hero-orb prm-hero-orb-primary pointer-events-none absolute -right-32 top-0 -z-20 h-[30rem] w-[30rem] rounded-full bg-amber-400/20 blur-[120px]" />

      <div className="prm-hero-orb prm-hero-orb-secondary pointer-events-none absolute -left-32 bottom-0 -z-20 h-[28rem] w-[28rem] rounded-full bg-orange-500/15 blur-[120px]" />

      <div className="prm-hero-container mx-auto grid h-full max-h-[920px] w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] items-center gap-3 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-1 lg:gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:gap-12">
        <div className="prm-hero-content relative z-10 order-1 flex min-h-0 flex-col justify-center">
          <PrmHeroText />
          <PrmHeroStats />
        </div>

        <div className="prm-hero-visual order-2 flex min-h-0 items-center justify-center">
          <PrmWorldMap />
        </div>
      </div>
    </section>
  );
}
