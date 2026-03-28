# Figma Capture

One-click Chrome extension to capture any web page to Figma using the official [HTML-to-Design](https://www.figma.com/community/plugin/1159123024924461424) capture script.

## How it works

1. **Add a Figma file key** — open the popup, enter a label and the file key from your Figma file URL
2. **Click the icon** — the extension injects the capture script, sets the `#figmacapture` hash, and reloads the page
3. **Paste in Figma** — open your Figma file and paste (`Ctrl/Cmd+V`)

The extension icon shows the Figma logo in **color** when a capture hash is active, and **gray** when idle.

## Features

- One-click capture to clipboard (no CORS issues)
- Multiple Figma file keys with labels
- Switch active key from settings
- Visual icon state (color = hash active, gray = idle)
- Clean hash removal preserving other URL fragments
- No data collection — everything stays in `chrome.storage.local`

## Getting the file key

From your Figma file URL:

```
https://www.figma.com/design/aBcDeFgHiJkLmNoPqRsT/My-File
                               ^^^^^^^^^^^^^^^^^^^^^^
                               this is the file key
```

## Install from source

1. Clone this repo
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the cloned folder

## Install from Chrome Web Store

Coming soon.

## Privacy

See [PRIVACY.md](PRIVACY.md). No data is collected or transmitted.

## License

MIT
