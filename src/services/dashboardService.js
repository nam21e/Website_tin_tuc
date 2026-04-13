import axiosClient from "../api/axiosClient";

export const getStats = () => axiosClient.get("/dashboard/stats");
