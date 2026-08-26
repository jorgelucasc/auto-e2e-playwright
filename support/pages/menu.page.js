import { ConsultaFornecedorPage } from './telasconsulta/consulta-fornecedor.page.js';

export class MenuPage {
  constructor(page) {
    this.page = page
  }

  async abrirConsultaFornecedor() {
    await this.page.locator('.li-menu-principal', { hasText: 'Cadastros' }).hover(); //passa mouse sobre o menu
    await this.page.locator('.container-label-menu:visible', { //passa mouse sobre o submenu com o texto expecifico Financeiro
      hasText: /^Financeiro$/,
    }).hover();

    const [novaJanela] = await Promise.all([ //espera a nova janela abrir apos clicar no submenu #fornecedor_listar
      this.page.context().waitForEvent('page'),
      this.page.locator('#fornecedor_listar:visible').click(),
    ]);

    await novaJanela.waitForLoadState();

    return new ConsultaFornecedorPage(novaJanela);
  }
}