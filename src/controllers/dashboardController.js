const supabase = require("../config/supabase");

const dashboardController = {
  async getStats(req, res, next) {
    try {
      const [{ count: articleCount }, { count: userCount }, { count: categoryCount }, { count: sourceCount }] =
        await Promise.all([
          supabase.from("articles").select("*", { count: "exact", head: true }),
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("sources").select("*", { count: "exact", head: true }),
        ]);

      res.status(200).json({
        success: true,
        data: {
          total_articles: articleCount || 0,
          total_users: userCount || 0,
          total_categories: categoryCount || 0,
          total_sources: sourceCount || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = dashboardController;