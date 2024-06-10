import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

    // additional configuration for absolute path
    resolve: {
      alias: {
      src: "/src",
    },
  },
})
