import BasePage from './BasePage';

class LoginPage extends BasePage {
    /**
     * Define selectors for Android and iOS
     */
    private usernameInput(): ChainablePromiseElement{
        const selector = driver.isAndroid
            ? '~username-input'
            : '~username-input';
        return $(selector);
    }

    private passwordInput(): ChainablePromiseElement{
        const selector = driver.isAndroid
            ? '~password-input'
            : '~password-input';
        return $(selector);
    }

    private loginButton(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~login-button'
            : '~login-button';
        return $(selector);
    }

    private errorMessage(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~error-message'
            : '~error-message';
        return $(selector);
    }

    /**
     * Enter username
     * @param username - username to enter
     */
    async enterUsername(username: string): Promise<void> {
        await this.setValue(this.usernameInput(), username);
    }

    /**
     * Enter password
     * @param password - password to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.setValue(this.passwordInput(), password);
    }

    /**
     * Click login button
     */
    async clickLoginButton(): Promise<void> {
        await this.click(this.loginButton());
    }

    /**
     * Perform login
     * @param username - username
     * @param password - password
     */
    async login(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    /**
     * Get error message text
     * @returns error message
     */
    async getErrorMessage(): Promise<string> {
        return await this.getText(this.errorMessage());
    }

    /**
     * Check if error message is displayed
     * @returns boolean
     */
    async isErrorMessageDisplayed(): Promise<boolean> {
        return await this.isElementDisplayed(this.errorMessage());
    }
}

export default new LoginPage();
