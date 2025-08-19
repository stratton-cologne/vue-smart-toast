import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/style.ts",
            formats: ["es", "cjs"],
            fileName: (format) => (format === "es" ? "style.mjs" : "style.cjs"),
        },
        outDir: "dist",
        emptyOutDir: false, // dist vom Lib-Build behalten
        cssCodeSplit: false, // eine einzige CSS-Datei erzeugen
        rollupOptions: {
            output: {
                // erzwingt Dateinamen "style.css" im Dist-Root
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith(".css"))
                        return "style.css";
                    return assetInfo.name || "[name][extname]";
                },
            },
        },
    },
});
