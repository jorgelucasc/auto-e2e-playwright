import { expect, test } from "@playwright/test";
import { RelatorioPersonalizadoPage } from "../../support/pages/relatorios/relatorio-personalizado.page.js";

test.setTimeout(15 * 60 * 1000);

test("criar relatório personalizado de conhecimentos", async ({ page }) => {
  const relatorioPage = new RelatorioPersonalizadoPage(page);
  await relatorioPage.acessar();

  const visoes = await relatorioPage.obterVisoes();
  expect(visoes.length).toBeGreaterThan(0);

  for (const visao of visoes) {
    await test.step(`carregar campos da visão ${visao.text}`, async () => {
      const nomesColunas = await relatorioPage.selecionarVisao(visao.value);

      await expect
        .soft(nomesColunas[0])
        .not.toBe("");
      await expect
        .soft(nomesColunas[1])
        .not.toBe("");
    });
  }

  const nomeRelatorio = `AUTOMACAO_CONHECIMENTOS_${Date.now()}`;
  await relatorioPage.preencherDadosConhecimento(nomeRelatorio);
  const paginaConsulta = await relatorioPage.salvar();

  await expect(paginaConsulta.getByText(nomeRelatorio, { exact: true })).toBeVisible();
});
