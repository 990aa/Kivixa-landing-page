import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

interface LatestRelease {
  version: string;
  windowsUrl: string | null;
  windowsMsixUrl: string | null;
  androidArm64Url: string | null;
}

async function fetchLatestGitHubVersion(): Promise<LatestRelease | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/990aa/kivixa/releases/latest",
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const version = (data.tag_name as string).replace(/^v/, "").split("+")[0];
    const windowsAsset = data.assets.find((a: { name: string }) =>
      a.name.toLowerCase().endsWith(".exe"),
    );
    const windowsMsixAsset = data.assets.find((a: { name: string }) =>
      a.name.toLowerCase().endsWith(".msix"),
    );
    const androidArm64Asset = data.assets.find(
      (a: { name: string }) =>
        a.name.toLowerCase().includes("arm64") && a.name.toLowerCase().endsWith(".apk"),
    );
    const encodedTag = encodeURIComponent(data.tag_name as string);
    const derivedMsixUrl = `https://github.com/990aa/kivixa/releases/download/${encodedTag}/kivixa.msix`;
    return {
      version,
      windowsUrl: windowsAsset?.browser_download_url ?? null,
      windowsMsixUrl: windowsMsixAsset?.browser_download_url ?? derivedMsixUrl,
      androidArm64Url: androidArm64Asset?.browser_download_url ?? null,
    };
  } catch {
    return null;
  }
}

test.describe("Kivixa landing", () => {
  test("loads with title and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await expect(page).toHaveTitle(/Kivixa/i);
    await page.waitForLoadState("networkidle");
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("renders all key sections", async ({ page }) => {
    await page.goto("/");
    for (const id of [
      "hero-section",
      "features-section",
      "models-section",
      "privacy-section",
      "download-section",
      "faq-section",
      "footer-section",
    ]) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  test("footer shows version and github link", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByTestId("footer-version");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/v\d+\.\d+/);
  });

  test("windows install: winget copy + exe download button", async ({ page }) => {
    await page.goto("/");

    // Hero CTA scrolls to download
    const heroCta = page.locator("a:has-text('Download for your device')").first();
    await expect(heroCta).toBeVisible();

    const winExe = page.getByTestId("download-windows-primary");
    await expect(winExe).toBeVisible();
    const exeHref = await winExe.getAttribute("href");
    expect(exeHref).toMatch(/^https:\/\/github\.com\/990aa\/kivixa\/releases\/download\/.+\.exe$/);

    // Copy button sits inside the Windows card next to the winget command
    const copyBtn = page.locator("button:has-text('Copy')").first();
    await expect(copyBtn).toBeVisible();
  });

  test("android install: APK download + F-Droid toggle", async ({ page }) => {
    await page.goto("/");

    const apk = page.getByTestId("download-android-primary");
    await expect(apk).toBeVisible();
    const apkHref = await apk.getAttribute("href");
    expect(apkHref).toMatch(/^https:\/\/github\.com\/990aa\/kivixa\/releases\/download\/.+\.apk$/);

    // F-Droid disclosure button
    const fdroid = page.locator("button:has-text('F-Droid repo')").first();
    await expect(fdroid).toBeVisible();
  });

  test("download URLs match latest GitHub release when reachable", async ({ page }) => {
    const github = await fetchLatestGitHubVersion();
    if (!github) test.skip(true, "GitHub API unavailable in test environment");
    const g = github!;

    await page.goto("/");

    const winHref = await page.getByTestId("download-windows-primary").getAttribute("href");
    expect(winHref).toBe(g.windowsUrl);

    const apkHref = await page.getByTestId("download-android-primary").getAttribute("href");
    expect(apkHref).toBe(g.androidArm64Url);
  });

  test("displays version matching latest GitHub release when reachable", async ({ page }) => {
    const github = await fetchLatestGitHubVersion();
    if (!github) test.skip(true, "GitHub API unavailable in test environment");
    const g = github!;

    await page.goto("/");
    const footerVersion = page.getByTestId("footer-version");
    await expect(footerVersion).toContainText(`v${g.version}`);
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    await page.goto("/");
    const firstQ = page.getByTestId("faq-section").locator("button").first();
    await firstQ.scrollIntoViewIfNeeded();
    await expect(firstQ).toHaveAttribute("aria-expanded", "false");
    await firstQ.click();
    await expect(firstQ).toHaveAttribute("aria-expanded", "true");
  });

  test("passes axe accessibility checks", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Every image must have alt text
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt?.trim().length, `Image #${i} missing alt`).toBeGreaterThan(0);
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
});