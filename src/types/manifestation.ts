/**
 * Tipos para o sistema de manifestações da Ouvidoria
 * Participa DF - Governo do Distrito Federal
 */

/** Tipos de manifestação suportados */
export type ManifestationType =
  | 'denuncia'
  | 'reclamacao'
  | 'sugestao'
  | 'elogio'
  | 'solicitacao'
  | 'informacao'

/** Labels em português para tipos de manifestação */
export const MANIFESTATION_TYPE_LABELS: Record<ManifestationType, string> = {
  denuncia: 'Denúncia',
  reclamacao: 'Reclamação',
  sugestao: 'Sugestão',
  elogio: 'Elogio',
  solicitacao: 'Solicitação',
  informacao: 'Pedido de Informação',
}

/** Descrições dos tipos de manifestação */
export const MANIFESTATION_TYPE_DESCRIPTIONS: Record<ManifestationType, string> = {
  denuncia: 'Comunicar irregularidades ou condutas ilegais',
  reclamacao: 'Relatar insatisfação com serviço público',
  sugestao: 'Propor melhorias nos serviços',
  elogio: 'Reconhecer um bom atendimento',
  solicitacao: 'Solicitar um serviço ou providência',
  informacao: 'Solicitar informações sobre serviços',
}

/** Canais de entrada (multicanalidade) */
export type InputChannel = 'text' | 'audio' | 'image' | 'video'

/** Labels para canais de entrada */
export const INPUT_CHANNEL_LABELS: Record<InputChannel, string> = {
  text: 'Texto',
  audio: 'Áudio',
  image: 'Imagem',
  video: 'Vídeo',
}

/** Categorias/Assuntos de manifestação */
export type ManifestationCategory =
  | 'saude'
  | 'educacao'
  | 'seguranca'
  | 'transporte'
  | 'assistencia_social'
  | 'meio_ambiente'
  | 'infraestrutura'
  | 'cultura'
  | 'esporte'
  | 'outros'

/** Labels para categorias */
export const CATEGORY_LABELS: Record<ManifestationCategory, string> = {
  saude: 'Saúde',
  educacao: 'Educação',
  seguranca: 'Segurança Pública',
  transporte: 'Transporte',
  assistencia_social: 'Assistência Social',
  meio_ambiente: 'Meio Ambiente',
  infraestrutura: 'Infraestrutura',
  cultura: 'Cultura',
  esporte: 'Esporte e Lazer',
  outros: 'Outros',
}

/** Status do arquivo de mídia */
export type MediaStatus = 'idle' | 'recording' | 'processing' | 'ready' | 'error'

/** Arquivo de mídia anexado */
export interface MediaFile {
  id: string
  type: InputChannel
  file?: File
  blob?: Blob
  url?: string
  name: string
  size: number
  mimeType: string
  duration?: number // Para áudio/vídeo em segundos
  thumbnail?: string // URL da thumbnail para imagem/vídeo
  status: MediaStatus
  error?: string
}

/** Dados do usuário (quando identificado) */
export interface UserData {
  nome: string
  cpf?: string
  email: string
  telefone?: string
}

/** Dados da manifestação completa */
export interface Manifestation {
  id: string
  type: ManifestationType
  category: ManifestationCategory
  anonymous: boolean
  user?: UserData
  content: {
    text?: string
    media: MediaFile[]
  }
  location?: {
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  createdAt: Date
  protocol?: string
}

/** Etapas do wizard de registro */
export type WizardStep =
  | 'relato'
  | 'assunto'
  | 'resumo'
  | 'identificacao'
  | 'anexos'
  | 'protocolo'

/** Labels das etapas */
export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  relato: 'Relato',
  assunto: 'Assunto',
  resumo: 'Resumo',
  identificacao: 'Identificação',
  anexos: 'Anexos',
  protocolo: 'Protocolo',
}

/** Ordem das etapas */
export const WIZARD_STEPS: WizardStep[] = [
  'relato',
  'assunto',
  'resumo',
  'identificacao',
  'anexos',
  'protocolo',
]

/** Estado do formulário do wizard */
export interface WizardFormState {
  currentStep: WizardStep
  type?: ManifestationType
  category?: ManifestationCategory
  anonymous: boolean
  text: string
  media: MediaFile[]
  user?: UserData
  hasPII: boolean
  piiWarningDismissed: boolean
}

/** Formato do protocolo: DF-YYYYMMDD-XXXXX-TT */
export interface Protocol {
  full: string // DF-20260127-00042-DV
  date: string // 20260127
  sequence: string // 00042
  typeCode: string // DV
}
