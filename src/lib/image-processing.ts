import { removeBackground } from "@imgly/background-removal";

const MAX_DIM = 1024;

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/**
 * Removes background and applies a subtle "clean & sharp" enhancement
 * (brightness/contrast/saturation) to a vehicle photo.
 * Returns a PNG data URL.
 */
export async function processVehicleImage(file: File | Blob): Promise<string> {
  // 1. Remove background
  const cutoutBlob = await removeBackground(file);

  // 2. Load into canvas and enhance + downscale
  const url = URL.createObjectURL(cutoutBlob);
  try {
    const img = await loadImage(url);
    const ratio = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // Subtle premium enhancement
    ctx.filter = "contrast(1.08) saturate(1.12) brightness(1.03)";
    ctx.drawImage(img, 0, 0, w, h);

    const out: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    });
    return blobToDataUrl(out);
  } finally {
    URL.revokeObjectURL(url);
  }
}
