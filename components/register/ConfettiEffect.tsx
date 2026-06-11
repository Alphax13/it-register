"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiEffect() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#3b82f6", "#6366f1", "#06b6d4", "#ffffff"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    frame();
  }, []);

  return null;
}
