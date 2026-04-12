const supabase = require("../config/supabase");

const TABLE_NAME = "sources";

const sourceModel = {
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
          name: payload.name,
          website: payload.website || null,
          logo: payload.logo || null,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, payload) {
    const updateData = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.website !== undefined) updateData.website = payload.website;
    if (payload.logo !== undefined) updateData.logo = payload.logo;

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

module.exports = sourceModel;