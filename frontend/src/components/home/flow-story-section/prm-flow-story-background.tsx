export default function PrmFlowStoryBackground() {
  return (
    <div className="prm-flow-story-bg pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0b132b]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(234,88,12,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/assets/images/noise.png')] opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
