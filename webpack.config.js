const { resolve } = require('node:path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const args = require('yargs-parser')(process.argv.slice(2));
const mode = args.mode || 'development';
const webpackMergeConfig = require(`./config/webpack.${mode}.js`);

// const isProd = mode === 'production' ? true :false;
console.log('Build mode:', args);
console.log(process.argv);
console.log(webpackMergeConfig);

const webpackBaseConfig = {
    entry: './src/main.tsx',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css'],
        alias: {
            '@': resolve(__dirname, 'src'),
            "@hooks": resolve(__dirname, 'src/hooks'),
            "@components": resolve(__dirname, 'src/components'),
            "@assets": resolve(__dirname, 'src/assets'),
            "@utils": resolve(__dirname, 'src/utils'),
            "@pages": resolve(__dirname, 'src/pages'),
            "@abis": resolve(__dirname, 'src/abis'),
            // 修复 @noble/hashes 导入路径问题
            '@noble/hashes/sha256': require.resolve('@noble/hashes/sha256'),
            '@noble/hashes/sha512': require.resolve('@noble/hashes/sha512'),
            '@noble/hashes/utils': require.resolve('@noble/hashes/utils'),
            // 修复 React Native 依赖问题
            '@react-native-async-storage/async-storage': false,
        },
        fallback: {
            "path": false,
            "os": false,
            "crypto": false,
            "stream": false,
            "http": false,
            "https": false,
            "zlib": false,
            "url": false,
            "buffer": false,
            "util": false,
            "assert": false,
            "fs": false,
        }
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts|jsx|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',// compile js/ts code, '.swcrc' can be used to configure swc，不传 options，自动读取 .swcrc 文件
                    // options: {
                    //     jsc: {
                    //         parser: {
                    //             syntax: 'typescript',
                    //             tsx: true,
                    //             decorators: true,
                    //         },
                    //         transform: {
                    //             react: {
                    //                 runtime: 'automatic',
                    //             },
                    //         },
                    //     },
                    // },
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         MiniCssExtractPlugin.loader,//如果这里用了MiniCssExtractPlugin插件，必须要在plugins中注册才行，否则会报错
            //         { loader: "css-loader", options: { importLoaders: 1 } },
            //         "postcss-loader",
            //     ],
            // },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                // webpack4使用file-loader或url-loader,options 使用limit设置8kb阈值,name设置输出文件名和路径：options: {limit: 8192,name: 'static/images/[name].[hash].[ext]'}
                // 如下是Webpack 5配置方式：
                type: 'asset',//asset/resource - 总是输出为单独文件，asset/inline - 总是作为 data URI 内联，asset/source - 导出资源的源代码，asset - 根据资源大小自动选择是内联还是输出为单独文件
                generator: {
                    // filename: 'static/images/[hash][ext][query]'//指定输出文件的路径和命名规则，
                    // - **占位符说明**:
                    //   - `static/images/` - 输出目录
                    //   - `[hash]` - 文件内容的 hash 值（用于缓存控制）
                    //   - `[ext]` - 原始文件扩展名（包含 `.`）
                    //   - `[query]` - URL 查询参数（如 `?v=123`）

                    // filename: 'static/images/[name].[hash][ext]'//   - `[name]` - 原始文件名
                    // 输出: static/images/logo.a1b2c3d4.png

                    // [contenthash] - 基于内容的 hash（更精确）
                    filename: 'static/images/[name].[contenthash:8][ext]'
                    // // 输出: static/images/logo.a1b2c3d4.png（hash 只取 8 位）
                },
                parser: {//配置解析选项
                    dataUrlCondition: {//设置 base64 内联的阈值,文件 ≤ 8KB → 转为 base64 内联到 JS/CSS 中,文件 > 8KB → 输出为独立文件
                        maxSize: 8 * 1024 // 8kb
                    }
                }
            }
        ],
    },
    // plugins:[
    //     new MiniCssExtractPlugin({
    //         filename: isProd ? 'styles/[name].[contenthash:8].css': "styles/[name].css",
    //         chunkFilename: isProd ? 'styles/[name].[contenthash:8].css': "styles/[name].css"
    //     })
    // ]
}

module.exports = merge(webpackBaseConfig, webpackMergeConfig)