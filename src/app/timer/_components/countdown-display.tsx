"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Timer, Calendar } from "lucide-react";
import { ProgressRing } from "./progress-ring";
import { ShareButtons } from "./share-buttons";
import { TimerExpired } from "./timer-expired";
import {
  type TimerData,
  getTimeRemaining,
  getProgressPercentage,
  formatTimeDisplay,
  formatDurationHuman,
  formatCreatedDate,
} from "@/lib/timer-encoding";

interface CountdownDisplayProps {
  timerData: TimerData;
  title?: string;
  url: string;
}

// Get or create a shared AudioContext
function getAudioContext() {
  if (typeof window === "undefined") return null;
  const W = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
    __timerAudioCtx?: AudioContext;
  };
  if (!W.__timerAudioCtx) {
    W.__timerAudioCtx = new (W.AudioContext || W.webkitAudioContext)();
  }
  return W.__timerAudioCtx;
}

// Alarm sound (simple beep using Web Audio API)
function useAlarmSound() {
  const playAlarm = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);

      // Play 3 beeps
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 800;
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 600);

      setTimeout(() => {
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.frequency.value = 1000;
        gain3.gain.setValueAtTime(0.4, ctx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc3.start();
        osc3.stop(ctx.currentTime + 0.8);
      }, 1200);
    } catch {
      // Audio not supported
    }
  }, []);

  return { playAlarm };
}

// Tick-tock sound using Web Audio API
function useTickSound(enabled: boolean, isExpired: boolean) {
  const isTickRef = useRef(true); // alternates between tick and tock

  useEffect(() => {
    if (!enabled || isExpired) return;

    const interval = setInterval(() => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const isTick = isTickRef.current;
        isTickRef.current = !isTickRef.current;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Tick = higher pitch, Tock = lower pitch
        osc.frequency.value = isTick ? 1200 : 800;
        osc.type = "sine";

        const now = ctx.currentTime;
        gain.gain.setValueAtTime(isTick ? 0.08 : 0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch {
        // Audio not supported
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, isExpired]);
}

// Update document.title with remaining time
function useDocumentTitle(
  remaining: number,
  isExpired: boolean,
  title?: string,
) {
  const originalTitleRef = useRef<string>("");

  useEffect(() => {
    originalTitleRef.current = document.title;
    return () => {
      document.title = originalTitleRef.current;
    };
  }, []);

  useEffect(() => {
    if (isExpired) {
      document.title = title ? `⏰ Time's Up! - ${title}` : "⏰ Time's Up!";
      return;
    }

    const t = formatTimeDisplay(remaining);
    const timeStr =
      t.days > 0
        ? `${t.days}d ${String(t.hours).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}:${String(t.seconds).padStart(2, "0")}`
        : `${String(t.hours + t.days * 24).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}:${String(t.seconds).padStart(2, "0")}`;

    document.title = title ? `${timeStr} - ${title}` : `${timeStr} - Timer`;
  }, [remaining, isExpired, title]);
}

export function CountdownDisplay({
  timerData,
  title,
  url,
}: CountdownDisplayProps) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(timerData));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasPlayedAlarm, setHasPlayedAlarm] = useState(false);
  const { playAlarm } = useAlarmSound();

  const isExpired = remaining <= 0;
  const progress = getProgressPercentage(timerData);
  const timeDisplay = formatTimeDisplay(remaining);
  const showDays = timerData.duration >= 86400; // Show days if duration >= 1 day

  // Document title countdown
  useDocumentTitle(remaining, isExpired, title);

  // Tick-tock sound
  useTickSound(soundEnabled, isExpired);

  useEffect(() => {
    if (isExpired) {
      if (soundEnabled && !hasPlayedAlarm) {
        playAlarm();
        setHasPlayedAlarm(true);
      }
      return;
    }

    const interval = setInterval(() => {
      const newRemaining = getTimeRemaining(timerData);
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerData, isExpired, soundEnabled, hasPlayedAlarm, playAlarm]);

  if (isExpired) {
    return (
      <TimerExpired
        duration={timerData.duration}
        createdAt={timerData.createdAt}
        title={title}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Timer className="h-4 w-4" />
          Countdown Timer
        </div>
        {title && (
          <h1 className="font-cal text-3xl md:text-4xl font-bold">{title}</h1>
        )}
        {!title && (
          <h1 className="font-cal text-3xl md:text-4xl font-bold">
            Time Remaining
          </h1>
        )}
      </motion.div>

      {/* Progress Ring with Time */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <ProgressRing percentage={progress} size={280} strokeWidth={12}>
          <div className="text-center">
            <p
              className="text-4xl md:text-5xl font-bold text-gradient"
              style={{
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum"',
                minWidth: "200px",
              }}
            >
              {String(timeDisplay.hours + timeDisplay.days * 24).padStart(
                2,
                "0",
              )}
              :{String(timeDisplay.minutes).padStart(2, "0")}:
              {String(timeDisplay.seconds).padStart(2, "0")}
            </p>
            {showDays && timeDisplay.days > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                +{timeDisplay.days} day{timeDisplay.days > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </ProgressRing>
      </motion.div>

      {/* Share Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-muted/30 space-y-4"
      >
        <ShareButtons
          url={url}
          title={title}
          soundEnabled={soundEnabled}
          onSoundToggle={setSoundEnabled}
        />
      </motion.div>

      {/* Timer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2"
      >
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          Created: {formatCreatedDate(timerData.createdAt)}
        </p>
        <p className="text-sm text-muted-foreground">
          Original duration:{" "}
          <span className="font-medium text-foreground">
            {formatDurationHuman(timerData.duration)}
          </span>
        </p>
      </motion.div>

      {/* Create New Timer Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <a
          href="/timer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
        >
          <Timer className="h-4 w-4" />
          Create Your Own Timer
        </a>
      </motion.div>
    </div>
  );
}
