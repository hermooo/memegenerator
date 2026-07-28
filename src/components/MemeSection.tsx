import { useCallback, useEffect, useRef, useState } from 'react'
import { useFavoriteTemplates } from '../hooks/useFavoriteTemplates'
import { useMemeTemplates } from '../hooks/useMemeTemplates'
import type { MemeTemplate, SelectedMeme } from '../types/meme'
import { defaultSelectedMeme } from '../types/meme'
import { downloadMemeImage } from '../utils/imageDownloader'
import Meme from './Meme'
import MemeEditorPanel from './MemeEditorPanel'

const MemeSection = () => {
  const { templates, isLoading, error, retry } = useMemeTemplates()
  const { favoriteIds, toggleFavorite } = useFavoriteTemplates()

  const [selectedMeme, setSelectedMeme] =
    useState<SelectedMeme>(defaultSelectedMeme)
  const [clearTextOnNewTemplate, setClearTextOnNewTemplate] = useState(false)
  const [downloadBusy, setDownloadBusy] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [hasInitialTemplate, setHasInitialTemplate] = useState(false)
  const uploadUrlRef = useRef<string | null>(null)

  const revokeUploadUrl = useCallback(() => {
    if (uploadUrlRef.current) {
      URL.revokeObjectURL(uploadUrlRef.current)
      uploadUrlRef.current = null
    }
  }, [])

  const applyTemplate = useCallback(
    (template: MemeTemplate, clearText: boolean) => {
      revokeUploadUrl()
      setSelectedMeme((prev) => ({
        ...prev,
        url: template.url,
        templateId: template.id,
        source: 'imgflip',
        ...(clearText ? { topText: '', bottomText: '' } : {}),
      }))
    },
    [revokeUploadUrl],
  )

  const pickRandomTemplate = useCallback(
    (clearText: boolean) => {
      if (templates.length === 0) return
      const idx = Math.floor(Math.random() * templates.length)
      applyTemplate(templates[idx], clearText)
    },
    [templates, applyTemplate],
  )

  useEffect(() => {
    if (!hasInitialTemplate && templates.length > 0) {
      pickRandomTemplate(true)
      setHasInitialTemplate(true)
    }
  }, [templates, hasInitialTemplate, pickRandomTemplate])

  useEffect(() => {
    return () => revokeUploadUrl()
  }, [revokeUploadUrl])

  const handleSelectTemplate = (template: MemeTemplate) => {
    applyTemplate(template, clearTextOnNewTemplate)
  }

  const handleRandomTemplate = () => {
    pickRandomTemplate(clearTextOnNewTemplate)
  }

  const handleUpload = (objectUrl: string) => {
    revokeUploadUrl()
    uploadUrlRef.current = objectUrl
    setSelectedMeme((prev) => ({
      ...prev,
      url: objectUrl,
      templateId: null,
      source: 'upload',
    }))
  }

  const handleCaptionChange = (patch: Partial<SelectedMeme>) => {
    setSelectedMeme((prev) => ({ ...prev, ...patch }))
  }

  const handleDownload = async () => {
    setDownloadError(null)
    setDownloadBusy(true)
    const result = await downloadMemeImage(selectedMeme)
    setDownloadBusy(false)
    if (!result.ok) {
      setDownloadError(result.message)
    }
  }

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] flex-col lg:h-[calc(100dvh-4.3rem)] lg:min-h-0 lg:flex-row lg:overflow-hidden">
      <div className="scrollbar-hide order-2 flex flex-1 justify-center overflow-y-auto px-4 py-6 lg:order-1 lg:min-h-0 lg:justify-start lg:pr-6 lg:pl-10">
        <MemeEditorPanel
          selectedMeme={selectedMeme}
          templates={templates}
          favoriteIds={favoriteIds}
          templatesLoading={isLoading}
          downloadBusy={downloadBusy}
          downloadError={downloadError}
          clearTextOnNewTemplate={clearTextOnNewTemplate}
          onClearTextOnNewTemplateChange={setClearTextOnNewTemplate}
          onCaptionChange={handleCaptionChange}
          onSelectTemplate={handleSelectTemplate}
          onRandomTemplate={handleRandomTemplate}
          onToggleFavorite={toggleFavorite}
          onUpload={handleUpload}
          onDownload={() => void handleDownload()}
          onRetryTemplates={retry}
          templatesError={error}
        />
      </div>
      <div className="order-1 flex lg:order-2 lg:min-h-0 lg:flex-1">
        <Meme meme={selectedMeme} isLoading={isLoading && !selectedMeme.url} />
      </div>
    </section>
  )
}

export default MemeSection
