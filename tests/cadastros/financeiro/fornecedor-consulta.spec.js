import { test, expect } from "@playwright/test";
import { fecharNovidadeVersao } from "../../../support/actions/login.js";
import { ConsultaFornecedorPage } from "../../../support/pages/telasconsulta/consulta-fornecedor.page.js";

test.describe("Consulta de Fornecedor", () => {
  test("consulta fornecedor", async ({ page }) => {
    await page.goto("/ConsultaControlador?codTela=14");

    await fecharNovidadeVersao(page); //fecha o novidades se aparecer

    const consultaFornecedorPage = new ConsultaFornecedorPage(page);

    await expect(consultaFornecedorPage.page).toHaveURL(/codTela=14$/);

    await expect(consultaFornecedorPage.tituloPagina).toBeVisible();

    await consultaFornecedorPage.selecionarFiltro("Contato");

    await consultaFornecedorPage.preencherInputFiltro("teste");

    await consultaFornecedorPage.pesquisar()

    await page.waitForTimeout(5000);
  });

  test("deve consultar por data", async ({ page }) => {});
});
