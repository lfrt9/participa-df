import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useWizardStore } from '@/hooks/useWizardStore'
import { useFormValidation } from '@/hooks/useFormValidation'
import {
  CATEGORY_LABELS,
  MANIFESTATION_TYPE_LABELS,
  MANIFESTATION_TYPE_DESCRIPTIONS,
  type ManifestationCategory,
  type ManifestationType,
} from '@/types/manifestation'

const typeOptions: Array<{ value: string; label: string; description: string }> = [
  { value: 'denuncia', label: MANIFESTATION_TYPE_LABELS.denuncia, description: MANIFESTATION_TYPE_DESCRIPTIONS.denuncia },
  { value: 'reclamacao', label: MANIFESTATION_TYPE_LABELS.reclamacao, description: MANIFESTATION_TYPE_DESCRIPTIONS.reclamacao },
  { value: 'sugestao', label: MANIFESTATION_TYPE_LABELS.sugestao, description: MANIFESTATION_TYPE_DESCRIPTIONS.sugestao },
  { value: 'elogio', label: MANIFESTATION_TYPE_LABELS.elogio, description: MANIFESTATION_TYPE_DESCRIPTIONS.elogio },
  { value: 'solicitacao', label: MANIFESTATION_TYPE_LABELS.solicitacao, description: MANIFESTATION_TYPE_DESCRIPTIONS.solicitacao },
  { value: 'informacao', label: MANIFESTATION_TYPE_LABELS.informacao, description: MANIFESTATION_TYPE_DESCRIPTIONS.informacao },
]

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export function StepAssunto() {
  const { type, setType, category, setCategory, canGoNext, nextStep, prevStep } = useWizardStore()
  const { handleDisabledContinueClick } = useFormValidation()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tipo e Assunto</h2>
        <p className="text-muted-foreground mt-1">
          Selecione o tipo de manifestação e a área relacionada.
        </p>
      </div>

      {/* Tipo de manifestação - Dropdown */}
      <section>
        <Select
          id="tipo-select"
          label="Tipo da Manifestação"
          value={type}
          onValueChange={(value) => setType(value as ManifestationType)}
          options={typeOptions}
          placeholder="Selecione o tipo..."
        />
      </section>

      {/* Categoria */}
      <section>
        <Select
          id="categoria-select"
          label="Área/Assunto"
          value={category}
          onValueChange={(value) => setCategory(value as ManifestationCategory)}
          options={categoryOptions}
          placeholder="Selecione a área relacionada..."
        />
      </section>

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
            onClick={canGoNext() ? nextStep : undefined}
            disabled={!canGoNext()}
            size="lg"
            aria-describedby={!canGoNext() ? 'validation-hint-assunto' : undefined}
          >
            Continuar
          </Button>
        </div>
        {!canGoNext() && (
          <span id="validation-hint-assunto" className="sr-only">
            Clique para ver os campos que precisam ser preenchidos
          </span>
        )}
      </div>
    </div>
  )
}
