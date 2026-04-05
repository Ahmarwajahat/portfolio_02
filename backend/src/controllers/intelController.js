const supabase = require('../config/supabase');

const getLogs = async (req, res) => {
  try {
    const { data, error } = await supabase.from('classified_logs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createLog = async (req, res) => {
  try {
    const { title, description, image_url, date, category, link } = req.body;
    const { data, error } = await supabase
      .from('classified_logs')
      .insert([{ title, description, image_url, date, category, link }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Log created', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('classified_logs')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ message: 'Log updated', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('classified_logs').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ message: 'Log deleted', deleted: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = { getLogs, createLog, updateLog, deleteLog };
