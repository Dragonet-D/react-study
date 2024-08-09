import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import babel from 'vite-plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    react({
      babel: {
        plugins: [
            [
              'babel-plugin-react-compiler',
              {
                runtimeModule: path.resolve(__dirname, './src/useCache'),
              }
            ]
        ],
      },
    }),
  ],
})
