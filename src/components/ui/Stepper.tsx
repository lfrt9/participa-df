import { Check } from 'lucide-react'
import type { WizardStep } from '@/types/manifestation'
import { WIZARD_STEPS, WIZARD_STEP_LABELS } from '@/types/manifestation'

interface StepperProps {
  currentStep: WizardStep
  completedSteps?: WizardStep[]
}

export function Stepper({ currentStep, completedSteps = [] }: StepperProps) {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep)

  return (
    <nav aria-label="Etapas do registro" className="w-full">
      {/* Mobile: Show current step only */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="step-indicator step-indicator--active">
            {currentIndex + 1}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Etapa {currentIndex + 1} de {WIZARD_STEPS.length}</p>
            <p className="font-medium">{WIZARD_STEP_LABELS[currentStep]}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {WIZARD_STEPS.map((step, index) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < currentIndex
                  ? 'bg-[hsl(var(--gdf-green))]'
                  : index === currentIndex
                  ? 'bg-[hsl(var(--gdf-blue))]'
                  : 'bg-border'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* Desktop: Full stepper */}
      <ol className="hidden md:flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step) || index < currentIndex
          const isCurrent = step === currentStep

          return (
            <li key={step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <div
                  className={`step-indicator ${
                    isCompleted
                      ? 'step-indicator--completed'
                      : isCurrent
                      ? 'step-indicator--active'
                      : 'step-indicator--pending'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium whitespace-nowrap ${
                    isCurrent
                      ? 'text-[hsl(var(--gdf-blue))]'
                      : isCompleted
                      ? 'text-[hsl(var(--gdf-green))]'
                      : 'text-muted-foreground'
                  }`}
                >
                  {WIZARD_STEP_LABELS[step]}
                </span>
              </div>

              {/* Connector line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`step-connector ${
                    isCompleted ? 'step-connector--completed' : 'step-connector--pending'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Etapa atual: {WIZARD_STEP_LABELS[currentStep]}, {currentIndex + 1} de {WIZARD_STEPS.length}
      </div>
    </nav>
  )
}
