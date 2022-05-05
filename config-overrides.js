module.exports = {
    webpack: function (config, env) {
        config.module.rules.push({
            test: /\.css$/i,
            use: [
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                'tailwindcss/nesting',
                                'tailwindcss',
                                'autoprefixer',
                            ],
                        },
                    },
                },
            ],
        });

        return config;
    }
};
