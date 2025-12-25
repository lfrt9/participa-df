import { useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: React.ReactNode
}

export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className="text-muted-foreground mb-6">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface PIIWarningModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detectedEntities: Array<{ type: string; value: string }>
  onContinue: () => void
  onEdit: () => void
}

export function PIIWarningModal({
  open,
  onOpenChange,
  detectedEntities,
  onContinue,
  onEdit,
}: PIIWarningModalProps) {
  const editButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      // Focus the edit button when modal opens
      setTimeout(() => editButtonRef.current?.focus(), 100)
    }
  }, [open])

  const entityTypeLabels: Record<string, string> = {
    NAME: 'Nome',
    CPF: 'CPF',
    RG: 'RG',
    PHONE: 'Telefone',
    EMAIL: 'E-mail',
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Dados pessoais detectados
              </Dialog.Title>
              <Dialog.Description className="text-muted-foreground mt-1">
                Encontramos possíveis dados pessoais no seu relato.
              </Dialog.Description>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800 mb-3">
              <strong>Atenção:</strong> Você optou por registrar de forma anônima, mas incluiu informações que podem identificá-lo:
            </p>
            <ul className="space-y-2">
              {detectedEntities.map((entity, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="badge badge--warning">
                    {entityTypeLabels[entity.type] || entity.type}
                  </span>
                  <span className="text-amber-900 font-mono text-sm">
                    {entity.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Para garantir seu anonimato, recomendamos revisar e remover esses dados.
            Se preferir, você pode continuar assim mesmo, mas sua identidade pode ser revelada.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              ref={editButtonRef}
              variant="primary"
              onClick={onEdit}
              className="flex-1"
            >
              Revisar meu relato
            </Button>
            <Button
              variant="outline"
              onClick={onContinue}
              className="flex-1"
            >
              Continuar assim mesmo
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
