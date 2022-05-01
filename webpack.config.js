const path = require('path');
const fs = require('fs');

module.exports = {
    // The main file to watch and start compiling the build from
    entry: './project/Boot.js',
    output: {
        // Where to export the file
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'project'),
                ],
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-env'].map(require.resolve)
                }
            }
        ]
    }
};
