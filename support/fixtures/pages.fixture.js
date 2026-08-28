import { test as base } from "@playwright/test";
import { RelatorioPadraoPage } from "../pages/relatorios/relatorio-padrao.page.js";

export const test = base.extend({
  relatorioPadraoPage: async ({ page }, use) => {
    await use(new RelatorioPadraoPage(page));
  },
});
