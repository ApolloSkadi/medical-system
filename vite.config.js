import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
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
    },
    server:{
        host: '0.0.0.0',
        post: 8999,
        strictPort: false,
        open: true,
        // 后端接口代理
        proxy: {
            '/system':{
                target: 'http://localhost:8077',
                // target: 'https://api.followupsystem.online',
                changeOrigin: true,
            }
        },
        // 预热文件，预热登录页面
        warmup: {
            clientFiles: ['./src/pages/login/*.jsx']
        }
    }
})
