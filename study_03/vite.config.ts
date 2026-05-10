import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import path from 'path'

// 빌드 후 인라인된 <script type="module"> → <script> 로 변환
// (file:// 프로토콜에서 type="module" 은 CORS 오류로 차단됨)
const stripModuleType = {
  name: 'strip-module-type',
  apply: 'build' as const,
  closeBundle() {
    const htmlPath = path.resolve('dist', 'index.html')
    if (!fs.existsSync(htmlPath)) return
    let html = fs.readFileSync(htmlPath, 'utf-8')
    html = html.replace(/<script type="module">/g, '<script>')
    html = html.replace(/<script type="module" /g, '<script ')
    fs.writeFileSync(htmlPath, html)
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), stripModuleType],
  base: './',
  server: { open: true },
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
})
