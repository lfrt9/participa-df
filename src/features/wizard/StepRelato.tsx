import { useState } from 'react'
import { MessageSquare, Mic, Image } from 'lucide-react'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AudioRecorder } from '@/components/media/AudioRecorder'
import { FileUpload } from '@/components/media/FileUpload'
import { useWizardStore } from '@/hooks/useWizardStore'
import type { MediaFile } from '@/types/manifestation'

type TabType = 'text' | 'audio' | 'files'

export function StepRelato() {
  const { text, setText, media, addMedia, canGoNext, nextStep } = useWizardStore()
  const [activeTab, setActiveTab] = useState<TabType>('text')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; file: File; preview?: string; type: 'image' | 'video' | 'document' }>>([])

  const tabs = [
    { id: 'text' as TabType, label: 'Texto', icon: MessageSquare },
    { id: 'audio' as TabType, label: 'Áudio', icon: Mic },
    { id: 'files' as TabType, label: 'Arquivos', icon: Image },
  ]

  const handleAudioComplete = (blob: Blob, duration: number) => {
    const audioFile: MediaFile = {
      id: Math.random().toString(36).slice(2, 9),
      type: 'audio',
      blob,
      name: `gravacao-${new Date().toISOString().slice(0, 10)}.webm`,
      size: blob.size,
      mimeType: 'audio/webm',
      duration,
      status: 'ready',
    }
    addMedia(audioFile)
  }

  const handleFilesChange = (files: typeof uploadedFiles) => {
    setUploadedFiles(files)
    // Sync with wizard store
    files.forEach(f => {
      const existingMedia = media.find(m => m.id === f.id)
      if (!existingMedia) {
        const mediaFile: MediaFile = {
          id: f.id,
          type: f.type === 'video' ? 'video' : 'image',
          file: f.file,
          url: f.preview,
          name: f.file.name,
          size: f.file.size,
          mimeType: f.file.type,
          status: 'ready',
        }
        addMedia(mediaFile)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Seu Relato</h2>
        <p className="text-muted-foreground mt-2">
          Conte o que aconteceu. Você pode escrever, gravar um áudio ou anexar arquivos.
        </p>
      </div>

      {/* Tab navigation */}
      <div
        className="flex border-b"
        role="tablist"
        aria-label="Formas de registrar seu relato"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-medium ${
                isActive
                  ? 'border-[hsl(var(--gdf-blue))] text-[hsl(var(--gdf-blue))]'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab panels */}
      <div className="min-h-[300px]">
        {/* Text panel */}
        <div
          id="panel-text"
          role="tabpanel"
          aria-labelledby="tab-text"
          hidden={activeTab !== 'text'}
        >
          {activeTab === 'text' && (
            <Textarea
              label="Descreva sua manifestação"
              placeholder="Descreva os fatos de forma clara e objetiva. Inclua datas, locais e pessoas envolvidas, se souber."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={5000}
              showCount={true}
              hint="Mínimo de 20 caracteres para continuar"
              required
            />
          )}
        </div>

        {/* Audio panel */}
        <div
          id="panel-audio"
          role="tabpanel"
          aria-labelledby="tab-audio"
          hidden={activeTab !== 'audio'}
        >
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Grave um áudio descrevendo sua manifestação. Máximo de 5 minutos.
              </p>
              <AudioRecorder
                onRecordingComplete={handleAudioComplete}
                maxDuration={300}
              />
              {media.filter(m => m.type === 'audio').length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Áudio gravado com sucesso!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Files panel */}
        <div
          id="panel-files"
          role="tabpanel"
          aria-labelledby="tab-files"
          hidden={activeTab !== 'files'}
        >
          {activeTab === 'files' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Anexe fotos, vídeos ou documentos que comprovem sua manifestação.
              </p>
              <FileUpload
                files={uploadedFiles}
                onFilesChange={handleFilesChange}
                maxFiles={5}
                maxSize={25}
              />
            </div>
          )}
        </div>
      </div>

      {/* Continue button */}
      <div className="flex justify-end pt-4 border-t">
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
