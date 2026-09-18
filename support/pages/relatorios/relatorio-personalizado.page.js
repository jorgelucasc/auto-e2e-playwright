import { expect } from "@playwright/test";

const reportBuilderUrl =
  "ReportBuilderControlador?acao=novoCadastro&modulo=webtrans";

// Campo-chave que só existe em cada visão. Ao trocar de visão, aguardamos
// até esse campo aparecer entre as colunas — garantindo que a tela realmente
// atualizou para a visão certa antes de validar (evita casar com o estado
// residual da visão anterior enquanto a tela ainda não atualizou).
const CAMPO_CHAVE_POR_VISAO = {
  vbi_trips: "Filial Abreviatura",
  vbi_aeroporto: "IATA",
  vbi_analise_entrega: "Número CT-e",
  vbi_areas: "Sigla",
  vbi_relrazao_planocusto: "Plano de Custo",
  vbi_cfop: "Cfop",
  vbi_cidades: "Cidade",
  vbi_cliente: "Razão Social",
  vbi_pedidos: "Data Solicitação",
  vbi_pedidos_com_conhecimento: "Número da Coleta",
  vbi_pedidos_com_cotas: "Tipo da Cota",
  vbi_conhecimento_full:"Número CT",
  vbi_conhecimentos_adv:"Número CT-e",
  vbi_conhecimentos_lucratividade:"Valor Coleta",
  vbi_conhecimentos:"Identificador",
  vbi_conhecimentos_ocorrencias:"Código Ocorrência",
  vbi_conta_bancaria:"Número",
  vbi_contas_pagar_pagas:"Espécie",
  vbi_receber_recebidas:"Emissão Fatura",
  vbi_contrato_frete:"Número Contrato",
  vbi_contrato_frete_pagamento:"Forma Pagamento",
  vbi_pagamento_comissao:"Tipo Comissão",
  vbi_conciliacao:"Conciliado",
  vbi_relcheques_clientes:"Cheque",
  vbi_movimentacao_factoring:"Número do Contrato",
  vbi_despesas:"Despesa",
  vbi_embalagem:"Descrição",
  vbi_especies:"Espécie",
  vbi_faixa_peso:"DE (Kg)",
  vbi_fatura_boleto:"Número",
  vbi_filial:"Abreviatura",
  vbi_forma_pagamento:"Descrição",
  vbi_fornecedor:"Razão Social",
  vbi_fornecedor_ocorrencia:"Nome do fornecedor",
  vbi_funcoes:"Descrição",
  vbi_grupo_cli_for:"Protocolo de Sincronização",
  vbi_grupo_usuario:"Filial abreviatura",
  vbi_historico:"Histórico",
  vbi_inventario_carga:"Número",
  vbi_inventario_conferencia:"Número do Inventário",
  vbi_manifesto:"Número",
  vbi_manifesto_com_conhecimento:"Numero Manifesto",
  vbi_marca:"Descrição",
  vbi_motorista:"Nome",
  vbi_motorista_ocorrencia:"Nome do motorista",
  vbi_movimentacao_pallets:"Nº Nota",
  vbi_navio:"Descrição",
  vbi_nota_fiscal:"Nota Fiscal",
  vbi_nota_servico:"Espécie",
  vbi_observacao:"Descrição",
  vbi_ocorrencia_ctrcs:"Código",
  vbi_orcamento_venda:"Número",
  vbi_origem_captacao:"Descrição",
  vbi_porto:"Descrição",
  vbi_plano_conta:"Conta contábil",
  vbi_planocusto:"Código",
  vbi_produto:"Descrição",
  vbi_rateio:"Descrição",
  vbi_romaneio:"Romaneio",
  vbi_rotas:"Nome da Rota",
  vbi_rotas_tabela_preco:"Nome do Cliente",
  vbi_servico:"Descrição",
  vbi_client_tariffs:"Nome Cliente",
  vbi_client_tariffs_analise:"Cliente Desde",
  vbi_client_tariffs_combinado:"UF Cidade de Origem",
  vbi_tabela_tde:"Valor TDE Adicional",
  vbi_terminal_container:"Descrição",
  vbi_tipo_container:"Tipo de Container",
  vbi_tipo_pallet:"Tipo de Pallet",
  vbi_tipo_produto:"Tipo de Produto",
  vbi_tipo_veiculo:"Tipo de Veículo",
  vbi_unidade_custo:"Unidade de Custo",
  vbi_unidade_medida:"Unidade de Medida",
  vbi_usuario:"Usuário",
  vbi_veiculo:"Veículo",
  vbi_viagens_com_conhecimento:"Viagens com Conhecimento",
  vbi_fechamento_conciliacao:"Fechamento de Conciliação",
  vbi_iscas:"Iscas",
  vbi_setores_entregas:"Setores de Entregas",
  vbi_pre_carregamento:"Doca",
  vbi_status_cte_sefaz:"Status do CT-e",

};

// Normaliza para comparação tolerante: sem acento, minúsculo e sem espaços
// duplicados nas bordas.
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

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
    const resposta = this.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("ReportBuilderControlador") &&
        response.status() === 200,
    );

    await this.visao.selectOption(value);
    await resposta;

    const campoChave = CAMPO_CHAVE_POR_VISAO[value];

    // Aguardamos até que o campo-chave específico desta visão apareça entre
    // as colunas. Só esse campo existir já confirma que a tela atualizou para
    // a visão correta — sem risco de validar os campos da visão anterior
    // (estado residual no DOM). O teste só chama este método para visões
    // mapeadas, então campoChave sempre está definido aqui.
    await this.page.waitForFunction(
      (chaveNormalizada) => {
        const normalizarNoDom = (texto) =>
          texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();

        const campos = [
          ...document.querySelectorAll('#abaColunas input[name^="label["]'),
        ];

        return campos.some((campo) =>
          normalizarNoDom(campo.value).includes(chaveNormalizada),
        );
      },
      normalizar(campoChave),
      { timeout: 120000 },
    );

    return this.obterNomesPrimeirasColunas();
  }

  async obterNomesPrimeirasColunas() {
    await expect(this.nomesColunas.nth(1)).toBeVisible({ timeout: 120000 });

    return this.nomesColunas.evaluateAll((inputs) =>
      inputs
        .slice(0, 2)
        .map((input) => input.value.trim()),
    );
  }

  async obterTodosNomesColunas() {
    return this.nomesColunas.evaluateAll((inputs) =>
      inputs.map((input) => input.value.trim()).filter((valor) => valor !== ""),
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

  /**
   * Retorna o campo-chave esperado para a visão, ou undefined se ainda
   * não estiver mapeado.
   * @param {string} value
   */
  obterCampoChave(value) {
    return CAMPO_CHAVE_POR_VISAO[value];
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

    // A página de consulta abre carregando de forma assíncrona (progress bar)
    // e ainda navega antes de estabilizar. Aguardamos o carregamento completo
    // e validamos por um elemento estável, em vez de casar uma URL frágil.
    await paginaConsulta.waitForLoadState("load");
    await expect(
      paginaConsulta.getByRole("heading", {
        text: "Consulta de Relatórios Personalizados ",
      }),
    ).toBeVisible({ timeout: 120000 });

    return paginaConsulta;
  }
}
