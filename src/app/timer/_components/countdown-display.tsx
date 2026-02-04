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

// Alarm sound (simple beep using Web Audio API)
function useAlarmSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playAlarm = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
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
              {String(timeDisplay.hours + timeDisplay.days * 24).padStart(2, "0")}:
              {String(timeDisplay.minutes).padStart(2, "0")}:
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
