export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
}

export type MemeImageSource = "imgflip" | "upload";

export interface MemeCaptionState {
  topText: string;
  bottomText: string;
  fontSizeScale: number;
  uppercase: boolean;
}

export interface SelectedMeme extends MemeCaptionState {
  url: string;
  templateId: string | null;
  source: MemeImageSource;
}

export const defaultCaptionState = (): MemeCaptionState => ({
  topText: "",
  bottomText: "",
  fontSizeScale: 1,
  uppercase: true,
});

export const defaultSelectedMeme = (): SelectedMeme => ({
  ...defaultCaptionState(),
  url: "",
  templateId: null,
  source: "imgflip",
});

export interface MemeDrawOptions {
  topText: string;
  bottomText: string;
  fontSizeScale: number;
  uppercase: boolean;
}
