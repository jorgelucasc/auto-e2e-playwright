import { expect } from "@playwright/test";

export class ColetaPage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page
    this.botaoSalvar = page.locator("#salva")
    this.campoRemetente = page.locator("#rem_rzs_cl")
  }

  async acessarNovoCadastroPeloMenu() {
    await this.page.goto("/menu")
    await this.page.getByText("Lançamentos", { exact: true }).click()

    const [consulta] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page
        .locator('li[href="ConsultaControlador?codTela=24"]')
        .getByText("Coletas/O.S", { exact: true })
        .click(),
    ]);

    await consulta.waitForLoadState("domcontentloaded")
    await consulta
      .getByRole("listitem")
      .filter({ hasText: "Novo Cadastro" })
      .click()
    await expect(consulta).toHaveURL(/cadcoleta\?acao=iniciar/)

    return new ColetaPage(consulta)
  }

  async selecionarPrimeiroRemetenteEncontrado() {
    const [popup] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.locator('input[onclick*="abrirLocalizarRemetente"]').click(),
    ])

    await popup.locator("#valor_consulta").fill("a");
    await popup.locator("#pesquisar").click();

    const primeiroRemetente = popup.locator('[id^="rem_rzs"]').first();
    await expect(primeiroRemetente).toBeVisible();
    await primeiroRemetente.click();
  }

  async salvar() {
    await this.botaoSalvar.click();
    await expect(this.page).toHaveURL(/ConsultaControlador\?codTela=24/);
  }
}