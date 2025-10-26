import React, { useEffect, useState } from "react";
import ResultForm from "./components/ResultForm";
import PredictionList from "./components/PredictionList";

export default function App() {
    const [predictions, setPredictions] = useState([]);

    // Add a prediction
    const addPrediction = ({ numbers, powerball }) => {
        const newPrediction = {
            id: Date.now(),           // unique ID
            numbers,
            powerball,
            score: 0,                 // default score until backend returns one
            favorite: false,
        };
        setPredictions((prev) => [newPrediction, ...prev]); // prepend newest
    };

    // Delete prediction
    const deletePrediction = (id) => {
        setPredictions((prev) => prev.filter((p) => p.id !== id));
    };

    // Toggle favorite
    const toggleFavorite = (id) => {
        setPredictions((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, favorite: !p.favorite } : p
            )
        );
    };

    // ✅ Listen for successful submission from ResultForm
    useEffect(() => {
        const handler = (e) => {
            addPrediction(e.detail);
        };
        window.addEventListener("pb:submitted", handler);
        return () => window.removeEventListener("pb:submitted", handler);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <ResultForm />

            {predictions.length > 0 && (
                <>
                    <h2 className="text-lg font-bold mt-8 mb-3">Predictions</h2>

                    <PredictionList
                        predictions={predictions}
                        onDelete={deletePrediction}
                        onToggleFavorite={toggleFavorite}
                    />
                </>
            )}
        </div>
    );
}
