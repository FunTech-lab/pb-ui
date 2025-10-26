import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ResultForm from "./components/ResultForm";
import PredictionList from "./components/PredictionList";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 text-gray-800">
                <header className="backdrop-blur-md bg-white/60 shadow-md sticky top-0 z-10">
                    <nav className="max-w-4xl mx-auto flex justify-between items-center px-6 py-3">
                        <h1 className="font-bold text-2xl text-blue-700 drop-shadow-sm">Powerball Predictor</h1>
                        <div className="text-red-500 text-3xl font-bold">Hello Tailwind</div>
                        <div className="flex gap-6 text-lg">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `hover:text-blue-600 ${isActive ? "text-blue-700 font-semibold" : ""}`
                                }
                            >
                                Results
                            </NavLink>
                            <NavLink
                                to="/predictions"
                                className={({ isActive }) =>
                                    `hover:text-blue-600 ${isActive ? "text-blue-700 font-semibold" : ""}`
                                }
                            >
                                Predictions
                            </NavLink>
                        </div>
                    </nav>
                </header>

                <main className="max-w-3xl mx-auto p-6 mt-6">
                    <Routes>
                        <Route path="/" element={<ResultForm />} />
                        <Route path="/predictions" element={<PredictionList />} />
                    </Routes>
                </main>

                <footer className="text-center text-sm py-4 text-gray-500">
                    © 2025 Powerball Predictor — All rights reserved.
                </footer>
            </div>
        </BrowserRouter>
    );
}
