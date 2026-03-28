const supabase = require('../config/supabase');

const getBlogs = async (req, res) => {
  try {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, category, category_color, description, image_url, link } = req.body;
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ title, category, category_color: category_color || '#10b981', description, image_url, link }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Blog created', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ message: 'Blog updated', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('blogs').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ message: 'Blog deleted', deleted: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };
