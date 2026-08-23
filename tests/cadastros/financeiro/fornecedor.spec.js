import { test, expect } from "@playwright/test";
import { fecharNovidadeVersao } from '../../../support/actions/login.js';

test("consulta fornecedor", async ({ page }) => {

    await page.goto('/menu')

    await fecharNovidadeVersao(page)

    await page.getByText("Cadastros").click()
    await page.getByText("Financeiro").click()
    await page.getByText("Fornecedores").click()


      await page.waitForTimeout(5000)

});

test("novo cadastro fornecedor", async ({ page }) => {});

test("cadastro fornecedor duplicado", async ({ page }) => {});
