import { defineConfig, devices } from '@playwright/test';
import dotenv                    from 'dotenv';
import path                      from 'path';

dotenv.config( { path: path.resolve( __dirname, '.env' ) } );

export const BASE_URL =    process.env.WP_ENV_HOST && process.env.WP_ENV_TESTS_PORT
    ? `http://${process.env.WP_ENV_HOST}:${process.env.WP_ENV_TESTS_PORT}`
    : 'http://localhost:8991';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig( {
    outputDir: './tests/e2e/test-results',
    testDir: './tests/e2e/tests',
    timeout: process.env.CI ? 30 * 1000 : 30 * 1000,
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests due to single WP environment for all tests (e.g. options in db table shared between tests) - slower but less flakey. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [ 'list' ],
        [
            'html',
            {
                outputFolder: 'tests/e2e/playwright-report',
                open: 'never',
            },
        ],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: BASE_URL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'setup',
            testMatch: '**/*.setup.ts',
            teardown: 'teardown',
        },
        {
            name: 'teardown',
            testMatch: 'global.teardown.ts',
        },

        /* Test against desktop viewports. */
        {
            name: 'chromium',
            use: { ...devices[ 'Desktop Chrome' ] },
            dependencies: [ 'setup' ],
        },
        // {
        // 	name: 'firefox',
        // 	use: { ...devices['Desktop Firefox'] },
        // 	dependencies: ['setup'],
        // },
        // {
        // 	name: 'webkit',
        // 	use: { ...devices['Desktop Safari'] },
        // 	dependencies: ['setup'],
        // },

        /* Test against mobile viewports. */
        {
            name: 'mobile chrome',
            use: { ...devices[ 'Pixel 5' ] },
            dependencies: [ 'setup' ],
        },
        // TODO: breaks in CI only - times out on one particular test middway
        // {
        // 	name: 'mobile safari',
        // 	use: { ...devices['iPhone 15'], storageState: STORAGE_STATE },
        // 	dependencies: ['setup'],
        // },
    ],
} );
