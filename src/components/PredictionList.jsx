import { useEffect, useState } from "react";
import { getPredictions } from "../api/api";

export default function PredictionList() {
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        getPredictions().then((res) => setPredictions(res.data || []));
    }, []);

    return (
        <div className="backdrop-blur-md bg-white/70 shadow-lg p-6 rounded-3xl border border-white/40">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
                Prediction Results
            </h2>
            {predictions.length === 0 ? (
                <p className="text-center text-gray-500">No predictions available.</p>
            ) : (
                <div className="grid gap-4">
                    {predictions.map((p, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center p-4 bg-gradient-to-r from-white via-blue-50 to-white rounded-2xl shadow-sm hover:shadow-md transition-all"
                        >
              <span className="font-mono text-lg">
                {p.numbers.join(", ")}{" "}
                  <span className="text-red-600 font-bold">PB {p.powerball}</span>
              </span>
                            <span className="text-sm text-gray-600">Score: {p.score}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
