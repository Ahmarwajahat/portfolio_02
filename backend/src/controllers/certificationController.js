const supabase = require('../config/supabase');

const getCertifications = async (req, res) => {
  try {
    const { data, error } = await supabase.from('certifications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createCertification = async (req, res) => {
  try {
    const { title, issuer, description, color } = req.body;
    const { data, error } = await supabase
      .from('certifications')
      .insert([{ title, issuer, description, color: color || '#10b981' }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Certification created', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('certifications')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    res.json({ message: 'Certification updated', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('certifications').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ message: 'Certification deleted', deleted: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };
