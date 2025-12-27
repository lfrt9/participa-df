import { useState, useEffect } from 'react'
import { MessageSquare, Mic, Image, X } from 'lucide-react'
import { Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AudioRecorder } from '@/components/media/AudioRecorder'
import { FileUpload } from '@/components/media/FileUpload'
import { useWizardStore } from '@/hooks/useWizardStore'
import { useFormValidation } from '@/hooks/useFormValidation'
import type { MediaFile } from '@/types/manifestation'

type TabType = 'text' | 'audio' | 'files'

export function StepRelato() {
  const { text, setText, media, addMedia, removeMedia, canGoNext, nextStep } = useWizardStore()
  const { handleDisabledContinueClick } = useFormValidation()
  const [activeTab, setActiveTab] = useState<TabType>('text')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; file: File; preview?: string; type: 'image' | 'video' | 'document' }>>([])

  // Sincronizar estado local com mídia do store ao montar/voltar
  useEffect(() => {
    const existingFiles = media
      .filter(m => m.type === 'image' || m.type === 'video')
      .map(m => ({
        id: m.id,
        file: m.file as File,
        preview: m.url,
        type: m.type as 'image' | 'video' | 'document',
      }))

    if (existingFiles.length > 0 && uploadedFiles.length === 0) {
      setUploadedFiles(existingFiles)
    }
  }, [media])

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
    // Detectar arquivos removidos e deletar do store
    const removedFiles = uploadedFiles.filter(
      existing => !files.some(f => f.id === existing.id)
    )
    removedFiles.forEach(f => removeMedia(f.id))

    setUploadedFiles(files)

    // Sync novos arquivos com wizard store
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
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Seu Relato</h2>
        <p className="text-muted-foreground mt-1">
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
              id="relato-textarea"
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
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Áudios gravados:</p>
                  <ul className="space-y-2">
                    {media.filter(m => m.type === 'audio').map((audio) => (
                      <li key={audio.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Mic className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{audio.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {audio.duration ? `${Math.floor(audio.duration / 60)}:${String(Math.floor(audio.duration % 60)).padStart(2, '0')}` : 'Áudio'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedia(audio.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
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
        <div
          onClick={!canGoNext() ? handleDisabledContinueClick : undefined}
          className={!canGoNext() ? 'cursor-pointer' : undefined}
        >
          <Button
            variant="primary"
            onClick={canGoNext() ? nextStep : undefined}
            disabled={!canGoNext()}
            size="lg"
            aria-describedby={!canGoNext() ? 'validation-hint' : undefined}
          >
            Continuar
          </Button>
        </div>
        {!canGoNext() && (
          <span id="validation-hint" className="sr-only">
            Clique para ver os campos que precisam ser preenchidos
          </span>
        )}
      </div>
    </div>
  )
}
