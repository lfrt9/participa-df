/**
 * Store Zustand para gerenciamento do estado do wizard
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  WizardStep,
  WizardFormState,
  ManifestationType,
  ManifestationCategory,
  MediaFile,
  UserData,
} from '@/types/manifestation'

interface WizardStore extends WizardFormState {
  // Ações de navegação
  setStep: (step: WizardStep) => void
  nextStep: () => void
  prevStep: () => void
  canGoNext: () => boolean
  canGoPrev: () => boolean

  // Ações de dados
  setType: (type: ManifestationType) => void
  setCategory: (category: ManifestationCategory) => void
  setAnonymous: (anonymous: boolean) => void
  setText: (text: string) => void
  setUser: (user: UserData | undefined) => void

  // Ações de mídia
  addMedia: (media: MediaFile) => void
  removeMedia: (id: string) => void
  updateMedia: (id: string, updates: Partial<MediaFile>) => void

  // Ações de PII
  setHasPII: (hasPII: boolean) => void
  dismissPIIWarning: () => void

  // Reset
  reset: () => void
}

const STEPS: WizardStep[] = [
  'relato',
  'assunto',
  'resumo',
  'identificacao',
  'anexos',
  'protocolo',
]

const initialState: WizardFormState = {
  currentStep: 'relato',
  type: undefined,
  category: undefined,
  anonymous: false,
  text: '',
  media: [],
  user: undefined,
  hasPII: false,
  piiWarningDismissed: false,
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navegação
      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const currentIndex = STEPS.indexOf(get().currentStep)
        if (currentIndex < STEPS.length - 1) {
          set({ currentStep: STEPS[currentIndex + 1] })
        }
      },

      prevStep: () => {
        const currentIndex = STEPS.indexOf(get().currentStep)
        if (currentIndex > 0) {
          set({ currentStep: STEPS[currentIndex - 1] })
        }
      },

      canGoNext: () => {
        const state = get()
        const currentIndex = STEPS.indexOf(state.currentStep)

        // Validações por etapa
        switch (state.currentStep) {
          case 'relato':
            return state.text.length >= 20 || state.media.length > 0
          case 'assunto':
            return !!state.type && !!state.category
          case 'resumo':
            return true
          case 'identificacao':
            if (state.anonymous) return true
            return !!(
              state.user?.nome &&
              state.user?.email
            )
          case 'anexos':
            return true
          case 'protocolo':
            return false // Última etapa
          default:
            return currentIndex < STEPS.length - 1
        }
      },

      canGoPrev: () => {
        const currentIndex = STEPS.indexOf(get().currentStep)
        return currentIndex > 0
      },

      // Dados
      setType: (type) => set({ type }),
      setCategory: (category) => set({ category }),
      setAnonymous: (anonymous) => set({ anonymous }),
      setText: (text) => set({ text }),
      setUser: (user) => set({ user }),

      // Mídia
      addMedia: (media) =>
        set((state) => ({
          media: [...state.media, media],
        })),

      removeMedia: (id) =>
        set((state) => ({
          media: state.media.filter((m) => m.id !== id),
        })),

      updateMedia: (id, updates) =>
        set((state) => ({
          media: state.media.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      // PII
      setHasPII: (hasPII) => set({ hasPII }),
      dismissPIIWarning: () => set({ piiWarningDismissed: true }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'participa-df-wizard',
      partialize: (state) => ({
        currentStep: state.currentStep,
        type: state.type,
        category: state.category,
        anonymous: state.anonymous,
        text: state.text,
        user: state.user,
        // Não persistimos mídia (muito grande) nem flags temporários
      }),
    }
  )
)
