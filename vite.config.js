import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {viteMockServe} from "vite-plugin-mock";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteMockServe({
            mockPath: 'src/mock',  // 正确指向mock目录
            localEnabled: true,     // 开发环境启用
            watchFiles: true,       // 监听文件变化
            logger: true           // 启用日志
        }),
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
        proxy: {
            '/system':{
                target: 'http://localhost:8077',
                changeOrigin: true,
            }
        },
        // 预热文件，预热登录页面
        warmup: {
            clientFiles: ['./src/pages/login/*.jsx']
        }
    }
})
