import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { weddingDay } from "@/lib/wedding";

export const alt = "Sumona & Anik are getting married";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const couple = await readFile(join(process.cwd(), "src/art/og-couple.png"));
  const src = `data:image/png;base64,${couple.toString("base64")}`;
  const date = new Date(weddingDay.start).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Dhaka",
  });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 90px", background: "#A3132B", border: "22px solid #E2B13C", color: "#FBF6EC", fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#FFD27A" }}>Shubho Bibaho</div>
          <div style={{ fontSize: 104, lineHeight: 1.05, marginTop: 8 }}>Sumona</div>
          <div style={{ fontSize: 104, lineHeight: 1.05 }}>&amp; Anik</div>
          <div style={{ fontSize: 36, marginTop: 24 }}>{`${date}, Netrokona`}</div>
          <div style={{ fontSize: 26, marginTop: 30, color: "#FFD27A" }}>Tap to open the invitation</div>
        </div>
        <img src={src} height={540} alt="" style={{ marginTop: 40 }} />
      </div>
    ),
    size,
  );
}
