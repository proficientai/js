import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    format: ['cjs'],
    sourcemap: true,
    clean: !options.watch,
    dts: true,
    minify: !options.watch,
  };
});
