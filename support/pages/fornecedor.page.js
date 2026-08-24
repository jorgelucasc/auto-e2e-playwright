export class FornecedorPage {
    constructor(page) {
        this.page = page
        this.tituloCadastro = page.getByText('Cadastro de Fornecedor', { exact: true }); //verifica o titulo da tela
        this.btNovoCadastro = page.getByText('Novo cadastro', { exact: true }); // clicar no botão de novo cadastro da tela
    }

    async iniciarNovoCadastro() {
        await this.btNovoCadastro.click() //pega a variavel do botão e clica
    }
}