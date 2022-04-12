module.exports = {
    module: {
        rules: [{
            test: /\.(js|jsx|ts|tsx)$/,
            use: {
                loader: 'babel-loader',
            },
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }],
        presets: [
            "next/babel"
        ],
        plugins: [
            [
                "babel-plugin-styled-components",
                {
                    "ssr": true,
                    "minify": true,
                    "transpileTemplateLiterals": true,
                    "pure": true,
                    "displayName": true,
                    "preprocess": false
                }
            ]
        ]
    }
};