"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Timer, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDurationHuman, formatCreatedDate } from "@/lib/timer-encoding";

interface TimerExpiredProps {
  duration: number;
  createdAt: number;
  title?: string;
}

// Pre-generate confetti data to avoid SSR issues
const CONFETTI_COLORS = ["#c97d0a", "#0099cc", "#f45c43", "#38ef7d", "#ffd200"];

function Confetti() {
  const [mounted, setMounted] = useState(false);

  // Generate random values only on client side
  const confettiPieces = useMemo(() => {
    if (!mounted) return [];
    return [...Array(20)].map((_, i) => ({
      id: i,
      initialX: Math.random() * 100, // percentage
      rotation: Math.random() > 0.5 ? 360 : -360,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            opacity: 0,
            y: -20,
            x: `${piece.initialX}vw`,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: "110vh",
            rotate: piece.rotation,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ background: piece.color }}
        />
      ))}
    </div>
  );
}

export function TimerExpired({
  duration,
  createdAt,
  title,
}: TimerExpiredProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      {/* Celebration Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-glow"
      >
        <PartyPopper className="w-12 h-12 text-primary" />
      </motion.div>

      {/* Title */}
      <div className="space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-gradient"
        >
          Time&apos;s Up!
        </motion.h2>
        {title && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground"
          >
            {title}
          </motion.p>
        )}
      </div>

      {/* Timer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-muted/30 space-y-2 max-w-sm mx-auto"
      >
        <p className="text-sm text-muted-foreground">
          This countdown was set for{" "}
          <span className="font-medium text-foreground">
            {formatDurationHuman(duration)}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          Created on {formatCreatedDate(createdAt)}
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button asChild size="lg" className="btn-glow">
          <Link href="/timer">
            <Timer className="w-5 h-5 mr-2" />
            Create New Timer
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            <RefreshCw className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </motion.div>

      {/* Animated Confetti Effect */}
      <Confetti />
    </motion.div>
  );
}
