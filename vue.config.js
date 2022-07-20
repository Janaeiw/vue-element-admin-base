const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  publicPath: process.env.VUE_PUBLIC_PATH,
  outputDir: process.env.VUE_OUTPUT_DIR,
  devServer: {
    proxy: {
      [`${process.env.VUE_APP_BASE_API}`]: {
        target: process.env.VUE_APP_BASE_HOST,
      },
      "^/user_image": {
        target: `${process.env.VUE_APP_BASE_HOST}`,
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData:
          '@import "./src/styles/variables.scss";@import "./src/styles/mixin.scss";',
      },
    },
  },
  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  configureWebpack: (config) => {
    config.plugins = [...config.plugins];
    config.optimization = {
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
            compress: {
              drop_console: true, // 配置production下移除console
            },
          },
        }),
      ],
    };
  },
};
