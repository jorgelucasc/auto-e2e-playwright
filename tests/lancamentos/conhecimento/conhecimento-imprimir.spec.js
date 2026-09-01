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

  await expect(paginaImpressao).toHaveURL(/jspconsulta_conhecimento/)
  await expect(paginaImpressao.locator("iframe")).toBeVisible()
});

test("alert ao imprimir dacte não averbado", async ({ page }) => {
  const conhecimentoPage = new ConhecimentoPage(page)
  const consultaPadraoPage = new ConsultaPadraoPage(page)

  await page.goto("/CTeControlador?acao=listar&&tipoTransporte=r")

  await conhecimentoPage.selecionarFiltroConsulta("s.numero")
  await conhecimentoPage.preencherInputFiltro("valor_consulta", "041156")
  await page.locator("#filial").selectOption("1")
  await page.locator("#statusCte").selectOption("C")
  await page.locator("#documentoAverbacao").selectOption("n")
  await consultaPadraoPage.pesquisar()

  const linhaResultado = page.locator("tr").filter({ hasText: "041156" }).first()
  await expect(linhaResultado).toBeVisible()

  await expect(page.locator('#statusCte')).toHaveValue('C')


  const checkboxCte = linhaResultado.locator('input[type="checkbox"]')
  await expect(checkboxCte).toBeVisible()
  await checkboxCte.check()

  const botaoImprimirDacte = page.locator("#img_imprimir")
  await expect(botaoImprimirDacte).toBeVisible()

  const dialogPromise = page.waitForEvent("dialog")
  await botaoImprimirDacte.click()

  const dialog = await dialogPromise
  expect(dialog.type()).toBe("alert")
  expect(dialog.message()).toContain("não está(o) averbado(s)")
  await dialog.accept()
})
