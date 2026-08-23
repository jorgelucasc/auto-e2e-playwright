export async function fecharNovidadeVersao(page) {
    const alertNovidades = page.frameLocator('.iframe-anuncio')
    const footer = alertNovidades.locator('footer')

    const novidadesApareceu = await footer
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false)

    if (novidadesApareceu) {
        await footer.locator('.btn-entendi').click()
    }
}
