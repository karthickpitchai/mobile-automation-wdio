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

    specs: [
        join(process.cwd(), 'features', '**', '*.feature')
    ],

    hostname: hostname,
    port: port,
    path: '/',

    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'emulator-5554',
        'appium:platformVersion': '16.0',
        'appium:app': join(process.cwd(), 'apps', 'android', 'android.wdio.apk'),
        'appium:appWaitActivity': '*',
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:printPageSourceOnFindFailure': true
    }]
};
