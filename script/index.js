const { build } = require("esbuild");

build({
  entryPoints: ["src/server.ts"], // 入口文件路径
  bundle: true, // 是否进行打包
  outfile: "dist/bundle.js", // 打包后的输出文件路径
  minify: true, // 是否进行代码压缩
  sourcemap: true, // 是否生成源映射文件
  platform: "node", // 构建目标平台，这里选择 Node.js 环境
}).catch(() => process.exit(1));
