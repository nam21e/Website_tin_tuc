const supabase = require("../config/supabase");

const TABLE_NAME = "articles";

const articleModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          title: payload.title,
          slug: payload.slug || null,
          content: payload.content || null,
          thumbnail: payload.thumbnail || null,
          category_id: payload.category_id || null,
          source_id: payload.source_id || null,
          author_id: payload.author_id || null,
          views: payload.views || 0,
          is_published:
            payload.is_published !== undefined ? payload.is_published : true,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, payload) {
    const updateData = {};

    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.slug !== undefined) updateData.slug = payload.slug;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.thumbnail !== undefined) updateData.thumbnail = payload.thumbnail;
    if (payload.category_id !== undefined) updateData.category_id = payload.category_id;
    if (payload.source_id !== undefined) updateData.source_id = payload.source_id;
    if (payload.author_id !== undefined) updateData.author_id = payload.author_id;
    if (payload.views !== undefined) updateData.views = payload.views;
    if (payload.is_published !== undefined) updateData.is_published = payload.is_published;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

module.exports = articleModel;