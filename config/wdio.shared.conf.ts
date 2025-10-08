import type { Options } from '@wdio/types';

// Parse CLI arguments
const getCliArg = (argName: string, defaultValue: string | number): string | number => {
    const arg = process.argv.find(arg => arg.startsWith(`--${argName}=`));
    return arg ? arg.split('=')[1] : defaultValue;
};

const testType = getCliArg('testType', 'Smoke') as string;
// Add @ prefix if not already present
const tagString = testType.startsWith('@') ? testType : `@${testType}`;

export const config: Options.Testrunner = {
    runner: 'local',

    framework: 'cucumber',

    specs: [
        'features/**/*.feature'
    ],

    exclude: [],

    maxInstances: 100,

    logLevel: 'info',

    bail: 0,

    waitforTimeout: 30000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,

    // Enable automatic session recovery
    automationProtocol: 'webdriver',

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
        tags: tagString,
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    /**
     * Gets executed once before all workers get launched.
     */
    onPrepare: function () {
        console.log('Starting test execution...');
    },

    /**
     * Gets executed before test execution begins.
     */
    before: function () {
        console.log('Test session started');
    },

    /**
     * Gets executed after all tests are done.
     */
    onComplete: function() {
        console.log('Test execution completed!');
    }
};
