import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: (() => {
    // GitHub Pages serves the site from "/<repo>/"
    const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1]
    if (process.env.GITHUB_ACTIONS && repo) return `/${repo}/`
    return '/'
  })(),
})
