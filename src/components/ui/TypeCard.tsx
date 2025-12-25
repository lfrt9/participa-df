import { forwardRef } from 'react'
import {
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  ThumbsUp,
  FileText,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import type { ManifestationType } from '@/types/manifestation'
import {
  MANIFESTATION_TYPE_LABELS,
  MANIFESTATION_TYPE_DESCRIPTIONS,
} from '@/types/manifestation'

interface TypeCardProps {
  type: ManifestationType
  selected: boolean
  onSelect: () => void
}

const typeIcons: Record<ManifestationType, LucideIcon> = {
  denuncia: AlertTriangle,
  reclamacao: MessageSquare,
  sugestao: Lightbulb,
  elogio: ThumbsUp,
  solicitacao: FileText,
  informacao: HelpCircle,
}

const typeColors: Record<ManifestationType, string> = {
  denuncia: 'text-red-600 bg-red-100',
  reclamacao: 'text-orange-600 bg-orange-100',
  sugestao: 'text-amber-600 bg-amber-100',
  elogio: 'text-green-600 bg-green-100',
  solicitacao: 'text-blue-600 bg-blue-100',
  informacao: 'text-purple-600 bg-purple-100',
}

export const TypeCard = forwardRef<HTMLButtonElement, TypeCardProps>(
  ({ type, selected, onSelect }, ref) => {
    const Icon = typeIcons[type]
    const label = MANIFESTATION_TYPE_LABELS[type]
    const description = MANIFESTATION_TYPE_DESCRIPTIONS[type]
    const colorClass = typeColors[type]

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className={`type-card text-left w-full ${selected ? 'type-card--selected' : ''}`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${colorClass} type-card-icon`}>
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-[hsl(var(--gdf-blue))] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </button>
    )
  }
)

TypeCard.displayName = 'TypeCard'
