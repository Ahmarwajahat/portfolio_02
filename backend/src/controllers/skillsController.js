const supabase = require('../config/supabase');

// Get all skills
const getSkills = async (req, res) => {
  try {
    const { data, error } = await supabase.from('skills').select('*').order('proficiency', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Create a new skill (Admin Only)
const createSkill = async (req, res) => {
  try {
    const { name, icon, proficiency } = req.body;
    const { data, error } = await supabase
      .from('skills')
      .insert([{ name, icon, proficiency }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Skill added successfully', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Update a skill (Admin Only)
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ message: 'Skill updated successfully', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Delete a skill (Admin Only)
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('skills').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
};
