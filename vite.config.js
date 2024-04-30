import { defineConfig } from "vite";

export default defineConfig({
    build: {
        base: '/portfolio/',
        minify: "terser",
    },
})