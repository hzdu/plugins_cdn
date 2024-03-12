/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    moduleNameMapper: {
        '@woocommerce/settings': './sources/ts/tests/mock/woocommerce-settings',
    },
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: [ 'sources/ts' ],
    setupFiles: [
        './jest-setup.js',
        './sources/ts/tests/mock/setup-globals.js',
    ],
};
