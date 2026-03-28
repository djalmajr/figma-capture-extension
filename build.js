import { copyFileSync, cpSync } from "node:fs";

await Bun.build({
  entrypoints: ["src/popup.js", "src/background.js"],
  outdir: "dist",
  minify: true,
  format: "esm",
});

// Copy static files
copyFileSync("manifest.json", "dist/manifest.json");
copyFileSync("popup.html", "dist/popup.html");
cpSync("icons", "dist/icons", { recursive: true });
