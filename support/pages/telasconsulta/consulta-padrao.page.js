// vai servir para padronizar os comportamentos das telas de consulta
// representa qualquer tela de consulta

export class ConsultaPadraoPage {
      /**
   * @param {import('@playwright/test').Page} page
   * @param {{ codigoTela: number, titulo: string }} consulta
   */
  constructor(page, consulta) {
    this.page = page
    this.consulta = consulta
  }

  get tituloPagina() {
    return this.page.getByText(this.consulta.titulo,{exact: true})
  }

  get botaoNovoCadastro() {
    return this.page.getByRole('button', {name: 'Novo cadastro'})
  }

  async iniciarNovoCadastro() {
    await this.botaoNovoCadastro.click()
  }

  get selectFiltro() {
    return this.page.locator('#select-abrev')
  }

  async selecionarFiltro(value) {
    await this.selectFiltro.selectOption(value, {force: true})
  }

  async obterValorFiltro() {
    return await this.selectFiltro.inputValue()
  }

  get preencherCampoFiltro() {
    return this.page.locator('#deltaInput1')
  }

  async preencherInputFiltro(valor) {
    await this.preencherCampoFiltro.fill(valor)
  }

  get botaoPesquisar() {
    return this.page.locator('input[type:"button"][value="Pesquisar"]') //buscar por qualquer botao com o value Pesquisar
  }

  async pesquisar() {
    await this.botaoPesquisar.click()
  }
}