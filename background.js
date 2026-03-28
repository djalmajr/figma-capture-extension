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
  if (info.status === "complete") updateIcon(tabId);
});

chrome.tabs.onActivated.addListener(({ tabId }) => updateIcon(tabId));

// Set gray as default
chrome.action.setIcon({ path: GRAY_ICON });
