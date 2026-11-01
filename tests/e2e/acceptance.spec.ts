import { test, expect } from "@playwright/test";

test.describe("Ronit's Master Acceptance Journey", () => {
  test.beforeEach(async ({ request }) => {
    // Reset to clean showcase demo state before test
    await request.post("http://localhost:3000/api/reset-demo");
  });

  test("complete end-to-end event planning lifecycle", async ({ page }) => {
    // 1. Open Planora Landing Page
    await page.goto("http://localhost:3000/");
    await expect(page).toHaveTitle(/Planora/);
    await expect(page.locator("text=Plan beautifully.")).toBeVisible();

    // 2. Navigate to Login & Sign In
    await page.click("text=Sign In");
    await expect(page).toHaveURL(/.*login/);
    await page.click("button[type='submit']");

    // 3. Lands on Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=Welcome back,")).toBeVisible();
    await expect(page.locator("text=Ronit Dhawan").first()).toBeVisible();

    // 4. Verify Exact Reference Elements on Dashboard
    await expect(page.locator("text=Our Wedding Celebration").first()).toBeVisible();
    await expect(page.locator("text=Apr 26, 2025").first()).toBeVisible();
    await expect(page.locator("text=Udaipur, Rajasthan").first()).toBeVisible();
    await expect(page.locator("text=220 Guests").first()).toBeVisible();

    // Check Metric Cards
    await expect(page.locator("text=Total Events").first()).toBeVisible();
    await expect(page.locator("text=Planned Budget").first()).toBeVisible();
    await expect(page.locator("text=₹28,00,000").first()).toBeVisible();
    await expect(page.locator("text=Total Expenses").first()).toBeVisible();
    await expect(page.locator("text=₹17,50,000").first()).toBeVisible();
    await expect(page.locator("text=Remaining Budget").first()).toBeVisible();
    await expect(page.locator("text=₹10,50,000").first()).toBeVisible();
    await expect(page.locator("text=Readiness Score").first()).toBeVisible();

    // Check Cards
    await expect(page.locator("text=Budget Overview").first()).toBeVisible();
    await expect(page.locator("text=Planning Timeline").first()).toBeVisible();
    await expect(page.locator("text=Vendor Checklist").first()).toBeVisible();
    await expect(page.locator("text=Theme Inspiration").first()).toBeVisible();
    await expect(page.locator("text=AI Copilot").first()).toBeVisible();
    await expect(page.locator("text=Upcoming Deadlines").first()).toBeVisible();

    // 5. Open Event Creation Wizard
    await page.click("text=Create Event");
    await expect(page).toHaveURL(/.*events\/new/);

    // Step 1: Wedding selected by default, click Continue
    await page.click("text=Continue");

    // Step 2: Basic Info
    await page.fill("input[placeholder='e.g. Royal Wedding Celebration']", "Royal Wedding Celebration");
    await page.fill("input[placeholder='e.g. Jaipur, Rajasthan']", "Jaipur, Rajasthan");
    await page.click("text=Continue");

    // Step 3: Financial Planning
    await page.click("text=Continue");

    // Step 4: Personalization
    await page.click("text=Continue");

    // Step 5: AI Plan & Review
    await expect(page.locator("text=Step 5: Review & AI Generation")).toBeVisible();
    const generateBtn = page.locator("text=Generate AI Event Plan & Save");
    await generateBtn.click();

    // Wait for plan generation
    await expect(page.locator("text=Open Event Workspace")).toBeVisible({ timeout: 15000 });
    await page.click("text=Open Event Workspace");

    // 6. Manage Budget
    await page.click("text=Budget");
    await expect(page).toHaveURL(/.*budget/);
    await expect(page.locator("text=Budget & Expense Ledger")).toBeVisible();

    // Record an Expense
    await page.click("button:has-text('Record Expense')");
    await page.fill("input[placeholder='e.g. Floral Mandap Initial Deposit']", "Live Shehnai Players Booking");
    await page.fill("input[type='number'][min='1']", "35000");
    await page.click("button[type='submit']:has-text('Save Expense')");

    // Verify Expense appears in ledger
    await expect(page.locator("text=Live Shehnai Players Booking")).toBeVisible();

    // 7. Manage Vendors
    await page.click("text=Vendors");
    await expect(page).toHaveURL(/.*vendors/);
    await expect(page.locator("text=Vendor Directory & Contracts")).toBeVisible();

    // 8. Manage Tasks
    await page.click("text=Timeline");
    await expect(page).toHaveURL(/.*timeline/);
    await expect(page.locator("text=Planning Timeline & Run of Show")).toBeVisible();

    // 9. AI Copilot
    await page.click("text=AI Copilot");
    await expect(page).toHaveURL(/.*copilot/);
    await expect(page.locator("text=AI Event Copilot")).toBeVisible();

    // Send a message to Copilot
    await page.fill("input[placeholder*='Ask anything']", "How can I save ~₹1,20,000 on decor in Udaipur?");
    await page.click("button[aria-label='Send message']");

    // Wait for proposal with Apply Changes
    await expect(page.locator("text=Apply Changes").first()).toBeVisible({ timeout: 15000 });
    await page.click("button:has-text('Apply Changes')");
    await expect(page.locator("text=Applied to Budget").first()).toBeVisible();

    // 10. Verify Data Persists Across Reload
    await page.reload();
    await expect(page.locator("text=Applied to Budget").first()).toBeVisible();

    // 11. Return to Dashboard
    await page.click("text=Dashboard");
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=Welcome back,")).toBeVisible();
  });
});
