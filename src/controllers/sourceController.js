const sourceModel = require("../models/sourceModel");
const slugify = require("../utils/slugify");

const sourceController = {
  async getAllSources(req, res, next) {
    try {
      const data = await sourceModel.getAll();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSourceById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await sourceModel.getById(id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createSource(req, res, next) {
    try {
      const { name, website, logo_url, description } = req.body;

      const payload = {
        name,
        slug: slugify(name),
        website: website || null,
        logo_url: logo_url || null,
        description: description || null,
      };

      const data = await sourceModel.create(payload);

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSource(req, res, next) {
    try {
      const { id } = req.params;
      const { name, website, logo_url, description } = req.body;

      const payload = {
        ...(name && { name, slug: slugify(name) }),
        ...(website !== undefined && { website }),
        ...(logo_url !== undefined && { logo_url }),
        ...(description !== undefined && { description }),
      };

      const data = await sourceModel.update(id, payload);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSource(req, res, next) {
    try {
      const { id } = req.params;
      const data = await sourceModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Xóa nguồn tin thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = sourceController;