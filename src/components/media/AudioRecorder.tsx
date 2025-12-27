import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  maxDuration?: number // in seconds
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

export function AudioRecorder({ onRecordingComplete, maxDuration = 300 }: AudioRecorderProps) {
  const [state, setState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [waveformData, setWaveformData] = useState<number[]>(Array(40).fill(0.1))
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current || state !== 'recording') return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Sample 40 points from the frequency data
    const step = Math.floor(dataArray.length / 40)
    const newWaveform = Array.from({ length: 40 }, (_, i) => {
      const value = dataArray[i * step] / 255
      return Math.max(0.1, value)
    })

    setWaveformData(newWaveform)
    animationRef.current = requestAnimationFrame(updateWaveform)
  }, [state])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio analyser for waveform
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete(blob, duration)
        stream.getTracks().forEach(track => track.stop())

        // Resetar após um breve delay para dar feedback visual
        setTimeout(() => {
          resetRecording()
        }, 1500)
      }

      mediaRecorder.start()
      setState('recording')

      // Start timer
      timerRef.current = window.setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

      // Start waveform animation
      animationRef.current = requestAnimationFrame(updateWaveform)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop()
      setState('stopped')

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const resetRecording = () => {
    setState('idle')
    setDuration(0)
    setAudioUrl(null)
    setWaveformData(Array(40).fill(0.1))
    setIsPlaying(false)
    chunksRef.current = []
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              state === 'recording'
                ? 'bg-red-100 text-red-600'
                : 'bg-[hsl(var(--gdf-blue-light))] text-[hsl(var(--gdf-blue))]'
            }`}
          >
            <Mic className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium">
              {state === 'idle' && 'Gravar áudio'}
              {state === 'recording' && 'Gravando...'}
              {state === 'stopped' && 'Áudio salvo!'}
            </p>
            <p className="text-sm text-muted-foreground">
              {state === 'idle' && `Máximo ${maxDuration / 60} minutos`}
              {state === 'recording' && 'Clique em parar quando terminar'}
              {state === 'stopped' && 'Você pode gravar outro em seguida'}
            </p>
          </div>
        </div>
        <div
          className={`text-2xl font-mono tabular-nums ${
            state === 'recording' ? 'text-red-600' : 'text-foreground'
          }`}
          aria-live="polite"
          aria-label={`Duração: ${formatDuration(duration)}`}
        >
          {formatDuration(duration)}
        </div>
      </div>

      {/* Waveform visualization */}
      <div
        className="waveform bg-muted/50 rounded-lg"
        role="img"
        aria-label={state === 'recording' ? 'Visualização do áudio sendo gravado' : 'Forma de onda do áudio'}
      >
        {waveformData.map((height, index) => (
          <div
            key={index}
            className={`waveform-bar ${state === 'recording' ? 'waveform-bar--recording' : ''}`}
            style={{
              height: `${height * 100}%`,
              '--delay': `${index * 30}ms`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {state === 'idle' && (
          <Button
            variant="primary"
            onClick={startRecording}
            leftIcon={<Mic className="w-5 h-5" />}
          >
            Iniciar gravação
          </Button>
        )}

        {state === 'recording' && (
          <Button
            variant="destructive"
            onClick={stopRecording}
            leftIcon={<Square className="w-5 h-5" />}
          >
            Parar gravação
          </Button>
        )}

        {state === 'stopped' && (
          <>
            <Button
              variant="outline"
              onClick={togglePlayback}
              leftIcon={isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            >
              {isPlaying ? 'Pausar' : 'Ouvir'}
            </Button>
            <Button
              variant="ghost"
              onClick={resetRecording}
              leftIcon={<RotateCcw className="w-5 h-5" />}
            >
              Gravar outro
            </Button>
          </>
        )}
      </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Recording indicator for screen readers */}
      {state === 'recording' && (
        <div className="sr-only" role="status" aria-live="assertive">
          Gravando áudio. Duração atual: {formatDuration(duration)}
        </div>
      )}
    </div>
  )
}
