const MAX_SIDE = 2000; // longest side in pixels
const QUALITIES = [0.85, 0.7, 0.55];

async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }

  // Fallback for older browsers
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Shrinks a photo so its longest side is at most 2000px and, if needed,
 * lowers JPEG quality until it is under maxBytes. Small photos are returned untouched.
 * Throws if the file can't be read as an image.
 */
export async function shrinkImage(file: File, maxBytes: number): Promise<File> {
  const { source, width, height, close } = await decode(file);

  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(width, height));

    // Already small enough in size and pixels: keep the original
    if (scale === 1 && file.size <= 2 * 1024 * 1024) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // White background so transparent PNGs don't turn black as JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

    let blob: Blob | null = null;
    for (const quality of QUALITIES) {
      blob = await toBlob(canvas, quality);
      if (blob && blob.size <= maxBytes) break;
    }
    if (!blob) throw new Error("Couldn't process the photo");

    // Never make a photo bigger than it already was (and still fits)
    if (scale === 1 && blob.size >= file.size && file.size <= maxBytes) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    close();
  }
}