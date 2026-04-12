const path = require("path");

const uploadController = {
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn file ảnh",
        });
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      return res.status(201).json({
        success: true,
        message: "Upload ảnh thành công",
        data: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadMultipleImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng chọn ít nhất 1 file ảnh",
        });
      }

      const files = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      }));

      return res.status(201).json({
        success: true,
        message: "Upload nhiều ảnh thành công",
        data: files,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = uploadController;