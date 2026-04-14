import axiosClient from "../api/axiosClient";

export const getSources = () => axiosClient.get("/sources");