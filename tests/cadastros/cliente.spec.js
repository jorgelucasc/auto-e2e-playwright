import {test, expect} from "@playwright/test"
import { ClientePage } from "../../support/pages/cadastros/cliente/cliente.page.js"

test.describe("Cadastro de Cliente", () => {
    

    test("deve acessar a consulta de cliente", async ({page}) => {
        const clientePage = new ClientePage(page)
        
        await clientePage.acessar()
    })

    test("deve realizar um novo cadastro de cliente com sucesso", async ({page}) => {
        const clientePage = new ClientePage(page)

        await clientePage.acessar()

        await page.getByText('Novo cadastro', {exact: true}).click()

        await expect(page.getByText('Cadastro de Cliente', {exact: true})).toBeVisible()

        await page.locator('#rzs').click()
    })
})