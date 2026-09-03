import { expect } from "@playwright/test";
import { test } from "../../../support/fixtures/pages.fixture.js";
import { imprimirModelosRelatorio } from "../../../support/actions/impressao-relatorios.js";
import { ConhecimentoPage } from "../../../support/pages/lancamentos/conhecimento/conhecimento.page.js";
import { ConsultaPadraoPage } from "../../../support/pages/telasconsulta/consulta-padrao.page.js";

async function aguardarResultadoPesquisa(page, numeroCte) {
  return page.waitForResponse(
    (response) =>
      response.status() === 200 &&
      response.url().includes("CTeControlador") &&
      (response.url().includes("acao=lista") ||
        response.url().includes("acao=listar")) &&
      response.url().includes(`valor=${numeroCte}`),
  );
}

async function imprimirModeloDacte(page, linhaResultado, modelo) {
  await expect(page.locator("#modelo")).toBeEnabled({ timeout: 120000 });
  await page.locator("#modelo").selectOption({ value: modelo });

  const checkboxCte = linhaResultado.locator('input[type="checkbox"]');
  await expect(checkboxCte).toBeVisible({ timeout: 120000 });
  await checkboxCte.check();

  const botaoImprimirDacte = page.locator("#img_imprimir");
  await expect(botaoImprimirDacte).toBeVisible({ timeout: 120000 });

  const [paginaImpressao] = await Promise.all([
    page.waitForEvent("popup", { timeout: 120000 }),
    botaoImprimirDacte.click(),
  ]);

  await paginaImpressao.waitForLoadState("domcontentloaded", {
    timeout: 120000,
  });

  await expect(paginaImpressao).toHaveURL(/listar_cte|jsp|redireciona_relatorio/i, {
    timeout: 120000,
  });

  const iframe = paginaImpressao.locator("iframe");
  await expect(iframe).toBeVisible({ timeout: 120000 });

  await paginaImpressao.close();
  await expect(page.locator("#modelo")).toBeEnabled({ timeout: 120000 });
}

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

test("alert ao imprimir dacte não averbado", async ({ page }) => {
  const conhecimentoPage = new ConhecimentoPage(page);
  const consultaPadraoPage = new ConsultaPadraoPage(page);

  await page.goto("/CTeControlador?acao=listar&&tipoTransporte=r");

  await conhecimentoPage.selecionarFiltroConsulta("s.numero");
  await page.locator("#filial").selectOption("1");
  await page.locator("#statusCte").selectOption("C");
  await page.locator("#documentoAverbacao").selectOption("n");
  await conhecimentoPage.preencherInputFiltro("valor_consulta", "041156");

  const pesquisaResponsePromise = aguardarResultadoPesquisa(page, "041156");
  await consultaPadraoPage.pesquisar();
  await pesquisaResponsePromise;

  const linhaResultado = page
    .locator("tr")
    .filter({ hasText: "041156" })
    .first();
  await expect(linhaResultado).toBeVisible();

  await expect(page.locator("#statusCte")).toHaveValue("C");

  const checkboxCte = linhaResultado.locator('input[type="checkbox"]');
  await expect(checkboxCte).toBeVisible();
  await checkboxCte.check();

  const botaoImprimirDacte = page.locator("#img_imprimir");
  await expect(botaoImprimirDacte).toBeVisible();

  const dialogPromise = page.waitForEvent("dialog");
  await botaoImprimirDacte.click();

  const dialog = await dialogPromise;
  expect(dialog.type()).toBe("alert");
  expect(dialog.message()).toContain("não está(o) averbado(s)");
  await dialog.accept();
});

test("imprimir todos os modelos de dacte para CT-es confirmados", async ({
  page,
}) => {
  const conhecimentoPage = new ConhecimentoPage(page);
  const consultaPadraoPage = new ConsultaPadraoPage(page);
  const modelosDacte = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ];

  await page.goto("/CTeControlador?acao=listar&&tipoTransporte=r");

  await conhecimentoPage.selecionarFiltroConsulta("s.numero");
  await page.locator("#filial").selectOption("1");
  await page.locator("#statusCte").selectOption("C");
  await page.locator("#documentoAverbacao").selectOption("s");
  await conhecimentoPage.preencherInputFiltro("valor_consulta", "041155");

  const pesquisaResponsePromise = aguardarResultadoPesquisa(page, "041155");
  await consultaPadraoPage.pesquisar();
  await pesquisaResponsePromise;

  const linhaResultado = page
    .locator("tr")
    .filter({ hasText: "041155" })
    .first();
  await expect(linhaResultado).toBeVisible();

  await expect(page.locator("#statusCte")).toHaveValue("C");


  for (const modelo of modelosDacte) {
    await test.step(`imprimir modelo ${modelo}`, async () => {
      await imprimirModeloDacte(page, linhaResultado, modelo);
    });
  }
});
