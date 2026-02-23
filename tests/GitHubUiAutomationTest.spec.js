import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {HomePage} from '../pages/HomePage';
import {RepoPage} from '../pages/RepoPage';
import {NewRepoPage} from '../pages/NewRepo';
import {NewRepoDetails} from '../pages/NewRepoDetails';

// import { createRepoPayload } from '../utils/testData.json';
import * as updateTestData from '../utils/testData.js';

import dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });
test.describe('GitHub Automation using Playwright ', () => {
    let context;
    let page;
    const url = process.env.GITHUB_URL || "https://github.com/login";
    const userId = process.env.GITHUB_USER;
    const password = process.env.GITHUB_PASSWORD;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('Test-01-GitHub Login', async () => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);

        await loginPage.navigate(url);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveTitle(/Sign in to GitHub/);

        //Sign in with valid credentials
        await loginPage.login(userId, password);

        const currentUrl =await loginPage.getCurrentURL();
        console.log("URL after login:", currentUrl);


        const isLoggedIn = currentUrl === 'https://github.com/';
        const isDeviceVerification = currentUrl.includes('/sessions/verified-device');

        await expect(isLoggedIn || isDeviceVerification).toBeTruthy();

        // If device verification is required, handle it
        if (isDeviceVerification) {
            console.log("Device verification is required. Please complete the verification process manually.");
            // Wait for the user to complete device verification
            await page.waitForNavigation({ waitUntil: 'networkidle' });
            const postVerificationUrl = await loginPage.getCurrentURL();
            console.log("URL after device verification:", postVerificationUrl);
            await expect(postVerificationUrl).toBe('https://github.com/');
        }   else {
            console.log("Logged in successfully without device verification.");
        }
        await page.screenshot({ path: `screenshots/login_success_${Date.now()}.png`, fullPage: true });   
        await page.waitForTimeout(2000);
        
        //check whether dashboard is visible or not after login
        const isDashboardVisible = await homePage.isDashboardVisible();
        await expect(isDashboardVisible).toBeTruthy();

        //Navigate to repositories page
        await homePage.navigateToRepositories();
        const repositoriesUrl = await homePage.getCurrentURL();
        console.log("URL after navigating to repositories:", repositoriesUrl);
        await expect(repositoriesUrl).toBe('https://github.com/repos');
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/repositories_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
    });

    test('Test-02-Verify the repository visibility', async () => {
        const repositoryName = `playwright-repo-${Date.now()}`;
        const repoPage = new RepoPage(page);

        // Navigate to My repositories page
        await repoPage.navigateToMyRepositories();
        const myRepositoriesUrl = await page.url();
        console.log("URL after navigating to My repositories:", myRepositoriesUrl);
        await expect(myRepositoriesUrl).toBe('https://github.com/repos');
        await page.waitForLoadState('domcontentloaded');

        await page.screenshot({ path: `screenshots/my_repositories_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);

        // Check if the mentioned repository is visible or not
        const isRepoVisible = await repoPage.isMyRepoVisible();
        console.log("Is the repository visible?", isRepoVisible);
        await expect(isRepoVisible).toBeTruthy();


        // Navigate to create new repository page
        await repoPage.navigateToCreateNewRepository();
        const newRepoUrl = await page.url();
        console.log("URL after navigating to create new repository:", newRepoUrl);
        await expect(newRepoUrl).toBe('https://github.com/new');
        await page.waitForLoadState('domcontentloaded');
        await page.screenshot({ path: `screenshots/create_new_repository_page_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);
    });

    test('Test-03-Create a new repository', async () => {
        const newRepoPage = new NewRepoPage(page);
        const repoData = updateTestData.createRepoPayload();

        // Create a new repository
        await newRepoPage.createNewRepository(repoData);
        await page.waitForTimeout(2000);
        await newRepoPage.selectPrivateVisibility();
        await page.waitForTimeout(2000);
        await newRepoPage.selectPublicVisibility();
        await page.waitForTimeout(2000);
        await newRepoPage.clickCreateRepository();
        // Wait for the repository to be created and the page to load
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const repoUrl = await page.url();
        console.log("URL after creating new repository:", repoUrl);
        await expect(repoUrl).toContain(`/${repoData.name}`);
        await page.screenshot({ path: `screenshots/new_repository_created_${Date.now()}.png`, fullPage: true });
        await page.waitForTimeout(3000);

        await expect(repoUrl).toBe(`https://github.com/${userId}/${repoData.name}`);
    });

});

// To run the test, use the following command in the terminal:
// npx playwright test tests/GitHubUiAutomationTest.spec.js --headed