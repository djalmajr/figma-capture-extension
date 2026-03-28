import { describe, expect, test } from "bun:test";
import { FILE_KEY_RE, HASH, esc, generateId, cleanHash } from "./helpers.js";

describe("esc", () => {
  test("passes plain text through", () => {
    expect(esc("Platform")).toBe("Platform");
  });

  test("escapes HTML tags", () => {
    expect(esc("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  test("escapes quotes and ampersands", () => {
    expect(esc('"hello" & \'world\'')).toBe('&quot;hello&quot; &amp; \'world\'');
  });

  test("handles empty string", () => {
    expect(esc("")).toBe("");
  });
});

describe("HASH", () => {
  test("generates correct hash format", () => {
    expect(HASH("abc123")).toBe("#figmacapture=abc123&figmaselector=body");
  });

  test("includes the key verbatim", () => {
    const key = "YHo2HzenvNOjhcr9H7iwn0";
    expect(HASH(key)).toContain(`figmacapture=${key}`);
  });

  test("always uses body as selector", () => {
    expect(HASH("x")).toEndWith("&figmaselector=body");
  });
});

describe("FILE_KEY_RE", () => {
  test("accepts alphanumeric keys", () => {
    expect(FILE_KEY_RE.test("YHo2HzenvNOjhcr9H7iwn0")).toBe(true);
  });

  test("accepts hyphens and underscores", () => {
    expect(FILE_KEY_RE.test("my-file_key-123")).toBe(true);
  });

  test("rejects spaces", () => {
    expect(FILE_KEY_RE.test("has space")).toBe(false);
  });

  test("rejects HTML injection", () => {
    expect(FILE_KEY_RE.test('<img src=x onerror="alert(1)">')).toBe(false);
  });

  test("rejects empty string", () => {
    expect(FILE_KEY_RE.test("")).toBe(false);
  });

  test("rejects special characters", () => {
    expect(FILE_KEY_RE.test("key&extra=1")).toBe(false);
    expect(FILE_KEY_RE.test("key#hash")).toBe(false);
  });
});

describe("generateId", () => {
  test("returns 8-char string", () => {
    expect(generateId()).toHaveLength(8);
  });

  test("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("cleanHash", () => {
  test("removes figmacapture hash completely", () => {
    expect(cleanHash("#figmacapture=abc123&figmaselector=body")).toBe("");
  });

  test("preserves other hash fragments", () => {
    expect(cleanHash("#other=value&figmacapture=abc&figmaselector=body")).toBe("#other=value");
  });

  test("handles lone figmacapture without figmaselector", () => {
    expect(cleanHash("#figmacapture=abc")).toBe("");
  });

  test("handles empty hash", () => {
    expect(cleanHash("")).toBe("");
  });

  test("handles hash with only #", () => {
    expect(cleanHash("#")).toBe("");
  });

  test("preserves unrelated hash", () => {
    expect(cleanHash("#section-1")).toBe("#section-1");
  });

  test("preserves multiple unrelated params", () => {
    expect(cleanHash("#a=1&figmacapture=x&b=2&figmaselector=body")).toBe("#a=1&b=2");
  });
});
