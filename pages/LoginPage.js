export class LoginPage {
    constructor(page) {
        this.page = page;

        //Locators
        this.usernameInput = page.locator('#login_field');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('input[name="commit"]');
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        //Wait for 3 seconds
        await this.page.waitForTimeout(3000);
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(3000);
        await this.loginButton.click();
    }

    async getCurrentURL() {
        return this.page.url();
    }
}