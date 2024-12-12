
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    //打包文件目录
    outDir: "./dist",
    rollupOptions: {
      //忽略打包vue文件
      external: ["vue", "vue-router"],
      input: ["./packages/index.ts"],
    },
    lib: {
      entry: "./packages/index.ts",
      name: 'janus-bury',
      fileName: "index",
      formats: ['es', 'umd']
    },
    target: 'esnext'
  },
  plugins: [
    dts({
      entryRoot: "./packages",
      outputDir: ["./dist"],
      tsConfigFilePath: "./tsconfig.json",
    })
  ]
});

