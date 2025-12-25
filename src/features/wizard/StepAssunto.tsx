import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { TypeCard } from '@/components/ui/TypeCard'
import { useWizardStore } from '@/hooks/useWizardStore'
import {
  CATEGORY_LABELS,
  type ManifestationCategory,
  type ManifestationType,
} from '@/types/manifestation'

const manifestationTypes: ManifestationType[] = [
  'denuncia',
  'reclamacao',
  'sugestao',
  'elogio',
  'solicitacao',
  'informacao',
]

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export function StepAssunto() {
  const { type, setType, category, setCategory, canGoNext, nextStep, prevStep } = useWizardStore()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tipo e Assunto</h2>
        <p className="text-muted-foreground mt-2">
          Selecione o tipo de manifestação e a área relacionada.
        </p>
      </div>

      {/* Tipo de manifestação */}
      <section aria-labelledby="tipo-heading">
        <h3 id="tipo-heading" className="text-lg font-semibold mb-4">
          Tipo da Manifestação
        </h3>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          role="radiogroup"
          aria-labelledby="tipo-heading"
        >
          {manifestationTypes.map((t) => (
            <TypeCard
              key={t}
              type={t}
              selected={type === t}
              onSelect={() => setType(t)}
            />
          ))}
        </div>
      </section>

      {/* Categoria */}
      <section aria-labelledby="categoria-heading">
        <h3 id="categoria-heading" className="text-lg font-semibold mb-4">
          Área/Assunto
        </h3>
        <Select
          label="Selecione a área relacionada"
          value={category}
          onValueChange={(value) => setCategory(value as ManifestationCategory)}
          options={categoryOptions}
          placeholder="Escolha uma categoria..."
        />
      </section>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button
          variant="primary"
          onClick={nextStep}
          disabled={!canGoNext()}
          size="lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
