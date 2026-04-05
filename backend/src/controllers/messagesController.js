const { db } = require('../config/firebase');

const getMessages = async (req, res) => {
  try {
    const snapshot = await db.collection('messages').orderBy('created_at', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createMessage = async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;
    const newDoc = { name, email, subject, content, created_at: new Date().toISOString() };
    const docRef = await db.collection('messages').add(newDoc);
    res.status(201).json({ message: 'Message sent successfully', data: { id: docRef.id, ...newDoc } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('messages').doc(id).delete();
    res.json({ message: 'Message deleted successfully', deleted: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = {
  getMessages,
  createMessage,
  deleteMessage
};
