import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "screenshots");
const artifactDir = "C:/Users/ronit/.gemini/antigravity/brain/789301ba-effe-4e0a-a382-24b6c353af43";
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  
  // 1. Desktop 1440px
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await contextDesktop.newPage();

  // Reset to showcase state
  await page.request.post("http://localhost:3000/api/reset-demo");

  // Dashboard Desktop (Primary Visual Comparison)
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "dashboard-1440px.png"), fullPage: false });
  await page.screenshot({ path: path.join(artifactDir, "dashboard-1440px.png"), fullPage: false });
  console.log("Captured dashboard-1440px.png");

  // Event Hub
  await page.goto("http://localhost:3000/events/event-our-wedding-celebration", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "event-hub-1440px.png") });
  console.log("Captured event-hub-1440px.png");

  // Budget Manager
  await page.goto("http://localhost:3000/events/event-our-wedding-celebration/budget", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "budget-1440px.png") });
  console.log("Captured budget-1440px.png");

  // AI Copilot
  await page.goto("http://localhost:3000/events/event-our-wedding-celebration/copilot", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "copilot-1440px.png") });
  console.log("Captured copilot-1440px.png");

  // Wizard
  await page.goto("http://localhost:3000/events/new", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "wizard-1440px.png") });
  console.log("Captured wizard-1440px.png");

  // Landing Page
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "landing-1440px.png") });
  console.log("Captured landing-1440px.png");

  // 2. Mobile 390px
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await contextMobile.newPage();
  await mobilePage.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await mobilePage.screenshot({ path: path.join(outDir, "dashboard-mobile-390px.png") });
  console.log("Captured dashboard-mobile-390px.png");

  // 3. Tablet 768px
  const contextTablet = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await contextTablet.newPage();
  await tabletPage.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await tabletPage.screenshot({ path: path.join(outDir, "dashboard-tablet-768px.png") });
  console.log("Captured dashboard-tablet-768px.png");

  await browser.close();
  console.log("All screenshots successfully captured!");
}

run().catch(console.error);
