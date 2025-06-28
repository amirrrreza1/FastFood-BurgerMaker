import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FastFood Restaurant",
    short_name: "AmirFast",
    description:
      "A fast food restaurant offering online food ordering with the best quality and fastest delivery.",
    start_url: "/",
    display: "standalone",
    background_color: "#000",
    theme_color: "#a58a01",
    icons: [
      {
        src: "/Logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
