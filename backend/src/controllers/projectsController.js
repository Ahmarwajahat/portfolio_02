const supabase = require('../config/supabase');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Get a single project
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ message: 'Project not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Create a new project (Admin Only)
const createProject = async (req, res) => {
  try {
    const { title, description, image_url, live_link, github_link, tech_stack } = req.body;
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, description, image_url, live_link, github_link, tech_stack }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Project created successfully', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Update a project (Admin Only)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ message: 'Project updated successfully', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Delete a project (Admin Only)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('projects').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ message: 'Project deleted successfully', deleted: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
