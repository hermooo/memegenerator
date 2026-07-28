import type { SelectedMeme } from '../types/meme'

interface MemeProps {
  meme: SelectedMeme
  isLoading?: boolean
}

const Meme = ({ meme, isLoading }: MemeProps) => {
  const displayTop = meme.uppercase ? meme.topText.toUpperCase() : meme.topText
  const displayBottom = meme.uppercase
    ? meme.bottomText.toUpperCase()
    : meme.bottomText
  const fontScale = `${meme.fontSizeScale * 2}em`

  return (
    <div className="flex h-full min-h-60 flex-1 items-center justify-center bg-(--color-preview-bg) px-4 py-6 lg:min-h-0 lg:border-l lg:border-(--color-border) lg:px-8">
      <div className="w-full max-w-2xl rounded-2xl border-4 border-(--color-primary) bg-(--color-surface) p-3 shadow-(--color-primary)/10 shadow-lg">
        <div className="relative min-h-60">
          {isLoading ? (
            <div className="flex aspect-4/3 w-full animate-pulse flex-col items-center justify-center rounded-lg bg-(--color-surface-muted)">
              <span className="text-sm text-(--color-fg-muted)">
                Loading preview…
              </span>
            </div>
          ) : !meme.url ? (
            <div className="flex aspect-4/3 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-(--color-border) bg-(--color-surface-muted) px-6 text-center">
              <p className="text-lg font-semibold text-(--color-fg)">
                Your meme preview
              </p>
              <p className="mt-2 text-sm text-(--color-fg-muted)">
                Choose a template from the list or upload your own image to get
                started.
              </p>
            </div>
          ) : (
            <>
              <img
                src={meme.url}
                alt="Meme preview"
                className="mx-auto max-h-[min(70dvh,560px)] w-full object-contain lg:max-h-[calc(100dvh-8rem)]"
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Meme
