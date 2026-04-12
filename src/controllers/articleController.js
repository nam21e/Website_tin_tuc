const articleModel = require("../models/articleModel");

const articleController = {
  async getAllArticles(req, res, next) {
    try {
      const data = await articleModel.getAll();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getArticleById(req, res, next) {
    try {
      const data = await articleModel.getById(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async createArticle(req, res, next) {
    try {
      const {
        title,
        slug,
        content,
        thumbnail,
        category_id,
        source_id,
        author_id,
        views,
        is_published,
      } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Thiếu title",
        });
      }

      const data = await articleModel.create({
        title,
        slug,
        content,
        thumbnail,
        category_id,
        source_id,
        author_id,
        views,
        is_published,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo article thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateArticle(req, res, next) {
    try {
      const data = await articleModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Cập nhật article thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteArticle(req, res, next) {
    try {
      const data = await articleModel.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Xóa article thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = articleController;