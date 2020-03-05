/* eslint-disable */
var path = require("path");
var webpack = require("webpack");
var copyPlugin = require("copy-webpack-plugin");
var miniCssExtractPlugin = require("mini-css-extract-plugin");
// var htmlPlugin = require("html-webpack-plugin");

const isWebpackDevServer = process.argv.some(
  a => path.basename(a) === "webpack-dev-server"
);

const isWatch = process.argv.some(a => a === "--watch");

module.exports = {
  mode: process.env.BUILD_MODE || "production",
  devtool:
    process.env.BUILD_MODE == "development" ? "inline-source-map" : "none",
  entry: ["./src/Main.purs"],
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
    sourceMapFilename: "index_bundle.js.map"
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, "dist"),
    port: 8082,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new copyPlugin([
      { from: "html/index.html", to: "." }
    ]),
    new miniCssExtractPlugin({
      moduleFilename: ({ name }) => `stylesheets/${name}.css`
    }),
  ],
  module: {
    rules: [
      {
        test: /\.purs$/,
        exclude: /node_modules/,
        use: {
          loader: "purs-loader",
          options: {
            src: [".spago/*/*/src/**/*.purs", "src/**/*.purs"],
            bundle: false,
            watch: isWebpackDevServer || isWatch,
            pscIde: true,
            ...(process.env.CONSOLE_PURS_IDE_PORT
              ? {
                  pscIdeArgs: { port: process.env.CONSOLE_PURS_IDE_PORT },
                  pscIdeServerArgs: { port: process.env.CONSOLE_PURS_IDE_PORT },
                  pscIdeClientArgs: { port: process.env.CONSOLE_PURS_IDE_PORT }
                }
              : {}),
            ...(process.env.CONSOLE_PURS_OUTPUT
              ? {
                  output: path.join(__dirname, process.env.CONSOLE_PURS_OUTPUT)
                }
              : {})
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /.s[ac]ss/,
        include: path.join(__dirname, "./stylesheets"),
        use: [
          miniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              prependData:
                "$uri_prefix: " + process.env.CONSOLE_RESOURCES_PREFIX + ";"
            }
          }
        ]
      }
    ]
  }
};
