const supabase = require("../config/supabase");

const articleModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("articles")
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("articles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  }
};

module.exports = articleModel;