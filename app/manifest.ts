import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Velyxor",
    short_name: "Velyxor",
    description: "Master Every Keystroke.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090f",
    theme_color: "#6C63FF",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
