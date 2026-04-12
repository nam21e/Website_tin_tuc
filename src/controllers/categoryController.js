const categoryModel = require("../models/categoryModel");

const categoryController = {
  async getAllCategories(req, res, next) {
    try {
      const data = await categoryModel.getAll();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      const data = await categoryModel.getById(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const { name, slug } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Thiếu name",
        });
      }

      const data = await categoryModel.create({ name, slug });
      return res.status(201).json({
        success: true,
        message: "Tạo category thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const data = await categoryModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Cập nhật category thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const data = await categoryModel.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Xóa category thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;