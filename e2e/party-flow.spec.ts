import { expect, test } from "@playwright/test";

async function createRoom(page: import("@playwright/test").Page): Promise<string> {
  await page.goto("/host", { waitUntil: "domcontentloaded", timeout: 15_000 });
  const roomCode = page.locator(".code-display").first();
  await expect(roomCode).toHaveText(/^[A-Z]{4}$/);
  return (await roomCode.textContent())!;
}

test("host creates a room, a player joins, and refresh resumes the player", async ({ browser }) => {
  const hostContext = await browser.newContext();
  const playerContext = await browser.newContext();
  const host = await hostContext.newPage();
  const player = await playerContext.newPage();
  host.on("console", (message) => console.log(`host console: ${message.type()}: ${message.text()}`));
  host.on("pageerror", (error) => console.log(`host page error: ${error.message}`));

  const roomCode = await createRoom(host);

  await player.addInitScript(() => { window.prompt = () => "E2E Player"; });
  await player.goto(`/play?room=${roomCode}`, { waitUntil: "domcontentloaded", timeout: 15_000 });

  await expect(player.getByRole("heading", { name: "Pronto para jogar?" })).toBeVisible();
  await expect(player.locator("#conn-indicator")).toHaveText("ligado");
  await expect.poll(async () => host.evaluate(async (code) => {
    const response = await fetch("/api/rooms");
    const payload = await response.json();
    return payload.rooms.find((room) => room.code === code)?.players;
  }, roomCode)).toBe(2);

  const playerIdBeforeReload = await player.evaluate(() => JSON.parse(localStorage.getItem("rs-party:identity") ?? "{}").playerId);
  await player.reload();
  await expect(player.getByRole("heading", { name: "Pronto para jogar?" })).toBeVisible();
  await expect(player.locator("#conn-indicator")).toHaveText("ligado");
  await expect.poll(async () => player.evaluate(() => JSON.parse(localStorage.getItem("rs-party:identity") ?? "{}").playerId)).toBe(playerIdBeforeReload);
  await expect.poll(async () => host.evaluate(async (code) => {
    const response = await fetch("/api/rooms");
    const payload = await response.json();
    return payload.rooms.find((room) => room.code === code)?.players;
  }, roomCode)).toBe(2);
});

test("joining an unknown room gives browser UI feedback", async ({ browser }) => {
  const playerContext = await browser.newContext();
  const player = await playerContext.newPage();

  await player.addInitScript(() => { window.prompt = () => "Unknown Room Player"; });
  await player.goto("/play?room=ZZZZ", { waitUntil: "domcontentloaded", timeout: 15_000 });
  await expect(player.getByRole("heading", { name: /Sala não encontrada — confirma o código\./ })).toBeVisible({ timeout: 15_000 });
});

test("join route pre-fills its room code and admin route serves its page", async ({ page }) => {
  await page.goto("/join/abcz?t=example", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#room-code")).toHaveValue("ABCZ");

  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Autenticação" })).toBeVisible();
});
