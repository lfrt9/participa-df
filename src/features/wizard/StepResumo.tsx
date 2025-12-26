import {
  FileText,
  Mic,
  Image,
  Film,
  Tag,
  FolderOpen,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useWizardStore } from '@/hooks/useWizardStore'
import {
  MANIFESTATION_TYPE_LABELS,
  CATEGORY_LABELS,
  type ManifestationType,
} from '@/types/manifestation'

export function StepResumo() {
  const { text, media, type, category, nextStep, prevStep, setStep } = useWizardStore()

  const hasText = text.length > 0
  const hasAudio = media.some(m => m.type === 'audio')
  const hasImages = media.some(m => m.type === 'image')
  const hasVideos = media.some(m => m.type === 'video')

  const getTypeColor = (t: ManifestationType | undefined) => {
    const colors = {
      denuncia: 'bg-red-100 text-red-700',
      reclamacao: 'bg-orange-100 text-orange-700',
      sugestao: 'bg-amber-100 text-amber-700',
      elogio: 'bg-green-100 text-green-700',
      solicitacao: 'bg-blue-100 text-blue-700',
      informacao: 'bg-purple-100 text-purple-700',
    }
    return t ? colors[t] : 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Resumo</h2>
        <p className="text-muted-foreground mt-1">
          Confira os dados da sua manifestação antes de continuar.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="space-y-3">
        {/* Tipo e categoria */}
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--gdf-blue-light))] flex items-center justify-center">
                <Tag className="w-5 h-5 text-[hsl(var(--gdf-blue))]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">
                  {type ? MANIFESTATION_TYPE_LABELS[type] : 'Não selecionado'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(type)}`}>
              {type ? MANIFESTATION_TYPE_LABELS[type] : '—'}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--gdf-green-light))] flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-[hsl(var(--gdf-green))]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p className="font-medium">
                {category ? CATEGORY_LABELS[category] : 'Não selecionada'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep('assunto')}
            className="text-sm text-[hsl(var(--gdf-blue))] hover:underline"
          >
            Alterar tipo ou categoria
          </button>
        </div>

        {/* Conteúdo */}
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h3 className="font-semibold">Conteúdo da manifestação</h3>

          {/* Texto */}
          {hasText && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Texto</p>
                <p className="text-sm line-clamp-3">{text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {text.length} caracteres
                </p>
              </div>
            </div>
          )}

          {/* Áudio */}
          {hasAudio && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mic className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Áudio gravado</p>
                <p className="text-sm">
                  {media.filter(m => m.type === 'audio').length} gravação(ões)
                </p>
              </div>
            </div>
          )}

          {/* Imagens */}
          {hasImages && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Image className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Imagens</p>
                <p className="text-sm">
                  {media.filter(m => m.type === 'image').length} arquivo(s)
                </p>
              </div>
            </div>
          )}

          {/* Vídeos */}
          {hasVideos && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Film className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vídeos</p>
                <p className="text-sm">
                  {media.filter(m => m.type === 'video').length} arquivo(s)
                </p>
              </div>
            </div>
          )}

          {!hasText && !hasAudio && !hasImages && !hasVideos && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                Nenhum conteúdo adicionado. Volte à etapa anterior para adicionar seu relato.
              </p>
            </div>
          )}

          <button
            onClick={() => setStep('relato')}
            className="text-sm text-[hsl(var(--gdf-blue))] hover:underline"
          >
            Editar relato
          </button>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button variant="primary" onClick={nextStep} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  )
}
