import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PackYourBags";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top left, rgba(236, 214, 186, 0.95), transparent 32%), linear-gradient(180deg, #f7f0e6 0%, #fffdf9 100%)",
          color: "#201914",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 48,
            right: 48,
            bottom: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 34,
            border: "1px solid rgba(32,25,20,0.12)",
            background: "rgba(255,252,246,0.74)",
            padding: 44,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#201914",
                color: "#fff",
                fontFamily: "Arial, sans-serif",
                fontSize: 24,
              }}
            >
              P
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 26,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#9b6a47",
                }}
              >
                Travel OS
              </span>
              <span style={{ fontSize: 34 }}>PackYourBags</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
            <div style={{ fontSize: 84, lineHeight: 0.94 }}>
              Your leave, flights, visas,
              <br />
              and itinerary in one calm place.
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                fontFamily: "Arial, sans-serif",
                color: "#5d5349",
              }}
            >
              Premium travel planning for frequent flyers, hybrid teams, and founders who want less admin and better trips.
            </div>
          </div>

          <div style={{ display: "flex", gap: 18 }}>
            {["Leave synced", "Visa aware", "AI itinerary concierge"].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(32,25,20,0.1)",
                  padding: "14px 20px",
                  fontSize: 24,
                  fontFamily: "Arial, sans-serif",
                  background: "rgba(255,255,255,0.76)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

