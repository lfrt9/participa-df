/**
 * Hook para validação de formulário e feedback ao usuário
 */

import { useCallback } from 'react'
import { useWizardStore, type ValidationError } from './useWizardStore'
import { toast } from '@/components/ui/Toast'

interface UseFormValidationReturn {
  handleDisabledContinueClick: () => void
  highlightInvalidFields: (errors: ValidationError[]) => void
  scrollToFirstError: (errors: ValidationError[]) => void
}

/**
 * Hook que gerencia a validação do formulário quando o botão Continuar está desabilitado
 */
export function useFormValidation(): UseFormValidationReturn {
  const getValidationErrors = useWizardStore((state) => state.getValidationErrors)

  /**
   * Adiciona classe de destaque aos campos inválidos
   */
  const highlightInvalidFields = useCallback((errors: ValidationError[]) => {
    // Remove destaques anteriores
    document.querySelectorAll('.field-invalid-highlight').forEach((el) => {
      el.classList.remove('field-invalid-highlight')
    })

    // Adiciona destaque aos novos campos inválidos
    errors.forEach((error) => {
      if (error.elementId) {
        const element = document.getElementById(error.elementId)
        if (element) {
          element.classList.add('field-invalid-highlight')
          // Remove destaque após 3 segundos
          setTimeout(() => {
            element.classList.remove('field-invalid-highlight')
          }, 3000)
        }
      }
    })
  }, [])

  /**
   * Rola a página até o primeiro campo com erro
   */
  const scrollToFirstError = useCallback((errors: ValidationError[]) => {
    if (errors.length > 0 && errors[0].elementId) {
      const element = document.getElementById(errors[0].elementId)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        // Foca o elemento para acessibilidade
        element.focus({ preventScroll: true })
      }
    }
  }, [])

  /**
   * Handler para clique no botão Continuar quando desabilitado
   */
  const handleDisabledContinueClick = useCallback(() => {
    const errors = getValidationErrors()

    if (errors.length === 0) return

    // Monta mensagem do toast
    const messages = errors.map((e) => e.message)
    const toastMessage =
      errors.length === 1
        ? messages[0]
        : `Campos obrigatórios: ${messages.join('; ')}`

    // Mostra toast com erro
    toast('warning', toastMessage, 5000)

    // Destaca campos inválidos
    highlightInvalidFields(errors)

    // Rola até o primeiro erro
    scrollToFirstError(errors)

    // Anuncia para leitores de tela
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'alert')
    announcement.setAttribute('aria-live', 'assertive')
    announcement.className = 'sr-only'
    announcement.textContent = toastMessage
    document.body.appendChild(announcement)
    setTimeout(() => announcement.remove(), 1000)
  }, [getValidationErrors, highlightInvalidFields, scrollToFirstError])

  return {
    handleDisabledContinueClick,
    highlightInvalidFields,
    scrollToFirstError,
  }
}
