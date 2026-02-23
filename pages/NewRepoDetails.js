export class NewRepoPage {
    constructor(page) {
        this.page = page;

        // Locators for NewRepoPage elements
        this.readmeFileCreation = page.getByRole('link', { name: 'README' });
        this.CommitChanges = page.getByRole('button', { name: 'Commit changes...' });
    }

    // Method to select the option to create README file
    async selectReadmeFileCreation() {
        await this.readmeFileCreation.click();
    }

    // Method to click on Commit changes button
    async clickCommitChanges() {
        await this.CommitChanges.click();
    }

}
