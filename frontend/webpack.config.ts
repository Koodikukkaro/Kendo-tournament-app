import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import DotenvPlugin from "dotenv-webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { Configuration } from "webpack";

const envFilePath = path.resolve(__dirname, ".env");
const prod = process.env.NODE_ENV === "production";

const devServer: DevServerConfiguration = {
  host: "0.0.0.0",
  port: 3000,
  historyApiFallback: true,
  open: true
};

const config: Configuration = {
  mode: prod ? "production" : "development",
  entry: "./src/index.tsx",
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  output: {
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: [".ts", ".tsx", ".js", ".json"]
        },
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  devServer,
  devtool: prod ? undefined : "source-map",
  plugins: [
    new DotenvPlugin({
      path: envFilePath
    }),
    new ESLintPlugin({
      extensions: ["ts", "tsx"]
    }),
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new MiniCssExtractPlugin()
  ]
};

export default config;
