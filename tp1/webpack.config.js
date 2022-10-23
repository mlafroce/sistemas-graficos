const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require( 'path' );

module.exports = {
    devtool: 'source-map',
    // bundling mode
    //mode: 'production',
    mode: 'development',

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/*.glsl' }
            ]
        })
    ],


    // entry files
    entry: './src/index.ts',

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'main.js',
    },

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
};
