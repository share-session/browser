//webpack.config.js
const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        main: "./src/content.tsx",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "content.js" // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
            ,
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ]
    }
};
