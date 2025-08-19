import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [vue(), dts({ insertTypesEntry: true })],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "VueSmartToast",
            fileName: (f) => `vue-smart-toast.${f}.js`,
            formats: ["es", "cjs", "umd"],
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                exports: "named",
                globals: { vue: "Vue" },
            },
        },
    },
});
