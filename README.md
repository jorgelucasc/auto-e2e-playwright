# Front Webtrans — Testes End-to-End

Projeto de automação end-to-end do Webtrans, desenvolvido com [Playwright](https://playwright.dev/) e JavaScript.

## Objetivo

Este projeto iniciou a automação end-to-end do sistema Webtrans com Playwright.

Além de cobrir fluxos críticos, a iniciativa busca melhorar o processo de validação, reduzindo atividades manuais, aumentando a confiabilidade das entregas e criando uma base reutilizável para novos cenários automatizados.

## Pré-requisitos

- Node.js 18 ou superior
- Acesso ao ambiente que será testado

## Instalação

```bash
npm install
npx playwright install
```

## Configuração

Copie o arquivo de exemplo e preencha as credenciais de teste:

```bash
cp .env.example .env
```

| Variável | Descrição |
| --- | --- |
| `E2E_BASE_URL` | URL base do ambiente Webtrans. |
| `E2E_LOGIN_EMAIL` | E-mail do usuário de teste. |
| `E2E_LOGIN_PASSWORD` | Senha do usuário de teste. |
| `E2E_ORGANIZATION` | Organização selecionada após o login. |

O arquivo `.env` e a sessão gerada em `playwright/.auth/user.json` não são versionados.
Nunca versione credenciais, tokens, sessões autenticadas ou URLs internas. O arquivo `.env.example` contém apenas valores ilustrativos.

## Autenticação reutilizável

Os testes autenticados reutilizam a sessão salva em `playwright/.auth/user.json`.

Na primeira execução, quando esse arquivo não existe, o `auth.setup.js` cria a sessão automaticamente. Para criar ou renovar manualmente a sessão, execute:

```bash
npm run auth
```

Esse comando faz um novo login e substitui a sessão salva. Use-o quando a sessão expirar ou quando as credenciais/organização forem alteradas.

Os cenários em `tests/login` são independentes e sempre começam sem autenticação.

## Executando os testes

```bash
# Todos os testes
npx playwright test

# Apenas os testes autenticados no Chromium
npx playwright test --project=chromium

# Um arquivo específico
npx playwright test tests/cadastros/financeiro/fornecedor.spec.js --project=chromium

# Modo visual
npx playwright test --headed
```

## Relatório

Após a execução, abra o relatório HTML com:

```bash
npx playwright show-report
```

## Organização do projeto

```text
tests/
  setup/       # Criação da sessão autenticada
  login/       # Cenários de login independentes
  cadastros/   # Cenários de negócio
support/
  actions/     # Ações reutilizáveis entre cenários
  pages/       # Page Objects: locators e interações por tela
```

Os testes devem manter o foco no cenário e nas validações. Interações repetidas e locators ficam em actions ou Page Objects para reduzir duplicação e facilitar manutenção.
