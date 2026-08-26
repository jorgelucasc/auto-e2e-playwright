import { ConsultaPadraoPage } from './consulta-padrao.page.js'
import { telasconsulta } from './consulta.config.js'

export class ConsultaFornecedorPage extends ConsultaPadraoPage {
    
    /**
   * @param {import('@playwright/test').Page} page
   */

    constructor(page) {
        super(page, telasconsulta.fornecedor)//chama o construtor da classe pai passando a página e a tela de fornecedor
    }
}