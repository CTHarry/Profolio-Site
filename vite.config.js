import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const htmlEntry = (fileName) => fileURLToPath(new URL(fileName, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: htmlEntry("index.html"),
        projects: htmlEntry("projects.html"),
        other: htmlEntry("creative-lab.html"),
        contact: htmlEntry("contact.html"),
        experience: htmlEntry("experience.html"),
        blog: htmlEntry("blog.html"),
      },
    },
  },
});
