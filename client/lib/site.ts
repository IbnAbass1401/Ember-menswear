// The public address of the site. Set NEXT_PUBLIC_SITE_URL in production (Step 13).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "Ember";

// Makes a relative path absolute (share previews and Google need full URLs)
export function absoluteUrl(src: string) {
  return src.startsWith("/") ? `${SITE_URL}${src}` : src;
}

// 1200x630 share image. Cloudinary photos are padded onto the dark brand
// colour so nothing gets cropped, and forced to JPG for WhatsApp.
export function ogImage(src?: string) {
  if (!src) return `${SITE_URL}/opengraph-image`;
  if (src.startsWith("https://res.cloudinary.com/") && src.includes("/image/upload/")) {
    return src.replace(
      "/image/upload/",
      "/image/upload/f_jpg,q_auto,c_pad,b_rgb:0E0904,w_1200,h_630/"
    );
  }
  return absoluteUrl(src);
}