import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

export const submitResult = (result) => api.post("/powerball/results", result);
export const getPredictions = () => api.get("/powerball/predictions");
