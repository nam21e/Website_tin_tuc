const supabase = require("../config/supabase");

const TABLE_NAME = "users";

const userModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async create(payload) {
    const newUser = {
      name: payload.name,
      email: payload.email,
      avatar_url: payload.avatar_url ?? null,
      role: payload.role ?? "user",
    };

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newUser])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async update(id, payload) {
    const updateData = {};

    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.avatar_url !== undefined) updateData.avatar_url = payload.avatar_url;
    if (payload.role !== undefined) updateData.role = payload.role;

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
};

module.exports = userModel;