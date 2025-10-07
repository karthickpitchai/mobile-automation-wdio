import { config as sharedConfig } from './wdio.shared.conf';
import { join } from 'path';

// Parse CLI arguments for hostname and port
const getCliArg = (argName: string, defaultValue: string | number): string | number => {
    const arg = process.argv.find(arg => arg.startsWith(`--${argName}=`));
    return arg ? arg.split('=')[1] : defaultValue;
};

const hostname = getCliArg('hostname', 'localhost') as string;
const port = parseInt(getCliArg('port', 4723) as string, 10);

export const config: WebdriverIO.Config = {
    ...sharedConfig,

    hostname: hostname,
    port: port,
    path: '/',

    capabilities: [{
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': 'iPhone 15',
        'appium:platformVersion': '17.0',
        'appium:app': join(process.cwd(), 'apps', 'ios', 'app.app'),
        'appium:newCommandTimeout': 240,
        'appium:autoAcceptAlerts': true,
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:printPageSourceOnFindFailure': true,
        'appium:bundleId': 'com.example.app'
    }],
};
