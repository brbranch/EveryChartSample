const path = require('path');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const PUBLIC_PATH = 'https://everychart.site/';

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx$/,
                use: [{
                    loader: 'awesome-typescript-loader'
                }]
            },
            {
                test: /\.ts$/,
                use: [{
                    loader: 'awesome-typescript-loader'
                }]
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'source-map-loader',
                    options: {
                        enforce: 'pre',
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }]
            },
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: { url: false }
                    }
                ]
            }
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve('./src'),
        ],
        extensions: ['.tsx', '.js', '.ts', 'json']
    },
    output: {
      path: path.resolve(__dirname, '../backend/static/js'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    devtool: "source-map",
    devServer: {
      contentBase: '../backend/static/js'
    },
    plugins: [
        new SWPrecacheWebpackPlugin(
            {
                cacheId: 'everychart-web',
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                filename: 'service-worker.js',
                minify: true,
                staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
            }
        ),
    ]
  };

