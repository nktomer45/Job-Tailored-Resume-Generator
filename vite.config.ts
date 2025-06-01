import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY) || 'AIzaSyCt0EI9eJf2F-3FYxyHVjH3VtIFN-5JHf8',
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) || 'AIzaSyCt0EI9eJf2F-3FYxyHVjH3VtIFN-5JHf8`'
      }, 
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
