import type { ReactNode } from 'react'
import type { MemeTemplate, SelectedMeme } from '../types/meme'
import Button from './Button'
import ImageUpload from './ImageUpload'
import TemplatePicker from './TemplatePicker'

interface MemeEditorPanelProps {
  selectedMeme: SelectedMeme
  templates: MemeTemplate[]
  favoriteIds: Set<string>
  templatesLoading: boolean
  downloadBusy: boolean
  downloadError: string | null
  clearTextOnNewTemplate: boolean
  onClearTextOnNewTemplateChange: (value: boolean) => void
  onCaptionChange: (patch: Partial<SelectedMeme>) => void
  onSelectTemplate: (template: MemeTemplate) => void
  onRandomTemplate: () => void
  onToggleFavorite: (templateId: string) => void
  onUpload: (objectUrl: string) => void
  onDownload: () => void
  onRetryTemplates: () => void
  templatesError: string | null
  /** Mobile-only preview rendered above the download action. */
  mobilePreview?: ReactNode
}

const MemeEditorPanel = ({
  selectedMeme,
  templates,
  favoriteIds,
  templatesLoading,
  downloadBusy,
  downloadError,
  clearTextOnNewTemplate,
  onClearTextOnNewTemplateChange,
  onCaptionChange,
  onSelectTemplate,
  onRandomTemplate,
  onToggleFavorite,
  onUpload,
  onDownload,
  onRetryTemplates,
  templatesError,
  mobilePreview,
}: MemeEditorPanelProps) => {
  return (
    <div className="flex w-full max-w-lg flex-col gap-5">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-(--color-primary) lg:text-4xl">
          Meme Generator
        </h1>
        <p className="mt-1 text-sm text-(--color-fg-muted)">
          Pick a template or upload an image, add captions, and download your
          meme.
        </p>
      </header>

      {templatesError && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          <p>{templatesError}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={onRetryTemplates}
          >
            Retry
          </Button>
        </div>
      )}

      <section aria-labelledby="templates-heading">
        <h2
          id="templates-heading"
          className="font-display mb-2 text-sm font-semibold tracking-wide text-(--color-primary) uppercase"
        >
          Templates
        </h2>
        <TemplatePicker
          templates={templates}
          selectedTemplateId={selectedMeme.templateId}
          favoriteIds={favoriteIds}
          isLoading={templatesLoading}
          onSelect={onSelectTemplate}
          onRandom={onRandomTemplate}
          onToggleFavorite={onToggleFavorite}
          clearTextOnNewTemplate={clearTextOnNewTemplate}
          onClearTextOnNewTemplateChange={onClearTextOnNewTemplateChange}
        />
      </section>

      <section aria-labelledby="upload-heading">
        <h2
          id="upload-heading"
          className="font-display mb-2 text-sm font-semibold tracking-wide text-(--color-primary) uppercase"
        >
          Or upload
        </h2>
        <ImageUpload onUpload={onUpload} disabled={templatesLoading} />
      </section>

      <section
        aria-labelledby="captions-heading"
        className="flex flex-col gap-3"
      >
        <h2
          id="captions-heading"
          className="font-display text-sm font-semibold tracking-wide text-(--color-primary) uppercase"
        >
          Captions
        </h2>

        <div>
          <label
            className="mb-1 block text-sm text-(--color-fg-muted)"
            htmlFor="topText"
          >
            Top text
          </label>
          <input
            id="topText"
            type="text"
            className="w-full rounded-xl border-2 border-(--color-border) bg-(--color-surface) px-3 py-2 transition-colors duration-200 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-focus)/30 focus:outline-none"
            placeholder="Enter top text"
            value={selectedMeme.topText}
            onChange={(e) => onCaptionChange({ topText: e.target.value })}
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm text-(--color-fg-muted)"
            htmlFor="bottomText"
          >
            Bottom text
          </label>
          <input
            id="bottomText"
            type="text"
            className="w-full rounded-xl border-2 border-(--color-border) bg-(--color-surface) px-3 py-2 transition-colors duration-200 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-focus)/30 focus:outline-none"
            placeholder="Enter bottom text"
            value={selectedMeme.bottomText}
            onChange={(e) => onCaptionChange({ bottomText: e.target.value })}
          />
        </div>

        <div>
          <label
            className="mb-1 flex justify-between text-sm text-(--color-fg-muted)"
            htmlFor="fontSize"
          >
            <span>Font size</span>
            <span>{Math.round(selectedMeme.fontSizeScale * 100)}%</span>
          </label>
          <input
            id="fontSize"
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={selectedMeme.fontSizeScale}
            onChange={(e) =>
              onCaptionChange({ fontSizeScale: Number(e.target.value) })
            }
            className="w-full accent-(--color-accent)"
          />
        </div>

        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selectedMeme.uppercase}
            onChange={(e) => onCaptionChange({ uppercase: e.target.checked })}
            className="size-4 accent-(--color-accent)"
          />
          Uppercase captions
        </label>
      </section>

      {mobilePreview && (
        <section
          aria-label="Meme preview"
          className="lg:hidden"
        >
          {mobilePreview}
        </section>
      )}

      {downloadError && (
        <p role="alert" className="text-sm text-red-600">
          {downloadError}
        </p>
      )}

      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={!selectedMeme.url || downloadBusy}
        onClick={onDownload}
      >
        {downloadBusy ? 'Preparing download…' : 'Download meme'}
      </Button>
    </div>
  )
}

export default MemeEditorPanel
