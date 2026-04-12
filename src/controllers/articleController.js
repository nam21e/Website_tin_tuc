const articleModel = require("../models/articleModel");
const slugify = require("../utils/slugify");

const articleController = {
  async getAllArticles(req, res, next) {
    try {
      const data = await articleModel.getAll();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  async getArticleById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await articleModel.getById(id);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },

  async createArticle(req, res, next) {
    try {
      const {
        title,
        summary,
        content,
        category,
        image_url,
        author,
        published
      } = req.body;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: "Thiếu title hoặc content"
        });
      }

      const payload = {
        title,
        slug: slugify(title),
        summary: summary || null,
        content,
        category: category || null,
        image_url: image_url || null,
        author: author || null,
        published: published ?? true
      };

      const data = await articleModel.create(payload);

      res.status(201).json({
        success: true,
        message: "Thêm bài viết thành công",
        data
      });
    } catch (error) {
      next(error);
    }
  },

  async updateArticle(req, res, next) {
    try {
      const { id } = req.params;
      const {
        title,
        summary,
        content,
        category,
        image_url,
        author,
        published
      } = req.body;

      const payload = {
        title,
        slug: title ? slugify(title) : undefined,
        summary,
        content,
        category,
        image_url,
        author,
        published
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });

      const data = await articleModel.update(id, payload);

      res.status(200).json({
        success: true,
        message: "Cập nhật bài viết thành công",
        data
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteArticle(req, res, next) {
    try {
      const { id } = req.params;
      await articleModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Xóa bài viết thành công"
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = articleController;