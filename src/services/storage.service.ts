/**
 * Serviço de armazenamento offline usando IndexedDB
 * Utiliza localforage para abstração e fallback
 */

import localforage from 'localforage'
import type { Manifestation, WizardFormState } from '@/types/manifestation'

// Configuração do localforage
localforage.config({
  name: 'participa-df-ouvidoria',
  storeName: 'manifestations',
  description: 'Armazenamento offline para manifestações do Participa DF',
})

// Stores separados para diferentes tipos de dados
const manifestationsStore = localforage.createInstance({
  name: 'participa-df-ouvidoria',
  storeName: 'manifestations',
})

const draftsStore = localforage.createInstance({
  name: 'participa-df-ouvidoria',
  storeName: 'drafts',
})

const mediaStore = localforage.createInstance({
  name: 'participa-df-ouvidoria',
  storeName: 'media',
})

/**
 * Manifestações
 */

/** Salva uma manifestação completa */
export async function saveManifestation(manifestation: Manifestation): Promise<void> {
  await manifestationsStore.setItem(manifestation.id, manifestation)
}

/** Obtém uma manifestação por ID */
export async function getManifestation(id: string): Promise<Manifestation | null> {
  return await manifestationsStore.getItem<Manifestation>(id)
}

/** Lista todas as manifestações */
export async function getAllManifestations(): Promise<Manifestation[]> {
  const manifestations: Manifestation[] = []
  await manifestationsStore.iterate<Manifestation, void>((value) => {
    manifestations.push(value)
  })
  return manifestations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/** Remove uma manifestação */
export async function deleteManifestation(id: string): Promise<void> {
  await manifestationsStore.removeItem(id)
}

/**
 * Rascunhos (drafts)
 */

const CURRENT_DRAFT_KEY = 'current_draft'

/** Salva o rascunho atual do formulário */
export async function saveDraft(state: WizardFormState): Promise<void> {
  await draftsStore.setItem(CURRENT_DRAFT_KEY, {
    ...state,
    savedAt: new Date().toISOString(),
  })
}

/** Recupera o rascunho atual */
export async function getDraft(): Promise<WizardFormState | null> {
  return await draftsStore.getItem<WizardFormState>(CURRENT_DRAFT_KEY)
}

/** Limpa o rascunho atual */
export async function clearDraft(): Promise<void> {
  await draftsStore.removeItem(CURRENT_DRAFT_KEY)
}

/** Verifica se existe um rascunho */
export async function hasDraft(): Promise<boolean> {
  const draft = await getDraft()
  return draft !== null
}

/**
 * Mídia (arquivos de áudio, imagem, vídeo)
 */

/** Salva um arquivo de mídia */
export async function saveMedia(id: string, blob: Blob): Promise<void> {
  await mediaStore.setItem(id, blob)
}

/** Obtém um arquivo de mídia */
export async function getMedia(id: string): Promise<Blob | null> {
  return await mediaStore.getItem<Blob>(id)
}

/** Remove um arquivo de mídia */
export async function deleteMedia(id: string): Promise<void> {
  await mediaStore.removeItem(id)
}

/** Remove todos os arquivos de mídia de uma manifestação */
export async function deleteManifestationMedia(mediaIds: string[]): Promise<void> {
  await Promise.all(mediaIds.map((id) => deleteMedia(id)))
}

/**
 * Utilitários
 */

/** Limpa todos os dados armazenados */
export async function clearAllData(): Promise<void> {
  await Promise.all([
    manifestationsStore.clear(),
    draftsStore.clear(),
    mediaStore.clear(),
  ])
}

/** Obtém o tamanho aproximado do armazenamento usado */
export async function getStorageUsage(): Promise<number> {
  let totalSize = 0

  await manifestationsStore.iterate((value) => {
    totalSize += JSON.stringify(value).length
  })

  await draftsStore.iterate((value) => {
    totalSize += JSON.stringify(value).length
  })

  await mediaStore.iterate((value) => {
    if (value instanceof Blob) {
      totalSize += value.size
    }
  })

  return totalSize
}

/** Verifica se o armazenamento está disponível */
export async function isStorageAvailable(): Promise<boolean> {
  try {
    await localforage.setItem('_test_', 'test')
    await localforage.removeItem('_test_')
    return true
  } catch {
    return false
  }
}
