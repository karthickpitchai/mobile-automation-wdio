import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
    runner: 'local',

    framework: 'cucumber',

    specs: [
        'features/**/*.feature'
    ],

    exclude: [],

    maxInstances: 1,


    logLevel: 'info',

    bail: 0,

    waitforTimeout: 30000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,

    // services: ['appium'],

    reporters: ['spec'],

    cucumberOpts: {
        require: ['./src/steps/**/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tags: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    /**
     * Gets executed once before all workers get launched.
     */
    onPrepare: function (config, capabilities) {
        console.log('Starting test execution...');
    },

    /**
     * Gets executed before test execution begins.
     */
    before: function (capabilities, specs) {
        console.log(`Running: ${specs}`);
    },

    /**
     * Gets executed after all tests are done.
     */
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('Test execution completed!');
    }
};
