const test = require('node:test');
const { resolve } = require('path');
const { merge } = require('webpack-merge');
const { resourceLimits } = require('worker_threads');
// const webpackDevConfig = require('./config/webpack.development.js');
// const webpackProdConfig = require('./config/webpack.production.js');
const args = require('yargs-parser')(process.argv.slice(2));
const mode = args.mode || 'development';
const webpackMergeConfig = require(`./config/webpack.${mode}.js`);

console.log('Build mode:', args);
console.log(process.argv );
console.log(webpackMergeConfig);

const webpackBaseConfig = {
    entry: './src/main.tsx',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@': resolve(__dirname, 'src'),
            "@hooks": resolve(__dirname, 'src/hooks'),
            "@components": resolve(__dirname, 'src/components'),
            "@assets": resolve(__dirname, 'src/assets'),
            "@utils": resolve(__dirname, 'src/utils'),
            "@pages": resolve(__dirname, 'src/pages'),
            "@abis": resolve(__dirname, 'src/abis'),
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
}

module.exports = merge(webpackBaseConfig,webpackMergeConfig)