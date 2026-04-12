const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { signToken } = require("../utils/jwt");

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await userModel.getByEmail(email).catch(() => null);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.createWithPassword({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.getByEmail(email).catch(() => null);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;