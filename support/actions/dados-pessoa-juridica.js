// Gerador de dados fictícios de Pessoa Jurídica para os testes de cadastro.
//
// Usa @faker-js/faker (locale pt_BR) para textos realistas (razão social,
// endereço, bairro, cidade) e @brazilian-utils/brazilian-utils para gerar
// um CNPJ válido. O CNPJ é gerado no formato alfanumérico (aceito pelo
// sistema). CEP, telefone e inscrição estadual são retornados apenas com
// dígitos.

import { fakerPT_BR as faker } from "@faker-js/faker";
import { generateCNPJ } from "@brazilian-utils/brazilian-utils";

// Opções de tipo CFOP disponíveis no cadastro.
export const TIPOS_CFOP = [
  "Comércio",
  "Indústria",
  "Transportador",
  "Prestador de Serviço",
  "Produtor Rural",
];

function somenteNumeros(valor) {
  return valor.replace(/\D/g, "");
}

/**
 * CNPJ válido. Por padrão gera no formato alfanumérico (novo padrão, aceito
 * pelo sistema); os 12 primeiros caracteres podem conter letras A-Z e os 2
 * dígitos verificadores permanecem numéricos.
 *
 * @param {boolean} [alfanumerico=true] `false` gera o CNPJ apenas numérico.
 * @returns {string} 14 caracteres, sem máscara.
 */
export function gerarCnpj(alfanumerico = true) {
  return alfanumerico ? generateCNPJ(2) : generateCNPJ();
}

/**
 * Telefone fictício, somente números (DDD + número).
 * @returns {string}
 */
export function gerarTelefone() {
  return somenteNumeros(faker.phone.number());
}

/**
 * CEP fictício, somente números (8 dígitos).
 * @returns {string}
 */
export function gerarCep() {
  return somenteNumeros(faker.location.zipCode("########"));
}

/**
 * Inscrição estadual fictícia, somente números (9 dígitos).
 * @returns {string}
 */
export function gerarInscricaoEstadual() {
  return faker.string.numeric(9);
}

/**
 * Gera dados fictícios de uma Pessoa Jurídica.
 *
 * O CNPJ é alfanumérico (aceito pelo sistema). CEP, telefone e inscrição
 * estadual são retornados apenas com números.
 *
 * @param {object} [overrides] Campos para sobrescrever os valores gerados.
 * @returns {{
 *   razaoSocial: string,
 *   cnpj: string,
 *   nomeFantasia: string,
 *   cep: string,
 *   endereco: string,
 *   bairro: string,
 *   fone: string,
 *   cidade: string,
 *   inscricaoEstadual: string,
 *   tipoCfop: string,
 * }}
 */
export function gerarPessoaJuridica(overrides = {}) {
  const razaoSocial = faker.company.name();

  // Nome fantasia derivado do nome da empresa (sem sufixos societários),
  // resultando em algo mais plausível que um substantivo solto.
  const nomeFantasia = razaoSocial
    .replace(/\b(S\.?A\.?|LTDA|ME|EPP|EIRELI|e\s+Filhos|e\s+Cia)\b/gi, "")
    .replace(/[-,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // O faker pt_BR não possui "bairro"; compomos um nome de bairro plausível.
  const bairro = `${faker.helpers.arrayElement([
    "Jardim",
    "Vila",
    "Parque",
    "Centro",
    "Alto",
  ])} ${faker.person.lastName()}`;

  return {
    razaoSocial,
    cnpj: gerarCnpj(),
    nomeFantasia,
    cep: gerarCep(),
    endereco: faker.location.streetAddress(),
    bairro,
    fone: gerarTelefone(),
    cidade: faker.location.city(),
    inscricaoEstadual: gerarInscricaoEstadual(),
    tipoCfop: faker.helpers.arrayElement(TIPOS_CFOP),
    ...overrides,
  };
}
