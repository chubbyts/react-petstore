module.exports = {
    webpack: function (config, env) {
        config.module.rules.push({
            test: /\.css$/,
            use: [
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('tailwindcss'),
                            require('postcss-nested'),
                            require('autoprefixer')
                        ],
                    },
                },
            ]
        });

        return config;
    }
};
