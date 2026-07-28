import type { SelectedMeme } from "../types/meme";
import { renderMemeToCanvas, triggerCanvasDownload } from "./memeCanvas";

export type DownloadResult = { ok: true } | { ok: false; message: string };

export async function downloadMemeImage(meme: SelectedMeme): Promise<DownloadResult> {
  if (!meme.url) {
    return { ok: false, message: "Choose a template or upload an image first." };
  }

  try {
    const canvas = await renderMemeToCanvas(meme.url, meme.source, {
      topText: meme.topText,
      bottomText: meme.bottomText,
      fontSizeScale: meme.fontSizeScale,
      uppercase: meme.uppercase,
    });
    triggerCanvasDownload(canvas);
    return { ok: true };
  } catch {
    if (meme.source === "imgflip") {
      return {
        ok: false,
        message:
          "Download failed (often due to image restrictions). Try uploading your own image, or pick another template.",
      };
    }
    return { ok: false, message: "Failed to prepare download. Please try again." };
  }
}
