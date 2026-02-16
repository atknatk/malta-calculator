"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";
import { AnimatedCounter, AnimatedCounterInt } from "./animated-counter";
import type { Summary } from "./summary-card";

interface FloatingNetCardProps {
  visible: boolean;
  summary: Summary;
}

export function FloatingNetCard({ visible, summary }: FloatingNetCardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/50 dark:border-white/20">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-green-500/15 border border-green-500/20">
                    <Wallet className="h-4 w-4 text-green-700 dark:text-green-400" />
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider block">
                      Monthly Net
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px]">
                      After tax & SSC
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <AnimatedCounter
                    value={summary.monthly.net}
                    className="text-2xl font-bold text-green-700 dark:text-green-400 block"
                    prefix="€"
                    decimals={2}
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    <AnimatedCounterInt
                      value={summary.annual.net}
                      prefix="€"
                      suffix="/year"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
