import { useState } from "react";
import { submitResult } from "../api/api";

export default function ResultForm() {
    const [numbers, setNumbers] = useState(Array(5).fill(""));
    const [powerball, setPowerball] = useState("");
    const [status, setStatus] = useState("");

    const handleChange = (i, value) => {
        const updated = [...numbers];
        updated[i] = value;
        setNumbers(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitResult({ numbers, powerball });
            setStatus("✅ Submitted successfully!");
        } catch {
            setStatus("❌ Error submitting result.");
        }
    };

    return (
        <div className="backdrop-blur-md bg-white/70 shadow-xl p-6 rounded-3xl border border-white/40 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800">
                Enter Powerball Result
            </h2>

            <form onSubmit={handleSubmit} className="flex justify-center items-center gap-4">
                {/* White balls */}
                {numbers.map((n, i) => (
                    <input
                        key={i}
                        type="number"
                        min="1"
                        max="69"
                        className="w-14 h-14 text-center border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-lg font-semibold"
                        value={n}
                        onChange={(e) => handleChange(i, e.target.value)}
                    />
                ))}

                {/* Powerball */}
                <input
                    type="number"
                    min="1"
                    max="26"
                    className="w-14 h-14 text-center border-2 border-red-400 rounded-full text-red-600 font-bold focus:outline-none focus:border-red-500"
                    placeholder="PB"
                    value={powerball}
                    onChange={(e) => setPowerball(e.target.value)}
                />

                {/* Submit button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 shadow-md transition-all font-semibold"
                >
                    Submit
                </button>
            </form>

            {status && <p className="text-sm text-center text-gray-700 mt-4">{status}</p>}
        </div>
    );
}
