// Fetches the latest Kivixa release from GitHub at build time and exposes
// platform-specific download URLs. Falls back to a known good release so
// the page always renders.

export interface ReleaseData {
  version: string;
  tagName: string;
  releaseUrl: string;
  releasesPageUrl: string;
  windowsUrl: string | null;
  windowsMsixUrl: string | null;
  androidArm64Url: string | null;
  macOSUrl: string | null;
  linuxUrl: string | null;
  iOSUrl: string | null;
}

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  assets: GitHubAsset[];
}

const REPO = "990aa/kivixa";

const FALLBACK: ReleaseData = {
  version: "0.8.25",
  tagName: "v0.8.25+80250",
  releaseUrl: `https://github.com/${REPO}/releases/tag/v0.8.25%2B80250`,
  releasesPageUrl: `https://github.com/${REPO}/releases`,
  windowsUrl: `https://github.com/${REPO}/releases/download/v0.8.25%2B80250/Kivixa-Setup-0.8.25.exe`,
  windowsMsixUrl: `https://github.com/${REPO}/releases/download/v0.8.25%2B80250/kivixa.msix`,
  androidArm64Url: `https://github.com/${REPO}/releases/download/v0.8.25%2B80250/Kivixa-Android-0.8.25-arm64.apk`,
  macOSUrl: null,
  linuxUrl: null,
  iOSUrl: null,
};

export async function getLatestRelease(): Promise<ReleaseData> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as GitHubRelease;

    const windowsAsset = data.assets.find((a) => a.name.toLowerCase().endsWith(".exe"));
    const windowsMsixAsset = data.assets.find((a) => a.name.toLowerCase().endsWith(".msix"));
    const androidArm64Asset = data.assets.find(
      (a) => a.name.toLowerCase().includes("arm64") && a.name.toLowerCase().endsWith(".apk"),
    );

    const version = data.tag_name.replace(/^v/, "").split("+")[0] || data.tag_name;

    const encodedTag = encodeURIComponent(data.tag_name);
    const baseUrl = `https://github.com/${REPO}/releases/download/${encodedTag}`;
    const derivedMsixUrl = `${baseUrl}/kivixa.msix`;
    const macOSUrl = `${baseUrl}/Kivixa-macOS-${version}-universal.zip`;
    const linuxUrl = `${baseUrl}/Kivixa-Linux-${version}-x86_64.tar.gz`;
    const iOSUrl = `${baseUrl}/Kivixa-iOS-${version}-arm64.ipa`;

    return {
      version,
      tagName: data.tag_name,
      releaseUrl: data.html_url,
      releasesPageUrl: `https://github.com/${REPO}/releases`,
      windowsUrl: windowsAsset?.browser_download_url ?? FALLBACK.windowsUrl,
      windowsMsixUrl: windowsMsixAsset?.browser_download_url ?? derivedMsixUrl,
      androidArm64Url: androidArm64Asset?.browser_download_url ?? FALLBACK.androidArm64Url,
      macOSUrl,
      linuxUrl,
      iOSUrl,
    };
  } catch {
    return FALLBACK;
  }
}