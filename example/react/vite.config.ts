import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import importToCDN, { autoComplete } from '../../dist/index'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        importToCDN({
            modules: [
                autoComplete('react-dom'),
                autoComplete('moment'),
                autoComplete('antd'),
                {
                    name: 'react',
                    var: 'React',
                    path: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js`,
                },
                {
                    name: 'lottie-web',
                    var: 'lottie',
                    mode: 'defer', // 'defer' atrribute will be added to its <script> tag.
                    path: `https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
                },
                {
                    name: 'axios',  // Module without 'mode' param will be loaded synchronously.
                    var: 'axios',
                    path: 'https://cdn.jsdelivr.net/npm/axios@1.2.1/dist/axios.min.js',
                }
            ],
        }),
        reactRefresh(),
    ],
})
