import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages repo path; overridden by a custom domain later.
export default defineConfig({
  base: '/client-dashboard/',
  plugins: [react()],
})
