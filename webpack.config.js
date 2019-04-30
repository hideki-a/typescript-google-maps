module.exports = {
    entry: './src/ts/main.ts',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/app/js',
        libraryTarget: 'umd',
        library: 'myLib'
    },
    mode: 'production',
    // devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            { test: /\.ts/, loader: 'awesome-typescript-loader' },
            // { enforce: 'pre', test: /\.js/, loader: 'source-map-loader' }
        ]
    },
    externals: {
    }
}
