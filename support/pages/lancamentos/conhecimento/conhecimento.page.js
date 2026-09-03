import { expect } from "@playwright/test";

export class ConhecimentoPage {
  /**
   * @param {import("@playwright/test").Page} page
   */
  constructor(page) {
    this.page = page;
    this.filtroConsulta = page.locator("#campo_consulta");
  }

  async acessar() {
    await this.page.goto("/consultaconhecimento?acao=iniciar");
  }

  async selecionarFiltroConsulta(value) {
    await this.filtroConsulta.selectOption({ value });
  }

  async preencherInputFiltro(campo, valor) {
    await this.page.locator(`#${campo}`).fill(valor);
  }

  async aguardarBotaoImprimirDacte() {
    const botaoImprimir = this.page
      .locator('#img_imprimir_0')

    await expect(botaoImprimir).toBeVisible();
    return botaoImprimir;
  }
}