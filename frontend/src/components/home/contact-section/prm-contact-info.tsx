import React from "react";
import { Mail } from "lucide-react";
import Image from "next/image";

export default function PrmContactInfo() {
  const socials = [
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ), 
      link: "#", 
      color: "hover:text-green-500" 
    },
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ), 
      link: "#", 
      color: "hover:text-pink-500" 
    },
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ), 
      link: "#", 
      color: "hover:text-blue-600" 
    },
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
          <polygon points="10 15 15 12 10 9" />
        </svg>
      ), 
      link: "#", 
      color: "hover:text-red-500" 
    }
  ];

  return (
    <div className="prm-liquid-glass-container p-8 space-y-10 flex flex-col h-full">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-[var(--prm-primary-color)] border-b-2 border-[var(--prm-secondary-color)] pb-2 w-fit">اطلاعات تماس</h3>
        <div className="flex items-center gap-4 prm-glass-sub-card p-4 rounded-2xl group transition-all hover:bg-white/80">
          <div className="bg-[var(--prm-primary-color)] p-3 rounded-xl text-white group-hover:scale-110 transition-transform">
            <Mail size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[var(--prm-text-light)] font-medium">ایمیل سازمانی:</span>
            <span className="font-bold text-[var(--prm-text-dark)]">info@atrianagroup.com</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <p className="font-bold text-[var(--prm-text-dark)]">ارتباط در شبکه‌های اجتماعی</p>
        <div className="flex gap-4">
          {socials.map((social, idx) => (
            <a 
              key={idx} 
              href={social.link} 
              className={`prm-glass-sub-card w-12 h-12 flex items-center justify-center rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl ${social.color} text-[var(--prm-text-dark)]`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="prm-glass-sub-card p-6 flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--prm-secondary-color)]/30 relative overflow-hidden group">
          <div className="prm-glass-gloss absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative w-48 h-48 bg-white p-2 rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Image src="/whatsapp-qrcode.png" alt="QR Contact" width={192} height={192} className="w-full h-full object-contain" priority />
          </div>
          <p className="text-xs font-bold text-[var(--prm-text-light)] animate-pulse">اسکن کنید و اطلاعات تماس را ذخیره کنید</p>
        </div>
      </div>
    </div>
  );
}
