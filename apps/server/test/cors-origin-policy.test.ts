import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { isSocketOriginAllowed } from "../src/index.js";

describe("CORS origin policy", () => {
  it.each([
    { RS_PARTY_CORS_ORIGINS: "*" },
    { CORS_ALLOWED_ORIGINS: "https://host.example, *" },
    { RS_PARTY_CORS_ORIGINS: "https://*.example" },
  ])("rejects wildcard configuration at load time: %o", (env) => {
    expect(() => loadConfig(env)).toThrow("CORS wildcard origins are not allowed");
  });

  it("never treats a wildcard allowlist entry as a socket origin match", () => {
    expect(isSocketOriginAllowed("https://untrusted.example", ["*"], 3210)).toBe(false);
  });

  it("permits an explicitly configured socket origin only", () => {
    const allowed = ["https://party.example"];
    expect(isSocketOriginAllowed("https://party.example", allowed, 3210)).toBe(true);
    expect(isSocketOriginAllowed("https://untrusted.example", allowed, 3210)).toBe(false);
  });
});
