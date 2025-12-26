import { useState } from 'react'
import { Paperclip, Plus, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/media/FileUpload'
import { AudioRecorder } from '@/components/media/AudioRecorder'
import { useWizardStore } from '@/hooks/useWizardStore'
import type { MediaFile } from '@/types/manifestation'

export function StepAnexos() {
  const { media, addMedia, removeMedia, nextStep, prevStep } = useWizardStore()
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; file: File; preview?: string; type: 'image' | 'video' | 'document' }>>([])

  const handleAudioComplete = (blob: Blob, duration: number) => {
    const audioFile: MediaFile = {
      id: Math.random().toString(36).slice(2, 9),
      type: 'audio',
      blob,
      name: `anexo-audio-${new Date().toISOString().slice(0, 10)}.webm`,
      size: blob.size,
      mimeType: 'audio/webm',
      duration,
      status: 'ready',
    }
    addMedia(audioFile)
    setShowAudioRecorder(false)
  }

  const handleFilesChange = (files: typeof uploadedFiles) => {
    setUploadedFiles(files)
    // Add new files to media store
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

  const audioFiles = media.filter(m => m.type === 'audio')
  const imageFiles = media.filter(m => m.type === 'image')
  const videoFiles = media.filter(m => m.type === 'video')

  const totalFiles = media.length
  const maxTotalFiles = 10

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Anexos Adicionais</h2>
        <p className="text-muted-foreground mt-1">
          Adicione mais arquivos para complementar sua manifestação (opcional).
        </p>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Dicas para anexos:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Fotos de documentos devem estar legíveis</li>
            <li>Vídeos devem ter no máximo 3 minutos</li>
            <li>Formatos aceitos: PDF, imagens (JPEG, PNG) e vídeos (MP4)</li>
            <li>Tamanho máximo: 25MB por arquivo</li>
          </ul>
        </div>
      </div>

      {/* Current attachments summary */}
      {totalFiles > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Arquivos anexados</h3>
            <span className="text-sm text-muted-foreground">
              {totalFiles} de {maxTotalFiles}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {audioFiles.length > 0 && (
              <span className="badge badge--info">
                {audioFiles.length} áudio(s)
              </span>
            )}
            {imageFiles.length > 0 && (
              <span className="badge badge--success">
                {imageFiles.length} imagem(ns)
              </span>
            )}
            {videoFiles.length > 0 && (
              <span className="badge badge--warning">
                {videoFiles.length} vídeo(s)
              </span>
            )}
          </div>
        </div>
      )}

      {/* File upload */}
      <div className="space-y-4">
        <h3 className="font-semibold">Arquivos</h3>
        <FileUpload
          files={uploadedFiles}
          onFilesChange={handleFilesChange}
          maxFiles={maxTotalFiles - audioFiles.length}
          maxSize={25}
        />
      </div>

      {/* Audio recorder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Gravação de áudio</h3>
          {!showAudioRecorder && audioFiles.length < 3 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAudioRecorder(true)}
            >
              Gravar áudio
            </Button>
          )}
        </div>

        {showAudioRecorder && (
          <div className="border rounded-xl p-4">
            <AudioRecorder
              onRecordingComplete={handleAudioComplete}
              maxDuration={300}
            />
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAudioRecorder(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {audioFiles.length > 0 && (
          <ul className="space-y-2">
            {audioFiles.map((audio) => (
              <li
                key={audio.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{audio.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {audio.duration ? `${Math.floor(audio.duration / 60)}:${(audio.duration % 60).toString().padStart(2, '0')}` : '—'}
                      {' • '}
                      {(audio.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedia(audio.id)}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prevStep}>
          Voltar
        </Button>
        <Button variant="primary" onClick={nextStep} size="lg">
          Finalizar
        </Button>
      </div>
    </div>
  )
}
