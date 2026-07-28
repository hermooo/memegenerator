import type { SelectedMeme } from '../types/meme'

interface MemeProps {
  meme: SelectedMeme
  isLoading?: boolean
  /** `stage` fills the desktop preview pane; `inline` sits in the mobile editor flow. */
  variant?: 'stage' | 'inline'
}

const Meme = ({ meme, isLoading, variant = 'stage' }: MemeProps) => {
  const displayTop = meme.uppercase ? meme.topText.toUpperCase() : meme.topText
  const displayBottom = meme.uppercase
    ? meme.bottomText.toUpperCase()
    : meme.bottomText
  const fontScale = `${meme.fontSizeScale * 2}em`
  const isStage = variant === 'stage'

  const frameClass = isStage
    ? 'absolute inset-0 flex items-center justify-center bg-(--color-preview-bg) p-6'
    : 'relative flex w-full items-center justify-center rounded-2xl bg-(--color-preview-bg) p-3'

  const imageClass = isStage
    ? 'block max-h-[calc(100dvh-4rem-3rem)] max-w-full object-contain'
    : 'block max-h-[min(55dvh,420px)] w-full object-contain'

  return (
    <div className={frameClass}>
      {isLoading ? (
        <div className="flex aspect-4/3 w-full max-w-md animate-pulse flex-col items-center justify-center rounded-lg bg-(--color-surface-muted)">
          <span className="text-sm text-(--color-fg-muted)">
            Loading preview…
          </span>
        </div>
      ) : !meme.url ? (
        <div className="flex aspect-4/3 w-full max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed border-(--color-border) bg-(--color-surface-muted) px-6 text-center">
          <p className="text-lg font-semibold text-(--color-fg)">
            Your meme preview
          </p>
          <p className="mt-2 text-sm text-(--color-fg-muted)">
            Choose a template from the list or upload your own image to get
            started.
          </p>
        </div>
      ) : (
        <div className="relative max-h-full max-w-full">
          <img
            src={meme.url}
            alt="Meme preview"
            className={imageClass}
            loading="lazy"
          />
          {displayTop && (
            <h2
              className={`text-overlay top-0 wrap-break-word whitespace-pre-wrap ${meme.uppercase ? 'uppercase' : 'normal-case'}`}
              style={{
                fontFamily: 'Impact, sans-serif',
                fontSize: fontScale,
              }}
            >
              {displayTop}
            </h2>
          )}
          {displayBottom && (
            <h2
              className={`text-overlay bottom-0 wrap-break-word whitespace-pre-wrap ${meme.uppercase ? 'uppercase' : 'normal-case'}`}
              style={{
                fontFamily: 'Impact, sans-serif',
                fontSize: fontScale,
              }}
            >
              {displayBottom}
            </h2>
          )}
        </div>
      )}
    </div>
  )
}

export default Meme
