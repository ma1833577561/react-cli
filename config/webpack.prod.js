const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const publicCssLoaders = () => {
    return [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [
                            // 能解决大多数样式兼容性问题
                            "postcss-preset-env",
                        ],
                    },
                },
            },
    ];
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/[name].[contenthash:10].js",
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      {
        oneOf: [
            // 处理css
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: publicCssLoaders(),
            },
            {
                test: /\.less$/,
                use: [
                    ...publicCssLoaders(),
                    "less-loader",
                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    ...publicCssLoaders(),
                    "sass-loader",
                ],
            },
            {
                test: /\.styl$/,
                use: [
                    ...publicCssLoaders(),
                    "stylus-loader",
                ],
            },
            // 处理图片
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: "asset",
                parser: {
                dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
                },
                },
            },
            // 处理其他资源
            {
                test: /\.(ttf|woff2?)$/,
                type: "asset/resource",
            },
            // 处理js
            {
                test: /\.(jsx|js)$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        // "@babel/plugin-transform-runtime" // presets中包含了
                    ],
                },
            },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
        context: path.resolve(__dirname, "../src"),
        exclude: "node_modules",
        cache: true,
        cacheLocation: path.resolve(
            __dirname,
            "../node_modules/.cache/.eslintcache"
        ),
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, "../public"),
                to: path.resolve(__dirname, "../dist"),
                toType: "dir",
                // 不生成错误
                noErrorOnMissing: true, 
                globOptions: {
                    // 忽略文件
                    ignore: ["**/index.html"],
                },
                info: {
                    // 跳过terser压缩js
                    minimized: true,
                },
            },
        ],
    }),
  ],
  optimization: {
    // 压缩的操作
    minimizer: [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin(),
        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        [
                            "svgo",
                            {
                                plugins: [
                                    "preset-default",
                                    "prefixIds",
                                    {
                                        name: "sortAttrs",
                                        params: {
                                            xmlnsOrder: "alphabetical",
                                        },
                                    },
                                ],
                            },
                        ],
                    ],
                },
            },
        }),
    ],
    splitChunks: {
        chunks: "all",
        // 其他一般都用默认值
        cacheGroups: {
            // layouts通常是admin项目的主体布局组件，所有路由组件都要使用的
            // 可以单独打包，从而复用
            // 如果项目中没有，请删除
            layouts: {
                name: "layouts",
                test: path.resolve(__dirname, "../src/layouts"),
                priority: 40,
            },
            // 如果项目中使用antd，此时将所有node_modules打包在一起，那么打包输出文件会比较大。
            // 所以我们将node_modules中比较大的模块单独打包，从而并行加载速度更好
            // 如果项目中没有，请删除
            antd: {
                name: "chunk-antd",
                test: /[\\/]node_modules[\\/]antd(.*)/,
                priority: 30,
            },
            // 将react相关的库单独打包，减少node_modules的chunk体积。
            react: {
                name: "react",
                test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
                chunks: "initial",
                priority: 20,
            },
            libs: {
                name: "chunk-libs",
                test: /[\\/]node_modules[\\/]/,
                // 权重最低，优先考虑前面内容
                priority: 10, 
                chunks: "initial",
            },
        }  
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  mode: "production",
  devtool: "source-map",
  // 关闭性能分析，提示速度
  performance: false, 
};