module.exports = {
    content: [
        './sources/ts/frontend/**/*',
        './sources/ts/components/**/*',
        './includes/**/*',
        '!./includes/Admin/**/*',
        '!./includes/Managers/**/*',
        './sources/php/**/*',
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
        require( '@shrutibalasa/tailwind-grid-auto-fit' ),
    ],
    corePlugins: {
        preflight: true,
    },
};
