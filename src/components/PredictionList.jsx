import React from "react";
import { motion } from "framer-motion";

/**
 * PredictionList
 * Props:
 *  - predictions: Array<{
 *      id: string|number,
 *      numbers: number[] | string[], // 5 white balls
 *      powerball: number | string,
 *      score?: number,               // 0..1 (optional)
 *      favorite?: boolean
 *    }>
 *  - onDelete?: (id) => void
 *  - onToggleFavorite?: (id) => void
 *
 * Behavior:
 *  - Click a card OR its balls -> dispatches window event "pb:fill" with chosen numbers
 *  - Score ring animates to percentage (0..100)
 *  - Favorite/Trash use inline SVGs (no extra deps)
 */

const pad = (v) => String(v).padStart(2, "0");

function Ball({ value, color = "blue", size = 40 }) {
    const base =
        "inline-flex items-center justify-center rounded-full text-white font-bold select-none";
    const style = {
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
    };
    const gradient =
        color === "red"
            ? "bg-gradient-to-br from-red-600 via-red-700 to-red-900 border-2 border-red-800"
            : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 border-2 border-blue-900";
    return (
        <div className={`${base} ${gradient}`} style={style} aria-label={value}>
            {pad(value)}
        </div>
    );
}

function ScoreRing({ score = 0, size = 48, stroke = 6 }) {
    // clamp 0..1
    const s = Math.max(0, Math.min(1, Number(score || 0)));
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = c * s;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={stroke}
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="url(#gradScore)"
                strokeWidth={stroke}
                strokeLinecap="round"
                initial={{ strokeDasharray: `0, ${c}` }}
                animate={{ strokeDasharray: `${dash}, ${c - dash}` }}
                transition={{ duration: 0.8 }}
            />
            <defs>
                <linearGradient id="gradScore" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
            </defs>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight="700"
                fill="#111827"
            >
                {Math.round(s * 100)}%
            </text>
        </svg>
    );
}

function HeartIcon({ filled }) {
    return filled ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M11.645 21.02a.75.75 0 0 0 .71 0c1.344-.73 5.98-3.43 8.073-7.02 1.15-1.93 1.405-4.225-.106-5.94C19.66 5.2 16.9 5.4 15.1 7.23L12 10.38l-3.1-3.15C7.1 5.4 4.34 5.2 2.678 8.06c-1.51 1.716-1.256 4.01-.106 5.94 2.093 3.59 6.73 6.29 8.073 7.02z" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
    );
}

export default function PredictionList({
                                           predictions = [],
                                           onDelete = () => {},
                                           onToggleFavorite = () => {},
                                       }) {
    const pick = (p) => {
        const detail = {
            numbers: (p.numbers || []).slice(0, 5).map((n) => Number(n)),
            powerball: Number(p.powerball),
        };
        // Broadcast to ResultForm to autofill
        window.dispatchEvent(new CustomEvent("pb:fill", { detail }));
    };

    if (!predictions.length) {
        return (
            <div className="rounded-2xl border border-gray-200 p-6 text-center text-gray-600">
                No predictions yet.
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {predictions.map((p) => (
                <motion.div
                    key={p.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <ScoreRing score={p.score ?? 0} />
                            <div className="text-sm text-gray-500">
                                Score
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className={`p-2 rounded-full hover:bg-gray-100 text-${p.favorite ? "rose-600" : "gray-600"}`}
                                onClick={() => onToggleFavorite(p.id)}
                                title={p.favorite ? "Unfavorite" : "Favorite"}
                            >
                                <HeartIcon filled={!!p.favorite} />
                            </button>
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                                onClick={() => onDelete(p.id)}
                                title="Delete"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => pick(p)}
                        className="w-full text-left"
                        title="Click to autofill"
                    >
                        <div className="flex items-center gap-2 flex-wrap">
                            {(p.numbers || []).slice(0, 5).map((n, i) => (
                                <Ball key={i} value={n} color="blue" />
                            ))}
                            <div className="mx-1 text-gray-400 font-semibold">+</div>
                            <Ball value={p.powerball} color="red" />
                        </div>
                        {typeof p.note === "string" && p.note.trim() !== "" && (
                            <div className="mt-2 text-xs text-gray-500">{p.note}</div>
                        )}
                    </button>
                </motion.div>
            ))}
        </div>
    );
}
