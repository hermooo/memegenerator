import { useRef, type ChangeEvent } from "react";
import Button from "./Button";

interface ImageUploadProps {
  onUpload: (objectUrl: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ onUpload, disabled }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    onUpload(url);
    event.target.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        id="meme-upload"
        disabled={disabled}
        onChange={handleChange}
      />
      <Button
        variant="secondary"
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        Upload your image
      </Button>
    </div>
  );
};

export default ImageUpload;
