const sourceModel = require("../models/sourceModel");

const sourceController = {
  async getAllSources(req, res, next) {
    try {
      const data = await sourceModel.getAll();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async getSourceById(req, res, next) {
    try {
      const data = await sourceModel.getById(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  async createSource(req, res, next) {
    try {
      const { name, website, logo } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Thiếu name",
        });
      }

      const data = await sourceModel.create({ name, website, logo });
      return res.status(201).json({
        success: true,
        message: "Tạo source thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSource(req, res, next) {
    try {
      const data = await sourceModel.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Cập nhật source thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSource(req, res, next) {
    try {
      const data = await sourceModel.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Xóa source thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = sourceController;