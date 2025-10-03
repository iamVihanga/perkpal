import { Bricolage_Grotesque, Inter } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const fontPalo = localFont({
  src: [
    {
      path: "./palo-wide/extralight.otf",
      weight: "200",
      style: "normal"
    },
    {
      path: "./palo-wide/light.otf",
      weight: "300",
      style: "normal"
    },
    {
      path: "./palo-wide/regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./palo-wide/medium.otf",
      weight: "500",
      style: "normal"
    },
    {
      path: "./palo-wide/semibold.otf",
      weight: "600",
      style: "normal"
    },
    {
      path: "./palo-wide/bold.otf",
      weight: "700",
      style: "normal"
    },
    {
      path: "./palo-wide/extrabold.otf",
      weight: "800",
      style: "normal"
    },
    {
      path: "./palo-wide/black.otf",
      weight: "900",
      style: "normal"
    }
  ],
  variable: "--font-palo"
});
