import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    //server部分を追加
	server: {
		proxy: {
			'/api': {
				'target': 'http://127.0.0.1:7071',
				changeOrigin: true,
			},
		}
	},
});
