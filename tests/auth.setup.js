import { test as setup, expect } from '@playwright/test';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const authFile = 'playwright/.auth/user.json';

setup('cria uma sessão autenticada para os testes', async ({ page }) => {
  const { E2E_LOGIN_EMAIL: email, E2E_LOGIN_PASSWORD: password } = process.env;

  if (!email || !password) {
    throw new Error('Defina E2E_LOGIN_EMAIL e E2E_LOGIN_PASSWORD antes de executar os testes autenticados.');
  }

  await rm(authFile, { force: true });
  await page.context().clearCookies();
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  // await page.reload();
  await page.locator('#login').fill(email)
  await page.locator('#senha').fill(password)

  await page.locator('.button-login').click()

  await expect(page.locator('#lblSelecione')).toHaveText('Selecione a organização desejada');
  await page.getByPlaceholder('Pesquise outras Organizações').fill(
    process.env.E2E_ORGANIZATION ?? 'GWSISTEMASQA  J LUCAS',
  );
  await page.locator('figure.icone-acesso').filter({ hasText: 'Colaborador' }).click();
  await page.locator('.organizacao').click();
  await expect(page).toHaveTitle('GW Sistemas - Home');

  await mkdir(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
