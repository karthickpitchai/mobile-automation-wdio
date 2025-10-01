import { config as sharedConfig } from './wdio.shared.conf';
import { join } from 'path';

export const config: WebdriverIO.Config = {
    ...sharedConfig,

    specs: [
        join(process.cwd(), 'features', '**', '*.feature')
    ],

    // hostname: '192.168.1.67',
    hostname: 'localhost',
    port: 4723,
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
