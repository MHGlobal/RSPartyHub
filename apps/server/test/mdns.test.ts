import { describe, expect, it, vi } from "vitest";
import { loadConfig } from "../src/config.js";
import { announceMdns } from "../src/mdns.js";

describe("mDNS announcement", () => {
  it("is configurable off without loading bonjour", async () => {
    const load = vi.fn();
    const announcement = await announceMdns({ enabled: false, port: 3210, load });

    announcement.close();
    expect(load).not.toHaveBeenCalled();
    expect(loadConfig({ RS_PARTY_MDNS: "false" }).mdnsEnabled).toBe(false);
  });

  it("publishes only safe custom-TCP metadata and destroys on close", async () => {
    const stop = vi.fn();
    const destroy = vi.fn();
    const publish = vi.fn(() => ({ stop }));
    const load = vi.fn().mockResolvedValue({
      Bonjour: class { publish = publish; destroy = destroy; },
    });

    const announcement = await announceMdns({ enabled: true, port: 43821, load });

    expect(publish).toHaveBeenCalledWith({
      name: "RS Party Hub",
      type: "rsparty",
      protocol: "tcp",
      port: 43821,
      txt: { version: "1" },
    });
    announcement.close();
    announcement.close();
    expect(stop).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("keeps LAN IP startup available when dynamic loading fails", async () => {
    const warn = vi.fn();
    await expect(announceMdns({
      enabled: true,
      port: 3210,
      load: async () => { throw new Error("multicast unavailable"); },
      warn,
    })).resolves.toEqual(expect.objectContaining({ close: expect.any(Function) }));
    expect(warn).toHaveBeenCalledOnce();
  });
});
