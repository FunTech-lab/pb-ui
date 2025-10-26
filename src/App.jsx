import React, { useState } from "react";
import ResultForm from "./components/ResultForm";
import PredictionList from "./components/PredictionList";

export default function App() {
    const [predictions, setPredictions] = useState([
        {
            id: 1,
            numbers: [3, 12, 19, 28, 44],
            powerball: 17,
            score: 0.73,
            favorite: true,
        },
        {
            id: 2,
            numbers: [1, 4, 22, 31, 40],
            powerball: 11,
            score: 0.58,
            favorite: false,
        },
    ]);

    const deletePrediction = (id) => {
        setPredictions((prev) => prev.filter((p) => p.id !== id));
    };

    const toggleFavorite = (id) => {
        setPredictions((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, favorite: !p.favorite } : p
            )
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <ResultForm />

            <h2 className="text-lg font-bold mt-8 mb-3">Predictions</h2>

            <PredictionList
                predictions={predictions}
                onDelete={deletePrediction}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
}
