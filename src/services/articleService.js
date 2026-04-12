import axiosClient from "../api/axiosClient";

export const getArticles = () => axiosClient.get("/articles");
export const getArticleById = (id) => axiosClient.get(`/articles/${id}`);
export const createArticle = (data) => axiosClient.post("/articles", data);
export const deleteArticle = (id) => axiosClient.delete(`/articles/${id}`);