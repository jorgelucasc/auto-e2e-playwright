import { test, expect } from "@playwright/test";
import { fecharNovidadeVersao } from "../../../support/actions/login.js";
import { MenuPage } from "../../../support/pages/menu.page.js";

test("consulta fornecedor", async ({ page }) => {
  const menu = new MenuPage(page)

  await page.goto("/menu")

  await fecharNovidadeVersao(page)

  const fornecedorPage = await menu.abrirConsultaFornecedor() // executa essa função que está em menu.page.js

  await fornecedorPage.iniciarNovoCadastro() // executa essa função que está em fornecedor.page.js

  await expect(fornecedorPage.tituloCadastro).toBeVisible() //verifica se o titulo da tela está visivel

  await page.waitForTimeout(5000)
});

test("novo cadastro fornecedor", async ({ page }) => {});

test("cadastro fornecedor duplicado", async ({ page }) => {});
