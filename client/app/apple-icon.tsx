import { ImageResponse } from "next/og";
import FlameMark from "@/lib/flame-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The icon iPhones use for "Add to Home Screen"
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex" }}>
        <FlameMark size={180} />
      </div>
    ),
    { ...size }
  );
}