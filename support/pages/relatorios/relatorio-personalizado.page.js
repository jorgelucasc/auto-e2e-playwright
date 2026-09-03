import { expect } from "@playwright/test";

const reportBuilderUrl =
  "ReportBuilderControlador?acao=novoCadastro&modulo=webtrans";

export class RelatorioPersonalizadoPage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page;
    this.visao = page.locator("#views");
    this.nomeRelatorio = page.locator("#report-title");
    this.tela = page.locator("#Rotina");
    this.colunas = page.locator('#abaColunas input[id^="view-"]');
    this.nomesColunas = page.locator('#abaColunas input[name^="label["]');
    this.botaoSalvar = page.locator('input.inputbotao[value=" Salvar "]');
  }

  async acessar() {
    await this.page.goto(reportBuilderUrl);
    await expect(this.visao).toBeVisible();
  }

  async selecionarVisao(value) {
    const estadoAnterior = await this.obterEstadoColunas();
    const resposta = this.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("ReportBuilderControlador") &&
        response.status() === 200,
    );

    await this.visao.selectOption(value);
    await resposta;
    await this.page.waitForFunction(
      ({ estadoAnterior }) => {
        const campos = [
          ...document.querySelectorAll(
            '#abaColunas input[name^="label["]',
          ),
        ];
        const estadoAtual = campos
          .slice(0, 2)
          .map((campo) => campo.value.trim())
          .join("|");

        return campos.length >= 2 && estadoAtual !== estadoAnterior;
      },
      { estadoAnterior },
      { timeout: 120000 },
    );

    return this.obterNomesPrimeirasColunas();
  }

  async obterEstadoColunas() {
    return this.nomesColunas.evaluateAll((inputs) =>
      inputs
        .slice(0, 2)
        .map((input) => input.value.trim())
        .join("|"),
    );
  }

  async obterNomesPrimeirasColunas() {
    await expect(this.nomesColunas.nth(1)).toBeVisible({ timeout: 120000 });

    return this.nomesColunas.evaluateAll((inputs) =>
      inputs
        .slice(0, 2)
        .map((input) => input.value.trim()),
    );
  }

  async obterVisoes() {
    return this.visao.locator("option").evaluateAll((options) =>
      options
        .map((option) => ({
          text: option.textContent.trim(),
          value: option.value,
        }))
        .filter((option) => option.value),
    );
  }

  async preencherDadosConhecimento(nome) {
    await this.selecionarVisao("vbi_conhecimentos");
    await this.nomeRelatorio.fill(nome);
    await this.tela.selectOption("0");
    await this.colunas.first().check();
  }

  async salvar() {
    const [paginaConsulta] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.botaoSalvar.click(),
    ]);

    await paginaConsulta.waitForLoadState("domcontentloaded");
    await expect(paginaConsulta).toHaveURL(/ReportBuilderControlador\?acao=listar/);
    return paginaConsulta;
  }
}
