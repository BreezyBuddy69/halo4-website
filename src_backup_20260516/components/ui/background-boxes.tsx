"use client";
import React, { useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  "rgba(124, 58, 237, 0.88)",
  "rgba(139, 92, 246, 0.80)",
  "rgba(167, 139, 250, 0.74)",
  "rgba(109, 40, 217, 0.84)",
  "rgba(196, 94, 255, 0.68)",
  "rgba(88, 28, 235, 0.78)",
  "rgba(104, 184, 215, 0.64)",
  "rgba(180, 120, 255, 0.70)",
];

// Tuned for full viewport coverage without 9 600-element overhead
const NUM_STRIPS = 80;
const NUM_CELLS = 52;

const Cell = React.memo(function Cell({
  color,
  showCross,
}: {
  color: string;
  showCross: boolean;
}) {
  return (
    <div
      className="box-cell w-16 h-8 relative"
      style={{
        "--box-hover-color": color,
        borderRight: "1px solid rgba(130, 70, 230, 0.16)",
        borderTop: "1px solid rgba(130, 70, 230, 0.16)",
      } as React.CSSProperties}
    >
      {showCross && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="absolute h-6 w-10 -top-[14px] -left-[22px] pointer-events-none"
          style={{ color: "rgba(130, 70, 230, 0.20)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m6-6H6"
          />
        </svg>
      )}
    </div>
  );
});

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const cellColors = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < NUM_STRIPS * NUM_CELLS; i++) {
      arr.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
    return arr;
  }, []);

  const prevCellRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // elementsFromPoint returns ALL elements at (x,y) regardless of z-index / pointer-events,
      // so box cells beneath blocking overlays (chat scroll container, etc.) are still found.
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      const cell = els.find((el) => el.classList.contains("box-cell")) as HTMLElement | undefined;
      const prev = prevCellRef.current;

      if (prev === (cell ?? null)) return;

      if (prev) {
        prev.style.transitionDuration = "";   // restore CSS class 1.2s fade-out
        prev.style.backgroundColor = "";
      }
      if (cell) {
        const color = cell.style.getPropertyValue("--box-hover-color") || "rgba(139, 92, 246, 0.8)";
        cell.style.transitionDuration = "0s"; // instant-on, matching original CSS :hover behaviour
        cell.style.backgroundColor = color;
      }
      prevCellRef.current = cell ?? null;
    };

    const onLeave = () => {
      const prev = prevCellRef.current;
      if (prev) {
        prev.style.transitionDuration = "";
        prev.style.backgroundColor = "";
        prevCellRef.current = null;
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      style={{
        // Shift origin upward so skewed grid covers the top corners (where the L sits)
        transform: `translate(-50%, -65%) skewX(-48deg) skewY(14deg) scale(0.853) translateZ(0)`,
      }}
      className={cn("absolute left-1/2 top-[55%] flex z-0", className)}
      {...rest}
    >
      {Array.from({ length: NUM_STRIPS }, (_, i) => (
        <div
          key={i}
          className="w-16 relative flex-shrink-0"
          style={{ borderLeft: "1px solid rgba(130, 70, 230, 0.16)" }}
        >
          {Array.from({ length: NUM_CELLS }, (_, j) => (
            <Cell
              key={j}
              color={cellColors[i * NUM_CELLS + j]}
              showCross={i % 4 === 0 && j % 4 === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
