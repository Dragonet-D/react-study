import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // 'eslint-plugin-react-compiler',
          'babel-plugin-react-compiler',
        ],
      },
    }),
  ],
})
