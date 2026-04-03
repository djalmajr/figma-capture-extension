// --- SVG icons ---
const ICONS = {
  figma: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>`,
  settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  save: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>`,
  sync: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
  dismiss: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  del: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  add: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
};

import { FILE_KEY_RE, HASH, esc, generateId, cleanHash } from "./helpers.js";

// --- Storage ---
async function getState() {
  const { keys, activeKeyId } = await chrome.storage.local.get(["keys", "activeKeyId"]);
  return { keys: keys || [], activeKeyId: activeKeyId || null };
}

async function saveKeys(keys, activeKeyId) {
  await chrome.storage.local.set({ keys, activeKeyId });
}

// --- Capture ---
async function captureTab(fileKey) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // Remove CSP for this tab so capture.js can load
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: [{
      id: 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "Content-Security-Policy", operation: "remove" },
          { header: "Content-Security-Policy-Report-Only", operation: "remove" },
        ],
      },
      condition: {
        tabIds: [tab.id],
        resourceTypes: ["main_frame"],
      },
    }],
  });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (hash) => {
      location.hash = hash;
      location.reload();
    },
    args: [HASH(fileKey)],
  });
  window.close();
}

async function clearHash() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [1] });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const cleaned = location.hash
        .replace(/[#&]?figmacapture=[^&]*/g, "")
        .replace(/[#&]?figmaselector=[^&]*/g, "")
        .replace(/^#?&/, "#");
      const clean = cleaned === "#" || cleaned === "" ? "" : cleaned;
      history.replaceState(null, "", location.pathname + location.search + clean);
    },
  });
  window.close();
}

// --- Rendering ---
const header = document.getElementById("header");
const container = document.getElementById("scene-container");

function renderHeader(scene) {
  if (scene === "settings") {
    header.innerHTML = `
      <button id="btn-back" class="btn-icon">${ICONS.back}</button>
      <span class="title">Settings</span>
    `;
    header.querySelector("#btn-back").onclick = () => render("active");
  } else {
    header.innerHTML = `
      <span class="icon">${ICONS.figma}</span>
      <span class="title">Figma Capture</span>
      <span class="spacer"></span>
      <button id="btn-settings" class="btn-icon">${ICONS.settings}</button>
    `;
    header.querySelector("#btn-settings").onclick = () => render("settings");
  }
}

async function render(scene) {
  const state = await getState();
  if (!scene) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const hasHash = tab?.url?.includes("figmacapture=");
    if (state.keys.length === 0) scene = "first-use";
    else if (hasHash) scene = "active";
    else scene = "idle";
  }
  renderHeader(scene);
  if (scene === "first-use") renderFirstUse(state);
  else if (scene === "idle") renderIdle(state);
  else if (scene === "active") renderActive(state);
  else if (scene === "settings") renderSettings(state);
}

function renderIdle(state) {
  const activeKey = state.keys.find((k) => k.id === state.activeKeyId);
  container.innerHTML = `
    <div class="status status-idle">
      <div class="dot"></div>
      <span class="text">Ready to capture</span>
    </div>
    <div class="info-box">
      <div class="info-row">
        <span class="label">Figma File</span>
        <span class="value">${esc(activeKey?.label || "—")}</span>
      </div>
    </div>
    <div class="spacer"></div>
    <button id="btn-capture" class="btn-primary">${ICONS.figma} Copy to Figma</button>
  `;
  container.querySelector("#btn-capture").onclick = () => activeKey && captureTab(activeKey.fileKey);
}

function renderFirstUse(state) {
  container.innerHTML = `
    <div class="onboarding">
      <div class="icon-wrap"><span class="icon">${ICONS.figma}</span></div>
      <div class="text">
        <h3>Add a Figma File</h3>
        <p>Enter a Figma file key.<br/>Then just click the extension icon to capture.</p>
      </div>
    </div>
    <div class="field">
      <label>Label</label>
      <input id="inp-label" type="text" placeholder="Ex: Platform" maxlength="50" />
    </div>
    <div class="field">
      <label>Figma File Key</label>
      <input id="inp-key" type="text" placeholder="Ex: aBcDeFgHiJkLmNoPqRsT" class="mono" maxlength="50" />
    </div>
    <div class="spacer"></div>
    <button id="btn-save" class="btn-primary">${ICONS.save} Save and capture</button>
  `;
  container.querySelector("#btn-save").onclick = async () => {
    const label = container.querySelector("#inp-label").value.trim();
    const fileKey = container.querySelector("#inp-key").value.trim();
    if (!label || !fileKey || !FILE_KEY_RE.test(fileKey)) return;
    const id = generateId();
    await saveKeys([...state.keys, { id, label, fileKey }], id);
    captureTab(fileKey);
  };
}

function renderActive(state) {
  const activeKey = state.keys.find((k) => k.id === state.activeKeyId);
  container.innerHTML = `
    <div class="status status-warning">
      <div class="dot"></div>
      <span class="text">Capture hash active</span>
    </div>
    <div class="info-box">
      <div class="info-row">
        <span class="label">Figma File</span>
        <span class="value">${esc(activeKey?.label || "—")}</span>
      </div>
    </div>
    <div class="hint">
      The <b>#hash</b> is still in the URL. Click below to remove it and return to normal.
    </div>
    <div class="spacer"></div>
    <button id="btn-recapture" class="btn-primary">${ICONS.sync} Capture again</button>
    <button id="btn-clear" class="btn-secondary">${ICONS.dismiss} Clear hash and reload</button>
  `;
  container.querySelector("#btn-recapture").onclick = () => activeKey && captureTab(activeKey.fileKey);
  container.querySelector("#btn-clear").onclick = () => clearHash();
}

function renderSettings(state) {
  const keyItems = state.keys.map((k) => `
    <div class="key-item ${k.id === state.activeKeyId ? "active" : ""}" data-activate="${esc(k.id)}">
      <div class="dot"></div>
      <span class="name">${esc(k.label)}</span>
      <span class="key">${esc(k.fileKey.slice(0, 6))}...${esc(k.fileKey.slice(-2))}</span>
      <button class="del" data-delete="${esc(k.id)}">${ICONS.del}</button>
    </div>`).join("");

  container.innerHTML = `
    <div>
      <div class="section-label">Figma Files</div>
      <div style="display:flex;flex-direction:column;gap:0.5rem">${keyItems}</div>
      <div class="add-row">
        <input id="add-label" type="text" placeholder="Label" maxlength="50" />
        <input id="add-key" type="text" placeholder="File key" maxlength="50" />
        <button id="btn-add">${ICONS.add}</button>
      </div>
      <p class="key-hint">Click a key to activate it. The active key is used when clicking the icon.</p>
    </div>
  `;

  for (const el of container.querySelectorAll("[data-activate]")) {
    el.onclick = async (e) => {
      if (e.target.closest("[data-delete]")) return;
      await saveKeys(state.keys, el.dataset.activate);
      render("settings");
    };
  }
  for (const el of container.querySelectorAll("[data-delete]")) {
    el.onclick = async () => {
      const id = el.dataset.delete;
      const keys = state.keys.filter((k) => k.id !== id);
      const activeKeyId = state.activeKeyId === id ? keys[0]?.id || null : state.activeKeyId;
      await saveKeys(keys, activeKeyId);
      if (keys.length === 0) {
        await clearHash();
        return;
      }
      render("settings");
    };
  }
  container.querySelector("#btn-add").onclick = async () => {
    const label = container.querySelector("#add-label").value.trim();
    const fileKey = container.querySelector("#add-key").value.trim();
    if (!label || !fileKey || !FILE_KEY_RE.test(fileKey)) return;
    const id = generateId();
    await saveKeys([...state.keys, { id, label, fileKey }], state.activeKeyId || id);
    render("settings");
  };
}

render();
