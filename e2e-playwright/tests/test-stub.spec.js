const { test, expect } = require("@playwright/test");

test("Test title", async ({ page }) => {
    await page.goto("localhost:7800");
    await expect(page).toHaveTitle("Questions and answers");
});

test("Test h1", async ({ page }) => {
    await page.goto("localhost:7800");
    await expect(page.locator("h1")).toHaveText("Courses");
});

test("Test questions", async ({ page }) => {
    await page.goto("localhost:7800/courses/1");
    await expect(page.locator("h1")).toHaveText("Questions");
});

test("Adding question", async ({ page }) => {
    await page.goto("localhost:7800/courses/1");
    const questionName = `What?`;
    await page.locator("input[type=text]").type(questionName);
    await page.locator("button[type=submit]").click();
    await expect(page.locator(`#question`)).toHaveText(questionName);
});

test("Adding answer", async ({ page }) => {
    const answerName = `Yes`;
    await page.goto("localhost:7800/courses/1/questions/1");
    await page.locator("input[type=text]").type(answerName);
    await page.locator("button[type=submit]").click();
    await expect(page.locator(`#answer`)).toHaveText(answerName);
});

