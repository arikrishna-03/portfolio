import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './', // Makes built asset paths relative so it works on GitHub Pages subdirectories
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
})
