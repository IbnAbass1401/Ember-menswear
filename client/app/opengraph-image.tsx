import { ImageResponse } from "next/og";

export const alt = "Ember Menswear: Dress sharp. Own the room.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share card for the whole site (home, shop, anything without its own photo)
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0E0904",
          backgroundImage: "radial-gradient(circle at 50% 38%, #4a2c0e 0%, #0E0904 70%)",
          color: "#FFF8E7",
        }}
      >
        <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: 18, color: "#FBBF24" }}>
          EMBER
        </div>
        <div style={{ display: "flex", fontSize: 48, marginTop: 24 }}>Dress sharp. Own the room.</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 36, color: "#a89f8e" }}>
          Menswear · Free delivery over $120 · 7-day returns
        </div>
      </div>
    ),
    { ...size }
  );
}