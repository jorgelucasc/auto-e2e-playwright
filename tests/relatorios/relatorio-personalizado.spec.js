import { expect, test } from "@playwright/test";
import { RelatorioPersonalizadoPage } from "../../support/pages/relatorios/relatorio-personalizado.page.js";

test.setTimeout(15 * 60 * 1000);

test("carregar todas as visões do relatório personalizado", async ({
  page,
}) => {
  const relatorioPage = new RelatorioPersonalizadoPage(page);
  await relatorioPage.acessar()

  const visoes = await relatorioPage.obterVisoes()
  expect(visoes.length).toBeGreaterThan(0)

  for (const visao of visoes) {
    await test.step(`carregar campos da visão ${visao.text}`, async () => {
      const campoChave = relatorioPage.obterCampoChave(visao.value);

      // Só validamos visões mapeadas. Uma visão sem campo-chave indica que
      // falta adicioná-la em CAMPO_CHAVE_POR_VISAO — o teste falha para
      // sinalizar isso, em vez de mascarar com uma validação genérica.
      if (!campoChave) {
        expect
          .soft(
            campoChave,
            `visão ${visao.text} (${visao.value}) não está mapeada — ` +
              `adicione o campo-chave em CAMPO_CHAVE_POR_VISAO na page ` +
              `relatorio-personalizado.page.js`,
          )
          .toBeDefined();
        return;
      }

      await relatorioPage.selecionarVisao(visao.value);

      // Visão mapeada: confirmamos que o campo-chave específico dela
      // apareceu entre as colunas — prova de que a tela atualizou para
      // a visão correta e não estamos validando a visão anterior.
      const todasColunas = await relatorioPage.obterTodosNomesColunas();
      const normalizar = (texto) =>
        texto
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .toLowerCase();

      const encontrouCampoChave = todasColunas.some((coluna) =>
        normalizar(coluna).includes(normalizar(campoChave)),
      );

      expect
        .soft(
          encontrouCampoChave,
          `visão ${visao.text} deve conter o campo-chave "${campoChave}"`,
        )
        .toBe(true);
    });
  }
});

test("criar relatorio com a visão conhecimento e savar", async ({ page }) => {

  const relatorioPage = new RelatorioPersonalizadoPage(page);
  await relatorioPage.acessar()
  
  const nomeRelatorio = `AUTOMACAO_CONHECIMENTOS_${Date.now()}`;
  await relatorioPage.preencherDadosConhecimento(nomeRelatorio);
  const paginaConsulta = await relatorioPage.salvar();

  await expect(
    paginaConsulta.getByText(nomeRelatorio, { exact: true }),
  ).toBeVisible({ timeout: 120000 });
});
