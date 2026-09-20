// Webpack 5 config (ES module syntax - requires "type": "module" in package.json)
import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
    // Always resolve a mode explicitly. `--mode` wins, then NODE_ENV, then development.
    // (If mode is left unset webpack silently minifies like production, but our own
    //  `prod` checks would say "dev" -> inline source maps -> a huge main.js.)
    const mode =
        argv.mode || (process.env.NODE_ENV === "production" ? "production" : "development");
    const prod = mode === "production";

    return {
        mode,
        entry: "./src/index.js",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: prod ? "[name].[contenthash].js" : "[name].js",
            assetModuleFilename: "assets/[name].[hash:8][ext]",
            clean: true,
        },
        // separate-file source maps in prod are optional; inline (eval) ones only in dev
        devtool: prod ? false : "eval-source-map",
        // keep the webpack runtime in its own tiny chunk so app changes don't bust its cache
        optimization: {
            runtimeChunk: "single",
        },
        // size hints only matter for production bundles
        performance: {
            hints: prod ? "warning" : false,
        },
        devServer: {
            static: "./dist",
            hot: true,
            open: true,
            watchFiles: ["src/template.html"],
        },
        plugins: [
            new HtmlWebpackPlugin({ template: "./src/template.html" }),
            new MiniCssExtractPlugin({
                filename: prod ? "[name].[contenthash].css" : "[name].css",
            }),
        ],
        module: {
            rules: [
                { test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"] },
                // images + svgs -> emitted as files, import returns the URL
                { test: /\.(png|jpe?g|gif|webp|avif|svg)$/i, type: "asset/resource" },
            ],
        },
    };
};
