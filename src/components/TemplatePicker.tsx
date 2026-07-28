import { useMemo, useState } from 'react'
import type { MemeTemplate } from '../types/meme'
import Button from './Button'

type PickerTab = 'all' | 'favorites'

interface TemplatePickerProps {
  templates: MemeTemplate[]
  selectedTemplateId: string | null
  favoriteIds: Set<string>
  isLoading: boolean
  onSelect: (template: MemeTemplate) => void
  onRandom: () => void
  onToggleFavorite: (templateId: string) => void
  clearTextOnNewTemplate: boolean
  onClearTextOnNewTemplateChange: (value: boolean) => void
}

const TemplatePicker = ({
  templates,
  selectedTemplateId,
  favoriteIds,
  isLoading,
  onSelect,
  onRandom,
  onToggleFavorite,
  clearTextOnNewTemplate,
  onClearTextOnNewTemplateChange,
}: TemplatePickerProps) => {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<PickerTab>('all')

  const filtered = useMemo(() => {
    let list = templates
    if (tab === 'favorites') {
      list = list.filter((t) => favoriteIds.has(t.id))
    }
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((t) => t.name.toLowerCase().includes(q))
  }, [templates, tab, favoriteIds, query])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={onRandom}
          disabled={isLoading || templates.length === 0}
        >
          Random template
        </Button>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 border-(--color-border) bg-(--color-surface) px-3 text-sm transition-colors duration-200 hover:border-(--color-primary)/40">
          <input
            type="checkbox"
            checked={clearTextOnNewTemplate}
            onChange={(e) => onClearTextOnNewTemplateChange(e.target.checked)}
            className="size-4 accent-(--color-accent)"
          />
          Clear text on new template
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-bold transition-colors duration-200 ${tab === 'all' ? 'bg-(--color-primary) text-white' : 'bg-(--color-surface-muted) text-(--color-fg-muted) hover:bg-(--color-border)'}`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setTab('favorites')}
          className={`cursor-pointer rounded-full px-3 py-1 text-sm font-bold transition-colors duration-200 ${tab === 'favorites' ? 'bg-(--color-primary) text-white' : 'bg-(--color-surface-muted) text-(--color-fg-muted) hover:bg-(--color-border)'}`}
        >
          Favorites ({favoriteIds.size})
        </button>
      </div>

      <label className="sr-only" htmlFor="template-search">
        Search templates
      </label>
      <input
        id="template-search"
        type="search"
        placeholder="Search templates…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border-2 border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm transition-colors duration-200 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-focus)/30 focus:outline-none"
        disabled={isLoading}
      />

      <div
        className="max-h-48 overflow-y-auto rounded-xl border-2 border-(--color-border) bg-(--color-surface) p-2"
        role="listbox"
        aria-label="Meme templates"
      >
        {isLoading ? (
          <p className="p-2 text-sm text-(--color-fg-muted)">
            Loading templates…
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-2 text-sm text-(--color-fg-muted)">
            {tab === 'favorites'
              ? 'No favorites yet. Star a template to save it here.'
              : 'No templates match your search.'}
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {filtered.map((template) => {
              const selected = selectedTemplateId === template.id
              const favorited = favoriteIds.has(template.id)
              return (
                <li key={template.id}>
                  <div
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 hover:-translate-y-0.5 ${selected ? 'border-(--color-primary) shadow-md' : 'border-transparent hover:border-(--color-primary)/40'}`}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => onSelect(template)}
                      className="block w-full cursor-pointer text-left focus-visible:outline focus-visible:outline-(--color-focus)"
                    >
                      <img
                        src={template.url}
                        alt={template.name}
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                      />
                      <span className="line-clamp-2 px-1 py-0.5 text-[10px] leading-tight text-(--color-fg-muted)">
                        {template.name}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={
                        favorited
                          ? `Remove ${template.name} from favorites`
                          : `Add ${template.name} to favorites`
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(template.id)
                      }}
                      className="absolute top-1 right-1 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-sm text-yellow-300 transition-colors duration-200 hover:bg-black/80"
                    >
                      {favorited ? '★' : '☆'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TemplatePicker
