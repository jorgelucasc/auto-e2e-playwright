import { expect } from "@playwright/test";
import { test } from "../../../support/fixtures/pages.fixture.js";
import { imprimirModelosRelatorio } from "../../../support/actions/impressao-relatorios.js";
import { ConhecimentoPage } from "../../../support/pages/lancamentos/conhecimento/conhecimento.page.js";
import { ConsultaPadraoPage } from "../../../support/pages/telasconsulta/consulta-padrao.page.js";

test("imprimir 1 minuta por vez", async ({ page, relatorioPadraoPage }) => {
  const conhecimentoPage = new ConhecimentoPage(page);
  const consultaPadraoPage = new ConsultaPadraoPage(page);

  await conhecimentoPage.acessar();

  await conhecimentoPage.selecionarFiltroConsulta("nfiscal");
  await conhecimentoPage.preencherInputFiltro("valor_consulta", "041130");
  await consultaPadraoPage.pesquisar();

  const [paginaImpressao] = await imprimirModelosRelatorio(
    relatorioPadraoPage,
    ["1"],
  );

  await expect(paginaImpressao).toHaveURL(/jspconsulta_conhecimento/);
  await expect(paginaImpressao.locator("iframe")).toBeVisible();
});

test("imprimir 1 dacte de CTe não averbado", async ({ page, relatorioPadraoPage }) => {
  const conhecimentoPage = new ConhecimentoPage(page);
  const consultaPadraoPage = new ConsultaPadraoPage(page);

  await page.goto("/CTeControlador?acao=listar&&tipoTransporte=r");

  await conhecimentoPage.selecionarFiltroConsulta("s.numero");
  await conhecimentoPage.preencherInputFiltro("valor_consulta", "041131");
  await consultaPadraoPage.pesquisar();
});
