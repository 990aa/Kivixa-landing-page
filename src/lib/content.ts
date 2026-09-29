// Content for the landing page. Kept in one place so copy edits don't
// require touching markup. All data is static and shipped as part of the
// bundle.

export interface FeatureCard {
  title: string;
  body: string;
  tag: string;
  icon: FeatureIcon;
}

export type FeatureIcon =
  | "brain"
  | "audio"
  | "notes"
  | "graph"
  | "timer"
  | "terminal";

export const features: FeatureCard[] = [
  {
    title: "On-device AI",
    body: "Run Phi-4, Qwen3.5, Llama 3.2, Gemma 4 and 13 other models entirely on your hardware. No API keys. No internet after download. Full reasoning, writing and tool use — offline.",
    tag: "17 models",
    icon: "brain",
  },
  {
    title: "Audio intelligence",
    body: "Whisper-powered speech-to-text, Kokoro neural TTS, voice notes with karaoke transcription, and a hands-free AI walkie-talkie — all running locally.",
    tag: "Fully offline",
    icon: "audio",
  },
  {
    title: "Rich note-taking",
    body: "Markdown editor, handwriting canvas, floating text boxes, bidirectional note linking, image and video embedding, and Life Git — automatic version control for every note.",
    tag: "+ PDF support",
    icon: "notes",
  },
  {
    title: "Knowledge graph",
    body: "Build visual mind maps with hub, note and idea nodes. Connect them with labelled arrows, pan and zoom freely, and link graph nodes directly to your notes.",
    tag: "Interactive",
    icon: "graph",
  },
  {
    title: "Productivity suite",
    body: "Pomodoro, 52/17, Ultradian timers. Chained routines. Multi-timer orchestration. Project manager with task tracking. Calendar with recurring events and reminders.",
    tag: "Built-in",
    icon: "timer",
  },
  {
    title: "Scriptable & extensible",
    body: "Lua plugin system with a full App API — create, read, move and search notes programmatically. MCP tool execution lets the AI perform file operations on your behalf.",
    tag: "Lua 5.3",
    icon: "terminal",
  },
];

export interface ModelEntry {
  name: string;
  tag: string;
  tone: "silver" | "gold" | "bright" | "muted";
}

export const models: ModelEntry[] = [
  { name: "Phi-4 Mini", tag: "Reasoning", tone: "silver" },
  { name: "Phi-4 Mini Reasoning", tag: "Reasoning", tone: "silver" },
  { name: "Qwen 2.5 3B", tag: "Writing", tone: "gold" },
  { name: "Llama 3.2 3B Instruct", tag: "Chat", tone: "silver" },
  { name: "Qwen2.5 1.5B Instruct", tag: "Efficiency", tone: "muted" },
  { name: "Qwen3.5 4B Distilled", tag: "Reasoning+", tone: "bright" },
  { name: "Qwen3.5 2B Distilled", tag: "Balanced", tone: "muted" },
  { name: "Qwen3.5 0.8B Distilled", tag: "Fast", tone: "muted" },
  { name: "DeepSeek R1 Distill Qwen 1.5B", tag: "Math / Code", tone: "silver" },
  { name: "SmolLM2 1.7B Instruct", tag: "Compact", tone: "muted" },
  { name: "SmolLM3 3B", tag: "General", tone: "silver" },
  { name: "SmolVLM2 500M Video Instruct", tag: "Vision", tone: "gold" },
  { name: "Function Gemma 270M", tag: "Tool use", tone: "bright" },
  { name: "Gemma 2B", tag: "General", tone: "silver" },
  { name: "Gemma 3 4B IT", tag: "Quality", tone: "silver" },
  { name: "Gemma 4 E2B IT", tag: "Quality+", tone: "gold" },
  { name: "TranslateGemma 4B IT", tag: "Translate", tone: "gold" },
];

export interface Pillar {
  title: string;
  description: string;
}

export const pillars: Pillar[] = [
  {
    title: "Local storage",
    description: "Notes, models and vectors stay on your file system. Zero cloud sync, zero account.",
  },
  {
    title: "Encrypted at rest",
    description: "Secure storage with platform-grade primitives. Your data is unreadable without your key.",
  },
  {
    title: "Offline first",
    description: "Every feature works without a network. The internet is optional, never required.",
  },
];

export interface Platform {
  id: PlatformId;
  title: string;
  status: "stable" | "distributed";
  statusLabel: string;
  blurb: string;
  primaryDownload: {
    label: string;
    fileType: string;
    releaseKey: "windowsUrl" | "androidArm64Url" | "macOSUrl" | "linuxUrl" | "iOSUrl";
  };
  secondary?: {
    kind: "winget" | "fdroid";
    label: string;
    detail?: string;
  };
}

export type PlatformId = "windows" | "android" | "macos" | "linux" | "ios";

export const platforms: Platform[] = [
  {
    id: "windows",
    title: "Windows",
    status: "stable",
    statusLabel: "Stable",
    blurb: "winget install or download the signed .exe installer.",
    primaryDownload: { label: "Download .exe", fileType: "exe", releaseKey: "windowsUrl" },
    secondary: { kind: "winget", label: "winget install Kivixa" },
  },
  {
    id: "android",
    title: "Android",
    status: "stable",
    statusLabel: "Stable",
    blurb: "ARM64 APK direct, or subscribe to the F-Droid repo for automatic updates.",
    primaryDownload: { label: "Download APK", fileType: "apk", releaseKey: "androidArm64Url" },
    secondary: { kind: "fdroid", label: "Add F-Droid repo" },
  },
  {
    id: "linux",
    title: "Linux",
    status: "distributed",
    statusLabel: "Distributed",
    blurb: "x86_64 .tar.gz bundle. Vulkan acceleration on supported GPUs.",
    primaryDownload: { label: "Download .tar.gz", fileType: "tar.gz", releaseKey: "linuxUrl" },
  },
  {
    id: "macos",
    title: "macOS",
    status: "distributed",
    statusLabel: "Distributed",
    blurb: "Universal build for x86_64 and Apple Silicon. Notarized for Gatekeeper.",
    primaryDownload: { label: "Download .zip", fileType: "zip", releaseKey: "macOSUrl" },
  },
  {
    id: "ios",
    title: "iOS",
    status: "distributed",
    statusLabel: "Distributed",
    blurb: "IPA — sideload via AltStore or Sideloadly. App Store distribution blocked by Apple policy.",
    primaryDownload: { label: "Download IPA", fileType: "ipa", releaseKey: "iOSUrl" },
  },
];

export interface FAQEntry {
  q: string;
  a: string;
}

export const faqs: FAQEntry[] = [
  {
    q: "What does on-device AI actually mean?",
    a: "Every model — Phi-4, Qwen, Gemma, Llama — is downloaded once and runs locally on your CPU, GPU (Vulkan on Windows/Linux/Android, Metal on macOS) or NPU. After the first download you can disable the network entirely and the AI still works. Nothing is sent to a server.",
  },
  {
    q: "Do I need an account?",
    a: "No. Kivixa has no accounts, no logins, no telemetry. Open the app, start working. Your data is yours.",
  },
  {
    q: "Can I bring my own models?",
    a: "Yes. Drop any GGUF file into the models folder and Kivixa will pick it up. The MCP tool layer lets the model call back into your notes, calendar and timers.",
  },
  {
    q: "How is this different from Obsidian or Notion?",
    a: "Obsidian is local-only markdown. Notion is cloud-only. Kivixa is both — a local-first workspace that ships its own on-device AI, so you get semantic search, summaries and tool use without sending your notes to anyone.",
  },
  {
    q: "What's the catch?",
    a: "AI quality scales with hardware. A 4B parameter model wants ~6 GB of RAM; a 1B model is comfortable on phones. Everything below 3B runs fast on modest laptops. Larger models exist if you have a discrete GPU.",
  },
];

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "Privacy", href: "#privacy" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
];

export const footerLinks: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/990aa/kivixa" },
  { label: "Releases", href: "https://github.com/990aa/kivixa/releases" },
  { label: "Changelog", href: "https://github.com/990aa/kivixa/blob/main/CHANGELOG.md" },
  { label: "Issues", href: "https://github.com/990aa/kivixa/issues" },
];

export const REPO_URL = "https://github.com/990aa/kivixa";
export const RELEASES_URL = "https://github.com/990aa/kivixa/releases";
export const WINGET_COMMAND = "winget install Kivixa";
export const FDROID_REPO_URL = "https://990aa.github.io/kivixa/repo";
export const FDROID_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
  FDROID_REPO_URL,
)}`;