export async function imprimirModelosRelatorio(relatorioPage, modelos) {
  const paginasImpressao = [];

  for (const modelo of modelos) {
    await relatorioPage.selecionarModelo(modelo);
    paginasImpressao.push(await relatorioPage.imprimirPdf());
  }

  return paginasImpressao;
}
