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
                                require('tailwindcss'),
                                require('postcss-nested'),
                                require('autoprefixer')
                            ]
                        }
                    }
                }
            ]
        });

        return config;
    }
};
