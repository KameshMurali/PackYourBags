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
          background: "#201914",
          color: "#f2e6d6",
          fontFamily: "Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
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
