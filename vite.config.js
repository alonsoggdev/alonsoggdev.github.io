import { defineConfig } from "vite";

export default defineConfig({
    build: {
        base: '/',
        minify: "terser",
    },
})