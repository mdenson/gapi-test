const autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = [
    {
        entry: ['./src/app.scss', './src/app.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
            port: 8000,
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'bundle.css',
                            },
                        },
                        { loader: 'extract-loader' },
                        { loader: 'css-loader' },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer()],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: ['./node_modules'],
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['@babel/preset-env'],
                    },
                },
            ],
        },
    },
];
