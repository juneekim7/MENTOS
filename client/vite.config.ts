import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxImportSource: "@emotion/react"
        })
    ],
    server: {
        port: 80,
        strictPort: true
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: resolve(__dirname, "src")
            },
            {
                find: "@assets",
                replacement: resolve(__dirname, "src/assets")
            }
        ]
    }
})