import { expect } from "@playwright/test";
import { test } from "../../../support/fixtures/pages.fixture.js";
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

test("imprimir todos os modelos de minuta", async ({ page }) => {
  const conhecimentoPage = new ConhecimentoPage(page);
  const consultaPadraoPage = new ConsultaPadraoPage(page);
  const numeroCte = "041155";
  const modelosMinuta = ["1", "2", "3", "4", "5"];

  // Ao reimprimir um CT-e já impresso, a tela abre um confirm
  // ("já foi impresso, deseja imprimir novamente?"). Aceitamos sempre para
  // que a impressão prossiga.
  page.on("dialog", (dialog) => dialog.accept());

  async function pesquisarESelecionarCte() {
    await conhecimentoPage.acessar();
    await conhecimentoPage.selecionarFiltroConsulta("nfiscal");
    await conhecimentoPage.preencherInputFiltro("valor_consulta", numeroCte);
    await consultaPadraoPage.pesquisar();

    const linhaResultado = page
      .locator("tr")
      .filter({ hasText: numeroCte })
      .first();
    await expect(linhaResultado).toBeVisible({ timeout: 120000 });

    // Seleciona ao menos 1 CT-e (checkbox da linha: ck0, ck1, ...)
    const checkboxCte = linhaResultado
      .locator('input[type="checkbox"][id^="ck"]')
      .first();
    await expect(checkboxCte).toBeVisible({ timeout: 120000 });
    await checkboxCte.check();
  }

  await pesquisarESelecionarCte();

  // O relatório de cada modelo abre em uma nova janela. Após validar,
  // fechamos a janela, retornamos à listagem e imprimimos o próximo modelo.
  for (const modelo of modelosMinuta) {
    await test.step(`imprimir modelo de minuta ${modelo}`, async () => {
      const botaoImprimir = page.getByTitle("Imprimir CT-e(s) selecionados");
      await expect(botaoImprimir).toBeVisible({ timeout: 120000 });
      await expect(page.locator("#modelo")).toBeEnabled({ timeout: 120000 });
      await page.locator("#modelo").selectOption({ value: modelo });

      const [paginaRelatorio] = await Promise.all([
        page.waitForEvent("popup", { timeout: 120000 }),
        botaoImprimir.click(),
      ]);

      await paginaRelatorio.waitForLoadState("load", { timeout: 120000 });
      await expect(paginaRelatorio).toHaveURL(/matricidectrc\.ctrc/, {
        timeout: 120000,
      });

      await paginaRelatorio.close();

      // A janela de relatório abriu a partir da listagem; garantimos que a
      // seleção do CT-e continua válida para o próximo modelo.
      await pesquisarESelecionarCte();
    });
  }
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
