import { test, expect } from "@playwright/test";

test("Search and Validate in Raven", async ({ page }) => {
  // STEP 1: GO TO THE SITE
  await page.goto("https://10.237.196.187:4432/LinkWorkbench/index.jsp");

  // STEP 2: LOGIN

  await page.fill("#inputUsername", "ms170318");
  await page.fill("#inputPassword", "p@$$Dec2025");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.locator(".content")).toBeVisible({
    timeout: 30000,
  });
  // await expect(page.getByTitle("LINK Workbench")).toBeVisible();

  // STEP 3: OPEN MENU
  await page.locator("button.AppBar_leftIcon").click();

  // STEP 4: OPEN “Communications”
  await page
    .locator(".MainMenu_item.MainMenu_groupItem.MainMenu_firstLevel", {
      hasText: "Communications",
    })
    .click();

  // STEP 5: OPEN “Notification History”
  await page.getByRole("menuitem", { name: "Notification History" }).click();

  // Validate page loaded
  await expect(page.locator(".ItemsTable_welcome")).toBeVisible();

  // STEP 6: Enter MSISDN & Apply
  const msidn = page.locator(".Input_input.CombinedInput_input");

  await msidn.fill("639270962327");

  // changing the date
  const picker = page.locator(".rdt").first();

  await picker.locator(".Input_input").click();
  await picker
    .locator(".rdtDay:not(.rdtOld):not(.rdtNew)", { hasText: "10" })
    .click();

  await page.locator(".FlatButton_label", { hasText: "Apply" }).click();

  const rows = page.locator(".PopoutTableRow_root");

  // Wait until at least 1 row appears — custom logic
  await expect(async () => {
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  }).toPass({ timeout: 30000 });

  console.log("Results found");

  // Take screenshot after rows appear
  await page.screenshot({
    path: "results-found.png",
    fullPage: true,
  });

  // STEP 8: Logout
  await page.locator("button.AppBar_leftIcon").click();

  await page
    .locator(".MainMenu_item.MainMenu_firstLevel", {
      hasText: "Logout",
    })
    .click();
});
