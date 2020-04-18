module.exports = {
    webpack: function (config, env) {
        const purgecss = require('@fullhuman/postcss-purgecss')({

            // Specify the paths to all of the template files in your project
            content: [
                './src/**/*.html',
                './src/**/*.jsx',
                './src/**/*.tsx',
            ],

            // Include any special characters you're using in this regular expression
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        });

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
                            require('autoprefixer'),
                            ...process.env.NODE_ENV === 'production'
                                ? [purgecss]
                                : []
                        ],
                    },
                },
            ]
        });

        return config;
    }
};
