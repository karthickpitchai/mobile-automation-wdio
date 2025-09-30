# Mobile Automation Framework - WebdriverIO + Cucumber

A comprehensive mobile automation testing framework using WebdriverIO with Cucumber BDD approach and Page Object Model (POM) for iOS and Android platforms.

## 🏗️ Framework Architecture

```
mobile-automation-wdio/
├── config/                      # Configuration files
│   ├── wdio.shared.conf.ts     # Shared configuration
│   ├── wdio.android.conf.ts    # Android specific config
│   └── wdio.ios.conf.ts        # iOS specific config
├── features/                    # Cucumber feature files
│   ├── login/
│   │   └── login.feature
│   └── home/
│       └── home.feature
├── src/
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── HomePage.ts
│   ├── steps/                  # Step definitions
│   │   ├── LoginSteps.ts
│   │   └── HomeSteps.ts
│   └── utils/                  # Utility helpers
│       ├── GestureHelper.ts
│       ├── WaitHelper.ts
│       └── AppHelper.ts
├── apps/                       # Mobile apps
│   ├── android/               # Android APK files
│   └── ios/                   # iOS APP files
└── package.json
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Appium Server
- Android SDK (for Android testing)
- Xcode (for iOS testing - macOS only)
- Java JDK (for Android testing)

## 🚀 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Install Appium drivers:
```bash
npx appium driver install uiautomator2  # For Android
npx appium driver install xcuitest      # For iOS
```

## 📱 Setup

### Android Setup

1. Place your Android APK file in `apps/android/` directory
2. Update the app path in `config/wdio.android.conf.ts`
3. Configure desired capabilities (device name, platform version, etc.)

### iOS Setup

1. Place your iOS APP file in `apps/ios/` directory
2. Update the app path and bundle ID in `config/wdio.ios.conf.ts`
3. Configure desired capabilities (device name, platform version, etc.)

## 🧪 Running Tests

### Run all tests

**Android:**
```bash
npm run test:android
```

**iOS:**
```bash
npm run test:ios
```

### Run smoke tests

**Android:**
```bash
npm run test:android:smoke
```

**iOS:**
```bash
npm run test:ios:smoke
```

### Run specific feature tests

**Android:**
```bash
npm run test:android:login
```

**iOS:**
```bash
npm run test:ios:login
```

### Run with custom tags

```bash
npx wdio run ./config/wdio.android.conf.ts --cucumberOpts.tagExpression='@smoke and @login'
```

## 🎯 Key Features

### Page Object Model (POM)
- **BasePage**: Base class with common methods for all pages
- Reusable methods for interactions (click, setText, wait, etc.)
- Platform-specific selectors support

### Cucumber BDD
- Feature files written in Gherkin syntax
- Reusable step definitions
- Support for scenario outlines and data tables
- Tag-based test execution

### Utilities
- **GestureHelper**: Swipe, scroll, tap, long press operations
- **WaitHelper**: Various wait strategies
- **AppHelper**: App lifecycle management, platform detection

### Cross-Platform Support
- Single test suite for iOS and Android
- Platform-specific configurations
- Conditional selector handling

## 📝 Writing Tests

### Feature File Example

```gherkin
Feature: Login Functionality

  @smoke @login
  Scenario: Successful login
    Given I am on the login page
    When I login with username "user" and password "pass"
    Then I should see the home page
```

### Step Definition Example

```typescript
When(/^I login with username "([^"]*)" and password "([^"]*)"$/, async (username: string, password: string) => {
    await LoginPage.login(username, password);
});
```

### Page Object Example

```typescript
class LoginPage extends BasePage {
    private get usernameInput() {
        return $('~username-input');
    }

    async enterUsername(username: string): Promise<void> {
        await this.setValue(this.usernameInput, username);
    }
}
```

## 🛠️ Configuration

### Capabilities

Edit `config/wdio.android.conf.ts` or `config/wdio.ios.conf.ts` to customize:
- Device name
- Platform version
- App path
- Automation name
- Other Appium capabilities

### Cucumber Options

Modify `config/wdio.shared.conf.ts` for:
- Timeout settings
- Tag expressions
- Step definition paths
- Report formats

## 📊 Reporting

Test results are displayed in the console using the spec reporter. You can add additional reporters like:
- Allure
- HTML
- JSON

## 🤝 Best Practices

1. **Keep feature files simple and readable**
2. **Use meaningful step definitions**
3. **Follow Page Object Model principles**
4. **Use appropriate waits (explicit over implicit)**
5. **Keep selectors in page objects only**
6. **Write reusable utility methods**
7. **Tag scenarios appropriately**
8. **Use data-driven testing with scenario outlines**

## 🐛 Troubleshooting

### Common Issues

1. **Appium connection failed**: Ensure Appium server is running
2. **Element not found**: Check selectors and wait conditions
3. **App not installed**: Verify app path in config files
4. **Device not connected**: Check device/emulator status

### Debug Mode

Run with debug logging:
```bash
npx wdio run ./config/wdio.android.conf.ts --logLevel=debug
```

## 📚 Resources

- [WebdriverIO Documentation](https://webdriver.io/)
- [Appium Documentation](http://appium.io/docs/en/latest/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)

## 📄 License

ISC
