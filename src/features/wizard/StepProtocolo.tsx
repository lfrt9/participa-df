import { useState, useEffect, useRef } from 'react'
import {
  CheckCircle2,
  Copy,
  Home,
  Printer,
  Share2,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useWizardStore } from '@/hooks/useWizardStore'
import { generateProtocol } from '@/services/protocol.service'
import {
  MANIFESTATION_TYPE_LABELS,
  CATEGORY_LABELS,
  type Protocol,
} from '@/types/manifestation'

export function StepProtocolo() {
  const { type, category, anonymous, user, text, media, reset } = useWizardStore()
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [copied, setCopied] = useState(false)
  const protocolRef = useRef<HTMLDivElement>(null)

  // Determine primary channel
  const getPrimaryChannel = () => {
    if (media.some(m => m.type === 'video')) return 'video' as const
    if (media.some(m => m.type === 'audio')) return 'audio' as const
    if (media.some(m => m.type === 'image')) return 'image' as const
    return 'text' as const
  }

  useEffect(() => {
    // Generate protocol on mount
    if (type) {
      const newProtocol = generateProtocol(type, getPrimaryChannel())
      setProtocol(newProtocol)
    }
  }, [type])

  const handleCopy = async () => {
    if (protocol) {
      try {
        await navigator.clipboard.writeText(protocol.full)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNewManifestation = () => {
    reset()
  }

  const formatDate = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    return `${day}/${month}/${year}`
  }

  if (!protocol) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-[hsl(var(--gdf-blue))] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Success header */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Manifestação Registrada!
        </h2>
        <p className="text-muted-foreground mt-2">
          Sua manifestação foi registrada com sucesso no sistema Participa DF.
        </p>
      </div>

      {/* Protocol card */}
      <div
        ref={protocolRef}
        className="bg-gradient-to-br from-[hsl(var(--gdf-blue))] to-[hsl(var(--gdf-blue-dark))] rounded-2xl p-6 text-white print:break-inside-avoid"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-blue-200 text-sm">Número do Protocolo</p>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            Participa DF
          </span>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p
            className="text-3xl md:text-4xl font-mono font-bold tracking-wider text-center"
            aria-label={`Protocolo: ${protocol.full}`}
          >
            {protocol.full}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-200">Data</p>
            <p className="font-medium">{formatDate(protocol.date)}</p>
          </div>
          <div>
            <p className="text-blue-200">Tipo</p>
            <p className="font-medium">
              {type ? MANIFESTATION_TYPE_LABELS[type] : '—'}
            </p>
          </div>
          <div>
            <p className="text-blue-200">Categoria</p>
            <p className="font-medium">
              {category ? CATEGORY_LABELS[category] : '—'}
            </p>
          </div>
          <div>
            <p className="text-blue-200">Identificação</p>
            <p className="font-medium">
              {anonymous ? 'Anônima' : user?.nome || 'Identificada'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4 print:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-white hover:bg-white/20"
            leftIcon={copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopy}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-white hover:bg-white/20"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
        </div>
      </div>

      {/* Important info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-semibold text-amber-900 mb-2">
          Importante: Guarde este número!
        </h3>
        <p className="text-sm text-amber-800">
          O número do protocolo é necessário para acompanhar o andamento da sua
          manifestação. Recomendamos que você anote ou salve este número.
        </p>
      </div>

      {/* Next steps */}
      {!anonymous && user?.email && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">
                Confirmação enviada
              </h3>
              <p className="text-sm text-green-800 mt-1">
                Uma cópia do protocolo foi enviada para{' '}
                <strong>{user.email}</strong>. Você também receberá atualizações
                sobre o andamento da sua manifestação.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Resumo da Manifestação</h3>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="font-medium">{type ? MANIFESTATION_TYPE_LABELS[type] : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Categoria</dt>
            <dd className="font-medium">{category ? CATEGORY_LABELS[category] : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Conteúdo</dt>
            <dd className="font-medium">
              {text ? 'Texto' : ''}
              {media.length > 0 && ` + ${media.length} arquivo(s)`}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Identificação</dt>
            <dd className="font-medium">{anonymous ? 'Anônima' : 'Identificada'}</dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <Button
          variant="primary"
          className="flex-1"
          leftIcon={<Home className="w-5 h-5" />}
          onClick={handleNewManifestation}
          size="lg"
        >
          Nova Manifestação
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          leftIcon={<Share2 className="w-5 h-5" />}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Protocolo Participa DF',
                text: `Minha manifestação foi registrada com o protocolo ${protocol.full}`,
              })
            }
          }}
          size="lg"
        >
          Compartilhar
        </Button>
      </div>

      {/* Help */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Dúvidas? Entre em contato pelo{' '}
          <strong>162</strong> ou acesse{' '}
          <a
            href="https://www.participa.df.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--gdf-blue))] hover:underline"
          >
            participa.df.gov.br
          </a>
        </p>
      </div>
    </div>
  )
}
