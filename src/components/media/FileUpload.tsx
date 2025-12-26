import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, Film, File, AlertCircle } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface UploadedFile {
  id: string
  file: File
  preview?: string
  type: 'image' | 'video' | 'document'
}

interface FileUploadProps {
  accept?: string
  maxFiles?: number
  maxSize?: number // in MB
  onFilesChange: (files: UploadedFile[]) => void
  files: UploadedFile[]
}

const acceptedTypes = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/3gpp'],
  document: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
}

const allAcceptedTypes = [...acceptedTypes.image, ...acceptedTypes.video, ...acceptedTypes.document]

export function FileUpload({
  accept = allAcceptedTypes.join(','),
  maxFiles = 5,
  maxSize = 25,
  onFilesChange,
  files,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const getFileType = (mimeType: string): 'image' | 'video' | 'document' => {
    if (acceptedTypes.image.includes(mimeType)) return 'image'
    if (acceptedTypes.video.includes(mimeType)) return 'video'
    return 'document'
  }

  const processFile = async (file: File): Promise<UploadedFile | null> => {
    const fileType = getFileType(file.type)

    // Validate type
    if (!allAcceptedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não suportado: ${file.type}`)
      return null
    }

    // Validate size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${maxSize}MB`)
      return null
    }

    let processedFile = file
    let preview: string | undefined

    // Compress images
    if (fileType === 'image') {
      try {
        processedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        })
        preview = URL.createObjectURL(processedFile)
      } catch (err) {
        console.error('Image compression failed:', err)
        preview = URL.createObjectURL(file)
      }
    }

    // Create preview for videos
    if (fileType === 'video') {
      preview = URL.createObjectURL(file)
    }

    return {
      id: Math.random().toString(36).slice(2, 9),
      file: processedFile,
      preview,
      type: fileType,
    }
  }

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return

    setError(null)

    const remainingSlots = maxFiles - files.length
    if (remainingSlots <= 0) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    const filesToProcess = Array.from(fileList).slice(0, remainingSlots)
    const processed: UploadedFile[] = []

    for (const file of filesToProcess) {
      const result = await processFile(file)
      if (result) {
        processed.push(result)
      }
    }

    if (processed.length > 0) {
      onFilesChange([...files, ...processed])
    }
  }, [files, maxFiles, onFilesChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id)
    if (file?.preview) {
      URL.revokeObjectURL(file.preview)
    }
    onFilesChange(files.filter(f => f.id !== id))
    setError(null)
  }

  const FileIcon = ({ type }: { type: 'image' | 'video' | 'document' }) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />
      case 'video':
        return <Film className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        className={`dropzone ${isDragging ? 'dropzone--active' : ''} ${error ? 'dropzone--error' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        aria-label={`Área de upload. ${files.length} de ${maxFiles} arquivos selecionados`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-describedby={error ? 'upload-error' : undefined}
        />

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--gdf-blue-light))] flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-[hsl(var(--gdf-blue))]" />
          </div>
          <p className="font-medium text-foreground">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            PDF, imagens, vídeos • Máximo {maxSize}MB por arquivo
          </p>
          <p className="text-sm text-muted-foreground">
            {files.length} de {maxFiles} arquivos
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          id="upload-error"
          className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2" aria-label="Arquivos selecionados">
          {files.map((file) => (
            <li
              key={file.id}
              className="file-preview flex items-center gap-3 p-3"
            >
              {/* Preview */}
              {file.type === 'image' && file.preview ? (
                <img
                  src={file.preview}
                  alt={`Prévia de ${file.file.name}`}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : file.type === 'video' && file.preview ? (
                <video
                  src={file.preview}
                  className="w-12 h-12 object-cover rounded-lg"
                  aria-label={`Prévia do vídeo ${file.file.name}`}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <FileIcon type={file.type} />
                </div>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFile(file.id)}
                className="p-2 rounded-lg hover:bg-muted transition-colors touch-target"
                aria-label={`Remover ${file.file.name}`}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
