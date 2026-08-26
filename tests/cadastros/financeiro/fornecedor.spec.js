import { test, expect } from "@playwright/test";
import { fecharNovidadeVersao } from "../../../support/actions/login.js";
import { MenuPage } from "../../../support/pages/menu.page.js";

test("consulta fornecedor", async ({ page }) => {

  await page.goto('/menu')

  await fecharNovidadeVersao(page)//fecha o novidades se aparecer

  const menuPage = new MenuPage(page)

  const consultaFornecedorPage = await menuPage.abrirConsultaFornecedor()

  await expect(consultaFornecedorPage.page).toHaveURL(
    /codTela=14$/,
  );

  await expect(consultaFornecedorPage.tituloPagina).toBeVisible()

  await consultaFornecedorPage.selecionarFiltro('Contato')

  await consultaFornecedorPage.preencherInputFiltro('teste')

  await consultaFornecedorPage.pesquisar()

  await page.waitForTimeout(5000)
});

test("novo cadastro fornecedor", async ({ page }) => {});

test("cadastro fornecedor duplicado", async ({ page }) => {});
