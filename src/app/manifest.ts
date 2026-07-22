import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlgoNotes — DSA documentation",
    short_name: "AlgoNotes",
    description: "A visual documentation platform for data structures and algorithms.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0284c7",
  };
}
