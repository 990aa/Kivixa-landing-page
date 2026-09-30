# Kivixa Landing Page

This repository contains the static landing page for [Kivixa](https://github.com/990aa/Kivixa).
It is published as a GitHub Pages site from the repository root.

## Release synchronization

The main Kivixa repository updates this repository automatically whenever it creates a
release. The workflow:

- Generates [`version.js`](./version.js), the single source of truth for the displayed
  release version and download links.
- Copies the main repository README to [`reference-README.md`](./reference-README.md).
- Commits and pushes those changes with the `LANDING_PAGE_PAT` secret.

The version file is generated, so release updates should be made by creating a release
in the main repository rather than editing `version.js` manually.

## Local preview

Because the page uses local JavaScript and assets, serve this directory with any static
HTTP server, then open the server URL in a browser. For example:

```sh
bunx serve .
```

The page has no build step or runtime dependencies.
