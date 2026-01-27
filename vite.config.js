import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react()
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true // 启用 LESS 的 JavaScript 兼容
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 优化自动引入策略
        extensions: ['.jsx', '.js']
    }
})
