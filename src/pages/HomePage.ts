import BasePage from './BasePage';

class HomePage extends BasePage {
    /**
     * Define selectors for Android and iOS
     */

    private loginButton(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~Login'
            : '~Login';
        return $(selector);
    }
     private webViewButton(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~Webview'
            : '~Webview';
        return $(selector);
    }
     private formsButton(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~Forms'
            : '~Forms';
        return $(selector);
    }
     private swipeButton(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~Swipe'
            : '~Swipe';
        return $(selector);
    }

private dragButton(): ChainablePromiseElement {
        const selector = driver.isAndroid
            ? '~Drag'
            : '~Drag';
        return $(selector);
    }


    /**
     * Click login button
     */
    async clickButtons(): Promise<void> {
        await browser.pause(3000);
        await this.click(this.loginButton());
        await browser.pause(2000);
        await this.click(this.webViewButton());
        await browser.pause(2000);
        await this.click(this.swipeButton());
        await browser.pause(2000);
        await this.click(this.formsButton());
        await browser.pause(2000);
        await this.click(this.dragButton());
        await browser.pause(2000);
    }


}

export default new HomePage();
