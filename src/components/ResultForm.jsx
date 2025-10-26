import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitResult } from "../api/api";


const clamp = (v, min, max) => {
    const n = parseInt(v || "", 10);
    if (Number.isNaN(n)) return "";
    return Math.max(min, Math.min(max, n));
};

function BallInput({ value, onChange, onFocusNext, onFocusPrev, min, max, color = "white", placeholder, autoFocus = false }, ref) {
    const isPowerball = color === "red";
    // Tailwind classes for ball colors
    const base =
        "w-16 h-16 md:w-16 md:h-16 text-center rounded-full outline-none text-xl font-semibold transition-transform duration-150 " +
        "shadow-[0_2px_8px_rgba(0,0,0,0.12)] focus:shadow-[0_4px_14px_rgba(0,0,0,0.18)]";
    const colorCls = isPowerball
        ? "bg-white border-2 border-red-500 text-red-600 focus:border-red-600"
        : "bg-white border-2 border-gray-300 text-gray-800 focus:border-blue-600";
    const ring = "focus:ring-2 focus:ring-offset-2 " + (isPowerball ? "focus:ring-red-200" : "focus:ring-blue-200");

    return (
        <motion.input
            ref={ref}
            type="text" // text (not number) so we can fully control arrows/spinners & input length
            inputMode="numeric"
            autoComplete="one-time-code"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                // allow only digits
                const raw = e.target.value.replace(/\D+/g, "");
                // max two digits
                let next = raw.slice(0, 2);
                // clamp to range if fully typed
                if (next.length > 0) {
                    const clamped = clamp(next, min, max);
                    next = clamped === "" ? "" : String(clamped);
                }
                onChange(next);
                // auto-advance on 2 digits
                if (next.length === 2) onFocusNext?.();
            }}
            onKeyDown={(e) => {
                if (e.key === "Backspace" && value === "") {
                    onFocusPrev?.();
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    onFocusPrev?.();
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    onFocusNext?.();
                }
            }}
            className={`${base} ${colorCls} ${ring} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            whileFocus={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            animate={{ scale: value ? 1.04 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            autoFocus={autoFocus}
            aria-label={isPowerball ? "Powerball" : "White ball"}
        />
    );
}

const ForwardBallInput = /** @type {any} */ (/* @__PURE__ */ (React).forwardRef(BallInput));

export default function ResultForm() {
    const [numbers, setNumbers] = useState(["", "", "", "", ""]);
    const [powerball, setPowerball] = useState("");
    const [status, setStatus] = useState("");

    const refs = Array.from({ length: 6 }, () => useRef(null)); // 5 white + 1 red

    const focusIdx = (idx) => {
        const el = refs[idx]?.current;
        if (el) el.focus();
    };

    const submit = async (e) => {
        e.preventDefault();
        // coerce to ints; basic validation
        const whites = numbers.map((n) => parseInt(n || "0", 10)).filter(Boolean);
        const pb = parseInt(powerball || "0", 10);

        if (whites.length !== 5 || whites.some((n) => n < 1 || n > 69) || !(pb >= 1 && pb <= 26)) {
            setStatus("❌ Please enter 5 white balls (1–69) and 1 Powerball (1–26).");
            return;
        }
        try {
            await submitResult({ numbers: whites, powerball: pb });
            setStatus("✅ Submitted successfully!");
        } catch (e2) {
            setStatus("❌ Error submitting result.");
        }
    };

    return (
        <div className="bg-white/90 rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-5">
                Powerball Result
            </h2>

            <form onSubmit={submit} className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                {/* White balls */}
                {numbers.map((val, i) => (
                    <ForwardBallInput
                        key={i}
                        ref={refs[i]}
                        value={val}
                        onChange={(next) => {
                            const clone = [...numbers];
                            clone[i] = next;
                            setNumbers(clone);
                        }}
                        onFocusNext={() => focusIdx(Math.min(i + 1, 5))}
                        onFocusPrev={() => focusIdx(Math.max(i - 1, 0))}
                        min={1}
                        max={69}
                        color="white"
                        placeholder={`${i + 1}`}
                        autoFocus={i === 0}
                    />
                ))}

                {/* Red Powerball */}
                <ForwardBallInput
                    ref={refs[5]}
                    value={powerball}
                    onChange={setPowerball}
                    onFocusNext={() => focusIdx(5)}
                    onFocusPrev={() => focusIdx(4)}
                    min={1}
                    max={26}
                    color="red"
                    placeholder="PB"
                />

                {/* Submit button */}
                <motion.button
                    type="submit"
                    className="ml-1 md:ml-2 inline-flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-full font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm7-3a1 1 0 112 0v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V7z" />
                    </svg>
                    Submit
                </motion.button>
            </form>

            {status && (
                <motion.p
                    className="text-center mt-4 text-sm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {status}
                </motion.p>
            )}

            {/* Subtle theme footer strip */}
            <div className="mt-6 h-2 w-full rounded-full bg-gradient-to-r from-blue-500 via-white to-red-600 opacity-70" />
        </div>
    );
}
