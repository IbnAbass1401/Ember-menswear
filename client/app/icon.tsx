import { ImageResponse } from "next/og";
import FlameMark from "@/lib/flame-mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The browser-tab icon
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex" }}>
        <FlameMark size={64} />
      </div>
    ),
    { ...size }
  );
}