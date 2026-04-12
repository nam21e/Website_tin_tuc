const categoryModel = require("../models/categoryModel");
const slugify = require("../utils/slugify");

const categoryController = {
  async getAllCategories(req, res, next) {
    try {
      const data = await categoryModel.getAll();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await categoryModel.getById(id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;

      const payload = {
        name,
        slug: slugify(name),
        description: description || null,
      };

      const data = await categoryModel.create(payload);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const payload = {
        ...(name && { name, slug: slugify(name) }),
        ...(description !== undefined && { description }),
      };

      const data = await categoryModel.update(id, payload);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const data = await categoryModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Xóa danh mục thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;