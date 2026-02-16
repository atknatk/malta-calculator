"use client";
import { useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

// Hook for animated counting number - ultra fast tween animation
function useAnimatedNumber(value: number) {
  const motionValue = useMotionValue(value);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  const animatedValue = useSpring(motionValue, {
    duration: 250,
    bounce: 0,
  });

  return animatedValue;
}

// Animated counter component - fast counting effect
export function AnimatedCounter({
  value,
  className,
  prefix = "",
  suffix = "",
  decimals = 2,
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = useTransform(animatedValue, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

// Animated counter for integers (no decimals)
export function AnimatedCounterInt({
  value,
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = useTransform(animatedValue, (v) =>
    Math.round(v).toLocaleString("en-US"),
  );

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}
