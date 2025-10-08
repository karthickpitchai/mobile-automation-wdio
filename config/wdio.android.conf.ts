import { config as sharedConfig } from './wdio.shared.conf';
import { join } from 'path';

// Parse CLI arguments
const getCliArg = (argName: string, defaultValue: string | number): string | number => {
    const arg = process.argv.find(arg => arg.startsWith(`--${argName}=`));
    return arg ? arg.split('=')[1] : defaultValue;
};

const hostname = getCliArg('hostname', 'localhost') as string;
const port = parseInt(getCliArg('port', 4723) as string, 10);
const deviceName = getCliArg('deviceName', 'emulator-5554') as string;
const udid = getCliArg('udid', '') as string;
const platformVersion = getCliArg('platformVersion', '16.0') as string;

export const config: WebdriverIO.Config = {
    ...sharedConfig,

    specs: [
        join(process.cwd(), 'features', '**', '*.feature')
    ],

    hostname: hostname,
    port: port,
    path: '/',

    // Connection settings
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    capabilities: [{
        "wdio:maxInstances": 100,
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': deviceName,
        ...(udid && { 'appium:udid': udid }),
        'appium:platformVersion': platformVersion,
        'appium:app': join(process.cwd(), 'apps', 'android', 'android.wdio.apk'),
        'appium:appWaitActivity': '*',
        'appium:newCommandTimeout': 240,
        'appium:autoGrantPermissions': true,
        'appium:noReset': true,
        'appium:fullReset': false,
        'appium:printPageSourceOnFindFailure': true,
        'appium:dontStopAppOnReset': true,
        'appium:forceAppLaunch': true,
        'appium:clearSystemFiles': true,
        'appium:enforceAppInstall': false
    }]
};
