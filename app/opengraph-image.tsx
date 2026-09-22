import { ImageResponse } from "next/og";

export const alt = "Dr Qudsia Akram, Assistant Professor of International Relations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 12% 10%, #FFD66B 0%, transparent 45%), radial-gradient(circle at 92% 18%, #FF9CC8 0%, transparent 50%), radial-gradient(circle at 60% 110%, #8CD4FF 0%, transparent 55%), #F6F9FF",
          color: "#1B1E3C",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, opacity: 0.8 }}>Kinnaird College for Women, Lahore</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 118, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Dr Qudsia Akram</div>
          <div style={{ fontSize: 40, marginTop: 24, maxWidth: 900 }}>
            International Relations: the Middle East, South Asia and the Indian Ocean
          </div>
        </div>
      </div>
    ),
    size
  );
}
