import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "meme-favorite-template-ids";

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as string[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function writeFavorites(ids: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
}

export function useFavoriteTemplates() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => readFavorites());

  useEffect(() => {
    writeFavorites(favoriteIds);
  }, [favoriteIds]);

  const toggleFavorite = useCallback((templateId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (templateId: string) => favoriteIds.has(templateId),
    [favoriteIds],
  );

  return { favoriteIds, toggleFavorite, isFavorite };
}
