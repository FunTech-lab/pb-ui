import { useState } from "react";
import { submitResult } from "../api/api";

export default function ResultForm() {
    const [numbers, setNumbers] = useState(Array(5).fill(""));
    const [powerball, setPowerball] = useState("");
    const [status, setStatus] = useState("");

    const handleChange = (i, v) => {
        const updated = [...numbers];
        updated[i] = v;
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
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-center mb-6">
                Enter Powerball Result
            </h2>

            <form onSubmit={handleSubmit} className="flex gap-3 items-center justify-center flex-wrap">

                {numbers.map((n, i) => (
                    <input
                        key={i}
                        type="number"
                        min="1"
                        max="69"
                        value={n}
                        onChange={(e) => handleChange(i, e.target.value)}
                        className="w-14 h-14 text-center border-2 rounded-full text-lg font-bold
              border-gray-300 focus:border-blue-500 outline-none
              [appearance:textfield]
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none"
                    />
                ))}

                <input
                    type="number"
                    min="1"
                    max="26"
                    placeholder="PB"
                    value={powerball}
                    onChange={(e) => setPowerball(e.target.value)}
                    className="w-14 h-14 text-center border-2 rounded-full
          text-lg font-bold text-red-600 border-red-400
          focus:border-red-600 outline-none
          [appearance:textfield]
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>

            {status && (
                <p className="text-center text-sm mt-4">{status}</p>
            )}
        </div>
    );
}
