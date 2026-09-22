import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr Qudsia Akram",
    short_name: "Qudsia Akram",
    description: "International Relations scholar at Kinnaird College for Women, Lahore.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F9FF",
    theme_color: "#F6F9FF",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
