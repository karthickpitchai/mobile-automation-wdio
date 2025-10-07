import { config as sharedConfig } from './wdio.shared.conf';
import { join } from 'path';

// Parse CLI arguments
const getCliArg = (argName: string, defaultValue: string | number): string | number => {
    const arg = process.argv.find(arg => arg.startsWith(`--${argName}=`));
    return arg ? arg.split('=')[1] : defaultValue;
};

const hostname = getCliArg('hostname', 'localhost') as string;
const port = parseInt(getCliArg('port', 4723) as string, 10);
const deviceName = getCliArg('deviceName', 'iPhone 15') as string;
const udid = getCliArg('udid', '') as string;
const platformVersion = getCliArg('platformVersion', '17.0') as string;

export const config: WebdriverIO.Config = {
    ...sharedConfig,

     specs: [
        join(process.cwd(), 'features', '**', '*.feature')
    ],
    
    hostname: hostname,
    port: port,
    path: '/',

    capabilities: [{
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': deviceName,
        ...(udid && { 'appium:udid': udid }),
        'appium:platformVersion': platformVersion,
        'appium:app': join(process.cwd(), 'apps', 'ios', 'wdiodemoapp.app'),
        'appium:newCommandTimeout': 240,
        'appium:autoAcceptAlerts': true,
        'appium:noReset': true,
        'appium:fullReset': false,
        'appium:printPageSourceOnFindFailure': true,
        'appium:bundleId': 'com.example.app',
        'appium:dontStopAppOnReset': true,
        'appium:forceAppLaunch': true
    }],
};
