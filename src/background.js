// Always show popup on icon click
chrome.action.setPopup({ popup: "popup.html" });

const COLOR_ICON = { 16: "icons/icon-16.png", 48: "icons/icon-48.png", 128: "icons/icon-128.png" };
const GRAY_ICON = { 16: "icons/icon-gray-16.png", 48: "icons/icon-gray-48.png", 128: "icons/icon-gray-128.png" };

async function updateIcon(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    const active = tab.url?.includes("figmacapture=");
    chrome.action.setIcon({ tabId, path: active ? COLOR_ICON : GRAY_ICON });
  } catch (e) { console.warn("updateIcon:", e); }
}

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === "complete") {
    updateIcon(tabId);
    injectCaptureScript(tabId);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => updateIcon(tabId));

async function injectCaptureScript(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url?.includes("figmacapture=")) return;
    await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: () => {
        if (!document.getElementById("figma-html-to-design-capture")) {
          const s = document.createElement("script");
          s.id = "figma-html-to-design-capture";
          s.src = "https://mcp.figma.com/mcp/html-to-design/capture.js";
          s.async = true;
          document.head.appendChild(s);
        }
      },
    });
  } catch (e) { console.warn("injectCaptureScript:", e); }
}

// Set gray as default
chrome.action.setIcon({ path: GRAY_ICON });
