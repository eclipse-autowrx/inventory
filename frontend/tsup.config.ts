import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  // Other config options
  define: {
    'process.env.__NEXT_ROUTER_BASEPATH': '""',
    'process.env': '{}',
  },
});
