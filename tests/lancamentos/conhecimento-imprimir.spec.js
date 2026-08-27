import { test, expect } from "@playwright/test";
import { RelatorioPadraoPage } from "../../support/pages/relatorios/relatorio-padrao.page.js";
import { ConsultaPadraoPage } from "../../support/pages/telasconsulta/consulta-padrao.page.js";

test("imprimir 1 minuta por vez", async ({ page }) => {
  await page.goto("/consultaconhecimento?acao=iniciar");

  const relatorioPadraoPage = new RelatorioPadraoPage(page);
  const consultaPadraoPage = new ConsultaPadraoPage(page);

  await relatorioPadraoPage.selecionarFiltroConsulta("nfiscal");
  await relatorioPadraoPage.preencherInputFiltro("valor_consulta", "041130");
  await consultaPadraoPage.pesquisar();


  await relatorioPadraoPage.selecionarModelo("1");

  const paginaImpressao = await relatorioPadraoPage.imprimirPdf()

  await expect(paginaImpressao).toHaveURL(/jspconsulta_conhecimento/)
  await expect(paginaImpressao.locator('iframe')).toBeVisible()


})
