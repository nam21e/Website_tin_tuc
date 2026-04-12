const supabase = require("../config/supabase");

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, avatar_url, role } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Thiếu name hoặc email",
        });
      }

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name,
            email,
            avatar_url: avatar_url || null,
            role: role || "user",
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Thiếu email",
        });
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw new Error("Email không tồn tại");

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;