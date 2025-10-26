import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ResultForm from "./components/ResultForm.jsx";
import PredictionList from "./components/PredictionList.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100 text-gray-800">
                <nav className="bg-blue-600 text-white px-6 py-3 flex gap-6">
                    <NavLink to="/" className="hover:underline">
                        Results
                    </NavLink>
                    <NavLink to="/predictions" className="hover:underline">
                        Predictions
                    </NavLink>
                </nav>

                <main className="max-w-3xl mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<ResultForm />} />
                        <Route path="/predictions" element={<PredictionList />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
