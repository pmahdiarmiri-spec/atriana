import localFont from "next/font/local";

export const prmVazirmatn = localFont({
  src: [
    {
      path: "../assets/fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    }
  ],
  variable: "--font-prm-vazirmatn",
  display: "swap",
});

export const prmInter = localFont({
  src: [
    {
      path: "../assets/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    }
  ],
  variable: "--font-prm-inter",
  display: "swap",
});
