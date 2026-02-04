/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { SIZE } from "../utils";
import {
  decodeTimer,
  getTimeRemaining,
  formatTimeDisplay,
  formatDurationHuman,
  isTimerExpired,
} from "@/lib/timer-encoding";

export const runtime = "edge";

const FOOTER = "maltacalculator.com/timer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const customTitle = searchParams.get("title");

  // Default values for invalid/missing token
  let timeText = "00:00:00";
  let statusText = "Countdown Timer";
  let isExpired = false;
  let durationText = "";

  if (token) {
    const timerData = decodeTimer(token);
    if (timerData) {
      const remaining = getTimeRemaining(timerData);
      isExpired = isTimerExpired(timerData);
      const timeDisplay = formatTimeDisplay(remaining);
      durationText = formatDurationHuman(timerData.duration);

      if (isExpired) {
        timeText = "TIME'S UP!";
        statusText = `${durationText} countdown finished`;
      } else {
        const totalHours = timeDisplay.hours + timeDisplay.days * 24;
        timeText = `${String(totalHours).padStart(2, "0")}:${String(timeDisplay.minutes).padStart(2, "0")}:${String(timeDisplay.seconds).padStart(2, "0")}`;
        statusText = `${formatDurationHuman(remaining)} remaining`;

        if (timeDisplay.days > 0) {
          statusText = `${timeDisplay.days}d ${timeDisplay.hours}h ${timeDisplay.minutes}m remaining`;
        }
      }
    }
  }

  const title = customTitle || (isExpired ? "Timer Finished" : "Countdown Timer");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #faf5eb 0%, #f5ead6 50%, #f0e6d3 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 30%, rgba(201, 125, 10, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 153, 204, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Timer icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(201, 125, 10, 0.2) 0%, rgba(201, 125, 10, 0.1) 100%)",
          marginBottom: 24,
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b86f08"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>

      {/* Title */}
      {customTitle && (
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "#2d2d2d",
            marginBottom: 16,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {customTitle}
        </div>
      )}

      {/* Time display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isExpired ? 72 : 120,
          fontWeight: 700,
          background: isExpired
            ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
            : "linear-gradient(135deg, #c97d0a 0%, #b86f08 50%, #a56006 100%)",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: isExpired ? "0" : "0.05em",
          marginBottom: 16,
        }}
      >
        {timeText}
      </div>

      {/* Status text */}
      <div
        style={{
          fontSize: 28,
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        {statusText}
      </div>

      {/* Duration info for active timers */}
      {!isExpired && durationText && (
        <div
          style={{
            fontSize: 20,
            color: "#9ca3af",
          }}
        >
          {durationText} countdown
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 20,
          color: "#9ca3af",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {FOOTER}
      </div>
    </div>,
    {
      ...SIZE,
    }
  );
}
