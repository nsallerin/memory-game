const path = require("path")
const dotenv = require("dotenv")
const { DefinePlugin } = require("webpack")

const HtmlWebpackPlugin = require("html-webpack-plugin")

dotenv.config()

module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./src/index.js"],
  plugins: [
    new HtmlWebpackPlugin({
      title: "Development",
      template: path.join(__dirname, "index.html"),
    }),
    new DefinePlugin({
      "process.env": {
        API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || ""),
      },
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    host: "0.0.0.0",
    port: process.env.CLIENT_PORT,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
      },
    ],
  },
}
