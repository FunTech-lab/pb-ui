import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ResultForm from "./components/ResultForm";
import PredictionList from "./components/PredictionList";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-800">
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
                    <nav className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 -ml-2" />
                            <div className="w-6 h-6 rounded-full bg-white border-2 border-red-500 -ml-2" />
                            <span className="ml-2 font-bold text-lg">Powerball Predictor</span>
                        </div>
                        <div className="flex gap-5">
                            <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-700")}>
                                Results
                            </NavLink>
                            <NavLink to="/predictions" className={({ isActive }) => (isActive ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-700")}>
                                Predictions
                            </NavLink>
                        </div>
                    </nav>
                </header>

                <main className="max-w-4xl mx-auto p-5 space-y-6">
                    <ResultForm />
                    <PredictionList />
                </main>

                <footer className="text-center text-xs text-gray-500 py-6">
                    © {new Date().getFullYear()} Powerball Predictor
                </footer>
            </div>
        </BrowserRouter>
    );
}
