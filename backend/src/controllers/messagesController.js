const supabase = require('../config/supabase');

// Get all messages (Admin Only)
const getMessages = async (req, res) => {
  try {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Create a new message (Public - from contact form)
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;
    const { data, error } = await supabase
      .from('messages')
      .insert([{ name, email, subject, content }])
      .select();
    if (error) throw error;
    res.status(201).json({ message: 'Message sent successfully', data: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Delete a message (Admin Only)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('messages').delete().eq('id', id).select();
    if (error) throw error;
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = {
  getMessages,
  createMessage,
  deleteMessage
};
