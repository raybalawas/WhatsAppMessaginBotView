import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import netlify from 'vite-plugin-netlify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()/*, netlify()*/],
})
