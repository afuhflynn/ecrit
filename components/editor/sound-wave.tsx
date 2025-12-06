"use client";

import { cn } from "@/lib/utils";
import { motion, MotionConfig, Transition } from "motion/react";
import { useEffect, useState } from "react";

interface SoundWaveProps {
  bars?: number;
  height?: number;
  width?: number;
  color?: string;
  isPlaying?: boolean;
  className?: string;
  itemClassName?: string;
}

const TRANSITION: Transition = {
  duration: 1,
  type: "spring",
  bounce: 0.2,
  ease: "easeInOut",
};

const SoundWave = ({
  bars = 20,
  height = 50,
  width = 100,
  color = "hsl(var(--primary))",
  isPlaying = true,
  className = "",
  itemClassName = "",
}: SoundWaveProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [isPlaying]);

  const barWidth = width / bars - 2;

  return (
    <MotionConfig transition={TRANSITION}>
      <div
        className={cn("flex items-center justify-center gap-0.5", className)}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {Array.from({ length: bars }).map((_, index) => (
          <motion.div
            key={`${animationKey}-${index}`}
            className={cn(itemClassName, "rounded-sm")}
            style={{
              width: `${barWidth}px`,
              backgroundColor: color,
              originY: 1,
            }}
            animate={
              isPlaying
                ? {
                    height: [
                      Math.random() * height * 0.3 + height * 0.1,
                      Math.random() * height * 0.8 + height * 0.2,
                      Math.random() * height * 0.4 + height * 0.1,
                      Math.random() * height * 0.9 + height * 0.1,
                      Math.random() * height * 0.3 + height * 0.1,
                    ],
                  }
                : {
                    height: height * 0.1,
                  }
            }
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.05,
            }}
          />
        ))}
      </div>
    </MotionConfig>
  );
};

export default SoundWave;
