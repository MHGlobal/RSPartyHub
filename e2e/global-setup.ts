import { rm } from "node:fs/promises";
import { resolve } from "node:path";

export const e2eHome = resolve(".rs-party-e2e");

export default async function globalSetup(): Promise<void> {
  await rm(e2eHome, { recursive: true, force: true });
}
