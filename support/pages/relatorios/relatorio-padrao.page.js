export class RelatorioPadraoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.modelo = page.locator("#modelo");
    this.filtroConsulta = page.locator("#campo_consulta"); //para telas de consulta que utilizam id campo_consulta
  }

  async selecionarModelo(value) {
    await this.modelo.selectOption({ value });
  }

  async selecionarFiltroConsulta(value) {
    //utilizado nas telas de consulta para selecionar o tipo de filtro
    await this.filtroConsulta.selectOption({ value });
  }

  async preencherInputFiltro(campo, valor) {
    await this.page.locator(`#${campo}`).fill(valor);
  }

  get botaoImpressaoPdf() {
    return this.page.getByTitle("Formato PDF(usado para a impressão)");
  }

  async imprimirPdf() {
    const [paginaImpressao] = await Promise.all([
      this.page.waitForEvent('popup'),//'page' aguarda a abertura de uma nova aba, 'popup' aguarda a abertura de uma nova janela
      this.botaoImpressaoPdf.click(),
    ]);

    await paginaImpressao.waitForLoadState('load');
    await paginaImpressao.locator('iframe').waitFor({ state: 'visible' })

    return paginaImpressao;
  }
}