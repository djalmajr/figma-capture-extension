# Privacy Policy

**Last updated:** March 28, 2026

## Data Collection

Figma Capture does **not** collect, transmit, or store any personal data. All data remains on your device.

## What is stored locally

The extension uses `chrome.storage.local` to persist:

- **Figma file keys** — label and key pairs you configure
- **Active key selection** — which key is currently active

This data never leaves your browser. It is not sent to any server, analytics service, or third party.

## Remote code

The extension loads `https://mcp.figma.com/mcp/html-to-design/capture.js`, the official Figma HTML-to-Design capture script. This script is loaded only when you trigger a capture. It is owned and maintained by Figma, Inc.

## Permissions

| Permission | Purpose |
| --- | --- |
| `activeTab` | Inject capture script on the current tab |
| `storage` | Persist file keys locally |
| `scripting` | Execute capture script via `chrome.scripting.executeScript` |
| `tabs` | Read tab URL to detect active capture hash |

## Third parties

No data is shared with third parties. The only external request is loading the Figma capture script from `mcp.figma.com`.

## Contact

For questions about this policy, [open an issue](https://github.com/djalmajr/figma-capture-extension/issues).
