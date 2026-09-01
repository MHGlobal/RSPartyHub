/**
 * Optional LAN mDNS announcement. It deliberately contains no join URLs,
 * addresses, room identifiers, tokens, or other private runtime data.
 */

export interface MdnsService {
  stop(callback?: () => void): void;
}

export interface MdnsInstance {
  publish(options: {
    name: string;
    type: string;
    protocol: "tcp";
    port: number;
    txt: Record<string, string>;
  }): MdnsService;
  destroy(callback?: () => void): void;
}

export interface BonjourModule {
  Bonjour: new () => MdnsInstance;
}

export interface MdnsAnnouncement {
  close(): void;
}

export interface MdnsAnnouncementOptions {
  enabled: boolean;
  port: number;
  load?: () => Promise<BonjourModule>;
  warn?: (message: string, error?: unknown) => void;
}

const noopAnnouncement: MdnsAnnouncement = { close() {} };

/**
 * Announce the HTTP server as a custom `_rsparty._tcp` service.
 *
 * Loading and publishing are intentionally isolated here: mDNS must never
 * prevent HTTP startup, joining by LAN IP, or shutdown.
 */
export async function announceMdns({
  enabled,
  port,
  load = async () => {
    const module = await import("bonjour-service");
    // Keep the production dependency behind a small structural boundary so
    // tests can inject a non-networking publisher.
    return { Bonjour: module.Bonjour as unknown as BonjourModule["Bonjour"] };
  },
  warn = (message, error) => console.warn(message, error),
}: MdnsAnnouncementOptions): Promise<MdnsAnnouncement> {
  if (!enabled) return noopAnnouncement;

  try {
    const { Bonjour } = await load();
    const bonjour = new Bonjour();
    const service = bonjour.publish({
      name: "RS Party Hub",
      type: "rsparty",
      protocol: "tcp",
      port,
      txt: { version: "1" },
    });
    let closed = false;
    return {
      close() {
        if (closed) return;
        closed = true;
        try {
          service.stop();
        } catch (error) {
          warn("[mdns] could not unpublish service", error);
        }
        try {
          // Bonjour's documented cleanup closes its multicast UDP socket.
          bonjour.destroy();
        } catch (error) {
          warn("[mdns] could not destroy service", error);
        }
      },
    };
  } catch (error) {
    warn("[mdns] announcement unavailable; LAN IP discovery remains available", error);
    return noopAnnouncement;
  }
}
