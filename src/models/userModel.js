const supabase = require("../config/supabase");

const TABLE_NAME = "users";

const userModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id, name, email, avatar_url, role, created_at")
      .order("id", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id, name, email, avatar_url, role, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select("id, name, email, avatar_url, role, created_at")
      .single();

    if (error) throw error;
    return data;
  },

  async createWithPassword(payload) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(payload)
      .eq("id", id)
      .select("id, name, email, avatar_url, role, created_at")
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .select("id, name, email, avatar_url, role, created_at")
      .single();

    if (error) throw error;
    return data;
  },
};

module.exports = userModel;