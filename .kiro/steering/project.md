# Contexto do projeto: front-webtrans

Projeto de automação end-to-end do Webtrans, com Playwright e JavaScript.

## Stack
- Playwright (`@playwright/test`)
- Node.js 18+
- JavaScript (ESM — `"type": "module"`)
- dotenv para variáveis de ambiente

## Estrutura
- `tests/setup/` — criação da sessão autenticada (`auth.setup.js`)
- `tests/login/` — cenários de login independentes (começam sem autenticação)
- `tests/cadastros/` — cenários de negócio
- `support/actions/` — ações reutilizáveis entre cenários
- `support/pages/` — Page Objects (locators e interações por tela)

## Convenções
- Testes focam no cenário e nas validações.
- Interações repetidas e locators ficam em `actions` ou Page Objects para reduzir duplicação.
- Sessão autenticada reutilizada em `playwright/.auth/user.json`.
- Comandos comuns:
  - Todos os testes: `npx playwright test`
  - Chromium autenticado: `npx playwright test --project=chromium`
  - Renovar sessão: `npm run auth`
  - Relatório: `npx playwright show-report`

## Segurança
- NUNCA versionar credenciais, tokens, sessões autenticadas ou URLs internas.
- `.env` e `playwright/.auth/user.json` não são versionados.
- `.env.example` contém apenas valores ilustrativos.
