import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@wdio/globals';
import LoginPage from '../pages/LoginPage';

When(/^I am on the login page$/, async () => {
    // App should launch on login page
    // Add any additional verification if needed
    await browser.pause(2000);
});

When(/^I enter username "([^"]*)"$/, async (username: string) => {
    await LoginPage.enterUsername(username);
});

When(/^I enter password "([^"]*)"$/, async (password: string) => {
    await LoginPage.enterPassword(password);
});

When(/^I click the login button$/, async () => {
    await LoginPage.clickLoginButton();
});

When(/^I login with username "([^"]*)" and password "([^"]*)"$/, async (username: string, password: string) => {
    await LoginPage.login(username, password);
});


When(/^I should see an error message "([^"]*)"$/, async (expectedMessage: string) => {
    const actualMessage = await LoginPage.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
});

When(/^I should see an error message$/, async () => {
    const isDisplayed = await LoginPage.isErrorMessageDisplayed();
    expect(isDisplayed).toBe(true);
});
