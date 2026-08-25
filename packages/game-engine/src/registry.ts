import type { GameManifest } from "@rs-party/protocol";
import type { PartyGamePlugin } from "./types.js";

/** Registry of installed games (spec etapa 10). */
export class GameRegistry {
  private byId = new Map<string, PartyGamePlugin>();

  register(plugin: PartyGamePlugin): void {
    const m = plugin.manifest;
    if (this.byId.has(m.id)) throw new Error(`duplicate game id: ${m.id}`);
    if (m.minPlayers > m.maxPlayers) throw new Error(`invalid players for ${m.id}`);
    this.byId.set(m.id, plugin);
  }

  get(id: string): PartyGamePlugin | undefined {
    return this.byId.get(id);
  }

  require(id: string): PartyGamePlugin {
    const p = this.byId.get(id);
    if (!p) throw new Error(`game not registered: ${id}`);
    return p;
  }

  list(): GameManifest[] {
    return [...this.byId.values()].map((p) => p.manifest);
  }
}
