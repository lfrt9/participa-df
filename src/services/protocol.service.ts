/**
 * Serviço de geração de protocolos
 * Formato: DF-YYYYMMDD-XXXXX-TT
 *
 * Onde:
 * - DF: Jurisdição (Distrito Federal)
 * - YYYYMMDD: Data de registro
 * - XXXXX: Número sequencial (00001-99999)
 * - TT: Código do tipo de manifestação
 */

import type { ManifestationType, InputChannel, Protocol } from '@/types/manifestation'

/** Códigos para tipos de manifestação */
const TYPE_CODES: Record<ManifestationType, string> = {
  denuncia: 'DN',
  reclamacao: 'RC',
  sugestao: 'SG',
  elogio: 'EL',
  solicitacao: 'SL',
  informacao: 'IF',
}

/** Códigos para canais de entrada (usado como sufixo) */
const CHANNEL_CODES: Record<InputChannel, string> = {
  text: 'T',
  audio: 'A',
  image: 'I',
  video: 'V',
}

/** Chave para armazenar o contador no localStorage */
const SEQUENCE_KEY = 'participa_df_protocol_sequence'

/**
 * Obtém o próximo número sequencial
 * Em produção, isso seria gerenciado pelo backend
 */
function getNextSequence(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const storageKey = `${SEQUENCE_KEY}_${today}`

  // Obtém o contador atual do dia
  const currentStr = localStorage.getItem(storageKey) || '0'
  const current = parseInt(currentStr, 10)
  const next = current + 1

  // Salva o novo valor
  localStorage.setItem(storageKey, next.toString())

  // Formata com zeros à esquerda (5 dígitos)
  return next.toString().padStart(5, '0')
}

/**
 * Formata a data no padrão YYYYMMDD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * Gera um novo protocolo para a manifestação
 */
export function generateProtocol(
  type: ManifestationType,
  channel: InputChannel
): Protocol {
  const date = new Date()
  const dateStr = formatDate(date)
  const sequence = getNextSequence()
  const typeCode = TYPE_CODES[type] + CHANNEL_CODES[channel]

  const full = `DF-${dateStr}-${sequence}-${typeCode}`

  return {
    full,
    date: dateStr,
    sequence,
    typeCode,
  }
}

/**
 * Valida se um protocolo está no formato correto
 */
export function validateProtocol(protocol: string): boolean {
  const pattern = /^DF-\d{8}-\d{5}-[A-Z]{2,3}$/
  return pattern.test(protocol)
}

/**
 * Extrai informações de um protocolo
 */
export function parseProtocol(protocol: string): Protocol | null {
  if (!validateProtocol(protocol)) {
    return null
  }

  const parts = protocol.split('-')
  return {
    full: protocol,
    date: parts[1],
    sequence: parts[2],
    typeCode: parts[3],
  }
}

/**
 * Formata o protocolo para exibição amigável
 */
export function formatProtocolDisplay(protocol: string): string {
  // Já está formatado, apenas retorna
  return protocol
}

/**
 * Obtém a data de um protocolo como objeto Date
 */
export function getProtocolDate(protocol: string): Date | null {
  const parsed = parseProtocol(protocol)
  if (!parsed) return null

  const year = parseInt(parsed.date.slice(0, 4), 10)
  const month = parseInt(parsed.date.slice(4, 6), 10) - 1
  const day = parseInt(parsed.date.slice(6, 8), 10)

  return new Date(year, month, day)
}
