"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, Link } from "@/i18n/navigation";
import { Home, Building2, TrendingUp, Megaphone, User } from "lucide-react";

export default function PrmBottomBar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(false);
      }, 750);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const navItems = [
    { label: "خانه", href: "/", icon: Home },
    { label: "شرکت‌ها", href: "/companies", icon: Building2 },
    { label: "استراتژی", href: "/strategy", icon: TrendingUp },
    { label: "آگهی", href: "/ads", icon: Megaphone },
    { label: "حساب", href: "/auth", icon: User }
  ];

  return (
    <div className="fixed bottom-5 left-0 right-0 z-40 flex justify-center px-5 pointer-events-none lg:hidden">
      <nav
        className={`pointer-events-auto relative prm-liquid-dock overflow-hidden rounded-full w-full max-w-[360px] flex items-center justify-between ${
          isScrolled 
            ? "py-1.5 px-3 scale-[0.84] opacity-90 shadow-[0_12px_28px_-5px_rgba(0,0,0,0.55)]" 
            : "py-2 px-3.5 scale-100 opacity-100 shadow-[0_25px_50px_-10px_rgba(0,0,0,0.7)]"
        }`}
      >
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative z-10 flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "text-[var(--prm-secondary-color)] font-extrabold"
                  : "text-slate-400 hover:text-white active:scale-95"
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-[var(--prm-secondary-color)]"
                    : ""
                }`}
              >
                <Icon className={`${isScrolled ? "w-4 h-4" : "w-[18px] h-[18px]"} transition-all duration-500`} />
              </div>

              <span
                className={`transition-all duration-500 leading-none mt-0.5 tracking-tight ${
                  isScrolled ? "text-[8.5px]" : "text-[9.5px]"
                } ${isActive ? "text-[var(--prm-secondary-color)]" : "text-slate-400"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
