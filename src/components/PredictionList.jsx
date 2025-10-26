import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPredictions } from "../api/api";

const scoreColor = (s) => {
    if (s >= 0.85) return "bg-green-100 text-green-800";
    if (s >= 0.65) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-700";
};

export default function PredictionList() {
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        getPredictions()
            .then((res) => setPredictions(res.data || []))
            .catch(() => setPredictions([]));
    }, []);

    return (
        <div className="bg-white/90 rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-5">Prediction Results</h2>

            {predictions.length === 0 ? (
                <p className="text-center text-gray-500">No predictions available yet.</p>
            ) : (
                <div className="grid gap-3">
                    <AnimatePresence>
                        {predictions.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white via-blue-50 to-white shadow"
                            >
                                <div className="flex items-center gap-2 flex-wrap">
                                    {p.numbers?.slice(0, 5).map((n, idx) => (
                                        <div
                                            key={idx}
                                            className="w-9 h-9 rounded-full bg-white border-2 border-gray-300 grid place-items-center font-semibold"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-red-500 text-red-600 grid place-items-center font-bold">
                                        {p.powerball}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreColor(p.score ?? 0)}`}>
                  Score: {typeof p.score === "number" ? p.score.toFixed(2) : "—"}
                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
