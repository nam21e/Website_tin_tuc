const uploadController = {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Chưa chọn file",
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      return res.status(200).json({
        success: true,
        message: "Upload thành công",
        data: {
          filename: req.file.filename,
          path: fileUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = uploadController;