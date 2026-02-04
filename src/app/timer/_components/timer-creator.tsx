"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, Clock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  encodeTimer,
  validateDuration,
  formatDurationHuman,
} from "@/lib/timer-encoding";

const PRESETS = [
  { label: "5m", seconds: 5 * 60 },
  { label: "15m", seconds: 15 * 60 },
  { label: "30m", seconds: 30 * 60 },
  { label: "1h", seconds: 60 * 60 },
  { label: "2h", seconds: 2 * 60 * 60 },
  { label: "5h", seconds: 5 * 60 * 60 },
  { label: "12h", seconds: 12 * 60 * 60 },
  { label: "24h", seconds: 24 * 60 * 60 },
] as const;

interface TimeInputProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  label: string;
}

function TimeInput({ value, onChange, max, label }: TimeInputProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value) || 0;
          onChange(Math.min(Math.max(0, num), max));
        }}
        className={cn(
          "w-20 h-20 text-center text-3xl font-bold rounded-xl",
          "bg-background border-2 border-border",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200",
          "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        )}
      />
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function TimerCreator() {
  const router = useRouter();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const handlePreset = useCallback((presetSeconds: number) => {
    const h = Math.floor(presetSeconds / 3600);
    const m = Math.floor((presetSeconds % 3600) / 60);
    const s = presetSeconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setError(null);
  }, []);

  const handleCreate = useCallback(() => {
    const validation = validateDuration(hours, minutes, seconds);

    if (!validation.valid) {
      setError(validation.error || "Invalid duration");
      return;
    }

    setIsCreating(true);
    setError(null);

    const token = encodeTimer(validation.totalSeconds);
    const titleParam = title.trim() ? `?title=${encodeURIComponent(title.trim())}` : "";

    router.push(`/timer/${token}${titleParam}`);
  }, [hours, minutes, seconds, title, router]);

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
          Shareable Timer
        </div>
        <h1 className="font-cal text-3xl md:text-4xl font-bold">
          Countdown Timer
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a countdown timer and share it with anyone. The timer starts when you create it.
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-8"
      >
        {/* Title Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary/70" />
            Timer Title (optional)
          </label>
          <Input
            type="text"
            placeholder="e.g., Meeting Starts, Project Deadline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="h-12"
          />
        </div>

        {/* Time Inputs */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary/70" />
            Set Duration
          </label>

          <div className="flex items-center justify-center gap-4 md:gap-6">
            <TimeInput
              value={hours}
              onChange={setHours}
              max={720}
              label="Hours"
            />
            <span className="text-4xl font-bold text-muted-foreground mt-[-1.5rem]">:</span>
            <TimeInput
              value={minutes}
              onChange={setMinutes}
              max={59}
              label="Minutes"
            />
            <span className="text-4xl font-bold text-muted-foreground mt-[-1.5rem]">:</span>
            <TimeInput
              value={seconds}
              onChange={setSeconds}
              max={59}
              label="Seconds"
            />
          </div>

          {totalSeconds > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Duration: <span className="font-medium text-foreground">{formatDurationHuman(totalSeconds)}</span>
            </p>
          )}
        </div>

        {/* Quick Presets */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground/70">Quick Presets</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.seconds)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  totalSeconds === preset.seconds
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:bg-muted"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-destructive font-medium"
          >
            {error}
          </motion.p>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={isCreating || totalSeconds === 0}
          size="lg"
          className="w-full h-14 text-lg font-semibold btn-glow"
        >
          {isCreating ? (
            <>
              <span className="animate-spin mr-2">
                <Timer className="h-5 w-5" />
              </span>
              Creating...
            </>
          ) : (
            <>
              <Timer className="h-5 w-5 mr-2" />
              Create Shareable Timer
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
