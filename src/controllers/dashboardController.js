const supabase = require("../config/supabase");

const dashboardController = {
  async getStats(req, res, next) {
    try {
      const [{ count: userCount }, { count: articleCount }, { count: categoryCount }, { count: sourceCount }] =
        await Promise.all([
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("articles").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("sources").select("*", { count: "exact", head: true }),
        ]);

      return res.status(200).json({
        success: true,
        data: {
          users: userCount || 0,
          articles: articleCount || 0,
          categories: categoryCount || 0,
          sources: sourceCount || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = dashboardController;