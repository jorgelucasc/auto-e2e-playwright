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
      const nomesColunas = await relatorioPage.selecionarVisao(visao.value);
      const campoChave = relatorioPage.obterCampoChave(visao.value);

      if (campoChave) {
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
      } else {
        // Visão ainda não mapeada: validamos que ao menos 2 colunas
        // apareceram e não estão vazias.
        expect
          .soft(
            nomesColunas.length,
            `visão ${visao.text} deve ter ao menos 2 colunas`,
          )
          .toBeGreaterThanOrEqual(2);
        expect
          .soft(
            nomesColunas[0],
            `1ª coluna da visão ${visao.text} não pode ser vazia`,
          )
          .not.toBe("");
        expect
          .soft(
            nomesColunas[1],
            `2ª coluna da visão ${visao.text} não pode ser vazia`,
          )
          .not.toBe("");
      }
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
