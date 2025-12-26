import { useState, useEffect } from 'react'
import { User, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { PIIWarningModal } from '@/components/ui/Modal'
import { useWizardStore } from '@/hooks/useWizardStore'
import { useFormValidation } from '@/hooks/useFormValidation'
import type { UserData } from '@/types/manifestation'

// Simple PII detection patterns (reusing from projeto1 concept)
const PII_PATTERNS = {
  CPF: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
  PHONE: /\(?\d{2}\)?\s?9?\d{4}-?\d{4}/g,
  EMAIL: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
  NAME: /\b[A-Z][a-zà-ú]+\s+[A-Z][a-zà-ú]+(?:\s+[A-Z][a-zà-ú]+)*/g,
}

function detectPII(text: string): Array<{ type: string; value: string }> {
  const entities: Array<{ type: string; value: string }> = []

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(value => {
        if (!entities.some(e => e.value === value)) {
          entities.push({ type, value })
        }
      })
    }
  }

  return entities
}

export function StepIdentificacao() {
  const {
    anonymous,
    setAnonymous,
    user,
    setUser,
    text,
    setHasPII,
    piiWarningDismissed,
    dismissPIIWarning,
    canGoNext,
    nextStep,
    prevStep,
  } = useWizardStore()

  const { handleDisabledContinueClick } = useFormValidation()
  const [showPIIModal, setShowPIIModal] = useState(false)
  const [detectedEntities, setDetectedEntities] = useState<Array<{ type: string; value: string }>>([])
  const [formData, setFormData] = useState<UserData>({
    nome: user?.nome || '',
    cpf: user?.cpf || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({})

  // Check for PII when anonymous is toggled on
  useEffect(() => {
    if (anonymous && text) {
      const entities = detectPII(text)
      if (entities.length > 0) {
        setDetectedEntities(entities)
        setHasPII(true)
        if (!piiWarningDismissed) {
          setShowPIIModal(true)
        }
      }
    }
  }, [anonymous, text, piiWarningDismissed, setHasPII])

  const handleInputChange = (field: keyof UserData, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    setErrors(prev => ({ ...prev, [field]: undefined }))
    // Sync to wizard store for real-time validation
    setUser(newFormData)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {}

    if (!anonymous) {
      if (!formData.nome || formData.nome.length < 3) {
        newErrors.nome = 'Nome é obrigatório (mínimo 3 caracteres)'
      }
      if (!formData.email) {
        newErrors.email = 'E-mail é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'E-mail inválido'
      }
      if (formData.cpf && !/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(formData.cpf)) {
        newErrors.cpf = 'CPF inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!anonymous && !validateForm()) {
      return
    }

    if (!anonymous) {
      setUser(formData)
    } else {
      setUser(undefined)
    }

    nextStep()
  }

  const handlePIIEdit = () => {
    setShowPIIModal(false)
    // Navigate back to relato step to edit
    useWizardStore.getState().setStep('relato')
  }

  const handlePIIContinue = () => {
    setShowPIIModal(false)
    dismissPIIWarning()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Identificação</h2>
        <p className="text-muted-foreground mt-1">
          Escolha se deseja se identificar ou permanecer anônimo.
        </p>
      </div>

      {/* Anonimato toggle */}
      <div className="bg-white border rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            anonymous ? 'bg-amber-100' : 'bg-[hsl(var(--gdf-blue-light))]'
          }`}>
            {anonymous ? (
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            ) : (
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--gdf-blue))]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-semibold text-base sm:text-lg">
                  {anonymous ? 'Manifestação Anônima' : 'Manifestação Identificada'}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {anonymous
                    ? 'Sua identidade será protegida'
                    : 'Você receberá respostas por e-mail'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Toggle
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                  label="Anônimo"
                />
              </div>
            </div>

            {anonymous && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Importante sobre anonimato:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Você não poderá acompanhar o andamento</li>
                      <li>Não receberá resposta sobre sua manifestação</li>
                      <li>Evite incluir dados pessoais no relato</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulário de identificação */}
      {!anonymous && (
        <div className="bg-white border rounded-xl p-4 sm:p-6 space-y-3">
          <h3 className="font-semibold text-base sm:text-lg mb-3">Seus dados</h3>

          <Input
            id="input-nome"
            label="Nome completo"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            error={errors.nome}
            required
            placeholder="Digite seu nome completo"
            autoComplete="name"
          />

          <Input
            id="input-cpf"
            label="CPF"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            error={errors.cpf}
            placeholder="000.000.000-00"
            hint="Opcional, mas facilita o acompanhamento"
            autoComplete="off"
          />

          <Input
            id="input-email"
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
            placeholder="seu@email.com"
            autoComplete="email"
          />

          <Input
            id="input-telefone"
            label="Telefone"
            type="tel"
            value={formData.telefone}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            placeholder="(61) 99999-9999"
            hint="Opcional"
            autoComplete="tel"
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <div
          onClick={!canGoNext() ? handleDisabledContinueClick : undefined}
          className={!canGoNext() ? 'cursor-pointer' : undefined}
        >
          <Button
            variant="primary"
            onClick={canGoNext() ? handleContinue : undefined}
            disabled={!canGoNext()}
            size="lg"
            aria-describedby={!canGoNext() ? 'validation-hint-identificacao' : undefined}
          >
            Continuar
          </Button>
        </div>
        {!canGoNext() && (
          <span id="validation-hint-identificacao" className="sr-only">
            Clique para ver os campos que precisam ser preenchidos
          </span>
        )}
      </div>

      {/* PII Warning Modal */}
      <PIIWarningModal
        open={showPIIModal}
        onOpenChange={setShowPIIModal}
        detectedEntities={detectedEntities}
        onContinue={handlePIIContinue}
        onEdit={handlePIIEdit}
      />
    </div>
  )
}
