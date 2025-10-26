import { useEffect, useState } from "react";
import { getPredictions } from "../api/api";

export default function PredictionList() {
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        getPredictions().then((res) => setPredictions(res.data || []));
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">
                Prediction Results
            </h2>

            {predictions.length === 0 && (
                <p className="text-center text-gray-500">
                    No predictions yet.
                </p>
            )}

            {predictions.map((p, i) => (
                <div
                    key={i}
                    className="flex justify-between items-center p-4 rounded-lg bg-gray-100 mb-3"
                >
          <span className="font-mono text-lg">
            {p.numbers.join(", ")} | PB: {p.powerball}
          </span>
                    <span className="text-sm text-gray-600">
            Score: {p.score}
          </span>
                </div>
            ))}
        </div>
    );
}
