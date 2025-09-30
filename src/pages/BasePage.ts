export default class BasePage {
    /**
     * Wait for an element to be displayed
     * @param element - WebdriverIO element
     * @param timeout - timeout in milliseconds
     */
    async waitForElement(element: any, timeout: number = 30000): Promise<void> {
        const el = await element;
        await el.waitForDisplayed({ timeout });
    }

    /**
     * Click on an element
     * @param element - WebdriverIO element
     */
    async click(element: any): Promise<void> {
        await this.waitForElement(element);
        const el = await element;
        await el.click();
    }

    /**
     * Set value in an input field
     * @param element - WebdriverIO element
     * @param value - value to set
     */
    async setValue(element: any, value: string): Promise<void> {
        await this.waitForElement(element);
        const el = await element;
        await el.setValue(value);
    }

    /**
     * Get text from an element
     * @param element - WebdriverIO element
     * @returns text content
     */
    async getText(element: any): Promise<string> {
        await this.waitForElement(element);
        const el = await element;
        return await el.getText();
    }

    /**
     * Check if element is displayed
     * @param element - WebdriverIO element
     * @returns boolean
     */
    async isElementDisplayed(element: any): Promise<boolean> {
        try {
            const el = await element;
            return await el.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Scroll to element
     * @param element - WebdriverIO element
     */
    async scrollToElement(element: any): Promise<void> {
        const el = await element;
        await el.scrollIntoView();
    }

    /**
     * Wait for a specific duration
     * @param milliseconds - duration in milliseconds
     */
    async pause(milliseconds: number): Promise<void> {
        await browser.pause(milliseconds);
    }

    /**
     * Hide keyboard (mobile specific)
     */
    async hideKeyboard(): Promise<void> {
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
    }

    /**
     * Swipe on screen
     * @param direction - up, down, left, right
     */
    async swipe(direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
        const { width, height } = await driver.getWindowSize();
        const centerX = width / 2;
        const centerY = height / 2;

        let startX = centerX;
        let startY = centerY;
        let endX = centerX;
        let endY = centerY;

        switch (direction) {
            case 'up':
                startY = height * 0.8;
                endY = height * 0.2;
                break;
            case 'down':
                startY = height * 0.2;
                endY = height * 0.8;
                break;
            case 'left':
                startX = width * 0.8;
                endX = width * 0.2;
                break;
            case 'right':
                startX = width * 0.2;
                endX = width * 0.8;
                break;
        }

        await driver.touchPerform([
            { action: 'press', options: { x: startX, y: startY } },
            { action: 'wait', options: { ms: 1000 } },
            { action: 'moveTo', options: { x: endX, y: endY } },
            { action: 'release' }
        ]);
    }
}
