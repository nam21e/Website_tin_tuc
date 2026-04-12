const userModel = require("../models/userModel");

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const data = await userModel.getAll();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await userModel.getById(id);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const { name, email, avatar_url, role } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Thiếu name hoặc email",
        });
      }

      const data = await userModel.create({
        name,
        email,
        avatar_url,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "Tạo user thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, avatar_url, role } = req.body;

      const data = await userModel.update(id, {
        name,
        email,
        avatar_url,
        role,
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật user thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const data = await userModel.delete(id);

      return res.status(200).json({
        success: true,
        message: "Xóa user thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;