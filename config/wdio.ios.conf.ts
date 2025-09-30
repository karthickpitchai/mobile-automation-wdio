import { config as sharedConfig } from './wdio.shared.conf';
import { join } from 'path';

export const config: WebdriverIO.Config = {
    ...sharedConfig,

    hostname: 'localhost',
    port: 4723,
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
