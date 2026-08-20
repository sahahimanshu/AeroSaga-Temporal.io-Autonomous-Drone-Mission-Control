// <<<<<<< HEAD
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
// });
// =======
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import cesium from 'vite-plugin-cesium'

// export default defineConfig({
//   plugins: [react(), cesium()],
// })
// >>>>>>> origin/Komal

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [react(), cesium()],
});