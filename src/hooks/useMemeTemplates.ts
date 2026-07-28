import ky from "ky";
import { useCallback, useEffect, useState } from "react";
import type { MemeTemplate } from "../types/meme";

const API_URL = "https://api.imgflip.com/get_memes";
const CACHE_KEY = "meme-templates-v2";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface ImgflipMeme {
  id: string;
  name: string;
  url: string;
}

interface CachedPayload {
  savedAt: number;
  templates: MemeTemplate[];
}

function readCache(): MemeTemplate[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.templates;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function writeCache(templates: MemeTemplate[]) {
  const payload: CachedPayload = { savedAt: Date.now(), templates };
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

async function fetchTemplates(): Promise<MemeTemplate[]> {
  const response = await ky
    .get(API_URL)
    .json<{ success: boolean; data: { memes: ImgflipMeme[] } }>();

  return response.data.memes.map((m) => ({
    id: String(m.id),
    name: m.name,
    url: m.url,
  }));
}

export function useMemeTemplates() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (forceNetwork = false) => {
    setIsLoading(true);
    setError(null);

    if (!forceNetwork) {
      const cached = readCache();
      if (cached?.length) {
        setTemplates(cached);
        setIsLoading(false);
        return;
      }
    }

    try {
      const fresh = await fetchTemplates();
      writeCache(fresh);
      setTemplates(fresh);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
      setError("Failed to load memes. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    void load(true);
  }, [load]);

  useEffect(() => {
    void load(false);
  }, [load]);

  return { templates, isLoading, error, retry };
}
