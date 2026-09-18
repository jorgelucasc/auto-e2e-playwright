import { expect } from "@playwright/test";

export class ClientePage {
  constructor(page) {
    this.page = page;
  }

  async acessar() {
    await this.page.goto("/ConsultaControlador?codTela=10");
  }

  get botaoNovoCadastro() {
    return this.page.getByRole("button", { name: "Novo cadastro" });
  }

  async iniciarNovoCadastro() {
    await this.botaoNovoCadastro.click();
  }

  async preencherInput(campo, valor) {}

  async botaoSalvar() {}
}
