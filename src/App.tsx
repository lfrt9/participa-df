import { useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Stepper } from '@/components/ui/Stepper'
import { ToastProvider } from '@/components/ui/Toast'
import { useWizardStore } from '@/hooks/useWizardStore'
import {
  StepRelato,
  StepAssunto,
  StepResumo,
  StepIdentificacao,
  StepAnexos,
  StepProtocolo,
} from '@/features/wizard'
import { WIZARD_STEPS } from '@/types/manifestation'

function WizardContent() {
  const { currentStep } = useWizardStore()

  const renderStep = () => {
    switch (currentStep) {
      case 'relato':
        return <StepRelato />
      case 'assunto':
        return <StepAssunto />
      case 'resumo':
        return <StepResumo />
      case 'identificacao':
        return <StepIdentificacao />
      case 'anexos':
        return <StepAnexos />
      case 'protocolo':
        return <StepProtocolo />
      default:
        return <StepRelato />
    }
  }

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const currentIndex = WIZARD_STEPS.indexOf(currentStep)
  const completedSteps = WIZARD_STEPS.slice(0, currentIndex)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Stepper - hide on protocol step */}
      {currentStep !== 'protocolo' && (
        <div className="mb-8">
          <Stepper currentStep={currentStep} completedSteps={completedSteps} />
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        {renderStep()}
      </div>
    </div>
  )
}

export function App() {
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion')
    }

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <ToastProvider>
      <Layout>
        <WizardContent />
      </Layout>
    </ToastProvider>
  )
}

export default App
