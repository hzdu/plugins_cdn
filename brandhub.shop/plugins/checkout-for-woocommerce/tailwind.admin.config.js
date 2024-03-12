module.exports = {
    content: [
        './sources/ts/admin/**/*',
        './sources/ts/components/**/*',
        './includes/Admin/**/*',
        './includes/Managers/**/*',
        './sources/php/**/*',
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
        require( '@shrutibalasa/tailwind-grid-auto-fit' ),
    ],
    corePlugins: {
        preflight: true,
    },
};
