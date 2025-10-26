import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitResult } from "../api/api";

// Helpers
const within = (v, min, max) =>
    parseInt(v) >= min && parseInt(v) <= max;

const sortWhites = (arr) => {
    const nums = arr
        .filter((v) => v !== "")
        .map(Number)
        .sort((a, b) => a - b)
        .map(String);

    const out = ["", "", "", "", ""];
    nums.forEach((v, i) => (out[i] = v));
    return out;
};

const pad = (v) => (v ? v.padStart(2, "0") : "");

// Ball Component
function BallInput(
    {
        value,
        onChange,
        onClickBall,
        onFocusEnter,
        onWhiteZoneExit,
        onFocusNext,
        onFocusPrev,
        placeholder,
        color,
        duplicate,
        editing,
        autoFocus,
        index
    },
    ref
) {
    const isPB = color === "red";

    const displayValue = editing ? value : pad(value);

    const glow =
        editing
            ? "ring-4 ring-yellow-300"
            : duplicate
                ? "ring-4 ring-red-500"
                : "ring-2 ring-transparent";

    const cls = `
    w-16 h-16 text-center text-xl font-bold rounded-full cursor-pointer
    outline-none shadow-md transition-all
    ${
        isPB
            ? "bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white border-2 border-red-800"
            : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white border-2 border-blue-900"
    }
    ${glow} focus:ring-offset-2
  `;

    const selectAll = (e) => setTimeout(() => e.target.select(), 0);

    return (
        <motion.input
            ref={ref}
            inputMode="numeric"
            type="text"
            maxLength={2}
            value={displayValue}
            placeholder={placeholder}
            className={cls}
            autoFocus={autoFocus}
            onFocus={(e) => {
                selectAll(e);
                onFocusEnter?.();
            }}
            onClick={(e) => {
                selectAll(e);
                onClickBall?.();
            }}
            onBlur={() => {}}
            onChange={(e) => {
                const val = e.target.value.replace(/\D+/g, "").slice(0, 2);
                onChange(val);
            }}
            onKeyDown={(e) => {
                if (e.key === "Backspace" && value === "") {
                    e.preventDefault();
                    onFocusPrev?.();
                }
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    onFocusPrev?.();
                }
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    onFocusNext?.();
                }
                if (e.key === "Tab" && e.shiftKey) {
                    e.preventDefault();
                    onFocusPrev?.();
                }
            }}
            whileFocus={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{ scale: value ? 1.05 : 1 }}
        />
    );
}

const ForwardBall = React.forwardRef(BallInput);

// Main Component
export default function ResultForm() {
    const [whites, setWhites] = useState(["", "", "", "", ""]);
    const [powerball, setPowerball] = useState("");
    const [editing, setEditing] = useState(null);
    const [status, setStatus] = useState("");

    const refs = Array.from({ length: 6 }, () => useRef(null));
    const focusIdx = (i) => refs[i]?.current?.focus();

    const dupFlags = whites.map(
        (v, i, arr) => v !== "" && arr.indexOf(v) !== i
    );

    const sortEnabled = editing === null;

    const trySortWhites = () => {
        if (!sortEnabled) return;
        if (!whites.includes("")) {
            setWhites((cur) => sortWhites(cur));
        }
    };

    const updateWhite = (i, v) => {
        const next = [...whites];
        next[i] = v;
        setWhites(next);
        setStatus(""); // ✅ Clear status immediately on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEditing(null);

        const sorted = sortWhites(whites);
        setWhites(sorted);

        const pb = parseInt(powerball);

        if (sorted.includes("") || dupFlags.includes(true)) {
            setStatus("❌ Fix duplicates / missing numbers");
            return;
        }
        if (!within(pb, 1, 26)) {
            setStatus("❌ Powerball must be 1–26");
            return;
        }

        try {
            await submitResult({
                numbers: sorted.map(Number),
                powerball: pb
            });
            setStatus("✅ Submitted!");
            setWhites(["", "", "", "", ""]);
            setPowerball("");
            focusIdx(0);
        } catch {
            setStatus("❌ API failed");
        }
    };

    return (
        <div className="p-6 md:p-8 bg-white/90 rounded-3xl shadow-xl border border-gray-200">
            <h2 className="text-xl font-bold text-center mb-4">
                Powerball Result
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 justify-center">
                {whites.map((v, i) => (
                    <ForwardBall
                        key={i}
                        ref={refs[i]}
                        value={v}
                        onChange={(num) => updateWhite(i, num)}
                        onClickBall={() => {
                            focusIdx(i);
                            setStatus("");
                        }}
                        onFocusEnter={() => {
                            setEditing(i);
                            setStatus("");
                        }}
                        onWhiteZoneExit={() => {}}
                        onFocusPrev={() => focusIdx((i - 1 + 5) % 5)}
                        onFocusNext={() => focusIdx((i + 1) % 5)}
                        placeholder={String(i + 1).padStart(2, "0")}
                        color="white"
                        duplicate={dupFlags[i]}
                        editing={editing === i}
                        autoFocus={i === 0}
                    />
                ))}

                {/* ✅ PB — full fix */}
                <ForwardBall
                    ref={refs[5]}
                    value={powerball}
                    onChange={(v) => {
                        setPowerball(v.replace(/\D+/g, "").slice(0, 2));
                        setStatus(""); // ✅ Auto-clear error
                    }}
                    onClickBall={() => {
                        focusIdx(5);
                        setStatus("");
                    }}
                    onFocusEnter={() => {
                        setEditing(5);
                        setStatus("");
                        trySortWhites(); // ✅ Only now sorting allowed
                    }}
                    onFocusPrev={() => focusIdx(4)}
                    onFocusNext={() => focusIdx(5)}
                    placeholder="PB"
                    color="red"
                    duplicate={false}
                    editing={editing === 5}
                />

                <motion.button
                    type="submit"
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-md hover:bg-red-700"
                >
                    Submit
                </motion.button>
            </form>

            {status && (
                <p className="text-sm font-medium text-center text-red-600 mt-3">
                    {status}
                </p>
            )}
        </div>
    );
}
