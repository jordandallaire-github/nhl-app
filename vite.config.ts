import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir: '../public',
  assetsInclude: ['**/*.svg'],
  plugins: [react(), svgr()],
  base: './',
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html')
      },
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')){
              return 'assets/images/[name]-[hash][extname]';
          }
          
          if (/\.svg$/.test(name ?? '')) {
              return 'assets/icons/[name]-[hash][extname]';   
          }

          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';   
          }
          // default value
          // ref: https://rollupjs.org/guide/en/#outputassetfilenames
          return 'assets/[name]-[hash][extname]';
        },
      }
    }
  },
})
