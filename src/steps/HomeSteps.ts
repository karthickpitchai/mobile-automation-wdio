import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@wdio/globals';
import HomePage from '../pages/HomePage';

Given(/^I am on the home page$/, async () => {
    // App should launch on home page
    await browser.pause(2000);
});

When(/^I click the buttons on home page$/, async () => {
     await HomePage.clickButtons();
});

