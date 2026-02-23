export class HomePage {
    constructor(page) {
        this.page = page;

        // Locators for HomePage elements
        this.dashboard = page.locator('.styles-module__contextCrumbLast__tI2e3');
        this.repositories = page.getByRole('link', { name: 'Repositories' });

    }
    // Method to verify that whether dashboard is visible
    async isDashboardVisible() {
        return await this.dashboard.isVisible();
    }

    // Method to navigate to repositories page
    async navigateToRepositories() {
        await this.repositories.click();
    }

    async getCurrentURL() {
        return this.page.url();
    }
}