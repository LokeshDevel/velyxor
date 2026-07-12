"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "motion/react";
import type { SessionResult } from "@/lib/storage";

interface WpmChartProps {
  sessions: SessionResult[];
}

const CHART_HEIGHT = 250;
const PADDING = { top: 20, right: 20, bottom: 35, left: 50 };

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMode(mode: string): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export default function WpmChart({ sessions }: WpmChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [lineLength, setLineLength] = useState(0);
  const polylineRef = useRef<SVGPolylineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Observe container width for responsiveness
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure polyline length for stroke animation
  useEffect(() => {
    if (polylineRef.current) {
      setLineLength(polylineRef.current.getTotalLength());
    }
  }, [sessions, containerWidth]);

  const chartData = useMemo(() => {
    if (sessions.length === 0) return null;

    const sorted = [...sessions].sort((a, b) => a.timestamp - b.timestamp);
    const wpmValues = sorted.map((s) => s.wpm);
    const minWpm = Math.max(0, Math.floor(Math.min(...wpmValues) / 10) * 10 - 10);
    const maxWpm = Math.ceil(Math.max(...wpmValues) / 10) * 10 + 10;
    const range = maxWpm - minWpm || 20;

    const drawWidth = containerWidth - PADDING.left - PADDING.right;
    const drawHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const points = sorted.map((session, i) => {
      const x =
        PADDING.left +
        (sorted.length === 1 ? drawWidth / 2 : (i / (sorted.length - 1)) * drawWidth);
      const y =
        PADDING.top +
        drawHeight -
        ((session.wpm - minWpm) / range) * drawHeight;
      return { x, y, session, index: i };
    });

    // Grid lines (4-5 horizontal)
    const gridCount = 5;
    const gridLines = Array.from({ length: gridCount }, (_, i) => {
      const val = minWpm + (range / (gridCount - 1)) * i;
      const y = PADDING.top + drawHeight - ((val - minWpm) / range) * drawHeight;
      return { y, label: Math.round(val) };
    });

    // Polygon for gradient fill (close the path)
    const areaPoints = [
      `${points[0].x},${PADDING.top + drawHeight}`,
      ...points.map((p) => `${p.x},${p.y}`),
      `${points[points.length - 1].x},${PADDING.top + drawHeight}`,
    ].join(" ");

    const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    return { points, gridLines, areaPoints, linePoints, sorted, drawWidth, drawHeight };
  }, [sessions, containerWidth]);

  if (!chartData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white/80 mb-4">
          📈 WPM Trend
        </h2>
        <div className="flex flex-col items-center justify-center h-[250px] text-white/30">
          <span className="text-4xl mb-3">📉</span>
          <p className="text-sm text-center max-w-xs">
            No sessions yet. Start typing to see your progress!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
    >
      <h2 className="text-lg font-semibold text-white/80 mb-4">
        📈 WPM Trend
      </h2>

      <div ref={containerRef} className="w-full relative">
        <svg
          width={containerWidth}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${containerWidth} ${CHART_HEIGHT}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {chartData.gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={PADDING.left}
                y1={line.y}
                x2={containerWidth - PADDING.right}
                y2={line.y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <text
                x={PADDING.left - 10}
                y={line.y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.3)"
                fontSize="11"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* X axis labels */}
          {chartData.points.map(
            (point, i) =>
              (chartData.points.length <= 10 || i % Math.ceil(chartData.points.length / 10) === 0) && (
                <text
                  key={`x-${i}`}
                  x={point.x}
                  y={CHART_HEIGHT - 5}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="10"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {i + 1}
                </text>
              )
          )}

          {/* Gradient fill area */}
          <motion.polygon
            points={chartData.areaPoints}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Line */}
          <polyline
            ref={polylineRef}
            points={chartData.linePoints}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line"
            style={
              lineLength > 0
                ? ({
                    strokeDasharray: lineLength,
                    strokeDashoffset: lineLength,
                    animation: "drawLine 1.5s ease-out 0.3s forwards",
                  } as React.CSSProperties)
                : undefined
            }
          />

          {/* Data points */}
          {chartData.points.map((point, i) => (
            <g key={i}>
              {/* Larger invisible hitbox for hover */}
              <circle
                cx={point.x}
                cy={point.y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Outer glow on hover */}
              {hoveredPoint === i && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={8}
                  fill="rgba(96,165,250,0.15)"
                  className="animate-pulse"
                />
              )}
              {/* Visible dot */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === i ? 5 : 3.5}
                fill={hoveredPoint === i ? "#93c5fd" : "#60a5fa"}
                stroke={hoveredPoint === i ? "#60a5fa" : "transparent"}
                strokeWidth={2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint !== null && chartData.points[hoveredPoint] && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 pointer-events-none"
            style={{
              left: Math.min(
                Math.max(chartData.points[hoveredPoint].x - 70, 0),
                containerWidth - 160
              ),
              top: chartData.points[hoveredPoint].y - 75,
            }}
          >
            <div className="bg-[#1a1a2e]/95 backdrop-blur-lg border border-white/15 rounded-xl px-4 py-2.5 shadow-xl shadow-black/30 min-w-[140px]">
              <p className="text-blue-400 font-bold text-lg font-mono">
                {chartData.points[hoveredPoint].session.wpm} WPM
              </p>
              <p className="text-white/50 text-xs">
                {formatMode(chartData.points[hoveredPoint].session.mode)} •{" "}
                {formatDate(chartData.points[hoveredPoint].session.timestamp)}
              </p>
              <p className="text-white/40 text-xs">
                {chartData.points[hoveredPoint].session.accuracy.toFixed(1)}% accuracy
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Inline keyframe animation for SVG line draw */}
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
