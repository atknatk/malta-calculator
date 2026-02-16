import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Malta Calculator";

  const fontData = await fetch(
    new URL("../../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1a1a2e",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
          display: "flex",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: "60px 70px",
          position: "relative",
        }}
      >
        {/* Top: Logo + Site Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🇲🇹
          </div>
          <span
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "CalSans",
            }}
          >
            Malta Calculator
          </span>
        </div>

        {/* Center: Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? "42px" : "52px",
              fontFamily: "CalSans",
              color: "white",
              lineHeight: 1.2,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #f59e0b, #d97706)",
              borderRadius: "2px",
              display: "flex",
            }}
          />
        </div>

        {/* Bottom: URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            maltacalculator.com/blog
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "20px",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              background: "rgba(245, 158, 11, 0.1)",
            }}
          >
            <span style={{ fontSize: "16px", color: "#f59e0b" }}>
              Read Article →
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "CalSans",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
