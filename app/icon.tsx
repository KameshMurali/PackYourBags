import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9,
          background: "linear-gradient(135deg, #ff6b4a, #ffb938)",
          color: "#0a2233",
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        P
      </div>
    ),
    {
      ...size,
    },
  );
}
