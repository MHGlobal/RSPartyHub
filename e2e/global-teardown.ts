import { rm } from "node:fs/promises";
import { e2eHome } from "./global-setup.js";

export default async function globalTeardown(): Promise<void> {
  await rm(e2eHome, { recursive: true, force: true });
}
