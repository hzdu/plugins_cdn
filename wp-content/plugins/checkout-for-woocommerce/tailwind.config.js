module.exports = {
    content: [
        './sources/ts/admin/**/*',
        './includes/**/*',
        './sources/**/*',
        './src/**/*.{js,jsx,ts,tsx}',
        './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    500: '#4e9ae0',
                    600: '#2372c5',
                },
                gray: {
                    100: '#f0f0f1',
                },
            },
        },
    },
    darkMode: 'class',
    plugins: [
        require( '@tailwindcss/forms' ),
    ],
    corePlugins: {
        preflight: true,
    },
};
