import { test, expect } from "@playwright/test";

test("filtrar conhecimento por data", async ({ page }) => {
  await page.goto("/consultaconhecimento?acao=iniciar");
});
