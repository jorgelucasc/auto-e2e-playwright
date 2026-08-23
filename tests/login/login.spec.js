import { test, expect } from '@playwright/test';

test('sem preencher email e senha', async ({ page }) => {
  await page.goto('/login')

    // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/GW Sistemas - Login/);

  await page.locator('.button-login').click()

  await expect(page.locator('.label-erro')).toHaveText('Os campos e-mail e senha são obrigatórios.')

})

test('preenchendo apenas senha', async ({ page }) => {
  await page.goto('/login')

    // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/GW Sistemas - Login/)

  await page.locator('#senha').fill('qualquersenha')

  await page.locator('.button-login').click()

  await expect(page.locator('.label-erro')).toHaveText('Os campos e-mail e senha são obrigatórios.')

})

test('preenchendo apenas email', async ({ page }) => {
  await page.goto('/login')

    // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/GW Sistemas - Login/)

  await page.locator('#login').fill('qualquersenha')

  await page.locator('.button-login').click()

  await expect(page.locator('.label-erro')).toHaveText('Os campos e-mail e senha são obrigatórios.')

})

test('preenchendo email e senha invalido', async ({ page }) => {
  await page.goto('/login')

    // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/GW Sistemas - Login/)

  await page.locator('#login').fill('teste123@gwsistemas.com.br')
  await page.locator('#senha').fill('senhainvalida')

  await page.locator('.button-login').click()

  const msg = "Dados de acesso invalidos. Esqueceu a senha? Clique aqui para resgatar a senha."
  await expect(page.locator('.label-erro')).toHaveText(msg)

});

test('preenchendo email e senha validos', async ({ page }) => {
  const { E2E_LOGIN_EMAIL: email, E2E_LOGIN_PASSWORD: password } = process.env

  if (!email || !password) {
    throw new Error('Defina E2E_LOGIN_EMAIL e E2E_LOGIN_PASSWORD antes de executar este teste.')
  }

  await page.goto('/login')

  await page.locator('#login').fill(email)
  await page.locator('#senha').fill(password)

  await page.locator('.button-login').click()

  await expect(page.locator('#lblSelecione')).toHaveText('Selecione a organização desejada')
  
  await page.getByPlaceholder('Pesquise outras Organizações').fill('GWSISTEMASQA  J LUCAS')

  await page.locator('figure.icone-acesso').filter({hasText: 'Colaborador'}).click()

  await page.locator('.organizacao').click()

  await expect(page).toHaveTitle('GW Sistemas - Menu')

  await page.waitForTimeout(5000)
});
