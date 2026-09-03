import { expect, test } from "@playwright/test";
import { ColetaPage } from "../../../support/pages/lancamentos/coleta/coleta.page.js";

test("cadastrar coleta somente com os campos obrigatórios", async ({ page }) => {
  const coletaPage = await new ColetaPage(page).acessarNovoCadastroPeloMenu();

  await coletaPage.selecionarPrimeiroRemetenteEncontrado();

  await expect(coletaPage.campoRemetente).not.toHaveValue("");
  await expect(coletaPage.page.locator("#dtsolicitacao")).not.toHaveValue("");

  await coletaPage.salvar();
  await expect(coletaPage.page.getByRole("heading", { name: "Consulta de Coletas" })).toBeVisible();
});
